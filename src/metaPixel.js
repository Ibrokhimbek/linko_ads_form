// Meta (Facebook) Pixel — SPA uchun dinamik yuklash.
// Faqat metaPixelId belgilangan forma uchun ishga tushadi (hozircha POS).

const initialized = new Set()

// fbevents.js ni bir marta yuklaydi, pixelni init qilib PageView yuboradi.
export function initPixel(id) {
  if (!id || typeof window === 'undefined' || initialized.has(id)) return
  initialized.add(id)

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq('init', id)
  window.fbq('track', 'PageView')
}

// Konversiya — faqat REAL muvaffaqiyatli zayavkadan keyin chaqiriladi.
export function trackLead(id) {
  if (id && typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead')
  }
}
