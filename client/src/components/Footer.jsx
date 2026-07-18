import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const SOCIAL_ICONS = {
  instagram: "IG",
  twitter: "X",
  facebook: "FB",
  pinterest: "P",
};

export default function Footer() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axiosInstance.get("/home").then((res) => setContent(res.data.homeContent)).catch(() => {});
  }, []);

  const social = content?.socialLinks || {};

  return (
    <footer className="bg-bottle-dark text-putty-light mt-20">
      <div className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold flex items-center gap-2 font-display mb-3">
              <span className="w-2.5 h-2.5 bg-mustard rounded-full inline-block" />
              ReWear
            </div>
            <p className="opacity-70 text-sm max-w-[220px] mb-4">
              {content?.footerTagline || "A preloved fashion marketplace for clothes that deserve a second chapter."}
            </p>
            <div className="flex gap-2">
              {Object.entries(SOCIAL_ICONS).map(([key, label]) =>
                social[key] ? (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-[11px] mono hover:bg-white/10 transition"
                  >
                    {label}
                  </a>
                ) : null
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Shop</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/shop">All products</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/shop?sort=bestsellers">Best sellers</Link>
              <Link to="/wishlist">Wishlist</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Company</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/about">About</Link>
              <Link to="/how-it-works">How it works</Link>
              <Link to="/stories">Stories</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Support</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/my-orders">Track order</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/contact#faq">FAQ</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-2 text-xs opacity-60">
          <span>© 2026 ReWear.</span>
          <span>Made for a better closet</span>
        </div>
      </div>
    </footer>
  );
}
