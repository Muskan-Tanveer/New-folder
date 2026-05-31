import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import { Destination } from "@/lib/destinations";

interface Props {
  destination: Destination;
}

export default function DestinationCard({ destination }: Props) {
  return (
    <Link href={`/destinations/${destination.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {/* Image placeholder - replace with real images */}
        <div className="h-48 bg-linear-to-br from-green-400 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-white opacity-50" />
          </div>
          <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold">{destination.rating}</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            {destination.region}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
            {destination.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {destination.shortDesc}
          </p>
          <div className="flex items-center mt-3 text-gray-400 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>Best time: {destination.bestTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}