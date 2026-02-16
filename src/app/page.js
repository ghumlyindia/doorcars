
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedCars from "@/components/FeaturedCars";
import BookingProcess from "@/components/BookingProcess";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCars />
      <BookingProcess />
      <Testimonials />
      <FAQ />
    </>
  );
}
