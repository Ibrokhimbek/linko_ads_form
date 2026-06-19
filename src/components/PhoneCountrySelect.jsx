import { useEffect, useRef, useState } from 'react'
import { t } from '../forms.config.js'

// Telefon prefiksi uchun custom dropdown (native select o'rniga).
export default function PhoneCountrySelect({ countries, value, onChange, lang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = countries.find((c) => c.code === value) || countries[0]

  useEffect(() => {
    if (!open) return
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(code) {
    onChange(code)
    setOpen(false)
  }

  return (
    <div className="dial" ref={ref}>
      <button
        type="button"
        className={`dial-btn${open ? ' dial-btn--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="dial-flag">{selected.flag}</span>
        <span className="dial-code">{selected.dial}</span>
        <span className="dial-caret" aria-hidden="true" />
      </button>

      {open && (
        <ul className="dial-menu" role="listbox">
          {countries.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === value}
                className={`dial-item${c.code === value ? ' dial-item--active' : ''}`}
                onClick={() => pick(c.code)}
              >
                <span className="dial-flag">{c.flag}</span>
                <span className="dial-name">{t(c.name, lang)}</span>
                <span className="dial-code">{c.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
