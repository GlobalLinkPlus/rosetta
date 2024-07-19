import fs from 'fs'
interface Base {
    namespace: string
    eng: string
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

    async processTranslations(target: string){
        const result: Record<string,string> = {}
        const errors: Array<any> = []

        for (const base of this.default){
            try {
                const response = await fetch(`https://backend.globallinkplus.com/api/translator/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        source: 'en',
                        target,
                        text: base.eng
                    })
                })

                if(response.ok){
                    const data = await response.json() as {text: string}
    
                    result[base.namespace] = data.text ?? ""
                    console.log(base.namespace, "✅")

                }
                else{
                    console.log(base.namespace, "❌")
                    console.log("translation error::", response.statusText, response.status)
                }
            }
            catch (e)
            {
                console.log(base.namespace, "❌")
                console.log("translation error::", e)
            }
        }

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
        const file = "./translations/base.json"
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

        const stone =  JSON.parse(data)
        const entries = Object.entries(stone)

        const translator = new Translator()
        for (const [namespace, english] of entries){
            translator.n(namespace, (english as string) ?? "")
        }

        return translator
    }
}