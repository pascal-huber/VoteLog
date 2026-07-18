import { createI18n } from 'vue-i18n'
import de from './locales/de.json'

// Add new languages here: drop a "<code>.json" file next to de.json with the
// same keys, then list it in both maps below.
export const SUPPORTED_LOCALES = ['de']
export const DEFAULT_LOCALE = 'de'

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { de },
})

export default i18n
