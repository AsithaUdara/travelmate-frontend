"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Header from '@/components/organisms/Header'; // <-- IMPORT HEADER
import Footer from '@/components/organisms/Footer'; // <-- IMPORT FOOTER
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
    <div className="bg-slate-50 text-slate-800 antialiased">
      <Header /> {/* <-- ADDED HEADER */}
      <main>
        <HeroSection />
        <SocialProofSection />
        <FeatureSection />
        <InspirationGallery />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer /> {/* <-- ADDED FOOTER */}
    </div>
  );
}

// 1. Hero Section
const HeroSection = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const heroImages = [
        { src: "/hero/hero-1.jpg", alt: "Scenic train journey in Sri Lanka" },
        { src: "/hero/hero-2.jpg", alt: "Sigiriya rock fortress in Sri Lanka" },
        { src: "/hero/hero-3.jpg", alt: "Beautiful beach in Sri Lanka" },
    ];

    return (
        <section className="relative h-[95vh] min-h-[700px] w-full">
            <Carousel
                className="w-full h-full"
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{ loop: true }}
            >
                <CarouselContent>
                    {heroImages.map((image, index) => (
                        <CarouselItem key={index} className="relative h-[95vh] min-h-[700px]">
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
                            <Button size="lg" variant="ghost">
                                Learn More <span aria-hidden="true" className="ml-2">→</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 2. Social Proof Section
const SocialProofSection = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <p className="text-center text-sm font-semibold text-slate-500">
        POWERING TRIPS FOR TRAVELERS FROM AROUND THE GLOBE
      </p>
      <div className="mt-6 flex justify-center gap-x-8 text-slate-400">
        <p className="font-medium">Booking.com</p>
        <p className="font-medium">Airbnb</p>
        <p className="font-medium">Sri Lanka Railways</p>
        <p className="font-medium">Local Guides</p>
      </div>
    </div>
  </section>
);

// 3. Feature Section
const FeatureSection = () => (
  <section id="features" className="py-20 overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to plan trips, in one place.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            From intelligent itinerary creation to real-time transport updates and discovering hidden local gems, TravelMate.lk handles the details so you can focus on the adventure.
          </p>
          <dl className="mt-12 grid grid-cols-1 gap-10">
            <FeatureItem icon={Sparkles} title="AI-Powered Itinerary" description="Get a personalized, optimized plan in seconds. Our AI considers your budget, interests, and even real-time weather."/>
            <FeatureItem icon={Train} title="Unified Transport Hub" description="Live schedules for trains, buses, and tuk-tuks. Get delay notifications and book your ride seamlessly."/>
            <FeatureItem icon={MapPin} title="Authentic Local Discovery" description="Go beyond the tourist traps. Find the best local food, unique experiences, and cultural spots."/>
          </dl>
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

// 4. Inspiration Gallery
const InspirationGallery = () => (
    <section id="gallery" className="bg-slate-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Embark on Your Sri Lankan Venture</h2>
        <p className="mt-4 text-lg text-slate-500">Yesterday you said tomorrow. Plan your dream trip today.</p>
        <div className="mt-10 grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-4">
            <div className="col-span-2 row-span-2 relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/gallery/gallery-1.jpg" alt="Sri Lankan Beach" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 100vw, 50vw"/>
            </div>
             <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/gallery/gallery-2.jpg" alt="Elephant Safari" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 50vw, 25vw"/>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/gallery/gallery-3.jpg" alt="Sri Lankan Food" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 50vw, 25vw"/>
            </div>
            <div className="col-span-2 relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/gallery/gallery-4.jpg" alt="Tea Plantations" fill style={{objectFit: 'cover'}} sizes="(max-width: 768px) 100vw, 50vw"/>
            </div>
        </div>
      </div>
    </section>
);

// 5. FAQ Section
const FaqSection = () => (
  <section id="faq" className="py-20">
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

// 6. Final CTA
const FinalCtaSection = () => (
  <section className="relative py-20">
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/60 z-10" />
     <Image src="/gallery/cta-bg.jpg" alt="Sri Lankan coastline" fill style={{objectFit: 'cover'}}/>
    <div className="relative z-20 container mx-auto px-4 text-center text-white">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready for Your Adventure?</h2>
      <p className="mt-4 text-lg text-slate-200">Your journey of a lifetime is just a few clicks away. Sign up now.</p>
      <div className="mt-8">
        <Link href="/register">
          <Button size="lg">Get Started Now</Button>
        </Link>
      </div>
    </div>
  </section>
);

// Helper Components
const FeatureItem = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div>
    <dt className="flex items-center gap-x-3 text-lg font-semibold">
      <Icon className="h-6 w-6 text-teal-600" aria-hidden="true" />
      {title}
    </dt>
    <dd className="mt-2 text-base text-slate-500">{description}</dd>
  </div>
);

const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <details className="group rounded-lg bg-slate-100 p-4 cursor-pointer">
    <summary className="flex items-center justify-between font-semibold list-none">
      {question}
      <ChevronDown className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" />
    </summary>
    <p className="mt-2 text-slate-600">{answer}</p>
  </details>
);