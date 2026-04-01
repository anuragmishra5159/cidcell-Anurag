import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { formatTime12h } from '../utils/formatTime';
import { AuthContext } from '../context/AuthContext';
import EmptyState from '../components/ui/EmptyState';

const categories = ['All', 'trainig and mentorships', 'tech', 'cultural', 'sports', 'educational', 'special'];

export default function Events() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState('All');
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
      setEvents(res.data.filter(ev => ev.isScheduled));

      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        const regRes = await axios.get(`${import.meta.env.VITE_API_URL}/events/my-registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const regIds = new Set(regRes.data.map(e => e._id));
        setRegisteredEventIds(regIds);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = active === 'All' 
    ? events 
    : events.filter((e) => e.category.toLowerCase() === active.toLowerCase());

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'tech': return 'text-accent-blue bg-accent-blue/10 border-accent-blue/30';
      case 'cultural': return 'text-accent-magenta bg-accent-magenta/10 border-accent-magenta/30';
      case 'sports': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'educational': return 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30';
      case 'trainig and mentorships': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-accent bg-accent/10 border-accent/30';
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-bg relative overflow-hidden border-b border-border">
        {/* Abstract Glowing Orb Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-accent-magenta/10 rounded-full blur-2xl pointer-events-none z-0"></div>

        <div className="container-max mx-auto px-4 text-center relative z-10">
          <div className="inline-flex px-4 py-1.5 glass-panel rounded-full border border-accent/20 mb-6 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent shadow-glow-purple"></span>
            <span className="font-semibold uppercase tracking-[0.2em] text-xs text-white">Event Matrix</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight drop-shadow-2xl">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-cyan">Events</span>
          </h1>
          <p className="text-secondary font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Browse upcoming workshops, hackathons, and guest lectures hosted by CID-Cell. Join the network and upgrade your skills.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding min-h-[600px] relative">
        <div className="container-max mx-auto px-4 relative z-10">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
             <div className="glass-panel p-2 rounded-2xl md:rounded-full bg-white/[0.03] flex flex-wrap gap-2 justify-center max-w-4xl">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setActive(cat)}
                   className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                     active === cat
                       ? 'bg-accent/20 text-white border border-accent/50 shadow-glow-purple'
                       : 'bg-transparent text-slate-400 border border-transparent hover:text-white hover:bg-white/5'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <div className="font-medium text-secondary text-sm tracking-widest uppercase">Syncing Events...</div>
             </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((event, idx) => {
                const isFull = event.registeredCount >= event.maxAttendees;
                return (
                  <ScrollReveal key={event._id} delay={idx * 50}>
                    <div 
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="glass-card flex flex-col group relative h-full transition-all duration-300 hover:shadow-glow-purple cursor-pointer overflow-hidden hover:-translate-y-1"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full aspect-[2/1] bg-[#0a0a0a] border-b border-border overflow-hidden relative">
                        {event.image ? (
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 mix-blend-screen" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-secondary/30 bg-surface">
                             <ImageIcon size={40} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-80"></div>

                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          {isFull && !registeredEventIds.has(event._id) && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 backdrop-blur-md">
                              Housefull
                            </span>
                          )}
                          {registeredEventIds.has(event._id) && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-green-400/30 bg-green-400/10 text-green-400 backdrop-blur-md">
                              Registered
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info header */}
                      <div className="px-5 pt-5 pb-3 flex justify-between items-center z-10">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getCategoryColor(event.category)} truncate max-w-[150px]`}>
                          {event.category}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-secondary bg-surface border border-border px-2.5 py-1 rounded-md">
                          {event.type}
                        </span>
                      </div>

                      <div className="px-5 pb-6 flex-1 flex flex-col z-10">
                        <div className="flex items-center gap-2 mb-3 text-[10px] font-semibold text-secondary uppercase tracking-widest">
                           <Calendar size={12} className="text-accent" /> {event.date}
                        </div>

                        <h3 className="font-heading text-xl font-bold text-white mb-5 leading-tight group-hover:text-accent transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-3 mb-6 flex-1 text-xs">
                          <div className="flex items-center gap-3 text-secondary font-medium">
                             <MapPin size={14} className="text-accent-magenta" /> 
                             <span className="truncate group-hover:text-white transition-colors">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-secondary font-medium">
                             <Clock size={14} className="text-accent-cyan" /> 
                             <span className="group-hover:text-white transition-colors">{formatTime12h(event.time) || 'Schedule TBD'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-secondary font-medium">
                             <Users size={14} className="text-green-400" /> 
                             <span className="group-hover:text-white transition-colors">{event.registeredCount} / {event.maxAttendees} Joined</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-auto flex items-center justify-between text-secondary group-hover:text-accent transition-colors">
                           <span className="text-xs font-semibold tracking-widest uppercase">View Details</span>
                           <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex justify-center py-10 w-full max-w-2xl mx-auto">
              <EmptyState title="No Events Found In Matrix" message="Adjust your active filters or clear search to discover events." icon={Calendar} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
