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
        gsap.set(cards, { opacity: 0, x: 190 });

        gsap.utils.toArray(cards).forEach((card: any, index: number) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 90%",

            // onEnter: kad ideš na dole
            onEnter: () => {
              gsap.fromTo(
                card,
                { x: 190, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,

                  ease: "back.inOut",
                  overwrite: "auto",
                  delay: (index % 3) * 0.1,
                },
              );
            },
            // onEnterBack: kad se vraćaš odozdo na gore
            onLeaveBack: () => gsap.set(card, { opacity: 0, duration: 2 }),
            // Opciono: šta se dešava kad karta izađe iz ekrana
          });
        });
      }, gridRef);

      return () => ctx.revert();
    }
  }, [filteredProducts]); // Bolje je da pratiš filteredProducts

  return (
    <div className="container mx-auto p-6 h-100% ">
      {/* FILTER */}
      {/* FILTERI I PRETRAGA */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-black/40 w-[80vw] mx-auto rounded-2xl p-4 lg:bg-black/40 lg:w-[50vw] lg:mx-auto lg:rounded-2xl lg:p-4">
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
            className="border-b-2 rounded-lg drop-shadow-2xl bg-black/50 p-4 flex flex-col items-center w-100% h-90 mx-auto"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-100% h-50 object-cover rounded-md"
              />
            )}
            <h2 className="text-white mt-2 text-xl font-bold font-black">
              {product.name}
            </h2>
            <p className=" text-center text-gray-200 text-sm">
              {product.description}
            </p>
            <p className="mt-2 text-lg font-semibold text-amber-600">
              {product.price} RSD
            </p>
            <span className="mt-1 text-xs uppercase text-gray-400">
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
