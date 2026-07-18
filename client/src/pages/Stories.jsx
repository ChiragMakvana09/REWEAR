import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import StoryCard from "../components/StoryCard";
import { SkeletonGrid } from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/stories")
      .then((res) => setStories(res.data.stories))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-16">
      <div className="eyebrow">From the fitting room</div>
      <h1 className="text-4xl md:text-5xl font-display mb-3">Customer Stories</h1>
      <p className="opacity-70 text-sm mb-14 max-w-md">What people are saying after their first swap.</p>

      {loading ? (
        <SkeletonGrid count={9} />
      ) : stories.length === 0 ? (
        <EmptyState icon="💬" title="No stories yet" />
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {stories.map((s, i) => <StoryCard key={s._id} story={s} index={i} />)}
        </div>
      )}
    </div>
  );
}
