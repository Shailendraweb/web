import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import commerceService from '../services/commerceService'
import '../styles/portal.css'

export function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [reviews, setReviews] = useState([])
  const [variants, setVariants] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  useEffect(() => { Promise.allSettled([commerceService.getProduct(id), commerceService.getProductImages(id), commerceService.getProductReviews(id), commerceService.getProductVariants(id)]).then(([p, i, r, v]) => { setProduct(p.value); setImages(i.value || []); setReviews(r.value || []); setVariants(v.value || []) }) }, [id])
  if (!product) return <div className="page-state">Loading product details...</div>
  const gallery = images.length ? images : [{ url: product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' }]
  const add = async () => { if (!variants[0]?.id) return setMessage('This product has no purchasable variant configured yet.'); try { await commerceService.addToCart(variants[0].id, quantity); setMessage('Added to cart.') } catch (error) { setMessage(error.message) } }
  return <div className="detail-page"><Link className="back-link" to="/shop">← Back to shop</Link>{message && <div className="shop-notice">{message}</div>}<div className="detail-layout"><div className="gallery"><div className="main-image"><img src={gallery[0].url} alt={product.name} /></div><div className="thumbs">{gallery.map((image) => <img key={image.id || image.url} src={image.url} alt="" />)}</div></div><section className="detail-copy"><span className="eyebrow">{product.brand?.name || 'NOVA SELECTION'}</span><h1>{product.name}</h1><div className="detail-rating"><span className="rating-badge">★ {product.rating || '4.2'}</span> {reviews.length} customer reviews</div><div className="detail-price">{product.price ? `$${Number(product.price).toFixed(2)}` : 'Price on request'}{product.mrp && <del>${Number(product.mrp).toFixed(2)}</del>}</div><p className="detail-description">{product.description || 'A considered addition to your everyday collection. Product details and specifications are supplied by the merchant.'}</p><div className="stock-line"><span className="status-dot" />{product.stock === 0 ? 'Currently unavailable' : 'Available to order'}</div><div className="quantity-row"><label>Quantity</label><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}>+</button></div></div><div className="detail-actions"><button className="hero-button" onClick={add}>Add to cart</button><Link className="outline-button" to="/checkout">Buy now</Link><button className="heart-action" onClick={() => commerceService.addToWishlist(product.id)}>♡</button></div><div className="spec-block"><strong>Product information</strong><span>Status <b>{product.status || 'active'}</b></span><span>Category <b>{product.category?.name || 'Not specified'}</b></span><span>Slug <b>{product.slug || 'Not specified'}</b></span></div></section></div><section className="reviews-section"><div className="section-heading"><div><span className="eyebrow">COMMUNITY NOTES</span><h2>Customer reviews</h2></div></div>{reviews.length ? reviews.map((review) => <article className="review" key={review.id}><strong>{review.user?.firstName || 'Verified customer'}</strong><span>★ {review.rating}</span><p>{review.comment || review.body}</p></article>) : <div className="empty-state">No reviews yet.</div>}</section></div>
}
