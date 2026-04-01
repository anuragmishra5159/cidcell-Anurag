import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, AlertTriangle, CheckCircle, ArrowLeft, Upload, Code2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { compressImage } from '../utils/compressImage';

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
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedFile = await compressImage(file, 1200, 1200, 0.75);
      const uploadData = new FormData();
      uploadData.append('image', compressedFile);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, uploadData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
      showToast('Image uploaded successfully!');
    } catch (err) {
      showToast('Failed to upload image.', 'error');
    } finally {
      setUploadingImage(false);
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
    <div className="min-h-screen bg-bg text-white relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-[-100px] w-[600px] h-[600px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="pt-32 pb-20 container-max mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Matrix
        </Link>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-6 shadow-glow-purple mx-auto">
             <Code2 size={24} className="text-accent" />
          </div>
          <h1 className="uppercase font-black text-white font-heading text-4xl md:text-5xl mb-4 tracking-wider">Initialize Project</h1>
          <p className="font-medium text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed glass-panel p-3 border-l-2 border-accent">
            Submit your node into the network. Independent nodes go to Faculty review. Collaborative nodes sync through Mentor → Faculty → Admin.
          </p>
        </div>

        <div className="glass-panel p-6 md:p-10 border border-white/10 shadow-glass rounded-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-glow-accent rounded-full rounded-full pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="space-y-8">

              {/* Project Type Toggle */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-400 pl-1">Protocol Type *</label>
                <div className="flex gap-4">
                  {['independent', 'collaborative'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`flex-1 py-4 px-4 rounded-xl border font-bold uppercase tracking-widest text-xs transition-all ${
                        formData.type === t
                          ? 'bg-accent/20 text-accent border-accent/50 shadow-glow-purple'
                          : 'bg-surface text-slate-400 border-white/5 hover:border-white/10 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-medium mt-3 text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  {formData.type === 'independent'
                    ? 'Reviewed by Faculty only. Requires a verified GitHub or Host Link.'
                    : 'Full network review. External nodes (students) can connect once authorized.'}
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 pl-1">Project Identifier *</label>
                <input
                  type="text" required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium"
                  placeholder="e.g. AI Threat Detection System"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 pl-1">Core Objectives *</label>
                <textarea
                  required rows="5"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium resize-none"
                  placeholder="Describe the system architecture, goals, and technical impacts..."
                />
              </div>

              {/* Tech Stack Tags */}
              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 pl-1">Tech Stack *</label>
                <div className="flex gap-3">
                  <input
                    type="text" value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium"
                    placeholder="e.g. React, Python"
                  />
                  <button type="button" onClick={addSkill} className="px-5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all font-bold shadow-[0_0_15px_rgba(139,92,246,0.2)] border border-accent/50 shrink-0">
                    <Plus size={20} />
                  </button>
                </div>
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-4 bg-surface border border-white/5 rounded-xl">
                    {formData.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/30 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-glass">
                        {tech}
                        <button type="button" onClick={() => removeSkill(i)} className="hover:text-white hover:bg-accent/50 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 pl-1">Source Node URL {formData.type === 'independent' && '*'}</label>
                  <input type="text" value={formData.githubRepo} onChange={e => setFormData({ ...formData, githubRepo: e.target.value })} className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 pl-1">Live Endpoint URL {formData.type === 'independent' && '*'}</label>
                  <input type="text" value={formData.deployedLink} onChange={e => setFormData({ ...formData, deployedLink: e.target.value })} className="w-full px-5 py-4 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium" placeholder="https://..." />
                </div>
              </div>

              {/* Project Images */}
              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 pl-1">Visual Assets</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden" 
                      id="project-image-upload"
                    />
                    <label 
                      htmlFor="project-image-upload" 
                      className={`w-full flex items-center justify-center gap-3 px-5 py-6 border border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/5 hover:border-accent/50 transition-all text-sm font-bold text-slate-400 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingImage ? 'Transmitting Data...' : <><Upload size={18} className="text-accent" /> Uplink Image Asset</>}
                    </label>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group rounded-xl border border-white/10 overflow-hidden aspect-video shadow-glass">
                        <img src={img} alt={`Asset ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
              <button type="submit" disabled={submitting} className="flex-[2] py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting ? 'Authenticating...' : 'Transmit Protocol'}
              </button>
              <Link to="/projects" className="flex-1 py-4 rounded-xl bg-surface border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20 text-center font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center">
                Abort
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
           <div className={`px-5 py-4 rounded-xl border font-bold shadow-glass backdrop-blur-md flex items-center gap-3 text-sm ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            <p className="tracking-wide">{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })} className="ml-3 hover:text-white transition-colors"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
