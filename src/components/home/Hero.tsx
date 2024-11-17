// components/home/Hero.tsx
"use client";
import { motion } from 'framer-motion';
import { ArrowRight} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Shield, DollarSign, PlayCircle, MousePointer, Box } from "lucide-react";

function Globe() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#3B82F6"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Globe />
          <OrbitControls enableZoom={false} autoRotate />
        </Canvas>
      </div>
  
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-left"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Build Smart Contracts
              </span>
              <br />
              <span className="text-white">
                Without Code
              </span>
            </h1>
            
            <p className="text-xl mt-6 text-gray-300 max-w-xl">
              Create, deploy, and manage smart contracts with our intuitive drag-and-drop builder. 
              No coding experience required.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity flex items-center gap-2">
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2">
                Watch Demo
                <PlayCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <h4 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  1000+
                </h4>
                <p className="text-gray-400 mt-1">Contracts Created</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  50+
                </h4>
                <p className="text-gray-400 mt-1">Templates</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  24/7
                </h4>
                <p className="text-gray-400 mt-1">Support</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">Smart Contract Builder</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                    <h5 className="text-sm font-medium mb-2">Components</h5>
                    <div className="space-y-2">
                      <div className="bg-blue-500/20 p-2 rounded flex items-center gap-2">
                        <Box className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Token Contract</span>
                      </div>
                      <div className="bg-purple-500/20 p-2 rounded flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">Access Control</span>
                      </div>
                      <div className="bg-green-500/20 p-2 rounded flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Payment System</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                    <h5 className="text-sm font-medium mb-2">Preview</h5>
                    <div className="space-y-2">
                      <div className="h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <code className="text-xs text-gray-300">
                          contract MyToken {"{...}"}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">
                      Compile
                    </button>
                    <button className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">
                      Deploy
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">
                    Ready to deploy
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-gray-400">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MousePointer className="w-5 h-5" />
        </motion.div>
        <span className="text-sm">Scroll to explore</span>
      </div>
    </section>
  );
}