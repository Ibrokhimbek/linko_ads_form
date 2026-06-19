import { Routes, Route, Navigate } from 'react-router-dom'
import FormPage from './pages/FormPage.jsx'

export default function App() {
  return (
    <Routes>
      {/* Instagram reklama tugmasi shu havolalardan biriga olib keladi:
            /form/1  -> 1-reklama formasi
            /form/2  -> 2-reklama formasi  */}
      <Route path="/form/:slug" element={<FormPage />} />
      <Route path="/" element={<Navigate to="/form/1" replace />} />
      <Route path="*" element={<Navigate to="/form/1" replace />} />
    </Routes>
  )
}
