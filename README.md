# Linko — Instagram reklama formalari

Instagram reklamasi tugmasi orqali ochiladigan **2 ta ko‘p qadamli (wizard) forma** —
**SFA** va **POS**. Oqim: salomlashuv → savollar (variantli) → kontakt (ism + telefon) →
javoblar **AmoCRM** da yangi lid bo‘lib yaratiladi → «Rahmat!» ekrani → **Telegram botga** redirect.

Dizayn [linko.uz](https://linko.uz) uslubida: **Golos Text** shrifti, brend rangi `#5a5bff`, pill tugmalar.

## Texnologiya
- **Frontend:** Vite + React + React Router
- **Backend:** Express (AmoCRM tokeni faqat serverda saqlanadi)

## Havolalar (Instagram reklama tugmasiga qo‘yiladi)
- SFA formasi: `/form/sfa`  (yoki `/form/1`)
- POS formasi: `/form/pos`  (yoki `/form/2`)

## Ishga tushirish
```bash
npm install
cp .env.example .env     # qiymatlarni to‘ldiring
npm run dev              # web (5173) + api (3001) birga ishlaydi
```
Brauzerda: http://localhost:5173/form/1

## Productionga build (lokal)
```bash
npm run build            # frontendni dist/ ga quradi
npm start                # Express dist/ ni va /api ni bitta portda tarqatadi
```

## Vercel'ga deploy
Vercel'da frontend statik (`dist`), backend esa `api/` ichidagi **serverless function**lar
(`api/lead.js`) sifatida ishlaydi. `vercel.json` Vite preseti va SPA routing'ni sozlaydi.

1. Kodni GitHub'ga yuboring: `git push origin main`
2. [vercel.com](https://vercel.com) → **New Project** → `linko_ads_form` reposini import qiling.
3. **Environment Variables** bo'limiga quyidagilarni qo'shing (deploy'dan oldin!):

   | Key | Value |
   |-----|-------|
   | `AMOCRM_SUBDOMAIN` | `linkouz` |
   | `AMOCRM_ACCESS_TOKEN` | *(lokal `.env` dan ko'chiring)* |
   | `AMOCRM_POS_PIPELINE_ID` | `9857042` |
   | `AMOCRM_POS_STATUS_ID` | `78392222` |
   | `AMOCRM_SFA_PIPELINE_ID` | `10394262` |
   | `AMOCRM_SFA_STATUS_ID` | `82159646` |
   | `VITE_TELEGRAM_URL` | `https://t.me/linko_sotuv_bot` |

   > `VITE_TELEGRAM_URL` — **build vaqtida** o'qiladi, shuning uchun birinchi deploy'dan
   > oldin qo'shilishi shart (keyin o'zgartirilsa, qayta deploy kerak).

4. **Deploy** bosing. Tayyor URL: `https://<loyiha>.vercel.app/form/pos` va `/form/sfa`.

CLI orqali (muqobil): `npx vercel` (login) → env'larni qo'shing → `npx vercel --prod`.

## Sozlash kerak bo‘ladigan joylar
| Nima | Qayerda |
|------|---------|
| Formadagi savollar | `src/forms.config.js` |
| AmoCRM token / subdomain | `.env` (`AMOCRM_*`) |
| Telegram bot havolasi | `.env` (`VITE_TELEGRAM_URL`) yoki har forma uchun `src/forms.config.js > telegramUrl` |

## AmoCRM haqida
- Lid `POST /api/v4/leads/complex` orqali kontakt bilan birga yaratiladi.
- Barcha javoblar lidga **izoh (note)** bo‘lib qo‘shiladi.
- `name` va `phone` belgilangan savollar kontakt maydonlariga ketadi.
- Token bo‘lmasa, server `/api/lead` ga 500 qaytaradi (forma «xato» holatini ko‘rsatadi).

### Har bir forma — alohida voronka (pipeline)
`formSlug` bo‘yicha lid to‘g‘ri voronka/bosqichga tushadi (`.env`):
| Forma | Pipeline | Bosqich (status) |
|-------|----------|------------------|
| POS | `AMOCRM_POS_PIPELINE_ID` = 9857042 (POS New) | `AMOCRM_POS_STATUS_ID` = 78392222 (Входящий) |
| SFA | `AMOCRM_SFA_PIPELINE_ID` = 10394262 (SFA New) | `AMOCRM_SFA_STATUS_ID` = 82159646 (Первичный контакт) |

> ⚠️ **Eslatma:** AmoCRM'dagi «Неразобранное» (unsorted) bosqichiga API orqali lid
> qo‘yib bo‘lmaydi — u maxsus "kiruvchi lidlar" holati va hisobdagi avtomatika uni
> boshqa voronkaga ko‘chirib yuboradi. Shuning uchun oddiy bosqich ishlatiladi.

## Loyiha tuzilmasi
```
src/
  forms.config.js           # 2 forma + savollar/variantlar (shu yerda tahrirlanadi)
  pages/FormPage.jsx        # wizard: welcome → savollar → kontakt
  components/OptionStep.jsx # savol qadami (single/multi tanlov)
  components/ContactStep.jsx# ism + telefon + yuborish
  components/ThankYou.jsx   # rahmat ekrani + Telegram redirect
server/
  index.js                  # Express API + dist tarqatish
  amocrm.js                 # AmoCRM lid yaratish
```
