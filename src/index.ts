import fs from 'fs'
import Client from '@googleapis/translate'
import axios from 'axios'
interface Base {
    namespace: string
    eng: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function loadToNamespace(data: Record<string, any>, _chosen: Array<Record<string, string>> = [], namespace = "") {
    const keys = Object.keys(data ?? [])
    const nested = []
    let chosen = _chosen
    if (keys.length === 0) {
        return chosen
    }

    for (const key of keys) {
        if (data[key] && typeof data[key] === 'string') {
            chosen.push({
                namespace: `${namespace}${namespace ? ":" : ""}${key}`.toLocaleLowerCase(),
                eng: data[key]
            })
        } else {
            nested.push(key)
        }
    }

    for (const key of nested) {
        const allChosen = loadToNamespace(data[key], chosen, `${namespace}${namespace ? ":" : ""}${key}`)
        chosen = [chosen, ...(allChosen as any)]
    }

    return chosen

}

export class Translator {
    private default: Array<Base> = []

    constructor(){}

    n(namespace: string, eng: string){
        this.default.push({
            namespace,
            eng
        })
        return this
    }

    serializeToText(unserialized?: Array<Base>) {
        let finalText = ""
        const master = unserialized ?? this.default ?? []
        for (const base of master) {
            const index = master.indexOf(base)
            finalText += `[${index}]|` + base.eng + ",_,"
        }

        return finalText

    }

    async deserializeFromText(text: string, target: string, unserialized?: Array<Base>, retries?: number,) {
        const master = unserialized ?? this.default ?? []
        const result: Record<string, string> = {}
        const lines = text.split(/,\s*_\s*,/gi)
        for (const line of lines) {
            try {

                const [namespace, translation] = line.split("|")
                // console.log("current::", namespace, translation)
                const index = parseInt(namespace.replace("[", "").replace("]", ""))
                const base = master[index]
                if (base === undefined) continue
                result[base.namespace] = translation
            }
            catch (e) {
                console.log("Error::", e)
            }
        }

        const untranslated = Object.entries(result).filter(([key, value]) => {
            const base = master.find((base) => base.namespace === key)
            if (value?.trim().toLowerCase() == base?.eng?.trim()?.toLowerCase()) {
                // console.log("attempting to retry::", key)
                return true
            }
            else {
                return false
            }
        })
        const asBase = untranslated?.map((uns) => {
            return {
                namespace: uns[0],
                eng: uns[1]
            } as Base
        })
        if ((retries ?? 0) < 20) {

            const serializedText = this.serializeToText(asBase)

            const response = await axios.post<{ text: string }>('http://3.87.245.245:7200/api/translator/', {
                source: 'en',
                target,
                text: serializedText
            })

            const translated = response.data.text


            const untranslated_translated = await this.deserializeFromText(translated, target, asBase, (retries ?? 0) + 1)
            console.log("Untranslated Translated::", untranslated_translated)
            for (const [key, value] of Object.entries(untranslated_translated)) {
                result[key] = value
            }
        }



        return result
    }

    async translateFromText(target: string) {
        const serialized = this.serializeToText()
        const response = await axios.post<{ text: string }>('http://3.87.245.245:7200/api/translator/', {
            source: 'en',
            target,
            text: serialized
        })

        const translated = response.data.text

        // console.log("Translated::", translated)

        const result = await this.deserializeFromText(translated, target)

        // console.log("Deserialized::", result)

        fs.writeFileSync(`./translations/${target}-text-serde.json`, JSON.stringify(result), { encoding: 'utf-8' })
        console.log("Done")
    }

    async processTranslations(target: string) {
        const result: Record<string, string> = {}
        const errors: Array<any> = []

        const bases = this.default?.filter(a => a !== undefined && a.namespace !== undefined && a.namespace !== 'undefined')
        const MAX = bases.length
        let CURRENT_OFFSET = 0

        while (CURRENT_OFFSET + 50 < MAX) {
            const currentBatch = bases.slice(CURRENT_OFFSET, CURRENT_OFFSET + 50)
            await Promise.all(currentBatch.map(async (base) => {
                CURRENT_OFFSET = CURRENT_OFFSET + 1
                if (base == undefined) return
                if (base.namespace == undefined) return
                if (base.namespace == 'undefined') return
                // result[base.namespace] = "empty_translation"
                try {
                    if (base.eng == undefined) return

                    console.log("Base::", base.eng, " target::", target)
                    // console.log("Translating::", base.namespace)
                    const _resp = await axios.post<{ text: string }>(`https://backend.globallinkplus.com/api/translator/`, {
                        source: 'en',
                        target,
                        text: base.eng ?? ""
                    })
                    console.log("Response::", _resp.data)
                    if (_resp.data.text) {
                        result[base.namespace] = _resp.data.text
                        console.log(base.namespace, "✅")
                    }
                }
                catch (e) {
                    result[base.namespace] = base.eng
                    console.log(base.namespace, "❌")
                    console.log("translation error::", e)
                }

            }))

            await sleep(4000)
            console.log("NEW BATCH::", CURRENT_OFFSET)
        }
        // for (const base of this.default){
        // }

        const file = "./translations/" + target + ".json"

        const fileData = JSON.stringify(result)

        fs.writeFileSync(file, fileData, {
            encoding: 'utf-8'
        })


        console.log("Translation complete")
        
    }

    generateBase(){
        const result: Record<string,string> = {}
        for (const base of this.default){
            result[base.namespace] = base.eng
        }
        const file = "./translations/en.json"
        const fileData = JSON.stringify(result)
        fs.writeFileSync(file, fileData, {
            encoding: 'utf-8'
        })
        console.log("Base translation")
    }

    static loadRosettaStone(file: string){
        const data = fs.readFileSync(file, {
            encoding: 'utf-8'
        })



        const stone = JSON.parse(data)

        console.log("Stone::", stone)

        const chosen = loadToNamespace(stone, [])
        const entries = chosen.map((a) => [a.namespace, a.eng])

        const translator = new Translator()
        for (const [namespace, english] of entries){
            translator.n(namespace, (english as string) ?? "")
        }

        // console.log("Translator::", translator.default)

        return translator
    }

    static inferTypes(translator: Translator) {
        const keys = translator.default.map((base) => base.namespace)
        const TypeDef = `
        // This file is auto-generated by the generate-types.ts script 
        // Do not modify this file directly
        export type TranslationNamespaces = ${keys.map((key) => `"${key}"`).join(" | ")}
        `
        const TypeDefFile = "./translations/types.ts"
        fs.writeFileSync(TypeDefFile, TypeDef, {
            encoding: 'utf-8'
        })
    }

    generateExcelSheet(targetLanguages: Array<string>) {
        const keys = this.default.map((base) => base.namespace)
        const lines: Array<string> = []
        const languageSources = targetLanguages.map((lang) => {
            const contents = fs.readFileSync(`./translations/${lang}-text-serde.json`, {
                encoding: 'utf-8'
            })
            const data = JSON.parse(contents)

            return data as Record<string, string>
        })

        const getCurrentTranslations = (namespace: string) => {
            const languageLines = languageSources.map((source) => {
                return source[namespace] ?? "NO_TRANSLATION"
            })

            return languageLines?.join("+")
        }

        for (const key of keys) {
            if (key === undefined || key === 'undefined') continue
            lines.push(`${key}+${this.default.find((base) => base.namespace === key)?.eng ?? "NO_ENGLISH"}+${getCurrentTranslations(key)}\n`)
        }

        const file = `./translations/rosetta-stone.csv`

        const stream = fs.createWriteStream(file, {
            encoding: 'utf-8'
        })

        const header = `NAMESPACE+ENGLISH+${targetLanguages.join("+")}\n`

        stream.write(header)

        for (const line of lines) {
            stream.write(line)
        }

        stream.end()

        console.log("Excel sheet generated")



    }
}