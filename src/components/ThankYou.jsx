import { useEffect, useState } from 'react'
import { UI, t } from '../forms.config.js'

const REDIRECT_SECONDS = 4

// Yakuniy ekran: rahmat xabari + Telegram botga avtomatik redirect.
export default function ThankYou({ text, telegramUrl, lang }) {
  const [count, setCount] = useState(REDIRECT_SECONDS)
  const canRedirect = Boolean(telegramUrl)

  useEffect(() => {
    if (!canRedirect) return
    if (count <= 0) {
      window.location.href = telegramUrl
      return
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, canRedirect, telegramUrl])

  return (
    <main className="page">
      <div className="card card--center">
        <img className="logo" src="/linko-logo.svg" alt="Linko" width="78" height="40" style={{ margin: '0 auto 18px' }} />
        <div className="check">✓</div>
        <h1>{t(UI.thanksTitle, lang)}</h1>
        <p className="muted">{text}</p>

        {canRedirect ? (
          <>
            <p className="muted small">{UI.redirectIn[lang](count)}</p>
            <a className="btn btn--tg" href={telegramUrl}>
              {t(UI.telegramNow, lang)}
            </a>
          </>
        ) : (
          <p className="muted small">{t(UI.telegramNotSet, lang)}</p>
        )}
      </div>
    </main>
  )
}
