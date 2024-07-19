import { Translator } from "./src";

const translator = new Translator();
translator
.n("home","hello")
.n("about:section1","banana")


await translator.processTranslations("sw")