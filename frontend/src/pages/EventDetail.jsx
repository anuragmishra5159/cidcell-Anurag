import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  ChevronLeft, 
  MessageCircle, 
  CheckCircle, 
  AlertTriangle,
  Mail,
  Share2,
  X,
  FileText
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { formatTime12h } from '../utils/formatTime';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    fetchEventDetails();
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`, { headers });
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/auth', { state: { from: `/events/${id}` } });
      return;
    }

    setRegistrationStatus({ submitting: true, success: false, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistrationStatus({ submitting: false, success: true, error: null });
      fetchEventDetails();
    } catch (err) {
      setRegistrationStatus({ 
        submitting: false, 
        success: false, 
        error: err.response?.data?.message || 'Registration failed' 
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-40 flex items-center justify-center font-bold text-primary animate-pulse uppercase tracking-widest">
      Loading event details...
    </div>
  );

  if (!event) return (
    <div className="min-h-screen pt-40 text-center">
      <h2 className="text-3xl font-black text-primary mb-6 uppercase">Event not found</h2>
      <Link to="/events" className="btn-neo bg-highlight-yellow inline-block">Go back to events</Link>
    </div>
  );

  const isFull = event.registeredCount >= event.maxAttendees;
  const isRegistered = event.registrations?.some(reg => reg.userId === user?._id);

  return (
    <div className="bg-bg min-h-screen pb-20">
      {/* Detail Header */}
      <section className="pt-32 pb-16 bg-white border-b-3 border-primary relative overflow-hidden">
        <div className="container-max mx-auto px-4 relative z-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-8 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Events
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-highlight-purple border-2 border-primary text-[10px] font-bold uppercase shadow-neo-sm">
                  {event.category}
                </span>
                <span className="px-3 py-1 bg-white border-2 border-primary text-[10px] font-bold uppercase shadow-neo-sm">
                  {event.type}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-primary tracking-widest uppercase leading-[0.85]">
                {event.title}
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {event.registrationType === 'external' ? (
                 <a 
                  href={event.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-10 py-4 font-bold uppercase text-sm shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all border-3 border-primary bg-highlight-yellow text-primary text-center cursor-pointer"
                 >
                   Register Now (External)
                 </a>
              ) : !isRegistered ? (
                 <button 
                  onClick={handleRegister}
                  disabled={isFull || registrationStatus.submitting}
                  className={`px-10 py-4 font-bold uppercase text-sm shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all border-3 border-primary ${
                    isFull ? 'bg-slate-100 text-slate-400 border-slate-200 shadow-none' : 'bg-highlight-yellow text-primary'
                  }`}
                 >
                   {registrationStatus.submitting ? 'Registering...' : isFull ? 'Event Full' : 'Register Now'}
                 </button>
              ) : (
                <div className="flex flex-col gap-2">
                   <span className="px-6 py-4 bg-highlight-green text-primary border-3 border-primary font-bold uppercase text-sm flex items-center gap-2">
                      <CheckCircle size={20} /> Registered
                   </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-max mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Banner Image */}
            <div className="aspect-[21/9] w-full border-3 border-primary shadow-neo overflow-hidden bg-slate-50 relative">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                   <Calendar size={60} strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-10 md:p-16 border-3 border-primary shadow-neo relative">
               <h2 className="text-3xl font-black text-primary uppercase mb-8 border-b-4 border-primary inline-block pb-2">
                 About this Event
               </h2>

               <div className="prose prose-slate max-w-none">
                  <div 
                    className="text-slate-700 text-lg leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
               </div>

               {event.whatsappGroupLink && isRegistered && (
                  <div className="mt-12 p-8 bg-green-50 border-3 border-dashed border-green-200 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                       <MessageCircle size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-green-800 uppercase mb-2">Join the WhatsApp Group</h4>
                      <p className="text-sm font-medium text-green-700 mb-4 uppercase">Get the latest updates and coordinate with other participants.</p>
                      <a 
                        href={event.whatsappGroupLink} 
                        target="_blank" 
                        className="px-6 py-2 bg-green-600 text-white font-bold uppercase text-[10px] tracking-widest border-2 border-white hover:bg-green-700 transition-colors"
                      >
                        Join Now
                      </a>
                    </div>
                  </div>
               )}
            </div>
          </div>

           {/* Sidebar */}
           <div className="space-y-8">
            <div className="bg-white p-8 border-3 border-primary shadow-neo">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-primary flex items-center gap-2 border-b-2 border-primary/10 pb-4">
                <FileText size={18} className="text-highlight-purple" /> Event Specifications
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-highlight-yellow border-2 border-primary flex items-center justify-center shrink-0 shadow-neo-sm">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/40 mb-1 tracking-widest">Temporal Marker</p>
                    <p className="font-black text-lg text-primary uppercase leading-tight">{event.date}</p>
                    <p className="text-xs font-bold text-primary/60 mt-1 uppercase italic">{formatTime12h(event.time) || 'SYNC PENDING'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-highlight-teal border-2 border-primary flex items-center justify-center shrink-0 shadow-neo-sm">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/40 mb-1 tracking-widest">Deployment Zone</p>
                    <p className="font-black text-lg text-primary uppercase leading-tight">{event.type === 'virtual' ? 'VIRTUAL DEPLOYMENT' : event.location}</p>
                    <p className="text-xs font-bold text-primary/60 mt-1 uppercase italic tracking-wider">{event.type} Session</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-highlight-blue border-2 border-primary flex items-center justify-center shrink-0 shadow-neo-sm">
                    <Users className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/40 mb-1 tracking-widest">Operational Capacity</p>
                    {event.registrationType === 'external' ? (
                      <p className="font-black text-lg text-primary uppercase leading-tight">Public Access Access</p>
                    ) : (
                      <>
                        <p className="font-black text-lg text-primary uppercase leading-tight">{event.registeredCount} / {event.maxAttendees} SLOTS FILLED</p>
                        <div className="w-full h-2 bg-primary/10 mt-3 border border-primary rounded-full overflow-hidden">
                           <div className="h-full bg-highlight-blue border-r border-primary" style={{ width: `${(event.registeredCount / event.maxAttendees) * 100}%` }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-primary/10">
                  <p className="text-[10px] font-black uppercase text-primary/30 mb-4 tracking-widest">Mission Coordinator</p>
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 bg-highlight-pink/10 border-2 border-primary/20 px-4 py-2 rounded-xl">
                      <User size={16} className="text-primary" />
                      <p className="font-black text-sm text-primary uppercase">{event.organizer}</p>
                    </div>
                    {event.organizerEmail && (
                      <div className="inline-flex items-center gap-2 px-1">
                        <Mail size={14} className="text-primary/40" />
                        <p className="text-xs font-black text-primary/40 uppercase tracking-tighter lowercase">{event.organizerEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-highlight-teal/10 border-3 border-primary p-8 text-center shadow-neo">
               <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Need help?</p>
               <p className="text-sm font-medium text-slate-600 mb-6">Contact the organizer for any queries regarding this event.</p>
               <a href={`mailto:${event.organizerEmail}`} className="block w-full py-3 bg-white border-2 border-primary text-primary font-bold text-xs hover:bg-slate-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase">
                 Contact Organizer
               </a>
            </div>
          </div>
        </div>
      </div>

      {registrationStatus.error && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-red-600 text-white px-8 py-4 border-3 border-black shadow-neo flex items-center gap-3">
            <AlertTriangle size={24} />
            <p className="font-bold uppercase text-sm">{registrationStatus.error}</p>
            <button onClick={() => setRegistrationStatus({...registrationStatus, error: null})} className="ml-4 bg-white/20 p-1 rounded hover:bg-white/40"><X size={16}/></button>
         </div>
      )}
    </div>
  );
}
