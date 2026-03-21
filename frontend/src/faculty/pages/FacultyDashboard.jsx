import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';

const statusConfig = {
  proposal: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
};

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/my-proposals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProposals(res.data);
      } catch (err) {
        setError('Failed to load your proposals. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyProposals();
  }, []);

  const pending = proposals.filter(p => p.status === 'proposal').length;
  const approved = proposals.filter(p => p.status === 'approved').length;
  const rejected = proposals.filter(p => p.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-max mx-auto section-padding">

        {/* Heading */}
        <h1 className="mb-2">My Proposals</h1>
        <p className="font-body normal-case tracking-normal text-primary/70 mb-10">
          Track the status of events you have submitted for review.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="neo-card p-6 text-center">
            <p className="text-3xl font-bold">{pending}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Pending</p>
          </div>
          <div className="neo-card p-6 text-center">
            <p className="text-3xl font-bold">{approved}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Approved</p>
          </div>
          <div className="neo-card p-6 text-center">
            <p className="text-3xl font-bold">{rejected}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Rejected</p>
          </div>
        </div>

        {/* CTA button */}
        <div className="mb-10">
          <Link to="/faculty/propose-event" className="btn-neo">
            + Propose New Event
          </Link>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
            <Loader size={20} className="animate-spin text-indigo-600" />
            <span className="text-sm">Loading proposals...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 gap-3 text-red-500">
            <AlertTriangle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">You haven't submitted any proposals yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map(p => {
              const cfg = statusConfig[p.status] || statusConfig.proposal;
              return (
                <div 
                  key={p._id} 
                  className="neo-card flex flex-col group relative h-full bg-white border-3 border-primary shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
                >
                  <span className={`neo-badge absolute top-3 right-3 text-[10px] font-bold px-2 py-1 border-2 border-primary uppercase z-10 ${cfg.color}`}>
                    {cfg.label}
                  </span>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                       {p.date}
                    </div>

                    <h3 className="font-heading text-xl font-black text-primary mb-6 leading-tight group-hover:text-blue-600 transition-colors uppercase">
                      {p.title}
                    </h3>

                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                         <span className="truncate text-red-500 font-bold">{p.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                         <span className="text-blue-600 font-bold uppercase">{p.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
