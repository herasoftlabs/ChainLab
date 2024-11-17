// components/home/Features.tsx
"use client";

import { motion } from 'framer-motion';
import { Layers, MonitorSmartphone, Palette, Zap, Code2, Users } from "lucide-react";

type Feature = {
  icon: any;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Layers,
    title: "Drag & Drop Builder",
    description: "Build your dApp visually with our intuitive interface"
  },
  {
    icon: MonitorSmartphone,
    title: "Cross-Platform",
    description: "Deploy to any blockchain platform seamlessly"
  },
  {
    icon: Palette,
    title: "Customizable",
    description: "Fully customizable components and styling"
  },
  {
    icon: Zap,
    title: "Fast & Secure",
    description: "Built with performance and security in mind"
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    description: "Clean code output and API integration"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Backed by a strong developer community"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-black/90">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10"
            >
              <feature.icon className="w-10 h-10 text-blue-400" />
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}