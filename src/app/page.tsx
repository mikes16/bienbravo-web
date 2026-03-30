import { Preloader } from "@/components/Preloader";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Barbers } from "@/components/sections/Barbers";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <Preloader />
      <GrainOverlay />
      <CustomCursor />
      <WhatsAppFloat />
      <ScrollDepthTracker />
      <JsonLd />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Barbers />
      </main>
      <Footer />
    </>
  );
}
