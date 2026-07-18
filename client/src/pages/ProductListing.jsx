import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { SkeletonGrid } from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";

const CATEGORIES = ["Denim", "Dresses", "Outerwear", "Accessories", "Tops", "Skirts", "Footwear", "Knitwear", "Ethnic Wear", "Activewear"];
const CONDITIONS = ["Like New", "Gently Used", "Well Loved"];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestsellers", label: "Best Sellers" },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const condition = searchParams.get("condition") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    setLoading(true);
    const params = { sort, page, limit: 12 };
    if (category) params.category = category;
    if (condition) params.condition = condition;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    axiosInstance
      .get("/products", { params })
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: res.data.products.length });
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, condition, search, sort, minPrice, maxPrice, page]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || condition || search || minPrice || maxPrice;

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-display mb-2">Shop the rack</h1>
        <p className="opacity-70 text-sm">{pagination.total ?? products.length} pieces available</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10 items-center">
        <select
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={condition}
          onChange={(e) => updateFilter("condition", e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm"
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          placeholder="Min ₹"
          defaultValue={minPrice}
          onKeyDown={(e) => e.key === "Enter" && updateFilter("minPrice", e.target.value)}
          onBlur={(e) => updateFilter("minPrice", e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm w-24"
        />
        <input
          type="number"
          placeholder="Max ₹"
          defaultValue={maxPrice}
          onKeyDown={(e) => e.key === "Enter" && updateFilter("maxPrice", e.target.value)}
          onBlur={(e) => updateFilter("maxPrice", e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm w-24"
        />
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={search}
          onKeyDown={(e) => e.key === "Enter" && updateFilter("search", e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm flex-1 min-w-[180px]"
        />
        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="bg-putty-light border border-line rounded-sm px-4 py-2 text-sm"
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="mono text-xs uppercase tracking-wide opacity-60 hover:opacity-100 underline">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={12} />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No pieces match these filters"
          subtitle="Try clearing a filter or searching a different term."
          action={<button onClick={clearFilters} className="btn-outline">Clear filters</button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  );
}
