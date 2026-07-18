import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import StepCard from "../components/StepCard";
import StoryCard from "../components/StoryCard";
import Newsletter from "../components/Newsletter";
import { SkeletonGrid } from "../components/SkeletonCard";

export default function Home() {
  const [homeContent, setHomeContent] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/home"),
      axiosInstance.get("/products", { params: { sort: "newest", limit: 8 } }),
      axiosInstance.get("/products", { params: { sort: "bestsellers", limit: 4 } }),
      axiosInstance.get("/categories"),
      axiosInstance.get("/steps"),
      axiosInstance.get("/stories"),
    ])
      .then(([home, prods, best, cats, stepsRes, storiesRes]) => {
        setHomeContent(home.data.homeContent);
        setFeatured(prods.data.products);
        setNewArrivals(prods.data.products.slice(0, 4));
        setBestSellers(best.data.products);
        setCategories(cats.data.categories.slice(0, 4));
        setSteps(stepsRes.data.steps.slice(0, 3));
        setStories(storiesRes.data.stories.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="pt-20 md:pt-24 pb-16 overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-8 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="eyebrow">Preloved & Ready</div>
            <h1 className="text-[38px] md:text-[68px] leading-[0.98] mb-6 font-display">
              {homeContent?.heroTitle || "Second life, first choice."}
            </h1>
            <p className="text-[17px] max-w-[440px] opacity-80 mb-8">
              {homeContent?.heroSubtitle || "Curated preloved fashion, hand-checked and honestly priced."}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link to="/shop" className="btn-primary">{homeContent?.heroButtonText || "Shop the rack"}</Link>
              <Link to="/how-it-works" className="text-sm font-semibold border-b border-ink pb-0.5">How it works</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={homeContent?.heroImage?.url || "https://loremflickr.com/700/875/vintagefashion?lock=1"}
              alt="Preloved fashion"
              className="w-full aspect-[4/5] object-cover rounded-sm shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-cream-paper border border-ink px-5 py-4 w-[170px] -rotate-6 shadow-md">
              <div className="mono text-[10px] uppercase tracking-wide opacity-60 mb-1">Just In</div>
              <div className="font-display font-semibold text-2xl">₹899</div>
              <div className="mono text-xs line-through opacity-50">₹3,400</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-bottle text-putty-light py-3.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-10 mono text-[13px] tracking-wide uppercase">
          <span>500+ pieces rescued this month</span>
          <span className="text-mustard">✦</span>
          <span>Every item hand-checked</span>
          <span className="text-mustard">✦</span>
          <span>Pay online, get instant receipt</span>
          <span className="text-mustard">✦</span>
          <span>Free returns within 7 days</span>
          <span className="text-mustard">✦</span>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="pt-24 pb-10" id="categories">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex justify-between items-end mb-11 flex-wrap gap-5">
            <h2 className="text-[32px] md:text-[42px] font-display">Popular categories</h2>
            <Link to="/categories" className="text-sm font-semibold border-b border-ink pb-0.5">View all →</Link>
          </div>
          {loading ? <SkeletonGrid count={4} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map((c) => <CategoryCard key={c._id} category={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex justify-between items-end mb-11 flex-wrap gap-5">
            <h2 className="text-[32px] md:text-[42px] font-display">New arrivals</h2>
            <p className="max-w-[320px] opacity-70 text-sm">Fresh on the rack this week, priced fair.</p>
          </div>
          {loading ? <SkeletonGrid count={4} /> : newArrivals.length === 0 ? (
            <p className="opacity-60 text-sm">No products yet — add some from the admin panel.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section className="py-24 bg-putty-light">
          <div className="max-w-[1180px] mx-auto px-8">
            <div className="flex justify-between items-end mb-11 flex-wrap gap-5">
              <h2 className="text-[32px] md:text-[42px] font-display">Best sellers</h2>
              <Link to="/shop?sort=bestsellers" className="text-sm font-semibold border-b border-ink pb-0.5">Shop all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED / TRENDING */}
      <section className="py-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex justify-between items-end mb-11 flex-wrap gap-5">
            <h2 className="text-[32px] md:text-[42px] font-display">Trending this week</h2>
            <p className="max-w-[320px] opacity-70 text-sm">What everyone's adding to cart right now.</p>
          </div>
          {loading ? <SkeletonGrid count={4} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featured.slice(4, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-primary">View All Pieces</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-putty-light" id="how">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex justify-between items-end mb-11 flex-wrap gap-5">
            <h2 className="text-[32px] md:text-[42px] font-display">How ReWear works</h2>
            <Link to="/how-it-works" className="text-sm font-semibold border-b border-ink pb-0.5">See full process →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => <StepCard key={s._id} step={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* STORIES */}
      {stories.length > 0 && (
        <section className="py-24" id="stories">
          <div className="max-w-[1180px] mx-auto px-8">
            <div className="flex justify-between items-end mb-11 flex-wrap gap-5">
              <h2 className="text-[32px] md:text-[42px] font-display">From the fitting room</h2>
              <Link to="/stories" className="text-sm font-semibold border-b border-ink pb-0.5">Read more →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {stories.map((s, i) => <StoryCard key={s._id} story={s} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="pb-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <Newsletter heading={homeContent?.promoBannerText || "Get first pick of new drops, every Friday."} />
        </div>
      </section>
    </div>
  );
}
