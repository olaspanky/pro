import React from 'react';
import { Sun, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const ProSolarLanding = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
        <div className="text-2xl font-bold text-blue-700 tracking-tight">
          PROSOLAR<span className="text-amber-500">ENERGY</span>
        </div>
        <div className="hidden md:flex space-x-8 font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition">Solutions</a>
          <a href="#" className="hover:text-blue-600 transition">Savings Calculator</a>
          <a href="#" className="hover:text-blue-600 transition">Projects</a>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          Get Free Quote
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-20 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold mb-6">
            <Zap size={16} />
            <span>NO MORE BLACKOUTS</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
            Energy Independence <br /> 
            <span className="text-blue-600">For Your Home.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Stop relying on an unstable grid and expensive diesel. ProSolar provides Tier-1 Jinko Solar systems designed for the Nigerian climate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition group">
              <span>Start Saving Now</span>
              <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
            </button>
            <div className="flex items-center space-x-3 px-4 py-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500 underline">Joined by 500+ Abuja homes</p>
            </div>
          </div>
        </div>

        {/* Visual Element (Mockup of a sleek inverter/panel setup) */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-amber-100 rounded-3xl blur-2xl opacity-50" />
          <div className="relative bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-sm mb-1">Monthly Fuel Cost</p>
                <p className="text-2xl font-bold text-red-500">₦120,000</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-blue-600 text-sm mb-1">With ProSolar</p>
                <p className="text-2xl font-bold text-blue-700">₦0.00</p>
              </div>
              <div className="col-span-2 bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="opacity-70 text-sm">System Status</p>
                  <p className="font-semibold text-emerald-400">100% Operational</p>
                </div>
                <Zap className="text-emerald-400" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white py-24 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why ProSolar Energy?</h2>
            <p className="text-slate-500">Premium hardware meets expert Nigerian engineering.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sun className="text-amber-500" />}
              title="Tier-1 Jinko Panels"
              desc="We exclusively use high-efficiency Jinko panels with a 25-year performance warranty."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-blue-600" />}
              title="Certified Installation"
              desc="Our engineers are COREN certified, ensuring your system is safe and fire-proof."
            />
            <FeatureCard 
              icon={<Zap className="text-emerald-500" />}
              title="Hybrid Inverters"
              desc="Seamlessly switch between solar, battery, and grid without a flicker in your TV."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition duration-300">
    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default ProSolarLanding;
