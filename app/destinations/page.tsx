"use client";
import { useState } from "react";
import { Destinations } from "@/lib/destinations";
import DestinationCard from "@/components/DestinationCard";
import { Search } from "lucide-react";

const regions = ["All", "North", "South", "Central", "East", "West"];

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filtered = Destinations.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.shortDesc.toLowerCase().includes(search.toLowerCase());
    const matchRegion = selectedRegion === "All" || d.region === selectedRegion;
    return matchSearch && matchRegion;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-green-700 to-emerald-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">All Destinations</h1>
        <p className="text-green-100 text-lg">
          Explore {Destinations.length} amazing places across Pakistan
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Region Filter */}
          <div className="flex gap-2 flex-wrap">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRegion === region
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-gray-500 mb-6">{filtered.length} destinations found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">No destinations found.</p>
            <p>Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}