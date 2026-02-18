"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Tajna komanda: CTRL + Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Proveravamo da li je pritisnut Ctrl (ili Cmd na Macu) i slovo Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault(); // Sprečava "Undo" akciju browsera
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Pogrešan email ili lozinka!");
    } else {
      setIsOpen(false); // Zatvori modal
      router.push("/products"); // Prebaci ga na admin stranicu
      alert("Uspešno ste ulogovani kao Admin!");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative border border-amber-300">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-red-500"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 font-serif">
          ADMIN LOGIN
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-3 border rounded bg-gray-100 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Lozinka"
            className="w-full p-3 border rounded bg-gray-100 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-black text-amber-300 font-bold py-3 rounded hover:bg-gray-800 transition"
          >
            {loading ? "Provera..." : "ULOGUJ SE"}
          </button>
        </form>
      </div>
    </div>
  );
}
