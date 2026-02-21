import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Redefining luxury and convenience for the modern era.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="space-y-12 text-lg text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="mb-4">
              Founded in 2024, Bagxco began with a simple mission: to make high-quality, premium products accessible to everyone, everywhere. We believe that style shouldn't come at the cost of substance, which is why we meticulously curate our collection to ensure every item meets our rigorous standards.
            </p>
            <p>
              From cutting-edge electronics to timeless fashion pieces, our inventory is a reflection of the diverse needs and tastes of our global community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 my-12">
             <img 
               src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" 
               className="rounded-xl shadow-lg w-full h-64 object-cover" 
               alt="Team meeting" 
             />
             <img 
               src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop" 
               className="rounded-xl shadow-lg w-full h-64 object-cover" 
               alt="Store interior" 
             />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <ul className="grid md:grid-cols-2 gap-6">
              <li className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-xl mb-2 text-black">Quality First</h3>
                <p className="text-sm">We never compromise on the quality of our products. If it's not the best, we don't sell it.</p>
              </li>
              <li className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-xl mb-2 text-black">Customer Obsession</h3>
                <p className="text-sm">Your satisfaction is our top priority. Our support team is here for you 24/7.</p>
              </li>
              <li className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-xl mb-2 text-black">Sustainability</h3>
                <p className="text-sm">We are committed to reducing our footprint by using eco-friendly packaging.</p>
              </li>
              <li className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-xl mb-2 text-black">Innovation</h3>
                <p className="text-sm">We are constantly looking for new ways to improve your shopping experience.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
