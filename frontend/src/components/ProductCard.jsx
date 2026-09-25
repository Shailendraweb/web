import { Link } from 'react-router-dom'

export function ProductCard({ product, onAdd, onWishlist, wished = false }) {
  const image = product.images?.[0]?.url || product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
  const price = Number(product.price || product.salePrice || 0)
  const original = Number(product.originalPrice || product.mrp || price)
  const discount = original > price ? Math.round((1 - price / original) * 100) : 0
  return <article className="product-card">
    <div className="product-image-wrap"><Link to={`/products/${product.id}`}><img src={image} alt={product.name} /></Link><button className={`wishlist-button ${wished ? 'wished' : ''}`} onClick={() => onWishlist?.(product)} aria-label="Wishlist">{wished ? '♥' : '♡'}</button>{discount > 0 && <span className="discount-chip">-{discount}%</span>}</div>
    <div className="product-card-body"><span className="product-brand">{product.brand?.name || product.brand || 'Nova selection'}</span><Link to={`/products/${product.id}`} className="product-name">{product.name}</Link><div className="rating-line"><span className="rating-badge">★ {product.rating || '4.2'}</span><span>{product.reviewCount || product.reviews?.length || 0} reviews</span></div><div className="price-line"><strong>{price ? `$${price.toFixed(2)}` : 'Price on request'}</strong>{original > price && <del>${original.toFixed(2)}</del>}</div><button className="card-add" onClick={() => onAdd?.(product)}>Add to cart</button></div>
  </article>
}

export default ProductCard
