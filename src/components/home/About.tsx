// components/home/About.tsx
"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Code2, Shield, Zap, Users } from "lucide-react";

type AboutFeature = {
  icon: any;
  title: string;
  description: string;
}

type AboutStat = {
  value: string;
  label: string;
}

const aboutFeatures: AboutFeature[] = [
  {
    icon: Code2,
    title: "No-Code Platform",
    description: "Build smart contracts without writing a single line of code"
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Enterprise-grade security with automated auditing"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Deploy contracts in minutes, not hours or days"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Backed by a strong community of developers"
  }
];

const aboutStats: AboutStat[] = [
  {
    value: "$10M+",
    label: "Total Value Locked"
  },
  {
    value: "100K+",
    label: "Smart Contracts Deployed"
  },
  {
    value: "50+",
    label: "Blockchain Networks"
  },
  {
    value: "24/7",
    label: "Developer Support"
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-black/95">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Why Choose ChainLab?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're revolutionizing the way developers and businesses interact with blockchain technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              {aboutFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Our Vision
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  We envision a future where creating blockchain applications is as intuitive as building a website. 
                  Our platform bridges the gap between complex blockchain technology and user-friendly development tools.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {aboutStats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5"
                  >
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                      {stat.value}
                    </div>
                    <p className="text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5">
                <h4 className="text-sm font-medium text-gray-400 mb-4">Trusted By</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className="h-12 rounded bg-white/5 flex items-center justify-center"
                    >
                      <span className="text-gray-500 text-xs">Partner {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}