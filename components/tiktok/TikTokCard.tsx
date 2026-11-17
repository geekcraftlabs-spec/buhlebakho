"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { TikTokVideo } from "@/lib/tiktok";

export function TikTokCard({ video }: { video: TikTokVideo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onClick={() => setOpen(true)}
        className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-black border border-white/10 group text-left"
        aria-label={`Play TikTok video: ${video.title || "Tap to watch"}`}
      >
        {video.cover ? (
          <Image
            src={video.cover}
            alt={video.title || "TikTok video"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-espresso via-neutral-950 to-black" />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-terracotta/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/40">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
            {video.title || "Tap to watch on TikTok"}
          </p>
          <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">
            @{video.author}
          </p>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden bg-black"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <iframe
                src={`https://www.tiktok.com/embed/v2/${video.videoId}`}
                className="w-full h-full"
                allow="encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}