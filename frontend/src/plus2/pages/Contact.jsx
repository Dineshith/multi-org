import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is the admission process?",
    answer: "You can apply online through our portal or visit the administration office to fill out the physical form. An entrance exam will be scheduled followed by an interview."
  },
  {
    question: "What is the fee structure?",
    answer: "Fee structures vary depending on the department and program (Science, Management, Humanities). Please contact our admission desk for a detailed breakdown."
  },
  {
    question: "Do you offer scholarships?",
    answer: "Yes, we offer merit-based and need-based scholarships. Deserving students can apply during the admission process with necessary documentation."
  }
];

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="font-sans bg-slate-50 min-h-screen">
      <section 
        className="relative w-full text-white py-24 px-6 text-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/tuimg.png')" }}
      >
        <div className="absolute inset-0 bg-blue-950/60" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 drop-shadow-lg">
          Contact Akshar Academy
        </h1>
        <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed font-medium drop-shadow-md">
          We'd love to hear from you. Reach out for admissions, inquiries, or any other assistance you might need.
        </p>
      </section>

      <section className="py-16 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
          
          <div className="flex flex-col gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
              <h2 className="text-2xl text-blue-900 font-extrabold mb-6">Contact Information</h2>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-blue-900">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">Phone Numbers</h4>
                    <p className="text-slate-500 text-sm">General: +977-71-xxxxxx</p>
                    <p className="text-slate-500 text-sm">Admission: +977-98xxxxxxxx</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-blue-900">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">Email Address</h4>
                    <p className="text-slate-500 text-sm">info@akshar.edu.np</p>
                    <p className="text-slate-500 text-sm">admission@akshar.edu.np</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-blue-900">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">Physical Address</h4>
                    <p className="text-slate-500 text-sm">Akshara Marg, Butwal<br />Rupandehi, Lumbini, Nepal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-950 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-extrabold">Operating Hours</h2>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="font-semibold text-white/90">Monday - Friday</span>
                  <span className="font-bold text-yellow-400">6:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold text-white/90">Saturday & Sunday</span>
                  <span className="font-bold text-red-400">Closed</span>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-bold mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-950 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-950 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-950 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-950 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-lg border border-slate-100">
            <h2 className="text-3xl text-blue-900 font-extrabold mb-2">Send us a message</h2>
            <p className="text-slate-500 mb-8">Fill out the form below and our team will get back to you shortly.</p>
            
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  required
                  className="w-full py-3 px-4 border border-slate-200 rounded-lg text-sm outline-none transition-all focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    placeholder="example@mail.com" 
                    required
                    className="w-full py-3 px-4 border border-slate-200 rounded-lg text-sm outline-none transition-all focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    placeholder="98xxxxxxxx" 
                    required
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    className="w-full py-3 px-4 border border-slate-200 rounded-lg text-sm outline-none transition-all focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Department / Subject <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    required
                    className="w-full py-3 px-4 pr-10 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none transition-all focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled selected>Select an option</option>
                    <option value="admission">Admissions</option>
                    <option value="general">General Inquiry</option>
                    <option value="it">IT Support</option>
                    <option value="administration">Administration</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Message <span className="text-red-500">*</span></label>
                <textarea 
                  rows="4" 
                  placeholder="How can we help you?"
                  required
                  className="w-full py-3 px-4 border border-slate-200 rounded-lg text-sm outline-none transition-all focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 resize-y min-h-[120px]"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-4 rounded-lg transition-all shadow hover:shadow-md hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="w-full h-[450px] rounded-3xl overflow-hidden mb-20 border border-slate-100 shadow-inner relative">
          <iframe
            title="Akshar Academy Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.6223425417024!2d87.2742654752152!3d26.660571676798227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6d8b1d73da1d%3A0xd4d57514869ca946!2sLunar%20IT%20Solution%20Pvt.%20Ltd.!5e0!3m2!1sen!2sno!4v1788074468924!5m2!1sen!2sno"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl text-blue-900 font-extrabold mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base">Find quick answers to common queries.</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl border ${openFaq === index ? 'border-blue-900 shadow-md' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all`}
              >
                <button 
                  className="w-full text-left py-5 px-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h4 className={`text-base font-bold ${openFaq === index ? 'text-blue-900' : 'text-slate-800'}`}>
                    {faq.question}
                  </h4>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-400'}`}>
                    {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all ease-in-out ${openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                >
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;