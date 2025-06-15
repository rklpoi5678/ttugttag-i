
{/* section components */}
import Script from 'next/script';
import HeroSection from "../../src/components/landing/HeroSection";
import FeaturesSection from "../../src/components/landing/FeaturesSection";
import Navigation from "../../src/components/landing/Navigation";
// import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../../src/components/landing/CTASection';
import Footer from '../../src/components/landing/Footer';

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
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `,
        }}
      />
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
