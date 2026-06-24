// Landingga o'tilganda URL'dagi UTM metkalari va reklama click ID'larini ushlaydi.
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'fbclid',
  'gclid',
  'yclid',
]

export function captureUtm() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k)
    if (v) out[k] = v
  }
  if (document.referrer) out.utm_referrer = document.referrer
  return out
}
