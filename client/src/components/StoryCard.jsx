import React from "react";
import RatingStars from "./RatingStars";

const ROTATIONS = ["rotate-[1deg]", "-rotate-[1.5deg]", "-rotate-[0.5deg]", "rotate-[2deg]", "-rotate-[1deg]", "rotate-[0.5deg]"];

export default function StoryCard({ story, index = 0 }) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  const date = story.date ? new Date(story.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "";

  return (
    <div className={`bg-cream-paper border border-ink p-6 relative ${rot}`}>
      <div className="absolute -top-2 left-6 w-3.5 h-3.5 rounded-full bg-putty border border-ink" />
      <div className="flex items-center gap-3 mb-4">
        <img
          src={story.photo?.url || "https://loremflickr.com/100/100/portrait"}
          alt={story.userName}
          className="w-10 h-10 rounded-full object-cover border border-ink"
        />
        <div>
          <div className="font-semibold text-sm">{story.userName}</div>
          <div className="text-xs opacity-55">{story.location}</div>
        </div>
      </div>
      <RatingStars rating={story.rating} />
      <div className="font-display italic text-[15px] leading-relaxed my-3">"{story.title}"</div>
      <p className="text-sm opacity-70 mb-3">{story.description}</p>
      <div className="mono text-[10px] uppercase tracking-wide opacity-45">{date}</div>
    </div>
  );
}
