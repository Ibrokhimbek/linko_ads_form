// =============================================================================
//  FORMALAR SOZLAMASI  (ko'p qadamli / wizard) — 2 tilli: uz / ru
//
//  Har bir matn { uz, ru } ko'rinishida. Til almashtirilganda butun forma
//  shu tilga o'tadi. Variantlar indeks bo'yicha saqlanadi, shuning uchun til
//  o'rtada almashtirilsa ham tanlovlar saqlanib qoladi.
//
//  Instagram reklama tugmalari:
//    /form/sfa  (yoki /form/1)  -> SFA formasi
//    /form/pos  (yoki /form/2)  -> POS formasi
// =============================================================================

export const FORMS = {
  // ===== 1-FORM: SFA =========================================================
  sfa: {
    slug: 'sfa',
    crmTitle: 'SFA — Instagram forma',
    telegramUrl: '', // bo'sh bo'lsa .env dagi VITE_TELEGRAM_URL ishlatiladi
    welcome: {
      title: {
        uz: 'Savdoni sun’iy intellekt yordamida avtomatlashtiring!',
        ru: 'Автоматизируйте продажи с помощью искусственного интеллекта!',
      },
      text: {
        uz: 'Hisob-kitobdagi xatolardan qutuling va savdoni real vaqt rejimida nazorat qiling!',
        ru: 'Избавьтесь от ошибок в учёте и контролируйте продажи в реальном времени!',
      },
    },
    questions: [
      {
        id: 'sales_reps',
        type: 'single',
        question: {
          uz: 'Distribyutsiyangizda nechta savdo vakili ishlaydi?',
          ru: 'Сколько торговых представителей работает в вашей дистрибуции?',
        },
        options: [
          { uz: '5 tagacha', ru: 'До 5' },
          { uz: '10 tagacha', ru: 'До 10' },
          { uz: '50 tagacha', ru: 'До 50' },
          { uz: '100 tadan ortiq', ru: 'Более 100' },
        ],
      },
      {
        id: 'processes',
        type: 'multi',
        question: {
          uz: 'Qaysi jarayonlarni avtomatlashtirmoqchisiz?',
          ru: 'Какие процессы вы хотите автоматизировать?',
        },
        options: [
          { uz: 'Ombor (sklad)', ru: 'Склад' },
          { uz: 'Agentlar nazorati', ru: 'Контроль агентов' },
          { uz: 'Analitika', ru: 'Аналитика' },
          { uz: 'Moliya (kassa)', ru: 'Финансы (касса)' },
          { uz: 'Xodimlarni boshqarish', ru: 'Управление сотрудниками' },
        ],
      },
    ],
    contact: {
      text: {
        uz: 'Kontakt ma’lumotlaringizni qoldiring. Mutaxassisimiz siz bilan bog‘lanib, biznesingiz uchun mos yechimni taklif qiladi.',
        ru: 'Оставьте свои контактные данные. Наш специалист свяжется с вами и предложит подходящее решение для вашего бизнеса.',
      },
    },
    thankYou: {
      text: {
        uz: 'Rahmat! Tez orada mutaxassisimiz siz bilan bog‘lanadi va Linko SFA haqida batafsil ma’lumot beradi.',
        ru: 'Спасибо! В ближайшее время наш специалист свяжется с вами и подробно расскажет о Linko SFA.',
      },
    },
  },

  // ===== 2-FORM: POS =========================================================
  pos: {
    slug: 'pos',
    crmTitle: 'POS — Instagram forma',
    telegramUrl: '',
    welcome: {
      title: {
        uz: 'Do‘koningizni sun’iy intellekt yordamida boshqaring!',
        ru: 'Управляйте магазином с помощью искусственного интеллекта!',
      },
      text: {
        uz: 'Hisob-kitobdagi xatolardan qutuling va savdoni real vaqt rejimida nazorat qiling!',
        ru: 'Избавьтесь от ошибок в учёте и контролируйте продажи в реальном времени!',
      },
    },
    questions: [
      {
        id: 'shop_type',
        type: 'single',
        question: {
          uz: 'Do‘koningiz qaysi turga kiradi?',
          ru: 'К какому типу относится ваш магазин?',
        },
        options: [
          { uz: 'Oziq-ovqat do‘koni', ru: 'Продуктовый магазин' },
          { uz: 'Qurilish mollari do‘koni', ru: 'Строительные товары' },
          { uz: 'Avto tovarlar', ru: 'Автотовары' },
          { uz: 'Kosmetika do‘koni', ru: 'Магазин косметики' },
          { uz: 'Elektronika do‘koni', ru: 'Электроника' },
          { uz: 'Ombor (sklad)', ru: 'Склад' },
          { uz: 'Kitob do‘koni', ru: 'Книжный магазин' },
          { uz: 'O‘yinchoq do‘koni', ru: 'Магазин игрушек' },
        ],
      },
      {
        id: 'current_tool',
        type: 'single',
        question: {
          uz: 'Hozirda hisobotlarni nimada yuritasiz?',
          ru: 'В чём вы сейчас ведёте учёт?',
        },
        options: [
          { uz: 'Qog‘oz ruchkada', ru: 'На бумаге' },
          { uz: 'Excelda', ru: 'В Excel' },
          { uz: 'Boshqa programmada', ru: 'В другой программе' },
        ],
      },
      {
        id: 'timeframe',
        type: 'single',
        question: {
          uz: 'Qachon do‘koningizni avtomatlashtirishni xohlaysiz?',
          ru: 'Когда вы хотите автоматизировать магазин?',
        },
        options: [
          { uz: '1 hafta ichida', ru: 'В течение недели' },
          { uz: '1 oy ichida', ru: 'В течение месяца' },
          { uz: 'Keyinroq', ru: 'Позже' },
        ],
      },
    ],
    contact: {
      text: {
        uz: 'Ma’lumotlaringizni qoldiring — mutaxassisimiz siz bilan bog‘lanib, Linko POS imkoniyatlarini ko‘rsatadi.',
        ru: 'Оставьте свои данные — наш специалист свяжется с вами и покажет возможности Linko POS.',
      },
    },
    thankYou: {
      text: {
        uz: 'Rahmat! Tez orada siz bilan bog‘lanamiz va Linko POS haqida batafsil ma’lumot beramiz.',
        ru: 'Спасибо! В ближайшее время мы свяжемся с вами и подробно расскажем о Linko POS.',
      },
    },
  },
}

// ---- UI matnlari (tugmalar, yorliqlar, xatolar) ----------------------------
export const UI = {
  multiHint: { uz: 'Bir nechta variant tanlash mumkin', ru: 'Можно выбрать несколько вариантов' },
  back: { uz: '← Orqaga', ru: '← Назад' },
  continue: { uz: 'Davom etish', ru: 'Продолжить' },
  submit: { uz: 'Yuborish', ru: 'Отправить' },
  sending: { uz: 'Yuborilmoqda…', ru: 'Отправка…' },
  contactTitle: { uz: 'Kontakt ma’lumotlaringiz', ru: 'Ваши контактные данные' },
  name: { uz: 'Ismingiz', ru: 'Ваше имя' },
  namePh: { uz: 'Masalan: Ali', ru: 'Например: Алишер' },
  nameErr: { uz: 'Ismingizni kiriting', ru: 'Введите ваше имя' },
  phone: { uz: 'Telefon raqamingiz', ru: 'Ваш номер телефона' },
  phonePh: { uz: '+998 90 123 45 67', ru: '+998 90 123 45 67' },
  phoneErr: { uz: 'Telefon raqamini to‘g‘ri kiriting', ru: 'Введите корректный номер телефона' },
  serverRetry: { uz: 'qaytadan urinib ko‘ring.', ru: 'попробуйте ещё раз.' },
  thanksTitle: { uz: 'Javobingiz uchun rahmat!', ru: 'Спасибо за ваш ответ!' },
  redirectIn: {
    uz: (n) => `${n} soniyadan so‘ng Telegram botimizga yo‘naltirilasiz…`,
    ru: (n) => `Через ${n} сек. вы будете перенаправлены в наш Telegram-бот…`,
  },
  telegramNow: { uz: 'Hoziroq Telegramga o‘tish', ru: 'Перейти в Telegram сейчас' },
  telegramNotSet: {
    uz: 'Telegram havolasi sozlanmagan (.env: VITE_TELEGRAM_URL).',
    ru: 'Ссылка на Telegram не настроена (.env: VITE_TELEGRAM_URL).',
  },
  switchTo: { uz: 'Русский', ru: 'O‘zbekcha' }, // tugmada ko'rsatiladigan "boshqa til" nomi
  notFoundTitle: { uz: 'Forma topilmadi', ru: 'Форма не найдена' },
  notFoundText: {
    uz: 'Bunday forma mavjud emas. Havolani tekshiring.',
    ru: 'Такая форма не существует. Проверьте ссылку.',
  },
}

// node {uz,ru} bo'lsa tanlangan tilni qaytaradi, oddiy qiymat bo'lsa o'zini.
export function t(node, lang) {
  if (node && typeof node === 'object' && (node.uz !== undefined || node.ru !== undefined)) {
    return node[lang]
  }
  return node
}

// Raqamli aliaslar: /form/1 -> sfa, /form/2 -> pos
const ALIASES = { 1: 'sfa', 2: 'pos' }

export function getForm(slug) {
  if (!slug) return null
  const key = ALIASES[slug] || slug
  return FORMS[key] || null
}
