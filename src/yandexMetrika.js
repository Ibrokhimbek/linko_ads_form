// Yandex.Metrika — SPA uchun dinamik yuklash.
// Har forma o'z counter ID'siga ega (POS / SFA), forma ochilganda init qilinadi.

const initialized = new Set()

// tag.js skriptini bir marta yuklaydi va berilgan counter'ni init qiladi.
export function initMetrika(id) {
  if (!id || typeof window === 'undefined' || initialized.has(id)) return
  initialized.add(id)

  /* eslint-disable */
  ;(function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        ;(m[i].a = m[i].a || []).push(arguments)
      }
    m[i].l = 1 * new Date()
    for (var j = 0; j < e.scripts.length; j++) {
      if (e.scripts[j].src === r) {
        return
      }
    }
    k = e.createElement(t)
    a = e.getElementsByTagName(t)[0]
    k.async = 1
    k.src = r
    a.parentNode.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + id, 'ym')
  /* eslint-enable */

  window.ym(id, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  })
}

// Maqsad (goal) — masalan, forma muvaffaqiyatli yuborilganda.
export function reachGoal(id, goal) {
  if (id && typeof window !== 'undefined' && window.ym) {
    window.ym(id, 'reachGoal', goal)
  }
}
