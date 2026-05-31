import { MapPin, Code, Brain, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-r from-green-700 to-emerald-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About This Project</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">
          An AI-powered travel guide built for the Artificial Intelligence
          course project
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Project Description */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Project Overview
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Explore Pakistan is a full-stack web application developed as part
            of an Artificial Intelligence course project. It uses cutting-edge
            AI tools including Claude Code for development assistance and
            implements a RAG (Retrieval-Augmented Generation) chatbot for
            intelligent travel recommendations.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            The website showcases Pakistan&apos;s most stunning destinations,
            from the towering peaks of Gilgit-Baltistan to the historic streets
            of Lahore, making travel information accessible and engaging for
            everyone.
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Globe className="h-6 w-6 text-blue-500" />,
                title: "Frontend",
                items: ["Next.js 14 (App Router)", "React 18", "TypeScript", "Tailwind CSS"],
              },
              {
                icon: <Code className="h-6 w-6 text-green-500" />,
                title: "Backend (Chatbot)",
                items: ["FastAPI (Python)", "OpenAI API", "Qdrant Vector DB", "Neon Postgres"],
              },
              {
                icon: <Brain className="h-6 w-6 text-purple-500" />,
                title: "AI Tools",
                items: ["Claude Code", "Spec-Kit Plus", "RAG Architecture", "OpenAI GPT"],
              },
              {
                icon: <MapPin className="h-6 w-6 text-red-500" />,
                title: "Deployment",
                items: ["Vercel (Frontend)", "Railway (Backend)", "GitHub Actions", "Git/GitHub"],
              },
            ].map((section, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  {section.icon}
                  <h3 className="font-bold text-gray-800">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-gray-600 text-sm flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Course Info */}
        <section className="bg-green-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Course Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div><strong>Course:</strong> Artificial Intelligence</div>
            <div><strong>Instructor:</strong> Ma&apos;am Mahnoor</div>
            <div><strong>Submission:</strong> 31 May 2026</div>
            <div><strong>Team Members:</strong> Muskan Abbasi & Khizar Khattak</div>
          </div>
        </section>
      </div>
    </div>
  );
}