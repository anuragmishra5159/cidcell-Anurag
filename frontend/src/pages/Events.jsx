import { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';

const categories = ['All', 'Workshops', 'Hackathons', 'Coding', 'Guest Lectures', 'Mentorship'];

const events = [
  // Workshops
  {
    title: 'Full Stack Web Development Bootcamp',
    category: 'Workshops',
    date: 'March 15-17, 2026',
    time: '10:00 AM - 4:00 PM',
    venue: 'CSE Lab 1',
    desc: 'A 3-day intensive workshop covering HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build a complete web application from scratch.',
    status: 'upcoming',
  },
  {
    title: 'Introduction to AI & Machine Learning',
    category: 'Workshops',
    date: 'April 5, 2026',
    time: '10:00 AM - 3:00 PM',
    venue: 'Seminar Hall',
    desc: 'Learn the fundamentals of AI/ML with Python, TensorFlow, and hands-on projects including image classification and NLP.',
    status: 'upcoming',
  },
  {
    title: 'Cloud Computing with AWS',
    category: 'Workshops',
    date: 'February 20, 2026',
    time: '11:00 AM - 4:00 PM',
    venue: 'CSE Lab 2',
    desc: 'Hands-on workshop on AWS services — EC2, S3, Lambda, and deploying applications to the cloud.',
    status: 'completed',
  },
  {
    title: 'Cybersecurity Essentials',
    category: 'Workshops',
    date: 'January 25, 2026',
    time: '10:00 AM - 3:00 PM',
    venue: 'CSE Lab 1',
    desc: 'Introduction to ethical hacking, network security, penetration testing basics, and security best practices.',
    status: 'completed',
  },
  {
    title: 'IoT with Raspberry Pi',
    category: 'Workshops',
    date: 'May 10, 2026',
    time: '10:00 AM - 4:00 PM',
    venue: 'IoT Lab',
    desc: 'Build IoT prototypes using Raspberry Pi, sensors, and cloud integration. Create a smart home automation project.',
    status: 'upcoming',
  },

  // Hackathons
  {
    title: 'InnoHack 2026',
    category: 'Hackathons',
    date: 'April 19-20, 2026',
    time: '24 Hours',
    venue: 'College Auditorium',
    desc: 'Annual 24-hour hackathon. Build innovative solutions to real-world problems. Open to all engineering students.',
    status: 'upcoming',
  },
  {
    title: 'CodeSprint Winter 2025',
    category: 'Hackathons',
    date: 'December 15, 2025',
    time: '12 Hours',
    venue: 'CSE Department',
    desc: 'A 12-hour mini-hackathon focused on building MVPs. Theme: Sustainable Technology Solutions.',
    status: 'completed',
  },

  // Coding
  {
    title: 'Weekly DSA Challenge',
    category: 'Coding',
    date: 'Every Saturday',
    time: '6:00 PM - 8:00 PM',
    venue: 'Online (LeetCode)',
    desc: 'Weekly competitive programming contest focusing on data structures and algorithms. Leaderboard-based rankings.',
    status: 'upcoming',
  },
  {
    title: 'Innovation Sprint: EdTech',
    category: 'Coding',
    date: 'March 28, 2026',
    time: '9:00 AM - 6:00 PM',
    venue: 'Innovation Lab',
    desc: 'A focused sprint to develop innovative education technology solutions. Teams ideate, prototype, and present.',
    status: 'upcoming',
  },

  // Guest Lectures
  {
    title: 'From Campus to Corporate',
    category: 'Guest Lectures',
    date: 'March 22, 2026',
    time: '2:00 PM - 4:00 PM',
    venue: 'Seminar Hall',
    desc: 'Industry expert session on transitioning from college life to corporate roles. Tips on interviews, resume building, and career growth.',
    status: 'upcoming',
  },
  {
    title: 'The Future of AI in Industry',
    category: 'Guest Lectures',
    date: 'February 10, 2026',
    time: '3:00 PM - 5:00 PM',
    venue: 'Auditorium',
    desc: 'Alumni session on how AI is reshaping industries and what skills students need to stay relevant.',
    status: 'completed',
  },

  // Mentorship
  {
    title: 'Peer Mentorship Program',
    category: 'Mentorship',
    date: 'Ongoing',
    time: 'Flexible',
    venue: 'Online & Offline',
    desc: 'Senior students mentor juniors on technical skills, project development, and career planning. One-on-one and group sessions.',
    status: 'upcoming',
  },
  {
    title: 'Industry Mentor Connect',
    category: 'Mentorship',
    date: 'Monthly',
    time: 'Scheduled',
    venue: 'Virtual',
    desc: 'Monthly mentorship sessions with industry professionals covering career guidance, technical advice, and project reviews.',
    status: 'upcoming',
  },
];

export default function Events() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? events : events.filter((e) => e.category === active);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-bg relative overflow-hidden border-b-3 border-primary">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-highlight-orange border-3 border-primary rounded-full shadow-neo opacity-80 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-highlight-blue border-3 border-primary transform -rotate-6 shadow-neo opacity-60"></div>

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform rotate-1 mb-6">
            <span className="font-bold uppercase tracking-widest text-sm">
              Stay Updated
            </span>
          </div>
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-black text-primary mb-6 uppercase leading-none">
            Events <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight-purple to-highlight-blue" style={{ WebkitTextStroke: '2px black' }}>& Activities</span>
          </h1>
          <p className="text-primary font-medium text-xl max-w-2xl mx-auto bg-white border-2 border-primary p-6 shadow-neo-sm transform -rotate-1 relative z-10">
            Workshops, hackathons, coding challenges, guest lectures, and mentorship programs — there's always something happening at CID-Cell.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding bg-white">
        <div className="container-max mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="bg-white border-3 border-primary p-2 rounded-full shadow-neo flex flex-wrap gap-2">
              <span className="items-center px-4 font-bold uppercase text-primary text-sm hidden sm:flex">
                 Categories:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase border-2 transition-all ${
                    active === cat
                      ? 'bg-primary text-white border-primary shadow-none transform translate-y-[1px]'
                      : 'bg-white text-primary border-transparent hover:border-primary hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event, idx) => (
              <ScrollReveal key={event.title} delay={idx * 50}>
              <div
                className="neo-card flex flex-col group relative h-full overflow-hidden"
              >
                <div className="p-0 flex flex-col flex-1 bg-white">
                  <div className={`p-4 border-b-3 border-primary flex justify-between items-center ${
                      event.category === 'Workshops'
                        ? 'bg-highlight-teal'
                        : event.category === 'Hackathons'
                        ? 'bg-highlight-orange'
                        : event.category === 'Coding'
                        ? 'bg-highlight-purple'
                        : event.category === 'Guest Lectures'
                        ? 'bg-highlight-pink'
                        : 'bg-highlight-green'
                    }`}>
                    <span className="font-heading font-black uppercase tracking-wide text-xl">
                      {event.category}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase px-2 py-1 border-2 border-primary bg-white shadow-neo-sm ${
                        event.status === 'upcoming' ? 'text-green-600' : 'text-primary'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-heading text-4xl font-black text-primary mb-6 leading-none group-hover:text-highlight-orange transition-colors uppercase">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-4 mb-6 flex-1">
                      <div className="flex items-center gap-4 font-bold text-base">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 border-2 border-primary">
                          <Calendar size={18} />
                        </div>
                        {event.date}
                      </div>
                      <div className="flex items-center gap-4 font-bold text-base">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 border-2 border-primary">
                          <Clock size={18} />
                        </div>
                        {event.time}
                      </div>
                      <div className="flex items-center gap-4 font-bold text-base">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 border-2 border-primary">
                          <MapPin size={18} />
                        </div>
                        {event.venue}
                      </div>
                    </div>

                    <p className="text-gray-800 text-base font-medium leading-relaxed mb-8 border-l-4 border-dashed border-gray-300 pl-4 py-1">
                      {event.desc}
                    </p>

                    {event.status === 'upcoming' ? (
                      <button className="w-full py-3 bg-primary text-white border-2 border-primary font-bold uppercase tracking-wider hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2 shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        Register Now <ArrowRight size={18} />
                      </button>
                    ) : (
                       <button disabled className="w-full py-3 bg-gray-100 text-gray-400 border-2 border-gray-200 font-bold uppercase tracking-wider cursor-not-allowed">
                        Event Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No events in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
