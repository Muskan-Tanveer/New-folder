"use client";
import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send to API
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-r from-green-700 to-emerald-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-green-100 text-lg">Have questions? We&apos;d love to hear from you.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-600" />
              <span>muskanabbasi6266@gmail.com</span>

            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>Pakistan</span>
            </div>
          </div>
          <div className="mt-8 bg-green-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-2">Ask Our AI Chatbot!</h3>
            <p className="text-gray-600 text-sm">
              Use the chat widget in the bottom right corner to ask questions
              about Pakistani destinations and travel tips.
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Message Sent!</h3>
              <p className="text-gray-500 mt-2">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}