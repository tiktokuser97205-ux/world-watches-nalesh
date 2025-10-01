import React, { useState, useMemo, useRef, useEffect } from "react";

export default function GlobalWatchesApp() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selected, setSelected] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [watches, setWatches] = useState([]);
  const featuredRef = useRef(null);

  // Fetch watches from external API (dummy API for demo)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        // Map API data to watch schema
        const mapped = data.map((item, idx) => ({
          _id: idx + 1,
          name: item.title,
          brand: item.category || "Unknown",
          country: "Global",
          priceUSD: Math.round(item.price * 100),
          year: 2020 + (idx % 5),
          image: item.image
        }));
        setWatches(mapped);
      } catch (err) {
        console.error("API fetch error", err);
      }
    }
    fetchData();
  }, []);

  const brands = useMemo(() => ["All", ...Array.from(new Set(watches.map(w => w.brand)))], [watches]);
  const countries = useMemo(() => ["All", ...Array.from(new Set(watches.map(w => w.country)))], [watches]);

  const filtered = useMemo(() => {
    let res = watches.filter(w => {
      const matchesQuery = (w.name + " " + w.brand).toLowerCase().includes(query.toLowerCase());
      const matchesBrand = brandFilter === "All" || w.brand === brandFilter;
      const matchesCountry = countryFilter === "All" || w.country === countryFilter;
      const matchesPrice = w.priceUSD >= priceRange[0] && w.priceUSD <= priceRange[1];
      return matchesQuery && matchesBrand && matchesCountry && matchesPrice;
    });

    if (sortBy === "price-asc") res.sort((a, b) => a.priceUSD - b.priceUSD);
    if (sortBy === "price-desc") res.sort((a, b) => b.priceUSD - a.priceUSD);
    if (sortBy === "year-desc") res.sort((a, b) => b.year - a.year);
    if (sortBy === "year-asc") res.sort((a, b) => a.year - b.year);

    return res;
  }, [watches, query, brandFilter, countryFilter, priceRange, sortBy]);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setVisibleCount(prev => prev + 9);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function resetFilters() {
    setQuery("");
    setBrandFilter("All");
    setCountryFilter("All");
    setPriceRange([0, 1000000]);
    setSortBy("relevance");
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-6">
      <section className="max-w-6xl mx-auto mb-10 text-center py-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">Discover the World of Watches</h1>
        <p className="text-lg text-white/90 mt-4">Luxury aur classic brands ek hi jaga. Explore your perfect timepiece today!</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="px-6 py-3 rounded-full bg-white text-purple-700 font-semibold hover:bg-gray-100 shadow-lg transition">Explore Now</button>
          <button onClick={() => featuredRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition">Shop Now</button>
        </div>
      </section>

      <main ref={featuredRef} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-lg border-l-4 border-blue-400">
          <h2 className="font-semibold mb-2 text-blue-600">Filters</h2>

          <label className="block text-xs text-gray-500">Search</label>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or brand" className="w-full border rounded p-2 mb-3 focus:ring-2 focus:ring-blue-400" />

          <label className="block text-xs text-gray-500">Brand</label>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="w-full border rounded p-2 mb-3 focus:ring-2 focus:ring-pink-400">
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <label className="block text-xs text-gray-500">Country</label>
          <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="w-full border rounded p-2 mb-3 focus:ring-2 focus:ring-purple-400">
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="block text-xs text-gray-500">Max Price (USD)</label>
          <input type="range" min={0} max={200000} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full mb-2 accent-pink-500" />
          <div className="text-sm text-gray-600">0 - ${priceRange[1]}</div>

          <div className="mt-4 flex gap-2">
            <button onClick={resetFilters} className="flex-1 py-2 rounded bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400">Reset</button>
            <button onClick={() => { setPriceRange([0, 5000]); }} className="py-2 px-3 rounded bg-gradient-to-r from-green-300 to-green-400 hover:from-green-400 hover:to-green-500">Under $5k</button>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b-4 border-pink-300">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">Showing</div>
              <div className="font-medium text-blue-600">{filtered.length}</div>
              <div className="text-sm text-gray-500">results</div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500">Sort</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded p-2 focus:ring-2 focus:ring-purple-400">
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="year-desc">Newest</option>
                <option value="year-asc">Oldest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, visibleCount).map(w => (
              <article key={w._id} className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer" onClick={() => setSelected(w)}>
                <img src={w.image} alt={w.name} className="w-full h-40 object-contain bg-white rounded-md mb-3 transform transition-transform duration-300 hover:scale-105" />
                <h3 className="font-semibold text-purple-700">{w.name}</h3>
                <div className="text-sm text-gray-600">{w.brand} • {w.country}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold text-pink-600">${w.priceUSD.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{w.year}</div>
                </div>
              </article>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setVisibleCount(prev => prev + 9)} className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white font-semibold shadow-md hover:scale-105 transition">Load More</button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl text-center text-gray-600">Koi watch nahin mili. Filters check karein.</div>
          )}
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-gradient-to-r from-white via-purple-50 to-pink-50 rounded-2xl p-6 max-w-2xl w-full shadow-2xl border-t-4 border-blue-400">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-700">{selected.name}</h2>
                <div className="text-sm text-gray-600">{selected.brand} • {selected.country}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-red-500">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src={selected.image} alt={selected.name} className="w-full h-64 object-contain bg-white rounded" />
              <div>
                <p className="mb-2">Price: <strong className="text-pink-600">${selected.priceUSD}</strong></p>
                <p className="mb-2">Year: {selected.year}</p>
                <p className="mb-4 text-gray-700">Description: Sample watch data loaded via API.</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">Add to collection</button>
                  <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Compare</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto text-center text-sm text-gray-600 mt-8">Built with external API • Infinite Scroll + Load More Enabled</footer>
    </div>
  );
}
