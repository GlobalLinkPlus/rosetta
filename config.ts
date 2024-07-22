import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json'
import swa from './translations/swahili.json'
import { TranslationNamespaces } from './translations/types'

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
            translations: en
        },
        sw: {
            translations: swa
        }
    } as const
})

i18n.languages = ['en', 'sw']

export const t = (t: TranslationNamespaces) => i18n.t(t)

export default i18n