"use client";

import { useState } from "react";
import SubmitPhotoModal from "@/components/SubmitPhotoModal";

export default function SubmitPhotoButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{
          background: "transparent",
          border: "1px solid rgba(42,36,29,0.2)",
          padding: "8px 16px",
          borderRadius: "40px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px",
          letterSpacing: "0.05em",
          color: "var(--ink)",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--terracotta)";
          e.currentTarget.style.color = "var(--terracotta)";
          e.currentTarget.style.background = "rgba(169,74,50,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(42,36,29,0.2)";
          e.currentTarget.style.color = "var(--ink)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        + Submit Photo
      </button>
      
      <SubmitPhotoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
