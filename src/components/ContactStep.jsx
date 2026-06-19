import { useState } from 'react'
import { UI, t } from '../forms.config.js'
import PhoneCountrySelect from './PhoneCountrySelect.jsx'

// Markaziy Osiyo + Afg'oniston telefon prefikslari. Sukut bo'yicha — O'zbekiston.
// mask = raqamlar guruhlari (probel bilan ajratiladi); yig'indisi = ruxsat etilgan raqamlar soni.
const COUNTRIES = [
  { code: 'UZ', flag: '🇺🇿', dial: '+998', mask: [2, 3, 2, 2], name: { uz: 'O‘zbekiston', ru: 'Узбекистан' } },
  { code: 'KZ', flag: '🇰🇿', dial: '+7', mask: [3, 3, 2, 2], name: { uz: 'Qozog‘iston', ru: 'Казахстан' } },
  { code: 'KG', flag: '🇰🇬', dial: '+996', mask: [3, 3, 3], name: { uz: 'Qirg‘iziston', ru: 'Кыргызстан' } },
  { code: 'TJ', flag: '🇹🇯', dial: '+992', mask: [2, 3, 2, 2], name: { uz: 'Tojikiston', ru: 'Таджикистан' } },
  { code: 'TM', flag: '🇹🇲', dial: '+993', mask: [2, 3, 3], name: { uz: 'Turkmaniston', ru: 'Туркменистан' } },
  { code: 'AF', flag: '🇦🇫', dial: '+93', mask: [2, 3, 4], name: { uz: 'Afg‘oniston', ru: 'Афганистан' } },
]

const maskLen = (m) => m.reduce((a, b) => a + b, 0)

// Raqamlarni mask bo'yicha guruhlab probel qo'yadi (placeholder uchun ham ishlatiladi)
function applyMask(digits, mask) {
  const out = []
  let i = 0
  for (const g of mask) {
    if (i >= digits.length) break
    out.push(digits.slice(i, i + g))
    i += g
  }
  return out.join(' ')
}

// Yakuniy qadam: ism + telefon (davlat prefiksi bilan) so'raladi va forma yuboriladi.
export default function ContactStep({ text, contact, onChange, onBack, onSubmit, submitting, error, stepLabel, lang }) {
  const [touched, setTouched] = useState(false)
  const [countryCode, setCountryCode] = useState('UZ')
  const [national, setNational] = useState('')

  const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0]

  const need = maskLen(country.mask)
  const nameOk = contact.name.trim().length > 1
  const digits = national.replace(/\D/g, '')
  const phoneOk = digits.length === need
  const valid = nameOk && phoneOk

  function pushPhone(dial, nat) {
    const full = nat.trim() ? `${dial} ${nat.trim()}` : ''
    onChange({ ...contact, phone: full })
  }

  function onCountry(code) {
    setCountryCode(code)
    const c = COUNTRIES.find((x) => x.code === code) || COUNTRIES[0]
    // mavjud raqamlarni yangi davlat shabloniga moslab qayta formatlaymiz
    const d = national.replace(/\D/g, '').slice(0, maskLen(c.mask))
    const formatted = applyMask(d, c.mask)
    setNational(formatted)
    pushPhone(c.dial, formatted)
  }

  function onNational(e) {
    const d = e.target.value.replace(/\D/g, '').slice(0, need)
    const formatted = applyMask(d, country.mask)
    setNational(formatted)
    pushPhone(country.dial, formatted)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!valid || submitting) return
    onSubmit()
  }

  return (
    <form className="step" onSubmit={handleSubmit} noValidate>
      <span className="step-label">{stepLabel}</span>
      <h2 className="question">{t(UI.contactTitle, lang)}</h2>
      <p className="muted">{text}</p>

      <div className="fields">
        <div className={`field${touched && !nameOk ? ' field--error' : ''}`}>
          <label htmlFor="c-name">{t(UI.name, lang)}</label>
          <input
            id="c-name"
            type="text"
            placeholder={t(UI.namePh, lang)}
            value={contact.name}
            onChange={(e) => onChange({ ...contact, name: e.target.value })}
          />
          {touched && !nameOk && <span className="field-msg">{t(UI.nameErr, lang)}</span>}
        </div>

        <div className={`field${touched && !phoneOk ? ' field--error' : ''}`}>
          <label htmlFor="c-phone">{t(UI.phone, lang)}</label>
          <div className="phone-row">
            <PhoneCountrySelect countries={COUNTRIES} value={countryCode} onChange={onCountry} lang={lang} />
            <input
              id="c-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder={country.mask.map((g) => '–'.repeat(g)).join(' ')}
              value={national}
              onChange={onNational}
            />
          </div>
          {touched && !phoneOk && <span className="field-msg">{t(UI.phoneErr, lang)}</span>}
        </div>
      </div>

      {error && (
        <p className="form-error">
          {error} — {t(UI.serverRetry, lang)}
        </p>
      )}

      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={onBack} disabled={submitting}>
          {t(UI.back, lang)}
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? t(UI.sending, lang) : t(UI.submit, lang)}
        </button>
      </div>
    </form>
  )
}
