// =============================================================================
//  AmoCRM integratsiyasi
//  Hujjat: https://www.amocrm.ru/developers/content/crm_platform/leads-api
//
//  Kerakli .env o'zgaruvchilari:
//    AMOCRM_SUBDOMAIN          - hisob subdomeni (masalan "linkouz" => linkouz.amocrm.ru)
//    AMOCRM_ACCESS_TOKEN       - uzoq muddatli (long-lived) access token
//    AMOCRM_BASE_URL           - (ixtiyoriy) to'liq URL (.com hisoblar uchun)
//    AMOCRM_RESPONSIBLE_ID     - (ixtiyoriy) mas'ul foydalanuvchi ID
//  Har bir forma uchun voronka (pipeline) va bosqich (status):
//    AMOCRM_POS_PIPELINE_ID / AMOCRM_POS_STATUS_ID
//    AMOCRM_SFA_PIPELINE_ID / AMOCRM_SFA_STATUS_ID
//  Fallback (forma topilmasa): AMOCRM_PIPELINE_ID / AMOCRM_STATUS_ID
// =============================================================================

function getConfig() {
  const subdomain = process.env.AMOCRM_SUBDOMAIN
  const token = process.env.AMOCRM_ACCESS_TOKEN
  const baseUrl = process.env.AMOCRM_BASE_URL || (subdomain ? `https://${subdomain}.amocrm.ru` : null)

  if (!baseUrl || !token) {
    return { ready: false, baseUrl, token }
  }
  return {
    ready: true,
    baseUrl,
    token,
    responsibleId: numOrNull(process.env.AMOCRM_RESPONSIBLE_ID),
  }
}

// ---------------------------------------------------------------------------
//  Forma javoblarini AmoCRM maxsus maydonlariga ulash xaritasi.
//  enums[] tartibi src/forms.config.js dagi options tartibiga MOS bo'lishi shart!
//  (Variantlarni qayta tartiblasangiz, shu yerdagi enums ham yangilanadi.)
// ---------------------------------------------------------------------------
const AMO_FIELD_MAP = {
  pos: {
    // Har bir POS lidiga avtomatik qo'yiladigan maydonlar:
    _always: [
      { field_id: 722369, values: [{ enum_id: 535071 }] }, // Цель обращения: автоматизировать магазин
      { field_id: 722371, values: [{ enum_id: 535077 }] }, // Источник: Инстаграм
      { field_id: 728173, values: [{ enum_id: 545019 }] }, // Сфера деятельности: Магазин
    ],
    // Do'kon turi -> Вид деятельности (select)
    shop_type: { field_id: 730049, enums: [548285, 548287, 602943, 548299, 603759, 599707, 602951, 603765] },
    // Hozir nimada hisob yuritadi -> Используемые программы (multiselect)
    current_tool: { field_id: 756339, enums: [602941, 594371, 595903] },
    // Qachon avtomatlashtirish -> matn maydoni (o'zbekcha kanonik matn yoziladi)
    timeframe: { field_id: 772195, type: 'text', texts: ['1 hafta ichida', '1 oy ichida', 'Keyinroq'] },
  },
  sfa: {
    _always: [
      { field_id: 722369, values: [{ enum_id: 602849 }] }, // Цель обращения: автоматизировать дистрибьюцию
      { field_id: 722371, values: [{ enum_id: 535077 }] }, // Источник: Инстаграм
      { field_id: 728173, values: [{ enum_id: 545017 }] }, // Сфера деятельности: Дистрибуция
    ],
    // sales_reps / processes uchun mos maydon yo'q -> izohda qoladi
  },
}

// formSlug + javoblar -> AmoCRM custom_fields_values massivi
function buildCustomFields(slug, answers) {
  const map = AMO_FIELD_MAP[(slug || '').toLowerCase()]
  if (!map) return []
  const out = [...(map._always || [])]
  for (const a of answers) {
    const m = map[a.id]
    const idx = a.indexes || []
    if (!m || !idx.length) continue
    if (m.type === 'text') {
      const txt = (m.texts ? idx.map((i) => m.texts[i]) : [a.value]).filter(Boolean).join(', ')
      if (txt) out.push({ field_id: m.field_id, values: [{ value: txt }] })
    } else {
      const values = idx.map((i) => m.enums[i]).filter(Boolean).map((enum_id) => ({ enum_id }))
      if (values.length) out.push({ field_id: m.field_id, values })
    }
  }
  return out
}

// formSlug bo'yicha to'g'ri voronka/bosqichni tanlaydi
function pipelineForForm(slug) {
  const s = (slug || '').toLowerCase()
  const map = {
    pos: { pipelineId: numOrNull(process.env.AMOCRM_POS_PIPELINE_ID), statusId: numOrNull(process.env.AMOCRM_POS_STATUS_ID) },
    sfa: { pipelineId: numOrNull(process.env.AMOCRM_SFA_PIPELINE_ID), statusId: numOrNull(process.env.AMOCRM_SFA_STATUS_ID) },
  }
  return (
    map[s] || {
      pipelineId: numOrNull(process.env.AMOCRM_PIPELINE_ID),
      statusId: numOrNull(process.env.AMOCRM_STATUS_ID),
    }
  )
}

function numOrNull(v) {
  const n = Number(v)
  return Number.isFinite(n) && v ? n : null
}

async function amoFetch(cfg, path, body) {
  const res = await fetch(`${cfg.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const err = new Error(`AmoCRM ${path} javobi: ${res.status}`)
    err.status = res.status
    err.details = data
    throw err
  }
  return data
}

// answers: [{ id, label, value, map }]
function pickByMap(answers, mapName) {
  const a = answers.find((x) => x.map === mapName && x.value)
  return a ? a.value : null
}

function buildNoteText(formTitle, answers) {
  const lines = [`📩 Instagram forma: ${formTitle}`, '']
  for (const a of answers) {
    if (!a.value) continue
    lines.push(`${a.label}: ${a.value}`)
  }
  return lines.join('\n')
}

/**
 * AmoCRM da yangi lid (kontakt bilan birga) yaratadi va javoblarni izoh qilib qo'shadi.
 * @returns {Promise<{leadId:number, contactId:number|null}>}
 */
export async function createLead({ formSlug, formTitle, answers }) {
  const cfg = getConfig()
  if (!cfg.ready) {
    const err = new Error('AmoCRM sozlanmagan: .env da AMOCRM_SUBDOMAIN va AMOCRM_ACCESS_TOKEN ni to‘ldiring')
    err.code = 'AMOCRM_NOT_CONFIGURED'
    throw err
  }
  const { pipelineId, statusId } = pipelineForForm(formSlug)

  const name = pickByMap(answers, 'name')
  const phone = pickByMap(answers, 'phone')
  const email = pickByMap(answers, 'email')

  const contactFields = []
  if (phone) {
    contactFields.push({ field_code: 'PHONE', values: [{ value: phone, enum_code: 'WORK' }] })
  }
  if (email) {
    contactFields.push({ field_code: 'EMAIL', values: [{ value: email, enum_code: 'WORK' }] })
  }

  const lead = {
    name: `${formTitle}${name ? ` — ${name}` : ''}`,
    _embedded: {
      tags: [{ name: 'Instagram' }],
      contacts: [
        {
          name: name || 'Instagram lead',
          ...(contactFields.length ? { custom_fields_values: contactFields } : {}),
        },
      ],
    },
  }

  if (pipelineId) lead.pipeline_id = pipelineId
  if (statusId) lead.status_id = statusId
  if (cfg.responsibleId) lead.responsible_user_id = cfg.responsibleId

  // Forma javoblarini AmoCRM maxsus maydonlariga ulaymiz
  const customFields = buildCustomFields(formSlug, answers)
  if (customFields.length) lead.custom_fields_values = customFields

  // 1) Lid + kontaktni birga yaratamiz (complex endpoint)
  const created = await amoFetch(cfg, '/api/v4/leads/complex', [lead])
  const leadId = Array.isArray(created) ? created[0]?.id : created?.id
  const contactId = Array.isArray(created) ? created[0]?.contact_id ?? null : null

  if (!leadId) {
    const err = new Error('AmoCRM lid yaratmadi (ID qaytmadi)')
    err.details = created
    throw err
  }

  // 2) Barcha javoblarni izoh (note) qilib qo'shamiz
  try {
    await amoFetch(cfg, `/api/v4/leads/${leadId}/notes`, [
      { note_type: 'common', params: { text: buildNoteText(formTitle, answers) } },
    ])
  } catch (e) {
    // Izoh qo'shilmasa ham lid yaratilgan — jarayonni to'xtatmaymiz, faqat log.
    console.warn('AmoCRM izoh qo‘shilmadi:', e.message)
  }

  return { leadId, contactId }
}

export function isConfigured() {
  return getConfig().ready
}
