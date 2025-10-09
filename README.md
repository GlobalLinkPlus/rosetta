# Rosetta Translation Library

A translation management system for the Global Link Plus application that handles multi-language translations using a structured workflow.

## Overview

This library converts a nested JSON structure (`base.json`) into multiple language translation files that can be used with i18next in React applications. It flattens the nested structure into namespace-based keys and generates type-safe translation keys.

## How It Works

### 1. Source File Structure

The `base.json` file contains all English translations in a nested structure:

```json
{
 "Landing": {
  "home": "Home",
  "aboutus": "About Us",
  "faq": "FAQ"
 },
 "dashboard": {
  "dashboard": "Dashboard",
  "orders": "Orders"
 }
}
```

### 2. Translation Process

The `Translator` class performs the following operations:

1. **Load & Flatten**: Reads `base.json` and converts nested structure into flat namespace keys

   - `Landing.home` → "Home"
   - `dashboard.orders` → "Orders"

2. **Generate Base**: Creates `translations/en.json` with all English translations

3. **Translate**: Sends text to translation API and generates language-specific files

   - Output: `translations/{lang}-text-serde.json`

4. **Export**: Optionally creates Excel/CSV sheets for manual review/editing

## Updating Translations

### Prerequisites

- Node.js installed
- `pnpm` package manager
- Updated `base.json` file with new/modified translations

### Step-by-Step Workflow

#### 1. Update the Base File

Edit `base.json` with your new or modified English translations. Follow the existing nested structure.

#### 2. Edit main.ts

Open `main.ts` and follow this sequence:

```typescript
import { Translator } from "./src";

// Step 1: Load the base.json file
const translator = Translator.loadRosettaStone("./base.json");

// Step 2: Generate the English base file (translations/en.json)
translator.generateBase();

// Step 3: Translate to each language ONE AT A TIME
// Uncomment ONE line at a time, run, wait for completion, then move to next

// await translator.translateFromText("sw");  // Swahili

// await translator.translateFromText("zh");  // Chinese

// await translator.translateFromText("es");  // Spanish

// await translator.translateFromText("id");  // Indonesian

// await translator.translateFromText("tr");  // Turkish

// Step 4: (Optional) Generate Excel sheet with all translations for review
// await translator.generateExcelSheet(["sw", "id", "es", "zh", "tr"]);
```

#### 3. Run Translations

Execute the following sequence:

```bash
# Always start with generating the base
pnpm translate

# After base generation completes, uncomment line 9 (sw translation)
pnpm translate

# After sw completes, comment line 9, uncomment line 11 (zh translation)
pnpm translate

# After zh completes, comment line 11, uncomment line 13 (es translation)
pnpm translate

# After es completes, comment line 13, uncomment line 15 (id translation)
pnpm translate

# After id completes, comment line 15, uncomment line 16 (tr translation)
pnpm translate

# (Optional) After all translations complete, uncomment line 18 for Excel export
pnpm translate
```

**Important Notes:**

- ⚠️ Only run ONE translation at a time to avoid API rate limits
- ⏱️ Each language translation can take several minutes depending on content size
- ✅ Wait for "Done" message before proceeding to next language
- 📝 The script processes translations in batches with delays to respect API limits

#### 4. Build for Distribution

After all translations are complete:

```bash
pnpm build
```

This will:

- Generate TypeScript types from translations
- Build the distribution files in `dist/`
- Copy translation JSON files to `dist/translations/`

## File Structure

```
rosetta/
├── base.json                    # Source English translations (nested structure)
├── main.ts                      # Translation workflow script
├── translations/                # Generated translation files
│   ├── en.json                  # English base (flat structure)
│   ├── sw-text-serde.json       # Swahili translations
│   ├── zh-text-serde.json       # Chinese translations
│   ├── es-text-serde.json       # Spanish translations
│   ├── id-text-serde.json       # Indonesian translations
│   ├── tr-text-serde.json       # Turkish translations
│   ├── types.ts                 # TypeScript type definitions
│   └── rosetta-stone.csv        # Excel export (optional)
├── dist/                        # Built files for distribution
│   ├── translations/            # Copied translation files
│   └── ...                      # Compiled TypeScript files
└── src/
    ├── index.ts                 # Main Translator class
    ├── generate-types.ts        # Type generation script
    └── copy-translations.ts     # Build helper script
```

## Key Methods

### `Translator.loadRosettaStone(file: string)`

Loads and flattens the base.json file into namespace-based translations.

### `generateBase()`

Creates `translations/en.json` with all English translations in flat structure.

### `translateFromText(target: string)`

Translates all content to the target language code and saves to `translations/{target}-text-serde.json`.

### `generateExcelSheet(targetLanguages: Array<string>)`

Creates a CSV file with all languages side-by-side for review/manual editing.

## Supported Languages

Currently configured languages (ISO 639-1 codes):

- `en` - English (base language)
- `sw` - Swahili
- `zh` - Chinese
- `es` - Spanish
- `id` - Indonesian
- `tr` - Turkish

## Usage in Applications

After building, import in your React application:

```typescript
import i18n, { t } from "globallinkplus-rosetta";

// Use in components
const Dashboard = () => {
 return <h1>{t("dashboard:dashboard")}</h1>;
};

// Change language
i18n.changeLanguage("es");
```

## Translation API

The translator uses a custom translation API endpoint:

- Primary: `http://3.87.245.245:7200/api/translator/`
- Alternative: `https://backend.globallinkplus.com/api/translator/`

The API expects:

```json
{
 "source": "en",
 "target": "es",
 "text": "Hello World"
}
```

## Troubleshooting

### Translations not completing

- Check API endpoint availability
- Verify network connectivity
- Check for rate limiting (wait between translations)

### Missing translations in output

- Verify base.json is properly formatted JSON
- Check that generateBase() completed successfully
- Look for error messages in console output

### Type errors in application

- Run `pnpm build` to regenerate types
- Ensure all translation keys exist in base.json

## Development Scripts

```bash
pnpm generate       # Alias for pnpm translate
pnpm translate      # Run main.ts translation workflow
pnpm generate-types # Generate TypeScript types only
pnpm copy           # Copy translations to dist/
pnpm build          # Full build process
```

## Notes

- The translation process serializes text with special markers `[index]|text,_,` to maintain context
- Failed translations automatically retry up to 20 times
- Batch processing uses delays (4000ms) to respect API rate limits
- The system automatically detects and retries untranslated phrases
