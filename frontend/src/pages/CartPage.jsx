import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import commerceService from '../services/commerceService'
import '../styles/portal.css'

export function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const load = () => commerceService.getCart().then(setCart).catch((error) => setMessage(error.message)).finally(() => setLoading(false))
  useEffect(load, [])
  const items = cart?.items || cart?.cartItems || []
  const total = items.reduce((sum, item) => sum + Number(item.price || item.product?.price || 0) * Number(item.quantity || 1), 0)
  const update = async (item, quantity) => { try { await commerceService.updateCartItem(item.id, quantity); load() } catch (error) { setMessage(error.message) } }
  const remove = async (item) => { try { await commerceService.removeCartItem(item.id); load() } catch (error) { setMessage(error.message) } }
  if (loading) return <div className="page-state">Loading your cart...</div>
  return <div className="cart-page"><div className="page-heading"><span className="eyebrow">YOUR SELECTION</span><h1>Shopping cart</h1><p>{items.length} items waiting for you.</p></div>{message && <div className="shop-notice">{message}</div>}{items.length === 0 ? <div className="empty-panel"><span>▢</span><h2>Your cart is waiting</h2><p>Add something considered from the shop and it will appear here.</p><Link to="/shop" className="hero-button">Explore products</Link></div> : <div className="cart-layout"><section className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><img src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'} alt={item.product?.name || 'Cart item'} /><div><span className="product-brand">{item.product?.brand?.name || 'Nova selection'}</span><h3>{item.product?.name || `Item #${item.id}`}</h3><strong>${Number(item.price || item.product?.price || 0).toFixed(2)}</strong><div className="quantity-control"><button onClick={() => update(item, Math.max(1, item.quantity - 1))}>−</button><span>{item.quantity}</span><button onClick={() => update(item, item.quantity + 1)}>+</button></div></div><button className="remove-link" onClick={() => remove(item)}>Remove</button></article>)}</section><aside className="summary-card"><span className="eyebrow">SUMMARY</span><h2>Order total</h2><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><div><span>Delivery</span><strong>Calculated at checkout</strong></div><hr /><div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><Link to="/checkout" className="hero-button">Proceed to checkout →</Link></aside></div>}</div>
}
