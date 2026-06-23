import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getForm, UI, t } from '../forms.config.js'
import { initMetrika, reachGoal } from '../yandexMetrika.js'
import OptionStep from '../components/OptionStep.jsx'
import ContactStep from '../components/ContactStep.jsx'
import ThankYou from '../components/ThankYou.jsx'
import LangToggle from '../components/LangToggle.jsx'

const TELEGRAM_FALLBACK = import.meta.env.VITE_TELEGRAM_URL || ''

function initialLang() {
  const saved = typeof localStorage !== 'undefined' && localStorage.getItem('linko_lang')
  return saved === 'ru' || saved === 'uz' ? saved : 'uz'
}

// Mijoz birdaniga 1-savoldan boshlaydi. Qadamlar: 1..N savollar, N+1 kontakt.
export default function FormPage() {
  const { slug } = useParams()
  const form = useMemo(() => getForm(slug), [slug])

  const [lang, setLang] = useState(initialLang)
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({}) // { questionId: index | index[] }
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [status, setStatus] = useState('filling') // filling | submitting | success | error
  const [serverError, setServerError] = useState('')

  // Forma ochilganda mos Yandex.Metrika counter'ini ishga tushiramiz
  useEffect(() => {
    if (form?.metrikaId) initMetrika(form.metrikaId)
  }, [form?.metrikaId])

  function toggleLang() {
    setLang((l) => {
      const next = l === 'uz' ? 'ru' : 'uz'
      try {
        localStorage.setItem('linko_lang', next)
      } catch {}
      return next
    })
  }

  if (!form) {
    return (
      <main className="page">
        <div className="card">
          <header className="card-top">
            <div className="card-top-row">
              <Logo />
              <LangToggle lang={lang} onToggle={toggleLang} />
            </div>
          </header>
          <h1>{t(UI.notFoundTitle, lang)}</h1>
          <p className="muted">{t(UI.notFoundText, lang)}</p>
        </div>
      </main>
    )
  }

  const telegramUrl = form.telegramUrl || TELEGRAM_FALLBACK
  const totalSteps = form.questions.length + 1
  const isContact = step === totalSteps
  const currentQuestion = !isContact ? form.questions[step - 1] : null
  const isFirst = step === 1

  const next = () => setStep((s) => Math.min(totalSteps, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))
  const setAnswer = (qid, value) => setAnswers((a) => ({ ...a, [qid]: value }))

  async function submit() {
    setStatus('submitting')
    setServerError('')

    // Javoblarni yig'amiz. indexes -> backend AmoCRM maydoniga ulaydi (til muhim emas),
    // value -> izoh uchun (tanlangan tildagi matn).
    const questionAnswers = form.questions.map((q) => {
      const raw = answers[q.id]
      const indexes = q.type === 'multi' ? raw || [] : raw != null ? [raw] : []
      const value = indexes.map((i) => t(q.options[i], lang)).join(', ')
      return { id: q.id, label: t(q.question, lang), value, indexes, map: null }
    })
    const payloadAnswers = [
      { id: 'name', label: t(UI.name, lang), value: contact.name.trim(), map: 'name' },
      { id: 'phone', label: t(UI.phone, lang), value: contact.phone.trim(), map: 'phone' },
      ...questionAnswers,
    ]

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formSlug: form.slug, formTitle: form.crmTitle, lang, answers: payloadAnswers }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Server xatosi')
      }
      setStatus('success')
      // Konversiya maqsadi (Yandex.Metrika)
      reachGoal(form.metrikaId, 'lead_submitted')
    } catch (err) {
      setServerError(err.message || 'Nimadir xato ketdi')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <ThankYou lang={lang} text={t(form.thankYou.text, lang)} telegramUrl={telegramUrl} />
  }

  return (
    <main className="page">
      <div className="card">
        <header className="card-top">
          <div className="card-top-row">
            <Logo />
            <LangToggle lang={lang} onToggle={toggleLang} />
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </header>

        <div className="step-anim" key={step}>
          {isFirst && (
            <div className="intro">
              <h1>{t(form.welcome.title, lang)}</h1>
              <p className="muted">{t(form.welcome.text, lang)}</p>
            </div>
          )}

          {currentQuestion && (
            <OptionStep
              lang={lang}
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={(v) => setAnswer(currentQuestion.id, v)}
              onNext={next}
              onBack={back}
              canBack={!isFirst}
              stepLabel={`${step} / ${totalSteps}`}
            />
          )}

          {isContact && (
            <ContactStep
              lang={lang}
              text={t(form.contact.text, lang)}
              contact={contact}
              onChange={setContact}
              onBack={back}
              onSubmit={submit}
              submitting={status === 'submitting'}
              error={status === 'error' ? serverError : ''}
              stepLabel={`${totalSteps} / ${totalSteps}`}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function Logo() {
  return <img className="logo" src="/linko-logo.svg" alt="Linko" width="78" height="40" />
}
