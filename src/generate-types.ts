import { Translator } from ".";

function main() {
 const translator = Translator.loadRosettaStone("./translations/en.json");
 Translator.inferTypes(translator);
}

main();
