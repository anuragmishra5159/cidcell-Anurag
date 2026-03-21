import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function SubmitProject() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'independent',
    techStack: [],
    githubRepo: '',
    deployedLink: '',
    images: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newImage, setNewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: null });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 4000);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({ ...prev, techStack: [...prev.techStack, newSkill.trim()] }));
      setNewSkill('');
    }
  };
  const removeSkill = (i) => setFormData(prev => ({ ...prev, techStack: prev.techStack.filter((_, idx) => idx !== i) }));

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImage.trim()] }));
      setNewImage('');
    }
  };
  const removeImage = (i) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === 'independent' && !formData.githubRepo && !formData.deployedLink) {
      return showToast('Independent projects require a GitHub repo or deployed link.', 'error');
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Project submitted! It will now go through the review pipeline.', 'success');
      setTimeout(() => navigate('/projects/mine'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit project.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pt-32 pb-20 container-max mx-auto section-padding max-w-3xl">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>

        <h1 className="mb-2 uppercase font-black text-primary font-heading text-4xl">Submit a Project</h1>
        <p className="font-body normal-case tracking-normal text-primary/70 mb-10 border-l-4 border-primary pl-4">
          Submit your project for review. Independent projects go to Faculty review. Collaborative projects go through Mentor → Faculty → Admin.
        </p>

        <div className="neo-card p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">

              {/* Project Type Toggle */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3 text-primary">Project Type*</label>
                <div className="flex gap-4">
                  {['independent', 'collaborative'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`flex-1 py-4 px-6 border-3 border-primary font-black uppercase text-sm transition-all ${
                        formData.type === t
                          ? 'bg-primary text-white shadow-none translate-x-[2px] translate-y-[2px]'
                          : 'bg-white text-primary shadow-neo hover:-translate-y-1'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-bold mt-2 text-slate-500 italic">
                  {formData.type === 'independent'
                    ? '→ Reviewed by Faculty only. Requires a GitHub link or deployed URL.'
                    : '→ Goes through Mentor → Faculty → Admin review. Other students can join once active.'}
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-primary">Project Title*</label>
                <input
                  type="text" required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary bg-white text-sm outline-none focus:bg-slate-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.1)] font-bold text-primary"
                  placeholder="e.g. AI Threat Detection System"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-primary">Description*</label>
                <textarea
                  required rows="5"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary bg-white text-sm outline-none focus:bg-slate-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.1)] font-bold text-primary"
                  placeholder="Describe the project's goal, impact, and technical approach..."
                />
              </div>

              {/* Tech Stack Tags */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest">Technical Stack</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-3 py-2 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold"
                    placeholder="e.g. React, Python"
                  />
                  <button type="button" onClick={addSkill} className="px-3 bg-white border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-highlight-blue text-primary border-2 border-primary text-[10px] font-black uppercase flex items-center gap-2">
                      {tech}
                      <button type="button" onClick={() => removeSkill(i)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">GitHub Repository {formData.type === 'independent' && '*'}</label>
                  <input type="text" value={formData.githubRepo} onChange={e => setFormData({ ...formData, githubRepo: e.target.value })} className="w-full px-4 py-3 border-2 border-primary bg-white text-sm outline-none focus:bg-slate-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.1)] font-bold text-primary" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Deployed Link {formData.type === 'independent' && '*'}</label>
                  <input type="text" value={formData.deployedLink} onChange={e => setFormData({ ...formData, deployedLink: e.target.value })} className="w-full px-4 py-3 border-2 border-primary bg-white text-sm outline-none focus:bg-slate-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.1)] font-bold text-primary" placeholder="https://..." />
                </div>
              </div>

              {/* Image URLs */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest">Project Images (URLs)</label>
                <div className="flex gap-2">
                  <input type="text" value={newImage} onChange={e => setNewImage(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} className="flex-1 px-3 py-2 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold" placeholder="https://example.com/screenshot.png" />
                  <button type="button" onClick={addImage} className="px-3 bg-white border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, i) => (
                    <span key={i} className="px-2 py-1 bg-highlight-teal text-primary border-2 border-primary text-[10px] font-black flex items-center gap-2 max-w-xs truncate">
                      {img}
                      <button type="button" onClick={() => removeImage(i)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={submitting} className="flex-1 py-4 bg-primary text-white font-black uppercase text-sm border-2 border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Submitting…' : 'Submit for Review'}
              </button>
              <Link to="/projects" className="py-4 px-8 bg-white text-primary text-center font-black uppercase text-sm border-2 border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
          <div className={`px-4 py-3 border-2 border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 text-sm font-bold ${toast.type === 'error' ? 'bg-highlight-orange text-primary' : 'bg-highlight-green text-primary'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })} className="ml-2 hover:opacity-70"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
