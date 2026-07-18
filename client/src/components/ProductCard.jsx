import React from "react";
import { Link } from "react-router-dom";
import PriceTag from "./PriceTag";
import RatingStars from "./RatingStars";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const image = product.images?.[0]?.url || "https://loremflickr.com/500/650/clothing";
  const wishlisted = isWishlisted(product._id);

  const handleAdd = () => {
    addToCart(product, 1);
    showToast(`${product.title} added to cart`);
  };

  const handleWishlist = () => {
    const nowWishlisted = toggleWishlist(product);
    showToast(nowWishlisted ? "Added to wishlist" : "Removed from wishlist");
  };

  return (
    <div className="group">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden rounded-sm mb-3">
          <span className="absolute top-3 left-3 z-10 bg-cream-paper text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-sm mono">
            {product.condition}
          </span>
          <button
            onClick={(e) => { e.preventDefault(); handleWishlist(); }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-cream-paper/90 flex items-center justify-center text-sm hover:scale-110 transition"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? "♥" : "♡"}
          </button>
          <img
            src={image}
            alt={product.title}
            className="w-full aspect-[5/6.5] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="text-xs uppercase tracking-wide opacity-60 mb-1">{product.category}</div>
      <Link to={`/product/${product._id}`}>
        <div className="font-display font-medium mb-1">{product.title}</div>
      </Link>
      {product.description && (
        <p className="text-xs opacity-55 mb-2 line-clamp-1">{product.description}</p>
      )}
      <div className="mb-2"><RatingStars rating={product.rating || 4.5} /></div>
      <div className="flex items-center justify-between">
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
        <button
          onClick={handleAdd}
          disabled={product.stock < 1}
          className="w-8 h-8 rounded-full border border-ink flex items-center justify-center hover:bg-ink hover:text-putty-light transition disabled:opacity-30"
          title={product.stock < 1 ? "Out of stock" : "Add to cart"}
        >
          +
        </button>
      </div>
    </div>
  );
}
