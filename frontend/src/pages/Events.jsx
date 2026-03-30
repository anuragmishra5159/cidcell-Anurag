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
      case 'tech': return 'bg-highlight-blue';
      case 'cultural': return 'bg-highlight-purple';
      case 'sports': return 'bg-highlight-orange';
      case 'educational': return 'bg-highlight-teal';
      case 'trainig and mentorships': return 'bg-highlight-green';
      default: return 'bg-highlight-yellow';
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-bg relative overflow-hidden border-b-3 border-primary">
        <div className="absolute top-10 left-10 w-32 h-32 bg-highlight-orange border-3 border-primary rounded-full shadow-neo opacity-80 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-highlight-blue border-3 border-primary transform -rotate-6 shadow-neo opacity-60"></div>

        <div className="container-max mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform rotate-1 mb-6">
            <span className="font-bold uppercase tracking-widest text-sm">Join Our Community</span>
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black text-primary mb-6 uppercase leading-none">
            Events
          </h1>
          <p className="text-primary font-medium text-xl max-w-2xl mx-auto bg-white border-2 border-primary p-6 shadow-neo-sm transform -rotate-1">
            Browse upcoming workshops, hackathons, and guest lectures hosted by CID Cell.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding bg-white min-h-[600px]">
        <div className="container-max mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="bg-white border-3 border-primary p-2 rounded-xl sm:rounded-full shadow-neo flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase border-2 transition-all ${
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

          {loading ? (
             <div className="flex justify-center py-20 font-bold text-primary animate-pulse text-xl">Loading events...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((event, idx) => {
                const isFull = event.registeredCount >= event.maxAttendees;
                return (
                  <ScrollReveal key={event._id} delay={idx * 50}>
                    <div 
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="neo-card flex flex-col group relative h-full bg-white border-3 border-primary shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer overflow-hidden"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full aspect-[2/1] bg-slate-50 border-b-3 border-primary overflow-hidden relative rounded-t-neo">
                        {event.image ? (
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                             <ImageIcon size={40} />
                          </div>
                        )}
                        {isFull && !registeredEventIds.has(event._id) && (
                          <span className="absolute top-4 right-4 text-[10px] font-black uppercase px-2 py-1 border-2 border-primary bg-white text-red-500 shadow-neo-sm z-10">
                            Housefull
                          </span>
                        )}
                        {registeredEventIds.has(event._id) && (
                          <span className="absolute top-4 right-4 text-[10px] font-black uppercase px-3 py-1.5 border-2 border-primary bg-highlight-green text-primary shadow-neo-sm z-10">
                            Registered
                          </span>
                        )}
                      </div>

                      <div className={`p-4 border-b-3 border-primary flex justify-between items-center ${getCategoryColor(event.category)}`}>
                        <span className="font-bold uppercase tracking-tight text-xs truncate max-w-[150px]">{event.category}</span>
                        <span className="text-[10px] font-bold uppercase bg-white px-2 py-0.5 border-2 border-primary">
                          {event.type}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <Calendar size={12} /> {event.date}
                        </div>

                        <h3 className="font-heading text-2xl font-black text-primary mb-6 leading-tight group-hover:text-blue-600 transition-colors uppercase">
                          {event.title}
                        </h3>

                        <div className="space-y-3 mb-8 flex-1">
                          <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                             <MapPin size={16} className="text-red-500" /> 
                             <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                             <Clock size={16} className="text-blue-600" /> {formatTime12h(event.time) || 'Schedule TBD'}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                             <Users size={16} className="text-purple-600" /> 
                             <span>{event.registeredCount} / {event.maxAttendees} Joined</span>
                          </div>
                        </div>

                        <button 
                          className="w-full py-3 bg-white border-3 border-primary font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                          View Details <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 border-3 border-dashed border-slate-200 rounded-3xl">
              <p className="font-bold text-slate-400 uppercase tracking-widest">No events found in this category</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
