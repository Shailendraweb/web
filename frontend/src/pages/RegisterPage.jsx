import { RegisterForm } from '../components/RegisterForm'
import '../styles/forms.css'

export function RegisterPage() {
  return (
    <div className="auth-screen auth-screen-register">
      <div className="auth-brand"><span className="brand-mark">N</span><span>NOVA<span>COMMERCE</span></span></div>
      <div className="auth-screen-content"><RegisterForm /></div>
      <p className="auth-footer-note">A quieter way to discover good things.</p>
    </div>
  )
}
