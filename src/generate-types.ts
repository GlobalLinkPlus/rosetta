import { Translator } from ".";


function main() {
    const translator = Translator.loadRosettaStone("./translations/swahili.json")
    Translator.inferTypes(translator)
}

main()