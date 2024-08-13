import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json' assert { type: "json" }
import swa from './translations/swahili.json' assert { type: "json" }
import { TranslationNamespaces } from './translations/types'

export const translationConfig = {
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
            translation: en
        },
        sw: {
            translation: swa
        }
    } as const,
    keySeparator: false,
    nsSeparator: '.',
} as const

i18n.use(initReactI18next).init(translationConfig)

i18n.languages = ['en', 'sw']

export const t = (t: TranslationNamespaces) => i18n.t(t, {
    nsSeparator: '.'
})

export type TranslationKeys = TranslationNamespaces

export default i18n