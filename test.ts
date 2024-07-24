import i18n, { t } from "./config";


i18n.changeLanguage('sw').then(() => {

    console.log("Translation::", t('landing:aboutus-title'))
})