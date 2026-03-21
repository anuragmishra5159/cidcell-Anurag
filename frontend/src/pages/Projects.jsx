import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  ExternalLink,
  Github,
  Filter,
  Layers,
  User,
  Users,
  Plus,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';

const typeFilters = ['All', 'independent', 'collaborative'];

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveProjects();
  }, []);

  const fetchActiveProjects = async () => {
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

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <>
      <section className="pt-32 pb-16 bg-bg relative overflow-hidden border-b-3 border-primary">
        <div className="absolute top-1/4 right-[-50px] w-64 h-64 bg-highlight-purple rounded-full border-3 border-primary shadow-neo opacity-30 blur-sm pointer-events-none"></div>
        <div className="absolute bottom-10 left-[-50px] w-40 h-40 bg-highlight-teal border-3 border-primary transform rotate-12 shadow-neo pointer-events-none"></div>

        <div className="container-max mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform -rotate-1 mb-6 font-bold uppercase tracking-widest text-xs sm:text-sm text-primary">
            Innovation Portfolio
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-primary mb-8 uppercase leading-none">
            Project <span className="bg-highlight-yellow px-2 border-3 border-primary transform -skew-x-6 inline-block">Repository</span>
          </h1>

          <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-sm p-4 md:p-6 border-l-4 border-primary shadow-neo-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
            <p className="text-primary font-medium text-base md:text-lg text-left leading-relaxed">
              Explore active projects developed by CID Cell members. Submit your own or join a collaborative project.
            </p>
            <Link
              to="/projects/submit"
              className="bg-black text-white px-8 py-3.5 font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 shrink-0 border-2 border-primary"
            >
              <Plus size={18} /> Submit Project
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white min-h-[600px]">
        <div className="container-max mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="bg-white border-3 border-primary p-2 rounded-xl sm:rounded-full shadow-neo flex flex-wrap gap-2">
              <span className="flex items-center px-4 font-bold uppercase text-primary text-xs">
                <Filter size={16} className="mr-2" /> Type:
              </span>
              {typeFilters.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase border-2 transition-all ${
                    activeFilter === cat
                      ? 'bg-primary text-white border-primary translate-y-[1px]'
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
                    {/* Image */}
                    <div className="relative h-48 bg-slate-50 border-b-3 border-primary overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                          <Layers size={40} />
                          <span className="text-[10px] font-bold uppercase mt-2">No Visual Asset</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white border-2 border-primary px-2 py-0.5 text-[9px] font-black uppercase shadow-neo-sm">
                        {project.type}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase px-2 py-1 border-2 border-primary bg-highlight-yellow shadow-neo-sm">
                          {project.type}
                        </span>
                        {project.contributors && project.contributors.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400">
                            <Users size={12} /> {project.contributors.length} contributors
                          </div>
                        )}
                      </div>

                      <h3 className="font-heading text-xl font-black text-primary mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4 transition-all">
                        {project.title}
                      </h3>

                      <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 line-clamp-3 overflow-hidden">
                        {project.description}
                      </p>

                      <div className="mt-auto space-y-4">
                        {/* Tech chips */}
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.slice(0, 4).map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase text-slate-500">{tech}</span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="px-2 py-0.5 text-[10px] font-bold text-slate-400">+{project.techStack.length - 4}</span>
                            )}
                          </div>
                        )}

                        {/* Creator */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl group-hover:border-primary/20 transition-colors">
                          <div className="w-8 h-8 bg-white border-2 border-primary flex items-center justify-center text-primary shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform">
                            <User size={14} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5 tracking-tighter">Created By</span>
                            <span className="text-[11px] font-black text-primary truncate">
                              {project.createdBy?.username || 'CID Developer'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            {project.githubRepo && (
                              <button
                                onClick={(e) => { e.stopPropagation(); window.open(project.githubRepo, '_blank'); }}
                                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black hover:bg-highlight-blue hover:text-primary transition-all shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                                title="View Source"
                              >
                                <Github size={16} />
                              </button>
                            )}
                            {project.deployedLink && (
                              <button
                                onClick={(e) => { e.stopPropagation(); window.open(project.deployedLink, '_blank'); }}
                                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black hover:bg-highlight-green hover:text-green-800 transition-all shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                                title="Live Demo"
                              >
                                <ExternalLink size={16} />
                              </button>
                            )}
                          </div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            View Details <span className="text-sm font-light">&rarr;</span>
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
              <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">No Projects Found</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
