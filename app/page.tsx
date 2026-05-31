import Link from "next/link";
import { Destinations } from "../lib/destinations";
import DestinationCard from "@/components/DestinationCard";
import { ArrowRight, MapPin, Users, Star } from "lucide-react";

export default function HomePage() {
  const featured = Destinations.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-green-700 via-emerald-600 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Discover the Beauty of{" "}
            <span className="text-yellow-300">Pakistan</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-green-100 max-w-2xl mx-auto">
            From the majestic mountains of the North to the vibrant cities of
            the South — your adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/destinations"
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-green-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: <MapPin className="h-8 w-8 mx-auto" />, value: "50+", label: "Destinations" },
            { icon: <Users className="h-8 w-8 mx-auto" />, value: "10K+", label: "Happy Travelers" },
            { icon: <Star className="h-8 w-8 mx-auto" />, value: "4.8", label: "Average Rating" },
          ].map((stat, i) => (
            <div key={i}>
              {stat.icon}
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
              <div className="text-green-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Featured Destinations
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Handpicked places you absolutely must visit
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/destinations"
            className="bg-green-600 text-white font-bold px-8 py-4 rounded-full hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>View All Destinations</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Why Explore Pakistan?
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Pakistan is home to 5 of the world&apos;s 14 eight-thousanders,
              ancient civilizations, lush valleys, and some of the most
              hospitable people on Earth.
            </p>
            <p className="text-gray-600 mb-6">
              Our AI-powered guide helps you discover hidden gems, plan your
              trip, and get real-time travel advice through our intelligent
              chatbot.
            </p>
            <Link
              href="/about"
              className="text-green-600 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>Learn about this project</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["K2 - World's 2nd Highest", "Ancient Indus Civilization", "Mughal Architecture", "World's Friendliest People"].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md text-center"
              >
                <div className="text-green-600 font-semibold text-sm">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}