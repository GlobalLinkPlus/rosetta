import { Translator } from "./src";

// const translator = new Translator();

const translator = Translator.loadRosettaStone("./base.json")
translator.generateBase()

// await translator.processTranslations("sw");

await translator.translateFromText("es")

// await translator.generateExcelSheet("swahili");
