import i18n, { t } from "./config";

await i18n
 .changeLanguage("sw")
 .then(() => {
  console.log("Translation::", t("landing:password"));
 })
 .then(() => {});
await i18n.changeLanguage("id").then(() => {
 console.log("Translation::", t("landing:password"));
});

await i18n.changeLanguage("es").then(() => {
 console.log("Translation::", t("landing:password"));
});

await i18n.changeLanguage("zh").then(() => {
 console.log("Translation::", t("landing:password"));
});
