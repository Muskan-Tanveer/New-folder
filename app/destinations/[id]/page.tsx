import { Destinations } from "@/lib/destinations";
import { notFound } from "next/navigation";
import { Clock, Navigation, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";

interface Props {
  params: { id: string };
}

export default function DestinationDetailPage({ params }: Props) {
  const destination = Destinations.find((d) => d.id === params.id);

  if (!destination) notFound();

  const related = Destinations
    .filter((d) => d.id !== destination.id && d.region === destination.region)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-linear-to-br from-green-700 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-500 text-sm px-3 py-1 rounded-full mb-4">
            {destination.region} Pakistan
          </div>
          <h1 className="text-5xl font-extrabold mb-4">{destination.title}</h1>
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-xl font-bold">{destination.rating}</span>
            <span className="text-green-200">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {destination.description}
        </p>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 text-green-700 mb-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Best Time to Visit</span>
            </div>
            <p className="text-gray-600">{destination.bestTime}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 text-blue-700 mb-2">
              <Navigation className="h-5 w-5" />
              <span className="font-semibold">How to Get There</span>
            </div>
            <p className="text-gray-600">{destination.howToReach}</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Top Highlights
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {destination.highlights.map((h, i) => (
              <div key={i} className="flex items-center space-x-2 text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              More from {destination.region} Pakistan
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <DestinationCard key={r.id} destination={r} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/destinations"
            className="text-green-600 hover:underline font-semibold"
          >
            ← Back to All Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}