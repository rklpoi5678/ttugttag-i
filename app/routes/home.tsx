
{/* section components */}
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Navigation from "@/components/landing/Navigation";
// import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export function meta() {
  return [
    { title: "ttugttag-i"},
    { 
      property: "og:title",
      content: "ttugttag-i main page"
    },
    { 
      name: "description",
      content: "Very fast,easy idea sketch"
    }
  ]
}


export default function LandingPage() {

  return (
    <>
    <div>
      {/* Navigation */}
      <Navigation />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 3. Features */}
      <FeaturesSection />

      {/* 5. Testimonials
      <TestimonialsSection /> */}

      {/* 6. CTA */}
      <CTASection />

      {/* 7. Footer */}
      <Footer />
    </div>
    </>
  );
}
