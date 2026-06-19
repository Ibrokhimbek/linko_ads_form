import { UI, t } from '../forms.config.js'

// Bitta savol qadami. value: single -> indeks (number), multi -> indekslar massivi.
export default function OptionStep({ question, value, onChange, onNext, onBack, canBack, stepLabel, lang }) {
  const isMulti = question.type === 'multi'
  const selected = isMulti ? value || [] : value

  function toggle(i) {
    if (isMulti) {
      const set = new Set(selected)
      set.has(i) ? set.delete(i) : set.add(i)
      onChange([...set])
    } else {
      onChange(i)
      // single tanlovda biroz kechikib avtomatik keyingi qadamga o'tamiz
      window.setTimeout(onNext, 220)
    }
  }

  const canContinue = isMulti ? selected.length > 0 : selected != null

  return (
    <div className="step">
      <span className="step-label">{stepLabel}</span>
      <h2 className="question">{t(question.question, lang)}</h2>
      {isMulti && <p className="muted small">{t(UI.multiHint, lang)}</p>}

      <div className="options">
        {question.options.map((opt, i) => {
          const active = isMulti ? selected.includes(i) : selected === i
          return (
            <button
              key={i}
              type="button"
              className={`option${active ? ' option--active' : ''}`}
              onClick={() => toggle(i)}
            >
              <span className={`option-mark${isMulti ? ' option-mark--box' : ''}`} />
              <span>{t(opt, lang)}</span>
            </button>
          )
        })}
      </div>

      {(canBack || isMulti) && (
        <div className="actions">
          {canBack ? (
            <button type="button" className="btn btn--ghost" onClick={onBack}>
              {t(UI.back, lang)}
            </button>
          ) : (
            <span />
          )}
          {isMulti && (
            <button type="button" className="btn btn--primary" onClick={onNext} disabled={!canContinue}>
              {t(UI.continue, lang)}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
