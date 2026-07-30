"use client";

import { useState, useEffect } from "react";
import { ICONS } from "@/lib/icons";

type UpvoteButtonProps = {
  type: "destination" | "hotel" | "shop" | "gallery";
  id: string;
  initialCount: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function UpvoteButton({ type, id, initialCount, className = "", style = {} }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const key = `upvoted_${type}_${id}`;
    if (localStorage.getItem(key)) {
      setVoted(true);
    }
  }, [type, id]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (voted) return;

    // Optimistic UI
    setVoted(true);
    setCount(c => c + 1);
    localStorage.setItem(`upvoted_${type}_${id}`, "true");

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      if (!res.ok) {
        // Revert on failure
        setVoted(false);
        setCount(c => Math.max(0, c - 1));
        localStorage.removeItem(`upvoted_${type}_${id}`);
      }
    } catch (err) {
      setVoted(false);
      setCount(c => Math.max(0, c - 1));
      localStorage.removeItem(`upvoted_${type}_${id}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleVote}
      className={`upvote-btn ${voted ? "voted" : ""} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "transparent",
        border: "none",
        cursor: voted ? "default" : "pointer",
        color: voted ? "var(--terracotta)" : "currentColor",
        opacity: voted ? 1 : 0.6,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "12px",
        transition: "all 0.2s ease",
        padding: "4px 8px",
        borderRadius: "4px",
        ...style
      }}
      title={voted ? "You liked this" : "Like this"}
      disabled={voted}
    >
      <span 
        style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          transform: voted ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
      >
        <svg 
          width="16" height="16" viewBox="0 0 24 24" 
          fill={voted ? "currentColor" : "none"} 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </span>
      <span>{count}</span>
    </button>
  );
}
