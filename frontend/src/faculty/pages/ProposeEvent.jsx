import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const categories = [
  "trainig and mentorships",
  "tech",
  "cultural",
  "sports",
  "educational",
  "special",
];

const eventTypes = ["virtual", "in-person"];

const ProposeEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    organizerEmail: '',
    creatorName: '',
    userType: 'faculty',
    category: 'tech',
    type: 'in-person',
    maxAttendees: 30,
    image: '',
    whatsappGroupLink: '',
    isScheduled: true,
    isPaid: false,
    price: 0,
  });
  const [toast, setToast] = useState({ message: '', type: null });
  const [submitting, setSubmitting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/events/proposals`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Proposal submitted! Awaiting admin approval.', 'success');
      setTimeout(() => navigate('/faculty/dashboard'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting proposal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-max mx-auto section-padding max-w-2xl">
        {/* Heading */}
        <h1 className="mb-2">Propose an Event</h1>
        <p className="font-body normal-case tracking-normal text-primary/70 mb-8">
          Fill in the details below. Your proposal will be reviewed by an admin before going live.
        </p>

        {/* Form card */}
        <div className="neo-card p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-1">Event Title*</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Code Hackathon 2026" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Date*</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Time</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-1">Location*</label>
                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Venue or Link" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Event Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                    {eventTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                    {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Max Attendees</label>
                  <input type="number" value={formData.maxAttendees} onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Event Type (Free/Paid)</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="isPaid" checked={formData.isPaid} onChange={e => setFormData({ ...formData, isPaid: e.target.checked, price: e.target.checked ? formData.price : 0 })} className="w-4 h-4 rounded text-indigo-600 border border-slate-300 focus:ring-indigo-500" />
                    <label htmlFor="isPaid" className="text-sm font-bold text-slate-700 cursor-pointer">Paid Event</label>
                  </div>
                </div>
              </div>

              {formData.isPaid && (
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Price (₹)*</label>
                  <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 500" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Organizer Name*</label>
                  <input type="text" required value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-1">Organizer Email*</label>
                  <input type="email" required value={formData.organizerEmail} onChange={e => setFormData({ ...formData, organizerEmail: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-1">Creator Name</label>
                <input type="text" value={formData.creatorName} onChange={e => setFormData({ ...formData, creatorName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Prof. John Doe" />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-1">WhatsApp Group Link*</label>
                <input type="text" required value={formData.whatsappGroupLink} onChange={e => setFormData({ ...formData, whatsappGroupLink: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://chat.whatsapp.com/..." />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-1">Header Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://example.com/image.jpg" />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-1">Description*</label>
                <div className="bg-white rounded-md h-[250px] mb-12 border border-slate-200 overflow-hidden">
                  <ReactQuill theme="snow" value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} style={{ height: '200px', border: 'none' }} />
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              <button type="submit" disabled={submitting} className="btn-neo w-full justify-center disabled:opacity-60">
                {submitting ? 'Submitting…' : 'Submit Proposal'}
              </button>
              <Link to="/faculty/dashboard" className="btn-neo-secondary w-full justify-center text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
          <div className={`px-4 py-3 rounded-lg shadow-neo-sm flex items-center gap-3 text-sm font-bold ${toast.type === 'error' ? 'bg-highlight-orange text-primary' : 'bg-highlight-yellow text-primary'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })} className="ml-2 hover:opacity-70 transition-colors"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposeEvent;
