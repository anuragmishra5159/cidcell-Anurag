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
  { icon: Code2, text: 'Provide hands-on experience through structured project-based learning from semester 1 to final year.' },
  { icon: Lightbulb, text: 'Foster innovation and creativity through hackathons, coding challenges, and innovation sprints.' },
  { icon: Users, text: 'Build a collaborative community of students, faculty, and industry professionals.' },
  { icon: GraduationCap, text: 'Bridge the gap between academic curriculum and industry requirements.' },
  { icon: Rocket, text: 'Encourage participation in open-source projects and real-world software development.' },
  { icon: BookOpen, text: 'Organize workshops, guest lectures, and mentorship programs for continuous skill development.' },
];

export default function About() {
  const { user } = useContext(AuthContext);
  return (
    <div className="bg-bg min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-highlight-cream border-b-4 border-primary relative overflow-hidden">
        <div className="absolute top-12 left-10 w-24 h-24 bg-highlight-yellow border-4 border-primary shadow-neo transform -rotate-12 hidden md:block"></div>
        <div className="absolute bottom-6 right-16 w-32 h-16 bg-highlight-purple border-4 border-primary shadow-neo transform rotate-6 hidden md:block"></div>
        <div className="absolute top-20 right-1/4 w-12 h-12 bg-highlight-pink border-4 border-primary shadow-neo rounded-full hidden lg:block"></div>
        
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-sm font-bold tracking-widest uppercase mb-6 shadow-neo transform -rotate-2">
            About Us
          </span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[80px] text-primary mb-6 uppercase leading-none tracking-tight drop-shadow-sm">
            About <span className="px-3 bg-highlight-yellow text-primary inline-block transform rotate-2 border-4 border-primary shadow-neo">CID-Cell</span>
          </h1>
          <p className="text-primary text-lg md:text-xl font-bold max-w-2xl mx-auto border-l-4 border-primary pl-6 py-2 bg-white/50 backdrop-blur-sm shadow-sm md:shadow-none md:bg-transparent">
            Learn about our purpose, vision, mission, and the structured approach we take to transform students into industry-ready professionals.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-bg border-b-4 border-primary relative overflow-hidden">
        {/* Background Grid Pattern & Hazard Lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/4 -right-12 w-48 h-8 bg-hazard border-y-2 border-primary transform -rotate-45 hidden lg:block opacity-80 z-0"></div>
        <div className="absolute bottom-1/4 -left-12 w-48 h-8 bg-hazard border-y-2 border-primary transform 45 hidden lg:block opacity-80 z-0"></div>

        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-highlight-teal/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-highlight-pink/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="container-max mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal className="h-full">
            <div className="relative pt-4">
              {/* Floating accent for the left intro card */}
              <div className="absolute top-0 -left-6 lg:-left-10 w-16 h-16 bg-highlight-yellow border-4 border-primary shadow-neo transform -rotate-12 hidden md:block"></div>
              
              <SectionHeading
                subtitle="Introduction"
                title="What is CID-Cell?"
                alignLeft={true}
                compact={true}
              />
              <div className="space-y-6 text-primary font-medium text-lg leading-relaxed mt-4">
                <p>
                  The <strong className="bg-highlight-pink px-2 py-0.5 border-2 border-primary shadow-neo-sm inline-block transform -rotate-1">Collaborative Innovation & Development Cell (CID-C)</strong> is a
                  structured platform operating under the Department of Computer Science & Engineering. It is designed
                  to bridge the gap between academic learning and industry requirements.
                </p>
                <p>
                  CID-Cell creates an innovation-driven ecosystem where students engage in hands-on learning,
                  real-world projects, open-source contributions, and collaborative initiatives — all guided by
                  faculty mentors and industry experts.
                </p>
                <div className="bg-highlight-teal border-4 border-primary p-4 shadow-neo transform rotate-1">
                  <p className="font-bold text-primary italic">
                    "From foundational programming workshops in first year to industry-grade capstone projects in
                    final year, CID-Cell provides a clear, semester-wise roadmap for student growth."
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="h-full">
            <div className="relative">
              {/* Floating accent for the right purpose card */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-highlight-pink border-4 border-primary shadow-neo transform rotate-6 hidden md:block z-0"></div>
              
              <div className="bg-highlight-blue border-4 border-primary p-8 lg:p-10 shadow-neo transform -rotate-1 hover:rotate-0 transition-neo relative z-10">
                <h3 className="font-heading text-3xl md:text-4xl text-primary mb-8 uppercase tracking-normal">Purpose of CID-Cell</h3>
                <ul className="space-y-5">
                  {[
                    'Create an innovation-driven learning ecosystem',
                    'Bridge academic curriculum with industry requirements',
                    'Foster collaboration between students, faculty, and industry',
                    'Develop technical, leadership, and soft skills',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-white border-4 border-primary text-primary text-lg flex items-center justify-center shrink-0 font-black shadow-neo-sm transform -rotate-2">
                        {i + 1}
                      </span>
                      <span className="text-primary font-bold text-lg pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-highlight-cream border-b-4 border-primary relative overflow-hidden">
        {/* Large purely aesthetic background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden flex justify-center pointer-events-none opacity-5 -z-0">
          <span className="font-heading text-[20vw] text-primary whitespace-nowrap leading-none tracking-normal">
            VISION
          </span>
        </div>
        
        <div className="container-max mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Vision */}
            <div className="bg-white border-4 border-primary p-8 lg:p-10 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo">
              <div className="w-16 h-16 bg-highlight-teal border-4 border-primary flex items-center justify-center mb-8 shadow-neo-sm transform -rotate-3">
                <Eye size={32} className="text-primary" strokeWidth={3} />
              </div>
              <h3 className="font-heading text-4xl text-primary mb-6 uppercase tracking-normal">Our Vision</h3>
              <p className="text-primary font-bold leading-relaxed text-lg border-t-4 border-primary pt-6">
                To establish a dynamic, innovation-driven ecosystem within the Department of Computer Science & Engineering
                that empowers students to bridge the gap between academic learning and real-world industry requirements
                — fostering creativity, collaboration, and technical excellence.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-white border-4 border-primary p-8 lg:p-10 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo">
              <div className="w-16 h-16 bg-highlight-orange border-4 border-primary flex items-center justify-center mb-8 shadow-neo-sm transform rotate-3">
                <Target size={32} className="text-primary" strokeWidth={3} />
              </div>
              <h3 className="font-heading text-4xl text-primary mb-6 uppercase tracking-normal">Our Mission</h3>
              <ul className="space-y-4 text-primary font-bold">
                {[
                  'Facilitate project-based, hands-on learning experiences.',
                  'Organize workshops, hackathons, and technical events regularly.',
                  'Encourage open-source contributions and community engagement.',
                  'Provide mentorship and industry exposure through expert sessions.',
                  'Build industry-ready graduates through structured skill development.',
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ArrowRight size={24} className="text-primary mt-0.5 shrink-0" strokeWidth={3} />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section-padding bg-bg border-b-4 border-primary relative overflow-hidden">
        {/* Background Grid Pattern & Decor */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-highlight-teal border-4 border-primary shadow-neo transform rotate-45 hidden lg:block -z-10"></div>
        <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-highlight-orange border-4 border-primary shadow-neo rounded-full hidden lg:block -z-10"></div>

        <div className="container-max mx-auto relative z-10">
          <SectionHeading
            subtitle="Goals"
            title="Our Objectives"
            description="CID-Cell is guided by clear objectives that drive every activity and initiative we undertake."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {objectives.map(({ icon: Icon, text }, i) => (
              <ScrollReveal key={i} delay={i * 50} className="h-full">
              <div className="flex flex-col items-start gap-6 bg-highlight-yellow border-4 border-primary p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo h-full group">
                <div className="w-14 h-14 bg-white border-4 border-primary flex items-center justify-center shrink-0 shadow-neo-sm transform -rotate-2 group-hover:rotate-0 transition-transform">
                  <Icon size={28} className="text-primary" strokeWidth={3} />
                </div>
                <p className="text-primary font-bold text-lg leading-relaxed">{text}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-highlight-green border-b-4 border-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-highlight-yellow border-4 border-primary shadow-neo rotate-12 hidden md:block"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-highlight-purple border-4 border-primary shadow-neo -rotate-12 rounded-full hidden md:block"></div>

        <div className="container-max mx-auto text-center relative z-10">
          <h2 className="font-heading text-5xl md:text-7xl text-primary mb-8 uppercase tracking-normal leading-none">
            Become a Part <br /> of CID-Cell
          </h2>
          <p className="text-primary font-bold text-xl max-w-xl mx-auto mb-10 bg-white border-4 border-primary p-6 shadow-neo transform -rotate-2">
            Whether you're a first-year student or a final-year, there's a place for you in CID.
          </p>
          <Link to={user ? "/profile" : "/auth"} className="inline-flex items-center gap-3 bg-primary text-white font-heading uppercase tracking-widest text-xl px-10 py-5 border-4 border-primary shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo transform rotate-1 hover:rotate-0">
            Join Now <ArrowRight size={28} strokeWidth={3} />
          </Link>
        </div>
      </section>
    </div>
  );
}
