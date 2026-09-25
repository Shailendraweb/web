import { LoginForm } from '../components/LoginForm'
import '../styles/forms.css'

export function LoginPage() {
  return (
    <div className="auth-screen">
      <div className="auth-brand"><span className="brand-mark">N</span><span>NOVA<span>COMMERCE</span></span></div>
      <div className="auth-screen-content"><LoginForm /></div>
      <p className="auth-footer-note">Curated essentials. Considered delivery.</p>
    </div>
  )
}
