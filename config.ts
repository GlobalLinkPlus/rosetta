import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json'
import swa from './translations/swa.json'
import { TranslationNamespaces } from './translations/types'

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
            translations: en
        },
        swa: {
            translations: swa
        }
    }
})

i18n.languages = ['en', 'swa']

export const t = (t: TranslationNamespaces) => i18n.t(t)

export default i18n