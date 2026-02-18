"use client";

import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [authorized, setAuthorized] = useState(false); // Da li je admin?
  const router = useRouter();

  // State-ovi za formu
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("shampoo");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  // 1. Provera sesije (DA LI JE LOGOVAN?)
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/"); // Ako nije ulogovan, vrati ga na početnu
      } else {
        setAuthorized(true);
        loadProducts(); // Učitaj proizvode tek kad znamo da je admin
      }
    }
    checkSession();
  }, [router]);

  // 2. Logout funkcija
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // 3. Učitavanje proizvoda
  async function loadProducts() {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  }

  // 4. Dodavanje proizvoda
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageUrl = null;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Greška pri uploadu slike: " + uploadError.message);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price: Number(price),
          description,
          image_url: imageUrl,
          category,
        },
      ])
      .select();

    if (error) {
      alert("Greška: " + error.message);
    } else if (data) {
      setProducts((prev) => [...prev, ...data]);
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      alert("Proizvod dodat!");
    }
  }

  // 5. Brisanje proizvoda
  async function handleDelete(id: number) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("Greška pri brisanju: " + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Proizvod obrisan!");
    }
  }

  // Ako nije autorizovan, ne prikazuj ništa dok ga ne redirectuje
  if (!authorized)
    return <div className="p-10 text-white">Provera pristupa...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-amber-300">
          ADMIN PANEL - Dodaj Proizvode
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
        >
          Odjavi se
        </button>
      </div>

      {/* Forma za dodavanje proizvoda */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 max-w-2xl mx-auto bg-black/50 p-6 rounded-xl border border-gray-700"
      >
        <input
          type="text"
          placeholder="Naziv proizvoda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded focus:border-amber-300 outline-none"
          required
        />

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Cena (RSD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-600 p-3 w-1/2 bg-gray-800 text-white rounded focus:border-amber-300 outline-none"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-600 p-3 w-1/2 bg-gray-800 text-white rounded focus:border-amber-300 outline-none"
          >
            <option value="shampoo">Šampon</option>
            <option value="gel">Gel</option>
            <option value="conditioner">Regenerator</option>
          </select>
        </div>

        <textarea
          placeholder="Opis proizvoda"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded h-24 focus:border-amber-300 outline-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded"
        />

        <button
          type="submit"
          className="w-full bg-amber-400 text-black font-bold px-4 py-3 rounded hover:bg-amber-300 transition text-lg"
        >
          + DODAJ U BAZU
        </button>
      </form>

      {/* Lista proizvoda */}
      <h2 className="text-2xl font-bold mb-4 border-l-4 border-amber-300 pl-3">
        Trenutni proizvodi u bazi
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <li
            key={p.id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg relative group"
          >
            {/* Dugme za brisanje */}
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute top-9 right-2 text-gray-400 hover:text-red-500 font-bold text-5xl"
              title="Obriši proizvod"
            >
              &times;
            </button>

            <div className="flex justify-between items-start">
              <div>
                <strong className="text-xl text-amber-200">{p.name}</strong>
                <p className="text-white font-bold">{p.price} RSD</p>
              </div>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded uppercase text-gray-300">
                {p.category}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
              {p.description}
            </p>
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                className="mt-3 w-full h-48 object-cover rounded border border-gray-600"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
