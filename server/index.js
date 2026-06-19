import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createLead, isConfigured } from './amocrm.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '100kb' }))

// Sog'lik tekshiruvi
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, amocrm: isConfigured() })
})

// Asosiy endpoint: forma javoblarini qabul qilib AmoCRM da lid yaratadi
app.post('/api/lead', async (req, res) => {
  const { formTitle, formSlug, answers } = req.body || {}

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ ok: false, message: 'Javoblar bo‘sh' })
  }

  // Minimal server tomonida tekshiruv: ism va telefon
  const name = answers.find((a) => a.map === 'name')?.value?.trim()
  const phone = answers.find((a) => a.map === 'phone')?.value?.trim()
  if (!name || !phone) {
    return res.status(400).json({ ok: false, message: 'Ism va telefon talab qilinadi' })
  }

  try {
    const result = await createLead({
      formSlug,
      formTitle: formTitle || `Forma ${formSlug || ''}`.trim(),
      answers,
    })
    return res.json({ ok: true, leadId: result.leadId })
  } catch (err) {
    console.error('Lid yaratishda xato:', err.message, err.details || '')
    const code = err.code === 'AMOCRM_NOT_CONFIGURED' ? 500 : 502
    return res.status(code).json({
      ok: false,
      message:
        err.code === 'AMOCRM_NOT_CONFIGURED'
          ? 'CRM hali sozlanmagan'
          : 'CRM bilan bog‘lanishda xatolik',
    })
  }
})

// Production: qurib chiqilgan frontendni (dist) tarqatamiz + SPA fallback
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next()
  })
})

app.listen(PORT, () => {
  console.log(`✅ Server: http://localhost:${PORT}  (AmoCRM ${isConfigured() ? 'sozlangan' : 'SOZLANMAGAN'})`)
})
