// components/home/Roadmap.tsx
"use client";
import { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from "lucide-react";

type RoadmapPhase = {
  quarter: string;
  title: string;
  status: string;
  milestones: string[];
}

const roadmapData: RoadmapPhase[] = [
  {
    quarter: "Q1 2025",
    title: "Alfa Release",
    status: "upcoming",
    milestones: [
      "Release ChainLab Alfa",
      "Feedback from Early Users",
      "Contract Templates",
      "Frontend Templates",
      "Wallet Integration",
      "Unit Testing Automation",
      "Provide Hosting & Domain",
      "Create Video Contents"
    ]
  },
  {
    quarter: "Q2 2025",
    title: "Beta Release",
    status: "upcoming",
    milestones: [
      "Release ChainLab Beta",
      "Improve UI and UX",
      "More Contract Templates",
      "More Frontend Templates",
      "Oracle Integrations",
      "Web Container Integration for Deploy on Browser"
    ]
  },
  {
    quarter: "Q3 2025",
    title: "Testnet Phase",
    status: "upcoming",
    milestones: [
      "Testnet Phase",
      "Preparation of Utility Token for Payments ( $DFY )",
      "Release Libraries for Contracts",
      "Release Analytics Tools",
      "Meetings with University Societies"
    ]
  },
  {
    quarter: "Q4 2025",
    title: "Mainnet Phase",
    status: "upcoming",
    milestones: [
      "Mainnet Phase",
      "Airdrop",
      "Cross Blockchain Support",
      "Integrate Web2 Tools",
      "Create Enterprise Materials",
      "Bootcamps"
    ]
  }
];

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  return (
    <section id="roadmap" className="py-24 bg-black/90">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Roadmap
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Our journey to revolutionize blockchain development
          </motion.p>
        </div>
        <div className="relative mt-20">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20">
            {canScrollLeft && (
              <motion.button
                onClick={() => scroll('left')}
                whileHover={{ scale: 1.1 }}
                className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all backdrop-blur-sm"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </motion.button>
            )}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20">
            {canScrollRight && (
              <motion.button
                onClick={() => scroll('right')}
                whileHover={{ scale: 1.1 }}
                className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all backdrop-blur-sm"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            )}
          </div>
          <div 
            ref={containerRef}
            className="overflow-x-auto scroll-smooth hide-scrollbar"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="flex gap-8 min-w-max px-12">
              {roadmapData.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative w-[400px] ${
                    index % 2 === 0 ? '-translate-y-1/2' : 'translate-y-1/2'
                  }`}
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                        {phase.quarter}
                      </span>
                      <span className="text-purple-400 text-sm">
                        {phase.title}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {phase.milestones.map((milestone, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
            Join Our Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}