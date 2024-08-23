import i18n, { t } from "./config";


await i18n.changeLanguage('sw').then(() => {

    console.log("Translation::", t('landing:aboutus-title'))
}).then(() => {

})
await i18n.changeLanguage('id').then(() => {

    console.log("Translation::", t('landing:aboutus-title'))
})


await i18n.changeLanguage('es').then(() => {
    console.log("Translation::", t('landing:aboutus-title'))
})

await i18n.changeLanguage('zh').then(() => {
    console.log("Translation::", t('landing:aboutus-title'))
})