import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <h1 className="text-4xl font-display mb-2">Your Wishlist</h1>
      <p className="opacity-70 text-sm mb-10">{items.length} saved piece{items.length !== 1 ? "s" : ""}</p>

      {items.length === 0 ? (
        <EmptyState
          icon="♡"
          title="Your wishlist is empty"
          subtitle="Tap the heart icon on any product to save it here for later."
          action={<Link to="/shop" className="btn-primary">Browse the Rack</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
