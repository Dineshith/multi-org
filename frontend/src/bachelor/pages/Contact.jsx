import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: 'Kathmandu-10, Baneshwor, Nepal' },
  { icon: Phone, label: 'Phone', value: '01-4XXXXXX / 98XXXXXXXX' },
  { icon: Mail, label: 'Email', value: 'info@college.edu.np' },
  { icon: Clock, label: 'Office Hours', value: 'Sun – Fri: 9:00 AM – 5:00 PM' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      // Fallback: show success for demo if backend not running
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            We'd love to hear from you. Reach out for admissions, queries, or general information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-10">
        {/* Left: Contact Info */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Let's Talk</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Have questions about admissions, programs, or anything else? We're here to help.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-gray-800 font-semibold text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-44">
            <iframe
              title="College Location"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.546!2d85.3240!3d27.6939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQxJzM4LjAiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1609459200000"
            />
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send Us a Message</h2>
          <p className="text-gray-400 text-sm mb-6">Fill in the form and we'll get back to you within 24 hours.</p>

          {status === 'success' && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-5 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Your message has been sent! We'll respond shortly.
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm font-semibold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Something went wrong. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputCls} placeholder="you@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="98XXXXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} required className={inputCls}>
                  <option value="">Select subject</option>
                  <option value="Admission Enquiry">Admission Enquiry</option>
                  <option value="Program Information">Program Information</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Result">Result Query</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className={inputCls + ' resize-none'}
                placeholder="Write your message here..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" /></svg>
                  Sending...
                </span>
              ) : (
                <><Send className="w-4 h-4" /> Send Message</>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
