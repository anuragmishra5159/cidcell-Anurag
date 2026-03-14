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

const flowSteps = [
  { step: '01', title: 'Orientation', desc: 'Students are introduced to CID-Cell, its activities, and semester-wise roadmap.' },
  { step: '02', title: 'Skill Building', desc: 'Structured workshops and micro projects to build foundational programming and development skills.' },
  { step: '03', title: 'Project Development', desc: 'Teams work on macro and capstone projects using industry-standard tools and methodologies.' },
  { step: '04', title: 'Innovation Activities', desc: 'Hackathons, innovation sprints, coding challenges, and open-source contributions.' },
  { step: '05', title: 'Industry Exposure', desc: 'Guest lectures, mentorship sessions, and collaborative initiatives with industry partners.' },
  { step: '06', title: 'Placement Ready', desc: 'Portfolio-ready students with technical expertise, soft skills, and leadership experience.' },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-highlight-cream border-b-3 border-black relative overflow-hidden">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-black text-white text-sm font-bold uppercase mb-4 shadow-neo transform -rotate-1">
            About Us
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-black mb-6 uppercase leading-none">
            About <span className="p-1 bg-highlight-yellow text-black inline-block transform rotate-1 border-3 border-black shadow-small">CID-Cell</span>
          </h1>
          <p className="text-black text-xl font-medium max-w-2xl mx-auto border-l-4 border-black pl-4">
            Learn about our purpose, vision, mission, and the structured approach we take to transform students into industry-ready professionals.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal className="h-full">
            <div>
              <SectionHeading
                subtitle="Introduction"
                title="What is CID-Cell?"
              />
              <div className="space-y-4 text-black font-medium text-lg leading-relaxed">
                <p>
                  The <strong className="bg-highlight-pink px-1 border border-black">Collaborative Innovation & Development Cell (CID-C)</strong> is a
                  structured platform operating under the Department of Computer Science & Engineering. It is designed
                  to bridge the gap between academic learning and industry requirements.
                </p>
                <p>
                  CID-Cell creates an innovation-driven ecosystem where students engage in hands-on learning,
                  real-world projects, open-source contributions, and collaborative initiatives — all guided by
                  faculty mentors and industry experts.
                </p>
                <p className="border-l-4 border-black pl-4 italic">
                  From foundational programming workshops in first year to industry-grade capstone projects in
                  final year, CID-Cell provides a clear, semester-wise roadmap for student growth.
                </p>
              </div>
            </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="h-full">
            <div className="bg-highlight-blue border-3 border-black p-8 lg:p-10 shadow-neo transform rotate-1">
              <h3 className="font-heading font-black text-3xl text-black mb-6 uppercase">Purpose of CID-Cell</h3>
              <ul className="space-y-4">
                {[
                  'Create an innovation-driven learning ecosystem',
                  'Provide structured project-based learning from Sem 1 to Sem 8',
                  'Bridge academic curriculum with industry requirements',
                  'Foster collaboration between students, faculty, and industry',
                  'Develop technical, leadership, and soft skills',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-black border-2 border-white text-white text-sm flex items-center justify-center shrink-0 font-bold shadow-small">
                      {i + 1}
                    </span>
                    <span className="text-black font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-highlight-cream border-b-3 border-black">
        <div className="container-max mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Vision */}
            <div className="bg-white border-3 border-black p-8 lg:p-10 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-highlight-teal border-3 border-black flex items-center justify-center mb-6 shadow-small">
                <Eye size={32} className="text-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-heading font-black text-3xl text-black mb-4 uppercase">Our Vision</h3>
              <p className="text-black font-medium leading-relaxed text-lg border-t-2 border-black pt-4">
                To establish a dynamic, innovation-driven ecosystem within the Department of Computer Science & Engineering
                that empowers students to bridge the gap between academic learning and real-world industry requirements
                — fostering creativity, collaboration, and technical excellence.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-white border-3 border-black p-8 lg:p-10 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="w-16 h-16 bg-highlight-orange border-3 border-black flex items-center justify-center mb-6 shadow-small">
                <Target size={32} className="text-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-heading font-black text-3xl text-black mb-4 uppercase">Our Mission</h3>
              <ul className="space-y-3 text-black font-medium">
                {[
                  'Facilitate project-based, hands-on learning experiences.',
                  'Organize workshops, hackathons, and technical events regularly.',
                  'Encourage open-source contributions and community engagement.',
                  'Provide mentorship and industry exposure through expert sessions.',
                  'Build industry-ready graduates through structured skill development.',
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ArrowRight size={20} className="text-black mt-1 shrink-0" strokeWidth={3} />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <SectionHeading
            subtitle="Goals"
            title="Our Objectives"
            description="CID-Cell is guided by clear objectives that drive every activity and initiative we undertake."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map(({ icon: Icon, text }, i) => (
              <ScrollReveal key={i} delay={i * 50} className="h-full">
              <div className="flex flex-col items-start gap-4 bg-highlight-yellow/10 border-3 border-black p-6 hover:bg-highlight-yellow transition-colors duration-200 h-full">
                <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shrink-0 shadow-small">
                  <Icon size={24} className="text-black" strokeWidth={2.5} />
                </div>
                <p className="text-black font-bold leading-relaxed">{text}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Flowchart / Process */}
      <section className="section-padding bg-black text-white relative overflow-hidden border-b-3 border-black">
        <div className="container-max mx-auto relative z-10">
          <SectionHeading
            subtitle="Process"
            title="How CID-Cell Works"
            description="A structured 6-step process that takes students from orientation to placement readiness."
            light
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {flowSteps.map(({ step, title, desc }, idx) => (
              <ScrollReveal key={step} delay={idx * 50} className="h-full">
              <div
                className="bg-gray-900 border-2 border-white p-6 hover:bg-white hover:text-black transition-colors group h-full"
              >
                <span className="text-5xl font-heading font-black text-transparent text-stroke-white group-hover:text-stroke-black mb-4 block">{step}</span>
                <h3 className="font-heading font-bold text-2xl mt-3 mb-2 uppercase">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-black font-medium">{desc}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-highlight-green border-b-3 border-black">
        <div className="container-max mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-black mb-6 uppercase">
            Become a Part of CID-Cell
          </h2>
          <p className="text-black font-bold text-xl max-w-xl mx-auto mb-8 bg-white border-3 border-black p-4 shadow-neo transform -rotate-1">
            Whether you're a first-year student or a final-year, there's a place for you in CID.
          </p>
          <Link to="/contact" className="btn-neo bg-black text-white hover:bg-gray-800 justify-center text-lg px-8 py-4 inline-flex items-center gap-2">
            Join Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
