// components/home/Pricing.tsx
"use client";
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCcw, Headset } from "lucide-react";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Basic Package",
    price: "$0",
    description: "Perfect for developers getting started with blockchain development",
    features: [
      "Single Project Development Environment",
      "Browser-Based Contract Deployment",
      "One-Click Frontend Integration",
      "Seamless Wallet Integration",
      "Downloadable dApp Resources",
      "Basic Documentation Access",
      "Community Forum Support"
    ]
  },
  {
    name: "Developer Package",
    price: "$10",
    description: "Enhanced tools and features for professional developers",
    features: [
      "All Basic Package Features",
      "Unlimited Project Development",
      "Advanced Contract Testing Suite",
      "Oracle Integration Framework",
      "Automated Frontend Deployment & Hosting",
      "Custom Subdomain Provisioning",
      "Automated Contract Management via Telegram Bot",
      "Priority Email Support",
      "Advanced API Access"
    ]
  },
  {
    name: "Enterprise Package",
    price: "Custom Pricing",
    description: "Comprehensive solution for organizations and large-scale deployments",
    features: [
      "All Developer Package Features",
      "Enterprise-Grade Analytics Dashboard",
      "24/7 Dedicated Technical Support",
      "Custom SLA Agreements",
      "Enterprise Security Features",
      "Dedicated Account Manager",
      "Professional Training Programs",
      "Custom Integration Solutions",
      "Unlimited Team Members",
      "On-Premise Deployment Options"
    ]
  }
];

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black/90">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Flexible pricing options to support your blockchain development journey
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-xl backdrop-blur-sm border ${
                index === 1 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/20' 
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10'
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center pb-8 border-b border-white/10">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom Pricing" && (
                    <span className="text-gray-400">/month</span>
                  )}
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-300 gap-3">
                    <CheckIcon className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button 
                  className={`w-full px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    index === 1
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                      : 'border border-white/20 hover:bg-white/10'
                  }`}
                >
                  {index === 2 ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>

              {index === 2 && (
                <p className="mt-4 text-center text-sm text-gray-400">
                  Custom pricing for enterprise needs
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">
            All plans include basic features like browser-based deployment and community support
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-300">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-300">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Headset className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-300">24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}