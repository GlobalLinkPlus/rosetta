import fs from 'fs'
function main() {

    const translations_folder = "./translations"
    const dist_folder = "./dist/translations"
    const files = fs.readdirSync(translations_folder)

    for (const file of files) {
        if (/\.json$/.test(file)) {
            fs.copyFileSync(`${translations_folder}/${file}`, `${dist_folder}/${file}`)
        }
    }

}

main()