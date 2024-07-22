import { Translator } from "./src";

// const translator = new Translator();

const translator = Translator.loadRosettaStone("./base.json")

await translator.processTranslations("swahili")
