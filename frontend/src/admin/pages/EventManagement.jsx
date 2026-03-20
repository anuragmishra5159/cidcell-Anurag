import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import {
  Edit2,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  ExternalLink,
  Loader
} from 'lucide-react';
import { formatTime12h } from '../../utils/formatTime';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    organizerEmail: '',
    creatorName: '',
    userType: 'admin',
    category: 'tech',
    type: 'in-person',
    maxAttendees: 30,
    image: '',
    whatsappGroupLink: '',
    isScheduled: true
  });

  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const categories = [
    "trainig and mentorships",
    "tech",
    "cultural",
    "sports",
    "educational",
    "special"
  ];

  const userTypes = ["student", "member", "faculty", "HOD", "admin"];
  const eventTypes = ["virtual", "in-person"];

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
      setEvents(res.data);
    } catch (err) { 
        console.error(err); 
        showToast('Failed to load events', 'error');
    } finally {
        setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setIsEditMode(true);
      setSelectedId(event._id);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time || '',
        location: event.location,
        organizer: event.organizer,
        organizerEmail: event.organizerEmail,
        creatorName: event.creatorName || '',
        userType: event.userType || 'admin',
        category: event.category || 'tech',
        type: event.type || 'in-person',
        maxAttendees: event.maxAttendees || 30,
        image: event.image || '',
        whatsappGroupLink: event.whatsappGroupLink || '',
        isScheduled: event.isScheduled ?? true
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        organizerEmail: '',
        creatorName: '',
        userType: 'admin',
        category: 'tech',
        type: 'in-person',
        maxAttendees: 30,
        image: '',
        whatsappGroupLink: '',
        isScheduled: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/events/${selectedId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(events.map(ev => ev._id === selectedId ? res.data : ev));
        showToast('Event updated successfully');
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/events`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents([...events, res.data]);
        showToast('Event created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving event', 'error');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/events/${deleteConfirm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(ev => ev._id !== deleteConfirm.id));
      showToast('Event deleted successfully');
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, id: null }); }
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      ['Title', 'Date', 'Type', 'Organizer', 'Max Attendees', 'Status']
    ];
    events.forEach(event => {
      csvRows.push([
        `"${event.title.replace(/"/g, '""')}"`,
        new Date(event.date).toLocaleDateString(),
        event.type || 'N/A',
        `"${event.organizer || ''}"`,
        event.maxAttendees || 'Unlimited',
        event.isScheduled ? 'Scheduled' : 'Draft'
      ]);
    });
    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Event Management</h1>
            <p className="text-slate-500 text-sm mt-1">Organize and track CID Cell activities.</p>
          </div>
            <div className="flex gap-2">
              <button onClick={handleDownloadCSV} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-2">
                Download CSV
              </button>
              <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
                <Plus size={16} /> Create Event
              </button>
            </div>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" placeholder="Filter events by title..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg w-full outline-none text-sm transition-all bg-white border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500 font-medium text-sm">Loading events...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-5 py-4 w-[40%]">Event Details</th>
                  <th className="px-5 py-4 text-center">Date & Time</th>
                  <th className="px-5 py-4 text-center">Type</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.length > 0 ? filteredEvents.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm text-slate-800">{ev.title}</div>
                      <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">{ev.category}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="text-sm font-medium text-slate-700">{ev.date}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTime12h(ev.time)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${ev.type === 'virtual' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(ev)} className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirm({ isOpen: true, id: ev._id })} className="px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all bg-white text-rose-600 border-rose-200 hover:bg-rose-50">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                      <td colSpan="4" className="px-5 py-12 text-center text-slate-500">
                          No events found matching your search.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reworked Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditMode ? 'Edit Event' : 'Create New Event'}
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">Cancel</button>
            <button form="eventForm" type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors text-sm">Save Event Info</button>
          </>
        }
      >
        <form id="eventForm" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Event Details</h3>
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Event Title*</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Code Hackathon 2026" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Date*</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Time</label>
                <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Location*</label>
                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Venue or Link" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Event Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                  {eventTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                  {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Max Attendees</label>
                <input type="number" value={formData.maxAttendees} onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Organizer & Creator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Organizer Name*</label>
                <input type="text" required value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Organizer Email*</label>
                <input type="email" required value={formData.organizerEmail} onChange={e => setFormData({ ...formData, organizerEmail: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Creator Name</label>
                <input type="text" value={formData.creatorName} onChange={e => setFormData({ ...formData, creatorName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Creator Role</label>
                <select value={formData.userType} onChange={e => setFormData({ ...formData, userType: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                  {userTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Media & Communication</h3>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">WhatsApp Group Link*</label>
              <div className="relative">
                  <input type="text" required value={formData.whatsappGroupLink} onChange={e => setFormData({ ...formData, whatsappGroupLink: e.target.value })} className="w-full px-3 py-2 border border-emerald-200 bg-emerald-50/30 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="https://chat.whatsapp.com/..." />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Header Image URL</label>
              <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://example.com/image.jpg" />
            </div>
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description*</label>
                <div className="bg-white rounded-md h-[250px] mb-12">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={(val) => setFormData({ ...formData, description: val })} 
                    style={{ height: '200px' }} 
                  />
                </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="scheduled" checked={formData.isScheduled} onChange={e => setFormData({ ...formData, isScheduled: e.target.checked })} className="w-4 h-4 rounded text-indigo-600 border border-slate-300 focus:ring-indigo-500" />
              <label htmlFor="scheduled" className="text-sm font-medium text-slate-700 cursor-pointer">Publish Event Immediately</label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation via Portal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-200 animate-fade-in">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">Confirm Deletion</h3>
            <p className="text-slate-500 my-3 text-sm">Are you absolutely sure you want to delete this event? All associated registrations will be lost.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-sm transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm transition-all text-sm active:scale-95">Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
            <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
                {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                <p>{toast.message}</p>
                <button onClick={() => setToast({message: '', type: null})} className="ml-2 text-white/70 hover:text-white transition-colors">
                    <X size={14} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
