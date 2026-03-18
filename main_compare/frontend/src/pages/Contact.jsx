import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to a backend API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-highlight-cream border-b-3 border-black relative overflow-hidden">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-black text-white text-sm font-bold uppercase mb-4 shadow-neo transform -rotate-2">
            Get in Touch
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-black mb-6 uppercase leading-none">
            Contact <span className="p-1 bg-highlight-orange text-black inline-block transform rotate-1 border-3 border-black shadow-small">Us</span>
          </h1>
          <p className="text-black text-xl font-medium max-w-2xl mx-auto border-l-4 border-black pl-4">
            Have a question, idea, or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <ScrollReveal className="lg:col-span-2 space-y-10">
              <div>
                <h3 className="font-heading font-black text-3xl text-black mb-6 uppercase">
                  Reach Out to CID-Cell
                </h3>
                <p className="text-black font-medium leading-relaxed mb-8 border-l-4 border-highlight-blue pl-4">
                  Whether you want to join, collaborate, or just learn more about CID-Cell, feel free to contact us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-highlight-blue/20 p-4 border-3 border-black shadow-small">
                  <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase mb-1">Address</h4>
                    <p className="text-black text-sm font-medium leading-relaxed">
                      Department of Computer Science & Engineering<br />
                      College of Engineering<br />
                      University Campus, City — 000000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-highlight-green/20 p-4 border-3 border-black shadow-small">
                  <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shrink-0">
                    <Mail size={24} className="text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase mb-1">Email</h4>
                    <a href="mailto:cidc@college.edu" className="text-black font-medium hover:text-highlight-purple transition-colors underline decoration-2 underline-offset-2">
                      cidc@college.edu
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-highlight-orange/20 p-4 border-3 border-black shadow-small">
                  <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase mb-1">Phone</h4>
                    <p className="text-black font-medium">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-bold text-black uppercase mb-4 text-xl">Follow Us</h4>
                <div className="flex gap-4">
                  {[
                    { icon: Github, href: '#', label: 'GitHub' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                    { icon: Twitter, href: '#', label: 'Twitter' },
                    { icon: Mail, href: 'mailto:cidc@college.edu', label: 'Email' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center text-black hover:bg-highlight-yellow hover:-translate-y-1 transition-all shadow-small"
                      title={label}
                    >
                      <Icon size={24} strokeWidth={2.5} />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal className="lg:col-span-3" delay={200}>
              <div className="bg-highlight-cream border-3 border-black p-8 lg:p-10 shadow-neo transform rotate-1">
                <h3 className="font-heading font-black text-3xl text-black mb-2 uppercase">Send a Message</h3>
                <p className="text-black font-medium mb-8 border-b-2 border-black pb-4">Fill in the form below and we'll get back to you soon.</p>

                {submitted && (
                  <div className="mb-8 p-4 bg-highlight-green border-3 border-black text-black font-bold shadow-small flex items-center gap-3">
                     <span className="text-xl">👍</span> Thank you! Your message has been sent successfully.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-black uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400"
                        placeholder=" YOUR NAME"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black uppercase mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400"
                        placeholder=" YOU@EMAIL.COM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400"
                      placeholder=" WHAT'S THIS ABOUT?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white border-3 border-black focus:shadow-neo outline-none transition-all font-bold placeholder:text-gray-400 resize-none"
                      placeholder=" TELL US WHAT'S ON YOUR MIND..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white font-black uppercase tracking-wider text-xl border-3 border-transparent hover:bg-white hover:text-black hover:border-black hover:shadow-neo transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={20} strokeWidth={3} />
                    Send Message
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative border-b-3 border-black">
        <div className="border-b-3 border-black px-6 py-4 bg-highlight-yellow flex items-center gap-3">
          <MapPin size={22} strokeWidth={2.5} />
          <span className="font-heading font-black text-lg uppercase">Find Us — Madhav Institute of Technology &amp; Science, Gwalior</span>
        </div>
        <div className="w-full h-[480px]">
          <iframe
            title="CID-Cell Location"
            src="https://maps.google.com/maps?q=Madhav+Institute+of+Technology+%26+Science,+Gwalior&hl=en&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
