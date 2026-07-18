import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import CategoryCard from "../components/CategoryCard";
import { SkeletonGrid } from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <div className="eyebrow">Shop by category</div>
      <h1 className="text-4xl md:text-5xl font-display mb-3">All Categories</h1>
      <p className="opacity-70 text-sm mb-12 max-w-md">
        From denim to dresses, sorted and steamed — find exactly what you're after.
      </p>

      {loading ? (
        <SkeletonGrid count={10} />
      ) : categories.length === 0 ? (
        <EmptyState icon="🗂️" title="No categories yet" subtitle="Categories will appear here once added from the admin panel." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((c) => <CategoryCard key={c._id} category={c} />)}
        </div>
      )}
    </div>
  );
}
