"use client";

import "./globals.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Cinzel_Decorative } from "next/font/google";
import { SplitText } from "gsap/SplitText";
import { FaInstagram } from "react-icons/fa";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AdminModal from "./components/AdminModal";

const cinzel = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

gsap.registerPlugin(ScrollToPlugin);

// POMOĆNA KOMPONENTA ZA TICKER (Definisana van RootLayout-a)
const Ticker = ({ innerRef }: { innerRef: React.RefObject<HTMLDivElement | null> }) => (
  <div className="overflow-hidden bg-amber-400 py-2 border-y border-black/20 whitespace-nowrap flex w-full">
    <div ref={innerRef} className="flex gap-10 items-center">
      {/* Prvi set teksta */}
      {[...Array(10)].map((_, i) => (
        <h3 key={`txt1-${i}`} className="text-black font-black uppercase italic text-sm md:text-xl inline-block">
          Besplatna dostava na svaku kupovinu! •
        </h3>
      ))}
      {/* Dupli set teksta za seamless loop */}
      {[...Array(10)].map((_, i) => (
        <h3 key={`txt2-${i}`} className="text-black font-black uppercase italic text-sm md:text-xl inline-block">
          Besplatna dostava na svaku kupovinu! •
        </h3>
      ))}
    </div>
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  
  // Reference za ticker animacije
  const tickerTopRef = useRef<HTMLDivElement>(null);
  const tickerBottomRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    if (!mainRef.current) return;
    const isMediumUp = window.matchMedia("(min-width: 768px)").matches;
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: mainRef.current, offsetY: isMediumUp ? 350 : 80 },
      ease: "power2.out",
    });
  };

  const scrollToAbout = () => {
    if (!aboutRef.current) return;
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: aboutRef.current, offsetY: 50 },
      ease: "power2.out",
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Ulazne animacije
      tl.from(headerRef.current, {
        y: -120,
        opacity: 0,
        duration: 1.2,
        ease: "back.out",
      });

      tl.from(heroRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      }, "-=0.5");

      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: "back.InOut",
      }, "-=0.3");

      tl.from(buttonRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out",
      }, "-=0.2");

      // Lebdenje dugmeta
      gsap.to(buttonRef.current, {
        y: -15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // TICKER ANIMACIJA (Ulevo)
      [tickerTopRef, tickerBottomRef].forEach((ref) => {
        if (ref.current) {
          gsap.to(ref.current, {
            xPercent: -50,
            repeat: -1,
            duration: 15, // Povećaj sekunde ako hoćeš da ide sporije
            ease: "linear",
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="relative bg-black text-gray-900 flex flex-col min-h-screen">
          <header
            ref={headerRef}
            className="relative w-[80vw] md:w-[60vw] m-auto rounded-b-4xl drop-shadow-lg drop-shadow-black font-serif z-50"
          >
            <div className="absolute inset-0 bg-yellow-400/75 opacity-70 drop-shadow-lg m-auto rounded-b-4xl !z-0"></div>
            <div className="relative !z-10 container mx-auto flex flex-col items-center pb-1 text-black text-[17px]">
              <h1 className={`text-[6.5vw] ${cinzel.className} md:text-4xl font-bold tracking-wide pb-4 pt-1 text-white drop-shadow-[1px_5px_4px_black]`}>
                DURU SHOP
              </h1>
              <nav className="flex items-center text-white text-1xl md:text-2xl font-medium cursor-pointer">
                <div className="flex items-center border-r-2 border-white/40 !px-[4vw]">
                  <a onClick={scrollToProducts} className="hover:border-b-2 border-white transition-all">Products</a>
                </div>
                <div className="flex items-center px-[4vw]">
                  <a onClick={scrollToAbout} className="hover:border-b-2 border-white transition-all">About</a>
                </div>
              </nav>
            </div>
          </header>

          <AdminModal />

          {/* HERO SECTION */}
          <div className="h-[95vh] bg-black">
            <div
              ref={heroRef}
              className="relative h-[85vh] w-[90vw] m-auto mt-3.5 rounded-4xl bg-[url(/hair.jpg)] bg-no-repeat bg-center bg-cover bg-top"
            >
              <div className="absolute inset-0 bg-black/35 rounded-4xl"></div>
              <button
                ref={buttonRef}
                onClick={scrollToProducts}
                className="absolute w-67 md:w-[60vw] lg:w-[25vw] h-[7vh] rounded-[100vw] bg-amber-400/70 bottom-10 md:top-[65vh] left-1/2 -translate-x-1/2 text-black text-[5vh] font-serif uppercase z-10 hover:bg-amber-400 transition-colors"
              >
                PROIZVODI
              </button>
              <h1
                ref={textRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 italic text-2xl font-extrabold uppercase w-[70vw] text-center md:text-[3vw] text-white z-10 drop-shadow-[1px_5px_4px_black]"
              >
                Oseti kvalitet i snagu na svojoj kosi
              </h1>
            </div>
          </div>

          {/* MAIN CONTENT SA TICKERIMA */}
          <main
            ref={mainRef}
            className="flex-1 mx-auto !w-[100vw] scroll-mt-[50vw] bg-gradient-to-b from-white/25 to-gray-100/10 rounded-4xl overflow-hidden"
          >
            <Ticker innerRef={tickerTopRef} />
            
            <div className="py-10">
              {children}
            </div>

            <Ticker innerRef={tickerBottomRef} />
          </main>

          {/* ABOUT SECTION */}
          <section
            ref={aboutRef}
            className="w-[80vw] relative container mx-auto p-10 my-10 rounded-3xl bg-white/10 shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-black text-center mb-6 border-b-2 w-50 mx-auto text-amber-300">O NAMA</h2>
            <p className="text-lg md:text-4xl font-semibold text-gray-200 leading-relaxed italic mb-6 text-center">
              Mi smo DURU SHOP – posvećeni kvalitetu i lepoti kose. Naša misija je da pružimo proizvode koji donose snagu, sjaj i zdravlje vašoj kosi.
            </p>
            <div className="flex flex-col md:flex-row justify-around items-center gap-6 mb-8">
              <div className="text-center mx-auto text-white">
                <h3 className="text-xl font-semibold mb-2 text-amber-300">Kontakt</h3>
                <p>Telefon: +381 64 123 4567</p>
                <p>Email: info@durushop.rs</p>
              </div>
              <div className="text-center mx-auto text-white">
                <h3 className="text-xl font-semibold mb-2 text-amber-300">Adresa</h3>
                <p>Bulevar Oslobođenja 100</p>
                <p>Novi Sad, Srbija</p>
              </div>
            </div>
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2808.61!2d19.83!3d45.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDE1JzAwLjAiTiAxOcKwNDknNDguMCJF!5e0!3m2!1sen!2srs!4v123456789"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </section>

          <footer className="bg-white/70 text-black font-bold p-4">
            <div className="container mx-auto flex justify-between items-center">
              <p>© {new Date().getFullYear()} DURU SHOP.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <span>📞 +381 64 123 4567</span>
                <a href="https://instagram.com/durushop" target="_blank" className="flex items-center gap-1"><FaInstagram /> Instagram</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
