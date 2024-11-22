import i18n, { t } from "./config";

await i18n
 .changeLanguage("sw")
 .then(() => {
  console.log(
   "Translation sw::",
   t("catalog:forms:shipping:shipping-preferred-text2")
  );
 })
 .then(() => {});
await i18n.changeLanguage("id").then(() => {
 console.log(
  "Translation id::",
  t("catalog:forms:shipping:shipping-preferred-text2")
 );
});

await i18n.changeLanguage("es").then(() => {
 console.log(
  "Translation es::",
  t("catalog:forms:shipping:shipping-preferred-text2")
 );
});

await i18n.changeLanguage("zh").then(() => {
 console.log(
  "Translation zh::",
  t("catalog:forms:shipping:shipping-preferred-text2")
 );
});

await i18n.changeLanguage("tr").then(() => {
 console.log("Translation tr::", t("landing:aboutus"));
});
