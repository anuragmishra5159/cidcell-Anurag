import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Github, 
  Filter, 
  Layers, 
  User, 
  Calendar, 
  Users, 
  Plus,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';

const categories = ['All', 'web', 'ML', 'ai', 'Cyber Security', 'hardware', 'iot'];

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Submission Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: null });
  
  const [formData, setFormData] = useState({
    name: '',
    theme: 'web',
    description: '',
    techStack: [],
    github: '',
    liveLink: '',
    mentor: '',
    members: [],
    status: 'Proposed',
    year: new Date().getFullYear().toString(),
    imageUrl: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 4000);
  };

  const handleOpenModal = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setFormData({
      name: '', theme: 'web', description: '', techStack: [], github: '', liveLink: '', mentor: '', members: [], status: 'Proposed', year: new Date().getFullYear().toString(), imageUrl: ''
    });
    setIsModalOpen(true);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, techStack: [...formData.techStack, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) });
  };

  const addMember = () => {
    if (newMember.trim()) {
      setFormData({ ...formData, members: [...formData.members, newMember.trim()] });
      setNewMember('');
    }
  };

  const removeMember = (index) => {
    setFormData({ ...formData, members: formData.members.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Project submitted! Awaiting administrator approval.', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to submit project. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = active === 'All' 
    ? projects 
    : projects.filter((p) => p.theme.toLowerCase() === active.toLowerCase());

  return (
    <>
      <section className="pt-40 pb-20 bg-bg relative overflow-hidden border-b-3 border-primary">
        <div className="absolute top-20 right-[-50px] w-64 h-64 bg-highlight-purple rounded-full border-3 border-primary shadow-neo opacity-50 blur-sm"></div>
        <div className="absolute bottom-10 left-[-50px] w-40 h-40 bg-highlight-teal border-3 border-primary transform rotate-12 shadow-neo"></div>

        <div className="container-max mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform -rotate-1 mb-6 font-bold uppercase tracking-widest text-sm text-primary">
            Innovation Portfolio
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black text-primary mb-6 uppercase leading-none">
            Project <span className="bg-highlight-yellow px-2 border-3 border-primary transform -skew-x-6 inline-block">Repository</span>
          </h1>
          <p className="text-primary font-medium text-lg max-w-2xl mx-auto border-l-4 border-primary pl-4 bg-white/50 backdrop-blur-sm p-4 rounded shadow-neo-sm flex flex-col md:flex-row items-center gap-6">
            <span className="flex-1 text-left">Explore technical implementations and research developed by CID Cell members.</span>
            <button 
              onClick={handleOpenModal}
              className="bg-black text-white px-6 py-3 font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 shrink-0"
            >
              <Plus size={16} /> Submit Project
            </button>
          </p>
        </div>
      </section>

      <section className="section-padding bg-white min-h-[600px]">
        <div className="container-max mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="bg-white border-3 border-primary p-2 rounded-xl sm:rounded-full shadow-neo flex flex-wrap gap-2">
              <span className="flex items-center px-4 font-bold uppercase text-primary text-xs">
                 <Filter size={16} className="mr-2" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase border-2 transition-all ${
                    active === cat
                      ? 'bg-primary text-white border-primary transform translate-y-[1px]'
                      : 'bg-white text-primary border-transparent hover:border-primary hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 italic font-bold text-primary animate-pulse uppercase tracking-widest">Fetching Knowledge Assets...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, index) => (
                <ScrollReveal key={project._id} delay={index * 50}>
                  <div 
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex flex-col h-full bg-white border-3 border-primary shadow-neo transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 group cursor-pointer"
                  >
                    <div className="relative h-48 bg-slate-50 border-b-3 border-primary overflow-hidden">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                          <Layers size={40} />
                          <span className="text-[10px] font-bold uppercase mt-2">No Visual Asset</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white border-2 border-primary px-2 py-0.5 text-[9px] font-black uppercase shadow-neo-sm">
                        {project.status}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase px-2 py-1 border-2 border-primary bg-highlight-yellow shadow-neo-sm">
                          {project.theme}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 italic">
                          <Calendar size={12} /> {project.year}
                        </div>
                      </div>

                      <h3 className="font-heading text-xl font-black text-primary mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4 transition-all">
                        {project.name}
                      </h3>
                      
                      <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8 line-clamp-3 overflow-hidden">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-4 border-t-2 border-slate-50 space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase w-16 shrink-0">Developers</span>
                             <span className="text-[11px] font-bold text-slate-800 truncate">
                               {project.members && project.members.length > 0 ? project.members.join(', ') : 'CID Core Team'}
                             </span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase w-16 shrink-0">Mentor</span>
                             <span className="text-[11px] font-bold text-slate-800 truncate italic">
                               {project.mentor || 'Lead Developer'}
                             </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            {project.github && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); window.open(project.github, '_blank'); }}
                                className="p-1.5 border-2 border-slate-200 rounded-lg text-slate-400 hover:border-primary hover:text-primary hover:bg-slate-50 transition-all shadow-sm"
                                title="View Source"
                              >
                                <Github size={14} />
                              </button>
                            )}
                            {project.liveLink && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); window.open(project.liveLink, '_blank'); }}
                                className="p-1.5 border-2 border-slate-200 rounded-lg text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                                title="Live Demo"
                              >
                                <ExternalLink size={14} />
                              </button>
                            )}
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-primary transition-colors">
                            Details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 border-3 border-dashed border-slate-100 rounded-2xl">
              <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">No Projects Documented in this Domain</p>
            </div>
          )}
        </div>
      </section>

      {/* Submission Modal for Users */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-primary rounded shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-2xl my-8 overflow-hidden transform relative">
            <div className="p-4 border-b-4 border-primary flex justify-between items-center bg-highlight-yellow">
              <h3 className="font-heading font-black text-primary uppercase tracking-tight">Submit New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-primary p-1 hover:bg-red-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Project Name*</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"/>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Theme</label>
                    <select value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                      {categories.filter(c => c !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Year</label>
                    <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" placeholder="e.g. 2024"/>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Mentor (Optional)</label>
                    <input type="text" value={formData.mentor} onChange={e => setFormData({...formData, mentor: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" placeholder="Project guide/mentor name"/>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Image URL</label>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" placeholder="https://..."/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Executive Summary*</label>
                  <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" placeholder="Tell us about the project goal and impact..."></textarea>
                </div>

                {/* Tag based Tech Stack */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Technical Stack</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSkill} 
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.1)]" 
                      placeholder="e.g. React, Python"/>
                    <button type="button" onClick={addSkill} className="p-3 bg-white border-2 border-primary hover:bg-primary hover:text-white transition-all">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 border-l-4 border-slate-100 pl-3">
                    {formData.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-highlight-blue/10 text-primary border-2 border-primary text-[11px] font-black uppercase flex items-center gap-2">
                        {tech}
                        <button type="button" onClick={() => removeSkill(i)}><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tag based Members */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Development Team</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newMember} 
                      onChange={e => setNewMember(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
                      className="flex-1 p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.1)]" 
                      placeholder="Add member name"/>
                    <button type="button" onClick={addMember} className="p-3 bg-white border-2 border-primary hover:bg-primary hover:text-white transition-all">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 border-l-4 border-slate-100 pl-3">
                    {formData.members.map((member, i) => (
                      <span key={i} className="px-3 py-1 bg-highlight-teal text-primary border-2 border-primary text-[11px] font-black uppercase flex items-center gap-2">
                        {member}
                        <button type="button" onClick={() => removeMember(i)}><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">GitHub Repository Link</label>
                    <input type="text" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" placeholder="https://github.com/..."/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Public Live Link</label>
                    <input type="text" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className="w-full p-3 border-2 border-primary focus:bg-slate-50 outline-none text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]" placeholder="https://..."/>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t-4 border-primary bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase italic">* All submissions undergo administrative review before being public.</p>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 font-black uppercase text-xs text-slate-400 hover:text-primary transition-colors">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-black text-white font-black uppercase text-xs shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit to CID Cell'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Persistence Toast */}
      {toast.message && (
        <div className={`fixed bottom-10 right-10 z-[110] flex items-center gap-3 px-6 py-4 border-3 border-primary shadow-[8px_8px_0px_rgba(0,0,0,1)] text-primary font-black uppercase text-xs ${toast.type === 'error' ? 'bg-red-400' : 'bg-highlight-green'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <p>{toast.message}</p>
          <button onClick={() => setToast({message: '', type: null})}><X size={16}/></button>
        </div>
      )}
    </>
  );
}
