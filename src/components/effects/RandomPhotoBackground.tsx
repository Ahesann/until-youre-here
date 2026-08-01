"use client";

import { motion } from "motion/react";

export function RandomPhotoBackground() {
  const photoPath = "/images/DSC07495.JPG";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${photoPath})`,
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: 0.14,
          filter: "sepia(0.18) contrast(1.05) brightness(1.04)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.14 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Soft Warm Cream Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#faf4ec]/50 to-[#faf4ec]/92" />
    </div>
  );
}
