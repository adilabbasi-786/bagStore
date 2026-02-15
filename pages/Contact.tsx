import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have questions about our products or your order? We're here to help. Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email Us</p>
                    <p className="text-gray-500 text-sm mt-1">support@luxemart.com</p>
                    <p className="text-gray-500 text-sm">sales@luxemart.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Call Us</p>
                    <p className="text-gray-500 text-sm mt-1">+91 98765 43210</p>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Visit Us</p>
                    <p className="text-gray-500 text-sm mt-1">
                      123 Commerce Avenue,<br/>
                      Tech Park, Bangalore,<br/>
                      Karnataka 560001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="Order Inquiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg w-full md:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
