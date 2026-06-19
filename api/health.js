// Vercel Serverless Function: GET /api/health
// AmoCRM sozlanganini tekshirish uchun (debug).
import { isConfigured } from '../server/amocrm.js'

export default function handler(_req, res) {
  res.status(200).json({ ok: true, amocrm: isConfigured() })
}
