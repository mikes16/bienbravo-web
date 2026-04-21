import { Preloader } from "@/components/Preloader";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ScrollDepthTracker } from "@/components/ScrollDepthTracker";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Sucursales } from "@/components/sections/Sucursales";
import { Services } from "@/components/sections/Services";
import { JaviCruz } from "@/components/sections/JaviCruz";
import { Barbers } from "@/components/sections/Barbers";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/JsonLd";
import { LocationProvider } from "@/context/LocationContext";

export default function Home() {
  return (
    <>
      <Preloader />
      <GrainOverlay />
      <CustomCursor />
      <ScrollDepthTracker />
      <JsonLd />

      <LocationProvider>
        <WhatsAppFloat />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Sucursales />
          <Services />
          <JaviCruz />
          <Barbers />
        </main>
        <Footer />
      </LocationProvider>
    </>
  );
}
