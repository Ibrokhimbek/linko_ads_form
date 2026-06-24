// Vercel Serverless Function: POST /api/lead
// Forma javoblarini qabul qilib AmoCRM da lid yaratadi.
// Lokal dev'da esa shu logika server/index.js (Express) orqali ishlaydi.
import { createLead } from '../server/amocrm.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const { formTitle, formSlug, answers, utm } = req.body || {}

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ ok: false, message: 'Javoblar bo‘sh' })
  }

  // Minimal tekshiruv: ism va telefon
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
      utm,
    })
    return res.status(200).json({ ok: true, leadId: result.leadId })
  } catch (err) {
    console.error('Lid yaratishda xato:', err.message, err.details || '')
    const code = err.code === 'AMOCRM_NOT_CONFIGURED' ? 500 : 502
    return res.status(code).json({
      ok: false,
      message: err.code === 'AMOCRM_NOT_CONFIGURED' ? 'CRM hali sozlanmagan' : 'CRM bilan bog‘lanishda xatolik',
    })
  }
}
