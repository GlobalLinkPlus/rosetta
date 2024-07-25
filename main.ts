import { Translator } from "./src";

// const translator = new Translator();

const translator = Translator.loadRosettaStone("./base.json")
translator.generateBase()

await translator.processTranslations("swahili");
