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
      await axios.post(
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
    <div className="min-h-screen bg-bg pt-40 flex flex-col items-center justify-center font-bold text-accent animate-pulse uppercase tracking-widest gap-4">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      Loading Event Data...
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-bg pt-40 text-center">
      <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Event Node Offline</h2>
      <Link to="/events" className="inline-block px-8 py-3 bg-surface border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors shadow-glass rounded-full">Return to Matrix</Link>
    </div>
  );

  const isFull = event.registeredCount >= event.maxAttendees;
  const isRegistered = event.registrations?.some(reg => reg.userId === user?._id);

  return (
    <div className="bg-bg min-h-screen pb-20 text-white relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10"></div>

      {/* Detail Header */}
      <section className="pt-32 pb-16 relative overflow-hidden border-b border-border">
        <div className="container-max mx-auto px-4 relative z-10">
          <Link to="/events" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors mb-10 group bg-surface/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Matrix
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-widest rounded shadow-glass">
                  {event.category}
                </span>
                <span className="px-3 py-1.5 bg-surface border border-border text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded shadow-glass">
                  {event.type}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase leading-tight drop-shadow-2xl">
                {event.title}
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              {event.registrationType === 'external' ? (
                 <a 
                  href={event.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-10 py-4 font-bold uppercase tracking-widest text-sm bg-accent text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:bg-accent/90 transition-all text-center"
                 >
                   External Uplink
                 </a>
              ) : !isRegistered ? (
                 <button 
                  onClick={handleRegister}
                  disabled={isFull || registrationStatus.submitting}
                  className={`px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-xl transition-all border ${
                    isFull ? 'bg-surface border-white/5 text-slate-500 cursor-not-allowed shadow-none' : 'bg-accent border-accent/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:bg-accent/90'
                  }`}
                 >
                   {registrationStatus.submitting ? 'Authenticating...' : isFull ? 'Capacity Reached' : 'Initialize Sync'}
                 </button>
              ) : (
                <div className="flex flex-col gap-2">
                   <span className="px-8 py-4 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <CheckCircle size={20} /> Connection Active
                   </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-max mx-auto px-4 mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Banner Image */}
            <div className="aspect-[2/1] w-full rounded-2xl border border-white/10 shadow-glass overflow-hidden bg-surface relative group">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-surface">
                   <Calendar size={60} strokeWidth={1} />
                </div>
              )}
              {/* Overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-60 pointer-events-none"></div>
            </div>

            {/* Description */}
            <div className="glass-panel p-8 md:p-12 border border-white/10 rounded-2xl shadow-glass relative overflow-hidden">
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-glow-accent rounded-full rounded-full pointer-events-none"></div>
               
               <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-3 relative z-10">
                 <FileText className="text-accent" /> Decrypted Payload
               </h2>

               <div className="prose prose-invert max-w-none relative z-10 font-medium text-slate-300 leading-relaxed prose-headings:text-white prose-a:text-accent hover:prose-a:text-accent-blue">
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
               </div>

               {event.whatsappGroupLink && isRegistered && (
                  <div className="mt-12 p-6 bg-green-500/5 border border-green-500/20 rounded-xl flex flex-col md:flex-row items-center gap-6 relative z-10 backdrop-blur-md overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[30px] rounded-full group-hover:scale-150 transition-transform"></div>
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                       <MessageCircle size={28} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-bold text-lg text-white uppercase tracking-widest mb-1 shadow-sm">Secure Comms Link</h4>
                      <p className="text-xs font-medium text-slate-400 mb-4 md:mb-0 uppercase tracking-wider">Sync data and coordinate with active nodes.</p>
                    </div>
                    <a 
                      href={event.whatsappGroupLink} 
                      target="_blank"
                      rel="noreferrer" 
                      className="px-6 py-3 bg-green-500/20 text-green-400 font-bold uppercase text-xs tracking-widest border border-green-500/40 hover:bg-green-500 hover:text-white transition-all rounded-lg shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                    >
                      Establish P2P Connect
                    </a>
                  </div>
               )}
            </div>
          </div>

           {/* Sidebar */}
           <div className="space-y-8">
            <div className="glass-panel p-8 border border-white/10 rounded-2xl shadow-glass relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-glow-accent rounded-full pointer-events-none"></div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-white flex items-center gap-3 border-b border-border pb-4 relative z-10">
                <Clock size={16} className="text-accent" /> Node Telemetry
              </h3>
              
              <div className="space-y-8 relative z-10">
                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass group hover:border-accent/40 transition-colors">
                    <Calendar className="text-accent-blue group-hover:scale-110 transition-transform" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Temporal Marker</p>
                    <p className="font-black text-lg text-white uppercase leading-tight">{event.date}</p>
                    <p className="text-xs font-bold text-accent-blue mt-1 uppercase tracking-widest">{formatTime12h(event.time) || 'SYNC PENDING'}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass group hover:border-accent/40 transition-colors">
                    <MapPin className="text-accent-magenta group-hover:scale-110 transition-transform" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Deployment Zone</p>
                    <p className="font-black text-lg text-white uppercase leading-tight">{event.type === 'virtual' ? 'VIRTUAL DEPLOYMENT' : event.location}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest bg-white/5 inline-block px-2 py-0.5 rounded">{event.type} Session</p>
                  </div>
                </div>

                {/* Capacity */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass group hover:border-accent/40 transition-colors">
                    <Users className="text-accent-cyan group-hover:scale-110 transition-transform" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Network Capacity</p>
                    {event.registrationType === 'external' ? (
                      <p className="font-black text-lg text-white uppercase leading-tight">Public Access</p>
                    ) : (
                      <>
                        <p className="font-black text-base text-white uppercase leading-tight flex justify-between">
                          <span>{event.registeredCount} / {event.maxAttendees}</span>
                          <span className="text-[10px] text-slate-400 tracking-widest">ACTIVE</span>
                        </p>
                        <div className="w-full h-1.5 bg-surface mt-2 border border-white/5 rounded-full overflow-hidden shadow-inner">
                           <div className="h-full bg-accent shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000" style={{ width: `${(event.registeredCount / event.maxAttendees) * 100}%` }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Organizer */}
                <div className="pt-6 border-t border-border">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-4 tracking-widest">Mission Coordinator</p>
                  <div className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-3 bg-surface border border-white/10 px-4 py-3 rounded-xl shadow-glass">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <User size={14} className="text-accent" />
                      </div>
                      <p className="font-black text-sm text-white uppercase tracking-widest">{event.organizer}</p>
                    </div>
                    {event.organizerEmail && (
                      <div className="inline-flex items-center gap-2 px-1 text-slate-400 hover:text-white transition-colors group cursor-pointer">
                        <Mail size={14} className="group-hover:text-accent transition-colors" />
                        <a href={`mailto:${event.organizerEmail}`} className="text-xs font-medium uppercase tracking-widest lowercase">{event.organizerEmail}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center shadow-glass relative overflow-hidden group">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-accent rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors"></div>
               <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 relative z-10">Diagnostics Support</p>
               <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed relative z-10">Ping the coordinator node for parameter clarification.</p>
               <a href={`mailto:${event.organizerEmail}`} className="block w-full py-3 bg-surface border border-white/10 text-white font-bold text-xs hover:border-accent hover:bg-white/5 transition-all shadow-glass uppercase tracking-widest rounded-xl relative z-10">
                 Ping Coordinator
               </a>
            </div>
          </div>
        </div>
      </div>

      {registrationStatus.error && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-red-500/10 backdrop-blur-md text-red-400 px-6 py-4 border border-red-500/30 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center gap-4 animate-fade-in font-medium max-w-sm w-full">
            <AlertTriangle size={20} className="shrink-0" />
            <p className="text-sm tracking-widest uppercase truncate">{registrationStatus.error}</p>
            <button onClick={() => setRegistrationStatus({...registrationStatus, error: null})} className="ml-auto hover:text-white transition-colors shrink-0"><X size={16}/></button>
         </div>
      )}
    </div>
  );
}
