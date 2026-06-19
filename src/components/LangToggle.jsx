import { UI, t } from '../forms.config.js'

// Tugma "boshqa tilni" ko'rsatadi: uz aktiv bo'lsa -> rus bayrog'i (bosilsa ru'ga o'tadi),
// ru aktiv bo'lsa -> o'zbek bayrog'i (bosilsa uz'ga qaytadi).
export default function LangToggle({ lang, onToggle }) {
  const next = lang === 'uz' ? 'ru' : 'uz'
  return (
    <button type="button" className="lang-toggle" onClick={onToggle} aria-label="Til / Язык">
      {next === 'ru' ? <RuFlag /> : <UzFlag />}
      <span>{t(UI.switchTo, lang)}</span>
    </button>
  )
}

function RuFlag() {
  return (
    <svg className="flag" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="ruClip">
          <rect width="24" height="24" rx="6" />
        </clipPath>
      </defs>
      <g clipPath="url(#ruClip)">
        <rect width="24" height="8" y="0" fill="#ffffff" />
        <rect width="24" height="8" y="8" fill="#0039a6" />
        <rect width="24" height="8" y="16" fill="#d52b1e" />
      </g>
    </svg>
  )
}

function UzFlag() {
  return (
    <svg className="flag" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="uzClip">
          <rect width="24" height="24" rx="6" />
        </clipPath>
      </defs>
      <g clipPath="url(#uzClip)">
        <rect width="24" height="7" y="0" fill="#0099b5" />
        <rect width="24" height="1" y="7" fill="#ce1126" />
        <rect width="24" height="8" y="8" fill="#ffffff" />
        <rect width="24" height="1" y="16" fill="#ce1126" />
        <rect width="24" height="7" y="17" fill="#1eb53a" />
        {/* oy (crescent) */}
        <circle cx="5" cy="3.5" r="2.1" fill="#ffffff" />
        <circle cx="6.2" cy="3.5" r="2.1" fill="#0099b5" />
      </g>
    </svg>
  )
}
