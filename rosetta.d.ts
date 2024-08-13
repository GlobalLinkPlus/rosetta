import { translationConfig } from './config'


declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "translation";
        resources: {
            en: typeof translationConfig.resources.en.translation,
            sw: typeof translationConfig.resources.sw.translation,
        };
    }
}