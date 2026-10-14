"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { TikTokVideo } from "@/lib/tiktok";

export function TikTokCard({ video }: { video: TikTokVideo }) {
  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noreferrer noopener"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-black group block"
    >
      <Image
        src={video.thumbnail}
        alt={video.title || "TikTok video"}
        fill
        sizes="(max-width: 768px) 60vw, 280px"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-terracotta/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={20} className="text-white ml-0.5" fill="white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
          {video.title}
        </p>
        <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">
          @{video.author}
        </p>
      </div>
    </motion.a>
  );
}