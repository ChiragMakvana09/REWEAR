import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import PriceTag from "../components/PriceTag";
import RatingStars from "../components/RatingStars";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const imgWrapRef = useRef(null);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    axiosInstance.get(`/products/${id}`).then((res) => setProduct(res.data.product));
    setActiveImg(0);
  }, [id]);

  if (!product) return <div className="max-w-[1180px] mx-auto px-8 py-24 text-center opacity-60">Loading...</div>;

  const images = product.images.length ? product.images : [{ url: "https://loremflickr.com/700/875/clothing" }];
  const wishlisted = isWishlisted(product._id);

  const handleMouseMove = (e) => {
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <Link to="/shop" className="text-sm opacity-60 hover:opacity-100 mb-8 inline-block">← Back to shop</Link>
      <div className="grid md:grid-cols-2 gap-14">
        {/* IMAGE AREA — thumbnails column beside main image */}
        <div className="flex gap-3">
          {images.length > 1 && (
            <div className="flex flex-col gap-2 shrink-0 max-h-[560px] overflow-y-auto pr-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-sm overflow-hidden transition-all duration-200
                    ${i === activeImg
                      ? "outline outline-2 outline-bottle opacity-100"
                      : "outline outline-1 outline-ink/10 opacity-60 hover:opacity-100 hover:outline-ink/30"}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div
            ref={imgWrapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setOrigin("50% 50%")}
            className="relative flex-1 overflow-hidden rounded-sm group bg-cream-paper
                       border border-ink/10 transition-all duration-300
                       hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] hover:border-ink/20 cursor-zoom-in"
          >
            <img
              key={activeImg}
              src={images[activeImg].url}
              alt={product.title}
              style={{ transformOrigin: origin }}
              className="w-full aspect-[4/5] object-contain rounded-sm transition-transform duration-300 ease-out
                         group-hover:scale-125 animate-[fadeIn_0.3s_ease-out]"
            />
          </div>
        </div>

        <div>
          <div className="mono text-xs uppercase tracking-wide text-rose mb-2">{product.category} · {product.condition}</div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-display mb-3">{product.title}</h1>
            <button
              onClick={() => showToast(toggleWishlist(product) ? "Added to wishlist" : "Removed from wishlist")}
              className="w-11 h-11 shrink-0 rounded-full border border-ink flex items-center justify-center text-lg
                         hover:bg-ink hover:text-cream-paper hover:scale-110 active:scale-95 transition-all duration-200"
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>
          <div className="mb-3"><RatingStars rating={product.rating || 4.5} size="text-sm" /></div>
          <PriceTag price={product.price} originalPrice={product.originalPrice} />
          <p className="opacity-75 mt-6 mb-8 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="opacity-60">Size:</span>
            <span className="font-semibold">{product.size}</span>
            <span className="opacity-60 ml-4">Stock:</span>
            <span className="font-semibold">{product.stock > 0 ? `${product.stock} left` : "Out of stock"}</span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 border border-ink rounded-sm hover:bg-ink hover:text-cream-paper transition-colors duration-200">−</button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-9 h-9 border border-ink rounded-sm hover:bg-ink hover:text-cream-paper transition-colors duration-200">+</button>
            </div>
          )}

          <button
            disabled={product.stock < 1}
            onClick={() => { addToCart(product, qty); showToast(`${product.title} added to cart`); }}
            className="btn-primary disabled:opacity-30 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            {product.stock < 1 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}