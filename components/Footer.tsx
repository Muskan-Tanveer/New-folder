import Link from "next/link";
import { MapPin, Github, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-green-400" />
              <span className="font-bold text-lg">Explore Pakistan</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover the breathtaking beauty of Pakistan — from the mighty
              mountains of the north to the historic cities of the plains.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Home", "Destinations", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="hover:text-green-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="font-semibold mb-4">Project Info</h3>
            <p className="text-gray-400 text-sm mb-2">
              AI Course Project | Ma&apos;am Mahnoor
            </p>
            <p className="text-gray-400 text-sm">
              Built with Next.js, TypeScript, Tailwind CSS &amp; Claude Code
            </p>
            <div className="flex space-x-4 mt-4">
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2026 Explore Pakistan. Built for AI Course Project.
        </div>
      </div>
    </footer>
  );
}