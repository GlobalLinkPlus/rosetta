import { Translator } from "./src";

/**
 * TRANSLATION WORKFLOW
 * ====================
 * Follow this sequence to update translations after modifying base.json:
 *
 * 1. ALWAYS START: Keep lines 16-17 uncommented to load and generate base
 * 2. TRANSLATE ONE LANGUAGE AT A TIME: Uncomment ONE language line, run, wait for "Done", then comment it out
 * 3. GENERATE EXCEL (Optional): After all languages are done, uncomment line 35
 *
 * Run command: pnpm translate
 *
 * WARNING: Only run ONE translation at a time to avoid API rate limits!
 */

// STEP 1: Load base.json and generate English base file (translations/en.json)
const translator = Translator.loadRosettaStone("./base.json");
translator.generateBase();

// STEP 2: Translate to each language ONE AT A TIME
// Uncomment ONE line below, run 'pnpm translate', wait for completion, then move to next

// await translator.translateFromText("sw"); // Swahili - Run this first

// await translator.translateFromText("zh"); // Chinese - Run this second

// await translator.translateFromText("es"); // Spanish - Run this third

// await translator.translateFromText("id"); // Indonesian - Run this fourth

// await translator.translateFromText("tr"); // Turkish - Run this fifth

// STEP 3: (Optional) Generate Excel/CSV file with all translations for review
// Only uncomment after ALL translations above are complete
// await translator.generateExcelSheet(["sw", "id", "es", "zh", "tr"]);

// =============================================================================
// ADVANCED FEATURES (Not typically needed for regular translation updates)
// =============================================================================

// Serialize translations to text format (requires: import fs from "fs")
// const serialized = translator.serializeToText()
// fs.writeFileSync("./base.txt", serialized, {
//     encoding: 'utf-8'
// })

// Deserialize from TSV file (for bulk updates from spreadsheets)
// await translator.deserializeTSV('rosetta')
