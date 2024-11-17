// app/page.tsx
import Features from '@/components/home/Features'
import About from '@/components/home/About'
import Pricing from '@/components/home/Pricing'
import Roadmap from '@/components/home/Roadmap'
import Hero from '@/components/home/Hero'
import Navigation from '@/components/home/Navigation'
import Footer from '@/components/home/Footer'
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <Features />
      <About />
      <Pricing />
      <Roadmap />
      <Footer />
    </main>
  )
}