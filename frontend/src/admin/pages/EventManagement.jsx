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
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [proposals, setProposals] = useState([]);

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
    isScheduled: true,
    registrationType: 'platform',
    externalLink: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, uploadData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setFormData(prev => ({ ...prev, image: res.data.url }));
      showToast('Image uploaded successfully');
    } catch (err) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

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

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [eventsRes, proposalsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/events`),
        axios.get(`${import.meta.env.VITE_API_URL}/events/proposals`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setEvents(eventsRes.data);
      setProposals(proposalsRes.data);
    } catch (err) { 
        console.error(err); 
        showToast('Failed to load data', 'error');
    } finally {
        setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleOpenModal = (event = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
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
        isScheduled: event.isScheduled ?? true,
        isPaid: event.isPaid || false,
        price: event.price || 0,
        registrationType: event.registrationType || 'platform',
        externalLink: event.externalLink || ''
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
        isScheduled: true,
        isPaid: false,
        price: 0,
        registrationType: 'platform',
        externalLink: ''
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

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/events/proposals/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(proposals.filter(p => p._id !== id));
      setEvents([res.data, ...events]);
      showToast('Proposal approved');
    } catch (err) { showToast('Approval failed', 'error'); }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/events/proposals/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(proposals.filter(p => p._id !== id));
      showToast('Proposal rejected');
    } catch (err) { showToast('Rejection failed', 'error'); }
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
    <div className="space-y-10 max-w-7xl mx-auto font-sans pb-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-4 border-primary pb-8">
          <div>
            <h1 className="text-3xl lg:text-3xl font-black text-primary uppercase tracking-tight">Event Oversight</h1>
            <div className="inline-block bg-highlight-blue border-2 border-primary px-3 py-0.5 mt-2 transform -rotate-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Global Activity Command</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleDownloadCSV} 
              className="px-6 py-3 bg-highlight-teal border-3 border-primary rounded-2xl text-primary font-black uppercase text-[10px] shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              Export Registry
            </button>
            <button 
              onClick={() => handleOpenModal()} 
              className="px-6 py-3 bg-highlight-blue border-3 border-primary rounded-2xl text-primary font-black uppercase text-[10px] shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={3} /> Initiate Event
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-6">
          <button 
            onClick={() => setActiveTab('events')} 
            className={`px-8 py-4 text-xs font-black uppercase border-3 rounded-2xl transition-all shadow-neo-mini ${
              activeTab === 'events' 
                ? 'bg-highlight-blue border-primary text-primary translate-x-[2px] translate-y-[2px] shadow-none' 
                : 'bg-white border-primary text-primary/40 hover:bg-highlight-blue/10'
            }`}
          >
            All Managed Events
          </button>
          <button 
            onClick={() => setActiveTab('proposals')} 
            className={`px-8 py-4 text-xs font-black uppercase border-3 rounded-2xl transition-all shadow-neo-mini relative overflow-visible ${
              activeTab === 'proposals' 
                ? 'bg-highlight-yellow border-primary text-primary translate-x-[2px] translate-y-[2px] shadow-none' 
                : 'bg-white border-primary text-primary/40 hover:bg-highlight-yellow/10'
            }`}
          >
            Pending Access Proposals
            {proposals.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-rose-500 border-2 border-primary text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center shadow-neo-mini animate-bounce">
                {proposals.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="relative group max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text" 
              placeholder="SEARCH THE ACTIVITY CALENDAR..."
              className="w-full bg-white border-3 border-primary rounded-xl py-3.5 pl-14 pr-6 outline-none shadow-neo-mini focus:shadow-neo transition-all font-black text-[10px] uppercase placeholder:text-primary/20"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 gap-6 bg-white border-4 border-primary shadow-neo rounded-3xl">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary rounded-full animate-ping opacity-20"></div>
                <Loader className="w-16 h-16 animate-spin absolute top-0 left-0 text-primary stroke-[3]" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Synchronizing Global Calendar...</p>
        </div>
      ) : (
        <div className="bg-white border-4 border-primary shadow-neo rounded-3xl overflow-hidden flex flex-col mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-highlight-blue border-b-4 border-primary text-primary">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Activity Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10 text-center">Temporal Marker</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10 text-center">Operational Mode</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Sanctions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-primary/10 font-sans">
                {activeTab === 'events' ? (
                  filteredEvents.length > 0 ? filteredEvents.map((ev) => (
                    <tr key={ev._id} className="hover:bg-highlight-blue/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-black text-sm text-primary uppercase leading-tight group-hover:translate-x-1 transition-transform">{ev.title}</p>
                          <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{ev.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{ev.date}</p>
                        <div className="text-[9px] font-black text-primary/40 uppercase mt-1 flex items-center justify-center gap-2">
                            <Clock className="w-3 h-3" /> {formatTime12h(ev.time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block border-2 border-primary px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-neo-mini ${ev.type === 'virtual' ? 'bg-highlight-pink' : 'bg-highlight-teal'}`}>
                          {ev.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenModal(ev)} className="w-9 h-9 border-2 border-primary rounded-xl bg-white flex items-center justify-center text-primary shadow-neo-mini hover:bg-highlight-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirm({ isOpen: true, id: ev._id })} className="w-9 h-9 border-2 border-primary rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-neo-mini hover:bg-rose-500 hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-primary/20">
                        <Search className="w-14 h-14 mx-auto mb-6 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-[0.2em]">Zero Activities Found</p>
                      </td>
                    </tr>
                  )
                ) : (
                  proposals.length > 0 ? proposals.map((ev) => (
                    <tr key={ev._id} className="hover:bg-highlight-yellow/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <p className="font-black text-base text-primary uppercase leading-tight group-hover:translate-x-1 transition-transform">{ev.title}</p>
                          <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                             <Users className="w-3 h-3" />
                             CATEGORY: {ev.category} • ORIGIN: {ev.proposedBy?.username || 'ANONYMOUS'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-xs font-black text-primary uppercase tracking-widest">{ev.date}</p>
                        <div className="text-[10px] font-black text-primary/40 uppercase mt-2 flex items-center justify-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> {formatTime12h(ev.time)}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-block border-2 border-primary px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-neo-mini ${ev.type === 'virtual' ? 'bg-highlight-pink' : 'bg-highlight-blue'}`}>
                          {ev.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                            <button onClick={() => handleOpenModal(ev, true)} className="w-10 h-10 border-2 border-primary rounded-xl bg-white flex items-center justify-center text-primary shadow-neo-mini hover:bg-highlight-blue hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" title="Inspect">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleApprove(ev._id)} className="w-10 h-10 border-2 border-primary rounded-xl bg-highlight-green flex items-center justify-center text-primary shadow-neo-mini hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(ev._id)} className="w-10 h-10 border-2 border-primary rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-neo-mini hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" title="Discard">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-primary/20">
                        <Users className="w-14 h-14 mx-auto mb-6 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-[0.2em]">Queue Fully Purged</p>
                      </td>
                    </tr>
                  )
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
        title={isViewOnly ? 'Proposal Details' : isEditMode ? 'Edit Event' : 'Create New Event'}
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">{isViewOnly ? 'Close' : 'Cancel'}</button>
            {!isViewOnly && (
              <button form="eventForm" type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors text-sm">Save Event Info</button>
            )}
          </>
        }
      >
        <form id="eventForm" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <fieldset disabled={isViewOnly} className="space-y-6">
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
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Event Type (Free/Paid)</label>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isPaidAdmin" checked={formData.isPaid} onChange={e => setFormData({ ...formData, isPaid: e.target.checked, price: e.target.checked ? formData.price : 0 })} className="w-4 h-4 rounded text-indigo-600 border border-slate-300 focus:ring-indigo-500" />
                  <label htmlFor="isPaidAdmin" className="text-sm font-medium text-slate-700 cursor-pointer">Paid Event</label>
                </div>
              </div>
              {formData.isPaid && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Price (₹)*</label>
                  <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 500" />
                </div>
              )}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Registration Type</label>
                  <select value={formData.registrationType} onChange={e => setFormData({ ...formData, registrationType: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                    <option value="platform">Via Platform (Internal)</option>
                    <option value="external">External Link (Unstop, GForms)</option>
                  </select>
                </div>
                {formData.registrationType === 'external' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Registration URL*</label>
                    <input type="url" required value={formData.externalLink} onChange={e => setFormData({ ...formData, externalLink: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://..." />
                  </div>
                )}
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
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Header Image</label>
              <div className="flex flex-col gap-3">
                {formData.image && (
                  <div className="relative group w-full aspect-video border-2 border-slate-200 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Event Preview" className="w-full h-full object-cover" />
                    {!isViewOnly && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                )}
                {!isViewOnly && (
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden" 
                      id="event-image-upload"
                    />
                    <label 
                      htmlFor="event-image-upload" 
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm font-medium ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImage ? 'Uploading...' : <><Plus size={16} /> {formData.image ? 'Change Image' : 'Upload Image'}</>}
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description*</label>
                <div className="bg-white rounded-md h-[250px] mb-12">
                  <ReactQuill 
                    theme="snow" 
                    readOnly={isViewOnly}
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
          </fieldset>
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
