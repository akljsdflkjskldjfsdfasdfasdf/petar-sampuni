"use client";

import "./globals.css";
import { useEffect, useState, useRef } from "react";
import { supabase } from "./lib/supabaseClient";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);
export default function AboutPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Greška pri učitavanju:", error.message);
      } else {
        setProducts(data || []);
      }
    }
    fetchProducts();
  }, []);
  const filteredProducts = products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  useEffect(() => {
    if (gridRef.current) {
      let ctx = gsap.context(() => {
        const cards = gridRef.current!.children;

        // Koristimo toArray da bi svaka kartica dobila svoj ScrollTrigger
        gsap.utils.toArray(cards).forEach((card: any, index: number) => {
          gsap.fromTo(
            card,
            {
              x: 190,
              opacity: 0,
            }, // Početno stanje (automatski se primenjuje čim se stranica učita)
            {
              x: 0,
              opacity: 1,
              ease: "back.inOut",
              duration: 0.8,
              overwrite: "auto",
              delay: (index % 3) * 0.1, // Zadržavamo tvoj stagger efekat

              scrollTrigger: {
                trigger: card,
                start: "top 90%", // Animacija krece kad vrh kartice udari u 90% visine ekrana

                // REDOSLED: onEnter, onLeave, onEnterBack, onLeaveBack
                // "play" - pokreni animaciju ka x:0
                // "reverse" - vrati animaciju unazad ka x:190 kad skroluješ nazad
                toggleActions: "play none play reverse",

                // markers: true, // Otkomentariši ovo ako želiš da vidiš linije okidača na ekranu
              },
            },
          );
        });
      }, gridRef);

      return () => ctx.revert(); // Čisti sve animacije da nema memory leak-a
    }
  }, [filteredProducts]);

  return (
    <div className="container mx-auto p-6 !w-[100vw] h-100%   ">
      {/* FILTER */}
      {/* FILTERI I PRETRAGA */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-black/40 w-[80vw] md:w-60vw border-2 border-orange-200/20  mx-auto rounded-2xl p-4 lg:bg-black/40 lg:w-[50vw] lg:mx-auto lg:rounded-2xl lg:p-4">
        {/* Kategorije */}
        <div className="flex gap-2">
          {["all", "shampoo", "gel"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-4xl transition-all duration-300 hover:-translate-y-1 shadow-md font-bold ${
                category === cat
                  ? "bg-amber-500 text-black text-[18px]"
                  : "bg-gray-200 text-black"
              }`}
            >
              {cat === "all" ? "Sve" : cat === "shampoo" ? "Šamponi" : "Gelovi"}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-94">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Pretraži proizvode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-4xl bg-gray-100 border-none focus:ring-4 focus:ring-amber-500 outline-none text-black shadow-inner"
          />
        </div>
      </div>
      {/* GRID PROIZVODA */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3  gap-6 ">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="  rounded-4xl shadow-sm shadow-amber-50  bg-gray-300/10 p-4 flex flex-col items-center w-[80vw] md:w-[27vw] lg-w[25vw]  h-100 mx-auto"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-100% h-50 object-cover rounded-md drop-shadow-xl drop-shadow-orange-600"
              />
            )}
            <h2 className="text-white  mt-2 text-xl uppercase mt-5.5 font-black  text-shadow-2xs text-shadow-black ">
              {product.name}
            </h2>
            <p className=" text-center text-gray-200/85 text-md italic">
              {product.description}
            </p>

            <p className="mt-2 text-xl font-semibold underline text-orange-500 text-shadow-2xs text-shadow-black">
              {product.price} RSD
            </p>
            <span className="mt-1 text-xs uppercase text-blue-200">
              {product.category}
            </span>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center h-[40vh] text-red-500 mt-20 text-xl">
          Nema proizvoda koji odgovaraju pretrazi.
        </div>
      )}
    </div>
  );
}
