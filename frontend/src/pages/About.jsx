import {
  Target,
  Eye,
  Rocket,
  BookOpen,
  Lightbulb,
  Users,
  GraduationCap,
  Code2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';

const objectives = [
  { icon: Code2, text: 'Provide hands-on experience through structured project-based learning from semester 1 to final year.', color: 'text-accent', bg: 'bg-accent/10' },
  { icon: Lightbulb, text: 'Foster innovation and creativity through hackathons, coding challenges, and innovation sprints.', color: 'text-accent-magenta', bg: 'bg-accent-magenta/10' },
  { icon: Users, text: 'Build a collaborative community of students, faculty, and industry professionals.', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  { icon: GraduationCap, text: 'Bridge the gap between academic curriculum and industry requirements.', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  { icon: Rocket, text: 'Encourage participation in open-source projects and real-world software development.', color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: BookOpen, text: 'Organize workshops, guest lectures, and mentorship programs for continuous skill development.', color: 'text-white', bg: 'bg-white/10' },
];

export default function About() {
  const { user } = useContext(AuthContext);
  return (
    <div className="bg-bg min-h-screen text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden border-b border-border">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent-blue/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
        
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-2 glass-panel rounded-full mb-6">
            <span className="text-secondary text-xs md:text-sm font-semibold tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent shadow-glow-purple"></span>
              About Us
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-[5rem] text-white mb-6 uppercase leading-tight tracking-tight drop-shadow-2xl">
            About <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-blue">CID-Cell</span>
          </h1>
          <p className="text-secondary text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Learn about our purpose, vision, mission, and the structured approach we take to transform students into industry-ready professionals.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding relative overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>
        
        <div className="container-max mx-auto relative z-10 px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal className="h-full">
            <div className="relative pt-4">
              <SectionHeading
                subtitle="Introduction"
                title="What is CID-Cell?"
                alignLeft={true}
                compact={true}
              />
              <div className="space-y-6 text-secondary font-medium text-base leading-relaxed mt-4">
                <p>
                  The <strong className="text-accent font-semibold tracking-wide">Collaborative Innovation & Development Cell (CID-C)</strong> is a
                  structured platform operating under the Department of Computer Science & Engineering. It is designed
                  to bridge the gap between academic learning and industry requirements.
                </p>
                <p>
                  CID-Cell creates an innovation-driven ecosystem where students engage in hands-on learning,
                  real-world projects, open-source contributions, and collaborative initiatives — all guided by
                  faculty mentors and industry experts.
                </p>
                <div className="glass-panel p-6 border-l-2 border-accent mt-8 relative">
                  <p className="font-medium text-white italic text-sm">
                    "From foundational programming workshops in first year to industry-grade capstone projects in
                    final year, CID-Cell provides a clear, semester-wise roadmap for student growth."
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="h-full">
            <div className="glass-card p-8 lg:p-10 relative z-10 h-full border border-border">
              <h3 className="font-heading text-2xl md:text-3xl text-white mb-8 uppercase tracking-widest font-semibold flex items-center gap-3">
                 <Target size={28} className="text-accent" /> Purpose
              </h3>
              <ul className="space-y-6">
                {[
                  'Create an innovation-driven learning ecosystem',
                  'Bridge academic curriculum with industry requirements',
                  'Foster collaboration between students, faculty, and industry',
                  'Develop technical, leadership, and soft skills',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <span className="w-8 h-8 rounded-full bg-surface border border-border text-accent text-sm flex items-center justify-center shrink-0 font-bold group-hover:bg-accent/10 transition-colors shadow-glass">
                      {i + 1}
                    </span>
                    <span className="text-secondary font-medium text-base pt-1 group-hover:text-white transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-transparent relative overflow-hidden border-y border-border">
        {/* Large purely aesthetic background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden flex justify-center pointer-events-none opacity-[0.02] -z-0">
          <span className="font-heading text-[15vw] text-white whitespace-nowrap leading-none tracking-widest font-black">
            VISION
          </span>
        </div>
        
        <div className="container-max mx-auto relative z-10 px-4">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Vision */}
            <div className="glass-panel p-8 lg:p-10 hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 shadow-glass group-hover:scale-110 transition-transform duration-300">
                <Eye size={32} className="text-accent" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-3xl text-white mb-6 uppercase tracking-widest font-bold">Our Vision</h3>
              <p className="text-secondary font-medium leading-relaxed text-base border-t border-border pt-6 group-hover:border-accent/30 transition-colors">
                To establish a dynamic, innovation-driven ecosystem within the Department of Computer Science & Engineering
                that empowers students to bridge the gap between academic learning and real-world industry requirements
                — fostering creativity, collaboration, and technical excellence.
              </p>
            </div>
            {/* Mission */}
            <div className="glass-panel p-8 lg:p-10 hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-8 shadow-glass group-hover:scale-110 transition-transform duration-300">
                <Target size={32} className="text-accent-blue" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-3xl text-white mb-6 uppercase tracking-widest font-bold">Our Mission</h3>
              <ul className="space-y-4 text-secondary font-medium pt-2">
                {[
                  'Facilitate project-based, hands-on learning experiences.',
                  'Organize workshops, hackathons, and technical events regularly.',
                  'Encourage open-source contributions and community engagement.',
                  'Provide mentorship and industry exposure through expert sessions.',
                  'Build industry-ready graduates through structured skill development.',
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <ArrowRight size={18} className="text-accent-blue mt-1 shrink-0 group-hover/item:translate-x-1 transition-transform" />
                    <span className="group-hover/item:text-white transition-colors">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section-padding relative overflow-hidden">
        <div className="container-max mx-auto relative z-10 px-4">
          <SectionHeading
            subtitle="Goals"
            title="Our Objectives"
            description="CID-Cell is guided by clear objectives that drive every activity and initiative we undertake."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {objectives.map(({ icon: Icon, text, color, bg }, i) => (
              <ScrollReveal key={i} delay={i * 50} className="h-full">
              <div className="flex flex-col items-start gap-5 glass-panel p-6 h-full group hover:-translate-y-1">
                <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-glass group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <p className="text-secondary font-medium text-sm leading-relaxed">{text}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden border-t border-border">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="container-max mx-auto text-center relative z-10 px-4">
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 uppercase tracking-tight leading-tight font-black">
            Become a Part <br className="hidden md:block"/> of the Network
          </h2>
          <p className="text-secondary font-medium text-base md:text-lg max-w-xl mx-auto mb-10">
            Whether you're a first-year student or a final-year, there's a place for you in CID-Cell.
          </p>
          <Link to={user ? "/profile" : "/auth"} className="btn-neo min-w-[200px] shadow-glow-purple mx-auto">
            INITIALIZE CONNECTION <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
