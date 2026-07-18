import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="group block">
      <div className="relative overflow-hidden rounded-sm mb-3 aspect-[5/6.5]">
        <img
          src={category.image?.url || "https://loremflickr.com/500/650/fashion"}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-cream-paper">
          <div className="text-2xl mb-1">{category.icon}</div>
          <div className="font-display font-semibold text-lg">{category.name}</div>
        </div>
      </div>
      <p className="text-sm opacity-65">{category.description}</p>
    </Link>
  );
}
