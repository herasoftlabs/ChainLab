"use client";

import React from 'react';
import { DynamicWalletButton } from "@/components/wallet/DynamicWalletButton";

import { SolanaWalletButton } from '@/components/wallet/SolanaWalletButton';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code2, Layers, Zap, MonitorSmartphone, Palette, Users, Shield, DollarSign } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/react"
export default function LandingPage() {
  

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navigation Bar */}
      <nav className="fixed w-full shadow-xs bg-white z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            <img src="./images/logo-dark.svg" alt="" className='max-w-[10rem]'/>
          </Link>
          <div className="hidden md:flex space-x-6 items-center justify-between">
            <Link href="#about" className="text-gray-700 hover:text-primary transition">
              About
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-primary transition">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary transition">
              Pricing
            </Link>
          </div>
          <div className="md:hidden">           
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-[15rem] pb-[15rem]">
        <div className="container px-4 mx-auto max-w-6xl flex flex-col-reverse lg:flex-row items-center">
          
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Create Your dApp
              <span className="text-primary block mt-2">In Minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
              Transform your ideas into stunning dApps with our intuitive drag-and-drop builder.  
              <b> <i>No coding required.</i></b>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Button size="lg">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div className="relative mx-auto max-w-md lg:max-w-lg">
            <Image 
              src="/images/header-img.png" 
              alt="Page Builder Interface"
              width={500}
              height={500}
              className="rounded-3xl shadow-2xl"
              priority
            />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="container px-4 mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">Everything You Need to Create</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-[10rem] bg-white">
        <div className="container px-4 mx-auto max-w-6xl flex flex-col-reverse lg:flex-row items-center">

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-muted-foreground mb-6">
              At dAppBuilder, we empower creators and entrepreneurs to build decentralized applications effortlessly. Our mission is to simplify the dApp development process, making it accessible to everyone.
            </p>
            <Link href="/about" className="text-primary font-semibold hover:underline">
              Learn More
            </Link>
          </div>
   
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              <Image 
                src="./images/chainlab-logo-dark.svg" 
                alt="About Us"
                width={800}
                height={600}
                className="rounded-xl p-5 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-secondary/10">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-16">Pricing Plans</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="p-6 flex flex-col items-center">
                <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✔️</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full">
                  Choose Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-md mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are building their online presence with our platform.
          </p>
          <Link href="/signup" className="inline-block">
            <Button size="lg" className="gap-2 bg-primary-light">
              Get Started for Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-200">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <p className="mb-4">&copy; {new Date().getFullYear()} ChainLab. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

const features = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Drag & Drop Builder",
    description: "Build pages visually with our intuitive drag and drop interface. No technical skills required."
  },
  {
    icon: <MonitorSmartphone className="w-6 h-6" />,
    title: "Responsive Design",
    description: "Your pages look perfect on all devices, from desktop to mobile, automatically."
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Custom Styling",
    description: "Customize every aspect of your page with our powerful styling controls."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Optimized for speed and performance, your pages load instantly."
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Clean Code Export",
    description: "Export clean, optimized code ready for production deployment."
  },
  {
    icon: <Users className="w-6 h-6" />, 
    title: "Collaboration Tools",
    description: "Work seamlessly with your team using our integrated collaboration features."
  }
];

const pricingPlans = [
  {
    name: "Basic",
    price: "$0/mo",
    features: [
      "Access to all components",
      "Single project",
      "Email support",
      "Community access"
    ]
  },
  {
    name: "Pro",
    price: "$10/mo",
    features: [
      "Access to all components",
      "Unlimited projects",
      "Priority support",
      "Team collaboration"
    ]
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    features: [
      "All Pro features",
      "Dedicated support",
      "Custom integrations",
      "Onboarding assistance"
    ]
  }
];
