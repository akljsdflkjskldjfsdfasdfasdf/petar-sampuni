"use client";

import "./globals.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Cinzel_Decorative } from "next/font/google";
import { SplitText } from "gsap/SplitText";
import { FaInstagram } from "react-icons/fa";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AdminModal from "./components/AdminModal";
// Konfiguracija fonta
const cinzel = Cinzel_Decorative({
  weight: ["400", "700", "900"], // Static font zahteva definisane težine
  subsets: ["latin"],
  display: "swap",
});
gsap.registerPlugin(ScrollToPlugin);
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Kreiramo referencu za header element
  // Koristimo HTMLElement jer su to opšti div-ovi ili sekcije
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToProducts = () => {
    if (!mainRef.current) return; // zaštita od nullx
    const isMediumUp = window.matchMedia("(min-width: 768px)").matches;
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: mainRef.current, offsetY: isMediumUp ? 350 : 80 }, // offsetY ostavlja malo mesta iznad naslova
      ease: "power2.out",
    });
  };

  const scrollToAbout = () => {
    if (!aboutRef.current) return; // zaštita od null
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: aboutRef.current, offsetY: 50 },
      ease: "power2.out",
    });
  };
  if (typeof window !== "undefined") {
    window.history.scrollRestoration = "manual";
  }

  // 2. Pokrećemo animaciju kada se komponenta montira
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50); // 10ms je dovoljno da Next.js završi svoje

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Header animacija
      tl.from(headerRef.current, {
        y: -120,
        opacity: 0,
        duration: 1.2,
        ease: "back.out",
      });

      // 2. Hero section
      tl.from(
        heroRef.current,
        {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.5",
      );

      // 3. Tekst sa SplitText
      const split = new SplitText(textRef.current, { type: "words" });
      tl.from(
        split.words,
        {
          opacity: 0,
          y: 30,
          stagger: 0.1,

          ease: "back.InOut",
        },
        "-=0.3",
      );

      // 4. Button ulaz
      tl.from(
        buttonRef.current,
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.8,
          ease: "back.out",
        },
        "-=0.2",
      );

      // 5. Dugme lebdi stalno
      gsap.to(buttonRef.current, {
        y: -15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <html lang="en">
      <body className=" relative  !bg-gradient-to-b from-white/25  to-gray-100/10 to-101% md:to-60% text-gray-900 flex flex-col min-h-screen ">
        {/* HEADER - Dodali smo ref={headerRef} */}
        <header
          ref={headerRef}
          className=" relative w-[80vw] md:w-[60vw] m-auto rounded-b-4xl drop-shadow-lg drop-shadow-black font-serif "
        >
          {/* Pozadinski overlay */}
          <div className="absolute inset-0 bg-yellow-400/75  opacity-70  drop-shadow-lg  m-auto rounded-b-4xl !z-0"></div>

          {/* Sadržaj iznad overlay-a */}
          <div className="relative !z-0 container mx-auto flex flex-col  items-center pb-1 text-black text-shadow-2xs text-shadow-black text-[17px]">
            <h1
              className={`text-[6.5vw] ${cinzel.className} md:text-4xl font-bold tracking-wide pb-4 pt-1 
                 text-white
                 bg-clip-text  drop-shadow-[1px_5px_4px_black] !cinzel.className  `}
            >
              DURU SHOP
            </h1>
            <nav className="flex items-center text-white text-1xl md:text-2xl font-medium">
              {/* PRVI LINK SA LINIJOM */}

              {/* DRUGI LINK SA LINIJOM */}
              <div className="flex items-center border-r-2 border-white/40 !px-[4vw] ">
                <a
                  onClick={scrollToProducts}
                  className="border-b-2 border-transparent transition duration-500 hover:border-white"
                >
                  Products
                </a>
              </div>

              {/* TREĆI LINK (BEZ LINIJE) */}
              <div className="flex items-center px-[4vw] ">
                <a
                  onClick={scrollToAbout}
                  className="border-b-2 border-transparent transition duration-500 hover:border-white"
                >
                  About
                </a>
              </div>
            </nav>
          </div>
        </header>
        <AdminModal />
        <div className="h-[95vh]">
          <div
            ref={heroRef}
            className="relative h-[85vh] w-[80vw] m-auto mt-3.5 rounded-4xl bg-[url(/hair.jpg)] bg-no-repeat bg-center bg-cover bg-top"
          >
            {/* Overlay sloj */}
            <div className="absolute inset-0 bg-black/35 rounded-4xl"></div>

            {/* Sadržaj iznad overlay-a */}
            <button
              ref={buttonRef}
              onClick={scrollToProducts}
              className="hover:bg-amber-400/70  absolute w-67  md:w-[60vw] lg:w-[25vw]  h-[7vh] rounded-[100vw] bg-amber-400/70  bottom-10 md:top-[65vh]  left-1/2 text-shadow-lg text-shadow-white -translate-x-1/2 text-black text-[5vh] font-serif uppercase z-10"
            >
              PROIZVODI
            </button>
            <h1
              ref={textRef}
              className="rounded-3xl drop-shadow-[1px_5px_4px_black] absolute bottom-0 top-1/2 left-1/2 -translate-x-1/2 italic h-20 text-2xl  rounded-2xl  font-extrabold uppercase w-[70vw] text-center drop-shadow-[1px_1px_40px_black] md:text-[3vw] text-white z-10"
            >
              Oseti kvalitet i snagu na svojoj kosi
            </h1>
          </div>
        </div>
        {/* MAIN CONTENT */}
        <main
          className="flex-1 container mx-auto  scroll-mt-[50vw]"
          ref={mainRef}
        >
          {children}
        </main>
        {/* ABOUT SECTION */}
        <section
          ref={aboutRef}
          id="about"
          className="w-[80vw] relative container mx-auto p-10 my-10 rounded-3xl bg-white/10 shadow-lg"
        >
          <h2 className="text-3xl md:text-4xl font-black text-center mb-6 border-b-2 w-50 mx-auto text-amber-300">
            O NAMA
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed italic mb-6 text-center drop-shadow-2xl drop-shadow-black">
            Mi smo DURU SHOP – posvećeni kvalitetu i lepoti kose. Naša misija je
            da pružimo proizvode koji donose snagu, sjaj i zdravlje vašoj kosi.
          </p>

          {/* Kontakt informacije */}
          <div className="flex flex-col md:flex-row justify-around items-center gap-6 mb-8 drop-shadow-2xl drop-shadow-black">
            <div className="text-center mx-auto ">
              <h3 className="text-xl font-semibold mb-2 text-amber-300">
                Kontakt
              </h3>
              <p>Telefon: +381 64 123 4567</p>
              <p>Email: info@durushop.rs</p>
            </div>
            <div className="hidden md:block h-16 border-l-2 border-amber-300/30"></div>

            {/* Opciona horizontalna linija samo za mobilni */}
            <div className="block md:hidden w-20 border-t-2 border-amber-300/30"></div>
            <div className="text-center mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-amber-300">
                Adresa
              </h3>
              <p>Bulevar Oslobođenja 100</p>
              <p>Novi Sad, Srbija</p>
            </div>
          </div>

          {/* Mapa */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.123456789!2d19.843239!3d45.260509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b105da5e15f7b%3A0x48e68c77b83bd05b!2sTrg%20Marije%20Trandafil%2024a%2C%20Novi%20Sad%2021000%2C%20Serbia!5e0!3m2!1sen!2srs!4v1700000000000!5m2!1sen!2srs"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
        {/* FOOTER */}

        {/* FOOTER */}
        <footer className="bg-black text-gray-300 text-sm">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} DURU SHOP. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-1 md:space-x-6 text-center">
              {/* Telefon */}
              <span className="hover:text-white transition">
                📞 +381 64 123 4567
              </span>

              {/* Email */}
              <a
                href="mailto:info@durushop.rs"
                className="hover:text-white transition"
              >
                info@durushop.rs
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/durushop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <FaInstagram size={18} />
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
