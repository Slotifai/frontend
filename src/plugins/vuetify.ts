import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'slotifai',
    themes: {
      slotifai: {
        dark: false,
        colors: {
          primary: '#0F4C5C',
          secondary: '#E5A823',
          accent: '#E5A823',
          error: '#C0392B',
          warning: '#B7791F',
          info: '#2F6FB7',
          success: '#2E7D58',
          background: '#F5F6F8',
          surface: '#FFFFFF',
        },
      },
      slotifaiDark: {
        dark: true,
        colors: {
          primary: '#14899E',
          secondary: '#F0B429',
          accent: '#F0B429',
          error: '#F05252',
          warning: '#F0B429',
          info: '#60A5FA',
          success: '#34C98A',
          background: '#0F1117',
          surface: '#1A1F2B',
        },
      },
    },
  },
})
