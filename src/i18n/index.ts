import { createI18n } from 'vue-i18n'
import en from './en'
import uk from './uk'

export type Locale = 'en' | 'uk'

export const i18n = createI18n({
  legacy: false,
  locale: (localStorage.getItem('locale') as Locale) || 'uk',
  fallbackLocale: 'en',
  messages: { en, uk },
})

export default i18n
