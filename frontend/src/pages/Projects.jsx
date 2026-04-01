import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ExternalLink,
  Github,
  Filter,
  Layers,
  User,
  Users,
  Plus,
  Bell,
  Terminal
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import EmptyState from '../components/ui/EmptyState';

const typeFilters = ['All', 'independent', 'collaborative'];

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [techStackQuery, setTechStackQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchActiveProjects();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, techStackQuery]);

  const fetchActiveProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (techStackQuery.trim()) params.append('techStack', techStackQuery.trim());

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects?${params.toString()}`, authHeaders());
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <>
      <section className="pt-32 pb-16 bg-bg relative overflow-hidden border-b border-border">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-[-50px] w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-[-50px] w-[300px] h-[300px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-float"></div>

        <div className="container-max mx-auto px-4 text-center relative z-10">
          <div className="inline-flex px-4 py-1.5 glass-panel rounded-full border border-accent/20 mb-6 items-center gap-2 shadow-glow-purple">
            <Terminal size={14} className="text-accent" />
            <span className="font-semibold uppercase tracking-[0.2em] text-xs text-secondary group-hover:text-white transition-colors">Innovation Portfolio</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black text-white mb-8 uppercase leading-[0.9] tracking-tight drop-shadow-2xl">
            Project <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400 filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Repository</span>
          </h1>

          <div className="max-w-3xl mx-auto glass-panel p-6 border-l-2 border-accent flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none"></div>
            <p className="text-secondary font-medium text-sm md:text-base text-left leading-relaxed relative z-10 w-full md:w-2/3">
              Explore active projects developed by CID-Cell members. Submit your own or join a collaborative neural network project.
            </p>
            <Link
              to="/projects/submit"
              className="btn-neo shrink-0 relative z-10 flex items-center gap-2"
            >
              <Plus size={16} /> SUBMIT PROJECT
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding min-h-[600px] relative">
        <div className="container-max mx-auto px-4 relative z-10">
          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-16 glass-panel p-4 md:p-6 rounded-2xl shadow-glass border border-white/5">
            {/* Search Inputs */}
            <div className="flex flex-col md:flex-row flex-1 w-full gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-border rounded-xl text-sm font-medium text-white placeholder-secondary focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all shadow-inner"
                />
              </div>
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="Filter by tech stack (e.g. React, Node)"
                  value={techStackQuery}
                  onChange={(e) => setTechStackQuery(e.target.value)}
                  className="w-full px-5 py-3 bg-white/[0.04] border border-border rounded-xl text-sm font-medium text-white placeholder-secondary focus:outline-none focus:border-accent-magenta/40 focus:bg-white/[0.08] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 shrink-0 bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
              <span className="hidden xl:flex items-center px-3 font-bold uppercase tracking-[0.2em] text-slate-500 text-[10px]">
                <Filter size={12} className="mr-2 text-accent" /> Filter:
              </span>
              {typeFilters.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-accent/20 text-white border border-accent/40 shadow-glow-purple'
                      : 'bg-transparent text-slate-400 border border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <div className="font-medium text-secondary text-sm tracking-widest uppercase">Fetching Knowledge Assets...</div>
             </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, index) => (
                <ScrollReveal key={project._id} delay={index * 50}>
                  <div
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="glass-card flex flex-col h-full transition-all duration-300 hover:shadow-glow-purple group cursor-pointer overflow-hidden hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-surface/50 border-b border-border overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-screen" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-secondary/30">
                          <Layers size={40} />
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-2">No Visual Asset</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-80 pointer-events-none"></div>

                      <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md border border-border/50 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase text-secondary group-hover:text-white group-hover:border-accent transition-colors shadow-glass">
                        {project.type}
                      </div>

                      {project.githubRepo?.toLowerCase().includes('github.com/cid-cell') && (
                        <div className="absolute top-4 left-4 bg-accent/20 border border-accent/50 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase shadow-glow-purple flex items-center gap-1.5 z-20 text-accent backdrop-blur-md">
                          <Github size={10} /> CID-CELL ORG
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-accent-blue/30 bg-accent-blue/10 text-accent-blue">
                          {project.type}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          {project.createdBy?._id === user?._id && project.pendingJoinRequests > 0 && (
                            <div 
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-accent-magenta/20 border border-accent-magenta/50 text-accent-magenta text-[10px] font-bold uppercase rounded-md shadow-glass cursor-pointer hover:bg-accent-magenta/30 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/${project._id}`);
                              }}
                              title="Pending Join Requests"
                            >
                              <Bell size={12} className="animate-pulse" />
                              {project.pendingJoinRequests}
                            </div>
                          )}
                          
                          {project.contributors && project.contributors.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary group-hover:text-accent-cyan transition-colors">
                              <Users size={12} /> {project.contributors.length}
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-white mb-3 leading-tight group-hover:text-accent transition-colors truncate">
                        {project.title}
                      </h3>

                      <p className="text-secondary text-sm font-medium leading-relaxed mb-6 flex-1 line-clamp-3 overflow-hidden">
                        {project.description}
                      </p>

                      <div className="mt-auto space-y-5">
                        {/* Tech chips */}
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.slice(0, 4).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-surface border border-border rounded-md text-[9px] font-bold uppercase tracking-wider text-secondary group-hover:border-white/10 transition-colors">{tech}</span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="px-2 py-1 text-[9px] font-bold tracking-wider text-secondary">+{project.techStack.length - 4}</span>
                            )}
                          </div>
                        )}

                        {/* Creator */}
                        <div className="flex items-center gap-3 px-3 py-2 bg-surface/50 border border-border rounded-xl group-hover:border-accent/30 group-hover:bg-accent/5 transition-all">
                          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-secondary shrink-0 shadow-glass group-hover:text-accent group-hover:border-accent/50 transition-colors">
                            <User size={14} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[8px] font-black text-secondary uppercase tracking-[0.2em] leading-none mb-1">Created By</span>
                            <span className="text-[11px] font-bold text-white truncate">
                              {project.createdBy?.username || 'CID Developer'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
                          <div className="flex gap-2">
                            {project.githubRepo && (
                              <button
                                onClick={(e) => { e.stopPropagation(); window.open(project.githubRepo, '_blank'); }}
                                className="w-8 h-8 rounded-md border border-border bg-surface flex items-center justify-center text-secondary hover:bg-white/10 hover:text-white transition-all shadow-glass"
                                title="View Source"
                              >
                                <Github size={14} />
                              </button>
                            )}
                            {project.deployedLink && (
                              <button
                                onClick={(e) => { e.stopPropagation(); window.open(project.deployedLink, '_blank'); }}
                                className="w-8 h-8 rounded-md border border-accent/30 bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 hover:text-white transition-all shadow-glow-purple"
                                title="Live Demo"
                              >
                                <ExternalLink size={14} />
                              </button>
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] group-hover:text-accent group-hover:translate-x-1 transition-all flex items-center gap-1">
                            Explore <span className="text-sm font-light">→</span>
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
            <div className="flex justify-center py-10 w-full max-w-2xl mx-auto">
              <EmptyState title="No Projects Found In Matrix" message="Adjust your active filters or query parameters to discover nodes." />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
