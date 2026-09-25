import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import commerceService, { toCollection } from "../services/commerceService";
import ProductCard from "../components/ProductCard";
import "../styles/portal.css";

export function CustomerShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [wished, setWished] = useState(new Set());
  useEffect(() => {
    Promise.allSettled([
      commerceService.getProducts(),
      commerceService.getCategories(),
      commerceService.getBrands(),
      commerceService.getWishlist(),
    ])
      .then(([p, c, b, w]) => {
        setProducts(toCollection(p.value));
        setCategories(toCollection(c.value));
        setBrands(toCollection(b.value));
        setWished(
          new Set(
            toCollection(w.value).map((item) => item.productId || item.product?.id),
          ),
        );
      })
      .finally(() => setLoading(false));
  }, []);
  const add = async (product) => {
    const variantId =
      product.defaultVariantId || product.variantId || product.variant?.id;
    if (!variantId)
      return setMessage(
        "This product has no purchasable variant configured yet.",
      );
    try {
      await commerceService.addToCart(variantId);
      setMessage(`${product.name} added to your cart.`);
    } catch (error) {
      setMessage(error.message);
    }
  };
  const wishlist = async (product) => {
    try {
      if (wished.has(product.id)) {
        await commerceService.removeFromWishlist(product.id);
        setWished(
          (current) => new Set([...current].filter((id) => id !== product.id)),
        );
      } else {
        await commerceService.addToWishlist(product.id);
        setWished((current) => new Set(current).add(product.id));
      }
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div>
          <span className="eyebrow">THE WEEKEND EDIT</span>
          <h1>
            Good things,
            <br />
            <em>beautifully chosen.</em>
          </h1>
          <p>Discover considered essentials from brands worth knowing.</p>
          <Link to="/shop" className="hero-button">
            Shop the collection <span>↗</span>
          </Link>
        </div>
        <div className="hero-art">
          <div className="hero-circle" />
          <span className="hero-tag">
            NEW SEASON
            <br />
            <b>01 / 04</b>
          </span>
        </div>
      </section>
      {message && <div className="shop-notice">{message}</div>}
      <section className="shop-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BROWSE BY MOOD</span>
            <h2>Find your next favorite</h2>
          </div>
          <Link to="/shop">View all →</Link>
        </div>
        <div className="category-tiles">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              to={`/shop?category=${category.id}`}
              className={`category-tile tile-${index % 4}`}
              key={category.id}
            >
              <span>0{index + 1}</span>
              <strong>{category.name}</strong>
              <small>Explore collection ↗</small>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="empty-state">
              Categories will appear here when they are available from the API.
            </div>
          )}
        </div>
      </section>
      <section className="shop-section tinted">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Trending now</h2>
          </div>
          <Link to="/shop">See all products →</Link>
        </div>
        {loading ? (
          <div className="inline-loading">Loading products...</div>
        ) : (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={add}
                onWishlist={wishlist}
                wished={wished.has(product.id)}
              />
            ))}
            {products.length === 0 && (
              <div className="empty-state">No products are available yet.</div>
            )}
          </div>
        )}
      </section>
      <section className="brand-strip">
        <div>
          <span className="eyebrow">BRANDS WE LOVE</span>
          <h2>Good company</h2>
        </div>
        {brands.slice(0, 6).map((brand) => (
          <span key={brand.id}>{brand.name}</span>
        ))}
      </section>
    </div>
  );
}
