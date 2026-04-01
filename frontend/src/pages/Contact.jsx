import { useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, Instagram, Globe, Clock, ExternalLink, Activity } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-bg min-h-screen text-white pt-32 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10"></div>
      
      {/* Hero */}
      <section className="pb-16 relative overflow-hidden border-b border-border">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex px-4 py-1.5 glass-panel rounded-full border border-accent/20 mb-6 items-center gap-2 shadow-glow-purple">
             <Activity size={14} className="text-accent" />
             <span className="font-semibold uppercase tracking-[0.2em] text-xs text-secondary">Network Communications</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[6rem] font-black text-white mb-6 uppercase leading-none drop-shadow-2xl">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400 filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Touch</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto glass-panel p-4 border-l-2 border-accent leading-relaxed inline-block">
            Contact the Institute for academic, administrative, or research inquiries.
          </p>
        </div>
      </section>

      {/* Main Info Section */}
      <section className="section-padding relative z-10">
        <div className="container-max mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info Sidebar */}
            <ScrollReveal className="lg:col-span-2 space-y-6">
              
              <div className="glass-panel p-8 border border-white/10 shadow-glass">
                <h3 className="font-heading font-black text-2xl text-white mb-4 uppercase tracking-widest">
                  Main Campus
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-6 border-l-2 border-accent-blue pl-4 text-sm">
                  Our flagship campus is conveniently located in the heart of Gwalior, offering state-of-the-art facilities in a modern academic environment.
                </p>

                {/* Primary Contacts */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-surface p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-accent-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-300 uppercase tracking-widest text-[10px] mb-1">Address</h4>
                      <p className="text-white text-xs font-medium leading-relaxed">
                        CSE Dept, MITS Gwalior<br/>
                        Gola ka Mandir, Gwalior - 474005<br />
                        Madhya Pradesh, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-surface p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-300 uppercase tracking-widest text-[10px] mb-1">Email</h4>
                      <a href="mailto:director@mitsgwalior.in" className="text-white font-medium text-xs hover:text-accent transition-colors underline decoration-1 underline-offset-4">
                        director@mitsgwalior.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Contacts */}
              <div className="glass-panel p-8 border border-white/10 shadow-glass relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-glow-magenta rounded-full pointer-events-none"></div>
                
                <h4 className="font-heading font-black text-lg text-white mb-6 uppercase tracking-widest border-b border-border pb-3">Directory</h4>
                <div className="space-y-5">
                  <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors cursor-default">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Admissions</p>
                    <p className="text-xs font-bold text-white bg-surface px-2 py-1 rounded border border-border group-hover/item:border-accent-magenta/50 transition-colors">+91 9343250503</p>
                  </div>
                  <div className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors cursor-default">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Registrar</p>
                    <p className="text-xs font-bold text-white bg-surface px-2 py-1 rounded border border-border group-hover/item:border-accent-magenta/50 transition-colors">+91 6267473144</p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gradient-to-br from-surface to-bg p-8 border border-white/10 rounded-2xl shadow-glass flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-full bg-glow-blue rounded-full -translate-y-1/2"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                    <Clock size={16} />
                  </div>
                  <h4 className="font-heading font-black text-lg uppercase tracking-widest">Office Hours</h4>
                </div>
                <ul className="text-xs space-y-3 font-bold uppercase tracking-wider relative z-10">
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-slate-400">Mon - Fri</span>
                    <span className="text-white bg-black px-2 py-1 border border-border rounded">8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-slate-400">Saturday</span>
                    <span className="text-white bg-black px-2 py-1 border border-border rounded">9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center pt-1 text-slate-500">
                    <span>Sunday</span>
                    <span className="line-through">Closed</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Contact Form & Social */}
            <ScrollReveal className="lg:col-span-3 space-y-6" delay={200}>
              <div className="glass-panel border-l-2 border-l-accent border-r border-r-white/10 border-y border-y-white/10 p-8 lg:p-12 shadow-glow-purple relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-glow-accent rounded-full pointer-events-none"></div>

                <h3 className="font-heading font-black text-3xl text-white mb-2 uppercase tracking-widest">Send a Message</h3>
                <p className="text-slate-400 text-sm font-medium mb-10">Fill in the secure form below for any specific requests or feedback.</p>

                {submitted ? (
                  <div className="mb-8 p-5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold backdrop-blur-md flex items-center gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <Send size={18} />
                    </div>
                    Encrypted message transmitted successfully over the network.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium"
                          placeholder="ENTER NAME"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Node *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium"
                          placeholder="USER@NETWORK.COM"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Transmission Data *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium resize-none"
                        placeholder="ENTER MESSAGE PROTOCOL..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:bg-accent/90 transition-all flex items-center justify-center gap-3"
                    >
                      <Send size={16} />
                      Transmit Data
                    </button>
                  </form>
                )}
              </div>

              {/* Grid links row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 border border-white/10 hover:border-accent-cyan/40 transition-colors group">
                  <div className="flex items-center gap-3 mb-5">
                    <Globe size={18} className="text-accent-cyan group-hover:animate-spin" />
                    <h4 className="font-heading font-black text-sm uppercase tracking-widest">Network Links</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { name: 'Root Hub', url: 'https://web.mitsgwalior.in' },
                      { name: 'IMS Link', url: 'https://ims.mitsgwalior.in' },
                      { name: 'IUMS Server', url: 'https://iums.mitsgwalior.in' },
                    ].map((link) => (
                      <li key={link.name}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors border border-transparent hover:border-white/10">
                          <span className="text-[11px] font-bold uppercase text-slate-300">{link.name}</span>
                          <ExternalLink size={14} className="text-slate-500" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 border border-white/10 hover:border-accent-magenta/40 transition-colors">
                  <div className="flex items-center gap-3 mb-5">
                    <Instagram size={18} className="text-accent-magenta" />
                    <h4 className="font-heading font-black text-sm uppercase tracking-widest">Social Nodes</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Github, href: 'https://github.com/CID-CELL', label: 'GitHub', color: 'hover:text-white hover:border-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]' },
                      { icon: Linkedin, href: 'https://www.linkedin.com/company/cidcellmits/', label: 'LinkedIn', color: 'hover:text-blue-400 hover:border-blue-400 hover:bg-blue-400/10 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]' },
                      { icon: Instagram, href: 'https://www.instagram.com/cidc_mitsgwalior', label: 'Instagram', color: 'hover:text-pink-400 hover:border-pink-400 hover:bg-pink-400/10 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)]' },
                      { icon: Mail, href: 'mailto:director@mitsgwalior.in', label: 'Email', color: 'hover:text-orange-400 hover:border-orange-400 hover:bg-orange-400/10 hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]' },
                    ].map(({ icon: Icon, href, label, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-11 h-11 bg-surface border border-white/10 rounded-full flex items-center justify-center text-slate-400 transition-all ${color}`}
                        title={label}
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative h-[480px] w-full mt-10 filter grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        <div className="absolute top-0 left-0 w-full h-full bg-bg/50 pointer-events-none z-10"></div>
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 glass-panel border border-white/10 p-4 flex items-center gap-3 shadow-glass backdrop-blur-xl">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent">
            <MapPin size={16} />
          </div>
          <span className="font-heading font-black text-xs md:text-sm uppercase tracking-widest text-white">MITS Gwalior</span>
        </div>
        <iframe
          title="MITS Gwalior Location"
          src="https://maps.google.com/maps?q=Madhav+Institute+of+Technology+%26+Science,+Gwalior&hl=en&z=16&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="relative z-0"
        />
      </section>
    </div>
  );
}
