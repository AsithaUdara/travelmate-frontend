"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import { ChevronDown, MapPin, Sparkles, Train } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from 'react';

export default function LandingPageV2() {
  return (
    <div className="bg-white text-slate-800 antialiased">
      <Header />
      {/* FIX: Added top padding to the main element to prevent header overlap on scroll */}
      <main className="pt-24"> {/* This value can be adjusted (e.g., pt-20) if needed */}
        <HeroSection />
        <SocialProofSection />
        <FeatureSection />
        <InspirationGallery />
        <FaqSection />
        <FinalCtaSection />
      </main>
      {/* FIX: Removed the unwanted spacer div */}
      <Footer />
    </div>
  );
}

// 1. Hero Section - Adjusted to account for the new main padding
const HeroSection = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const heroImages = [
        { src: "/hero/hero-3.jpg", alt: "Beautiful beach in Sri Lanka" },
        { src: "/hero/hero-1.jpg", alt: "Scenic train journey in Sri Lanka" },
        { src: "/hero/hero-2.jpg", alt: "Sigiriya rock fortress in Sri Lanka" },
    ];

    return (
        // FIX: Using a negative top margin to pull the hero section back up under the transparent header
        <section className="relative -mt-24 h-screen min-h-[700px] w-full">
            <Carousel
                className="w-full h-full"
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{ loop: true }}
            >
                <CarouselContent>
                    {heroImages.map((image, index) => (
                        <CarouselItem key={index} className="relative h-screen min-h-[700px]">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority={index === 0}
                                className="brightness-50"
                                sizes="100vw"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            
            <div className="absolute inset-0 z-20 container mx-auto flex h-full items-center px-4">
                <div className="max-w-2xl text-left">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Effortless Planning for Your Dream Sri Lankan Adventure.
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-200">
                        Discover the fastest and most enjoyable way to plan your trip with our AI-powered, all-in-one travel companion.
                    </p>
                    <div className="mt-10 flex items-center gap-x-4">
                        <Link href="/register">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link href="#features">
                           <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ... (The rest of your components: SocialProofSection, FeatureSection, etc. remain the same) ...

const SocialProofSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest">
        INTEGRATED WITH THE SERVICES YOU ALREADY TRUST
      </p>
      <div className="mt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-slate-400">
        <p className="font-medium text-lg">Booking.com</p>
        <p className="font-medium text-lg">Airbnb</p>
        <p className="font-medium text-lg">Sri Lanka Railways</p>
        <p className="font-medium text-lg">Local Guides</p>
      </div>
    </div>
  </section>
);

const FeatureSection = () => (
  <section id="features" className="py-20 overflow-hidden bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
              Everything you need to plan trips, in one place.
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-xl">
              From intelligent itinerary creation to real-time transport updates and discovering hidden local gems, TravelMate.lk handles the details so you can focus on the adventure.
            </p>
          </div>
          <div className="mt-12 space-y-10">
            <FeatureItem icon={Sparkles} title="AI-Powered Itinerary" description="Get a personalized, optimized plan in seconds. Our AI considers your budget, interests, and even real-time weather."/>
            <FeatureItem icon={Train} title="Unified Transport Hub" description="Live schedules for trains, buses, and tuk-tuks. Get delay notifications and book your ride seamlessly."/>
            <FeatureItem icon={MapPin} title="Authentic Local Discovery" description="Go beyond the tourist traps. Find the best local food, unique experiences, and cultural spots."/>
          </div>
        </div>
        <div className="relative flex items-center justify-center lg:h-auto">
          <div className="relative w-[320px] sm:w-[400px]">
            <Image src="/mockups/mockup-main.png" alt="App map itinerary" width={400} height={812} style={{ width: '100%', height: 'auto' }} className="relative z-10 rounded-2xl shadow-2xl ring-1 ring-slate-200"/>
            <Image src="/mockups/mockup-card-1.png" alt="App transport options" width={400} height={812} style={{ width: '100%', height: 'auto' }} className="absolute -bottom-12 -left-16 z-0 rounded-2xl shadow-2xl ring-1 ring-slate-200 transform -rotate-6 transition hover:rotate-0"/>
            <Image src="/mockups/mockup-card-2.png" alt="App recommendations" width={400} height={812} style={{ width: '100%', height: 'auto' }} className="absolute -top-12 -right-16 z-20 rounded-2xl shadow-2xl ring-1 ring-slate-200 transform rotate-6 transition hover:rotate-0"/>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const InspirationGallery = () => (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Embark on Your Sri Lankan Venture</h2>
        <p className="mt-4 text-lg text-slate-600">Yesterday you said tomorrow. Plan your dream trip today.</p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4">
            <div className="col-span-2 row-span-2 rounded-xl overflow-hidden group relative">
                <Image src="/gallery/gallery-1.jpg" alt="Sri Lankan Beach" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 100vw, 50vw" className="transition-transform duration-300 group-hover:scale-105"/>
            </div>
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden group relative">
                <Image src="/gallery/gallery-2.jpg" alt="Elephant Safari" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 50vw, 25vw" className="transition-transform duration-300 group-hover:scale-105"/>
            </div>
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden group relative">
                <Image src="/gallery/gallery-3.jpg" alt="Sri Lankan Food" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 50vw, 25vw" className="transition-transform duration-300 group-hover:scale-105"/>
            </div>
            <div className="col-span-2 row-span-1 rounded-xl overflow-hidden group relative">
                <Image src="/gallery/gallery-4.jpg" alt="Tea Plantations" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 100vw, 50vw" className="transition-transform duration-300 group-hover:scale-105"/>
            </div>
        </div>
      </div>
    </section>
);

const FaqSection = () => (
  <section id="faq" className="py-20 bg-slate-50">
    <div className="container mx-auto max-w-3xl px-4">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
      <div className="mt-10 space-y-4">
        <FaqItem question="How does the AI itinerary planner work?" answer="Our AI analyzes your preferences, budget, travel dates, and real-time data like weather. It calculates the most efficient routes and schedules to create a personalized plan you can customize."/>
        <FaqItem question="Is the transport information really live?" answer="Yes, we partner with local transport authorities and use real-time data pipelines to provide the most up-to-date information, including delays and cancellations."/>
        <FaqItem question="Can I use the app offline?" answer="Absolutely. You can download your entire itinerary, maps, and booking details for offline access, which is crucial for remote areas in Sri Lanka."/>
      </div>
    </div>
  </section>
);

const FinalCtaSection = () => (
  <section className="relative py-20 bg-slate-800">
    <div className="absolute inset-0 opacity-20">
        <Image src="/gallery/cta-bg.jpg" alt="Sri Lankan coastline" fill style={{objectFit: 'cover'}}/>
    </div>
    <div className="relative z-20 container mx-auto px-4 text-center text-white">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready for Your Adventure?</h2>
      <p className="mt-4 text-lg text-slate-300">Your journey of a lifetime is just a few clicks away. Sign up now.</p>
      <div className="mt-8">
        <Link href="/register">
          <Button size="lg">Get Started Now</Button>
        </Link>
      </div>
    </div>
  </section>
);

const FeatureItem = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-200">
        <Icon className="h-6 w-6 text-slate-800" aria-hidden="true" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-base text-slate-600">{description}</p>
    </div>
  </div>
);

const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <details className="group rounded-lg bg-white p-6 shadow-sm cursor-pointer">
    <summary className="flex items-center justify-between font-semibold list-none text-slate-900">
      {question}
      <ChevronDown className="h-5 w-5 transition-transform duration-300 group-open:rotate-180 text-slate-500" />
    </summary>
    <p className="mt-4 text-slate-600">{answer}</p>
  </details>
);