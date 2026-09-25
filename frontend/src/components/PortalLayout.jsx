import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { getFullName, getStoredUser } from '../utils/authUtils'
import '../styles/portal.css'

const adminLinks = [
  ['Dashboard', '/admin', '▦'], ['Users', '/admin/users', '♙'], ['Brands', '/admin/brands', '◆'],
  ['Categories', '/admin/categories', '◈'], ['Subcategories', '/admin/subcategories', '◇'],
  ['Products', '/admin/products', '□'], ['Orders', '/admin/orders', '≡'], ['Order Reports', '/admin/reports/orders', '⌁'],
  ['Inventory / Stock', '/admin/inventory', '▥'], ['Offers / Coupons', '/admin/coupons', '%'], ['Reports', '/admin/reports', '◒'], ['Settings', '/admin/settings', '⚙'],
]

export function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const user = getStoredUser()

  const logout = async () => {
    await authService.logout().catch(() => {})
    navigate('/login')
  }

  return (
    <div className={`admin-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand-lockup"><span className="brand-mark">N</span><span className="brand-copy">NOVA<span>COMMERCE</span></span></div>
        <div className="sidebar-caption">Workspace</div>
        <nav className="admin-nav">
          {adminLinks.map(([label, path, icon]) => <NavLink key={path} to={path} end={path === '/admin'} onClick={() => setMobileOpen(false)}><span className="nav-icon">{icon}</span><span className="nav-label">{label}</span></NavLink>)}
        </nav>
        <div className="sidebar-footer"><span className="status-dot" />Systems operational</div>
      </aside>
      {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <div className="admin-main">
        <header className="admin-header">
          <button className="icon-button menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">☰</button>
          <button className="icon-button collapse-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar">⇔</button>
          <div className="header-search"><span>⌕</span><input placeholder="Search anything..." /></div>
          <div className="header-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="profile-menu"><span className="avatar">{user?.firstName?.[0] || 'A'}</span><div><strong>{getFullName(user) || 'Administrator'}</strong><small>Administrator</small></div><button className="profile-caret" onClick={logout} title="Logout">⌄</button></div></div>
        </header>
        <main className="portal-content">{children}</main>
      </div>
    </div>
  )
}

const customerNav = ['Home', 'Electronics', 'Mobiles', 'Fashion', 'Beauty', 'Home & Kitchen', 'Grocery', 'Sports', 'Books']

export function CustomerLayout({ children }) {
  const navigate = useNavigate()
  const user = getStoredUser()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const submitSearch = (event) => { event.preventDefault(); navigate(`/shop?search=${encodeURIComponent(query)}`) }
  const logout = async () => { await authService.logout().catch(() => {}); navigate('/login') }

  return <div className="customer-shell">
    <header className="customer-header">
      <div className="customer-topbar"><button className="mobile-customer-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">☰</button><Link to="/shop" className="customer-logo"><span className="brand-mark">N</span><span>NOVA<span>COMMERCE</span></span></Link><form className="customer-search" onSubmit={submitSearch}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands and more" /><button aria-label="Search">⌕</button></form><nav className="customer-actions"><Link to="/profile">♙ <span>{user?.firstName || 'Account'}</span></Link><Link to="/wishlist">♡ <span>Wishlist</span></Link><Link to="/orders">▤ <span>Orders</span></Link><Link to="/cart">▢ <span>Cart</span></Link><button onClick={logout} className="customer-logout">Logout</button></nav></div>
      <nav className={`category-nav ${menuOpen ? 'open' : ''}`}>{customerNav.map((item) => <Link key={item} to={`/products?category=${encodeURIComponent(item)}`} onClick={() => setMenuOpen(false)}>{item}</Link>)}</nav>
    </header>
    <main>{children}</main>
    <footer className="customer-footer"><div><strong>NOVACOMMERCE</strong><p>Thoughtful products, delivered simply.</p></div><div><strong>Customer care</strong><Link to="/orders">Track orders</Link><Link to="/profile">My account</Link></div><div><strong>Explore</strong><Link to="/shop">All products</Link><Link to="/wishlist">Wishlist</Link></div></footer>
  </div>
}
