import { Translator } from "./src";
import fs from "fs";

// const translator = new Translator();

const translator = Translator.loadRosettaStone("./base.json");
translator.generateBase();

// await translator.translateFromText("zh");

// await translator.translateFromText("es");

// await translator.translateFromText("sw");

// await translator.translateFromText("id");
// await translator.translateFromText("tr");

// await translator.generateExcelSheet(["sw", "id", "es", "zh", "tr"]);

// const serialized = translator.serializeToText()

// fs.writeFileSync("./base.txt", serialized, {
//     encoding: 'utf-8'
// })

// await translator.deserializeTSV('rosetta')
