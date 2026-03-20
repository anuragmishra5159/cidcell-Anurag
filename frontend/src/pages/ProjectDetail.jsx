import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Github, 
  ExternalLink, 
  ChevronLeft, 
  User, 
  Calendar, 
  Tag, 
  Users, 
  Layers, 
  Info,
  Clock
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
        const found = res.data.find(p => p._id === id);
        setProject(found);
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-40 flex items-center justify-center font-bold text-primary animate-pulse">
      Requesting Asset Details...
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-40 text-center">
      <h2 className="text-2xl font-black text-primary mb-4">Asset Not Found</h2>
      <Link to="/projects" className="text-blue-600 font-bold hover:underline italic">Return to Repository</Link>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pb-20">
      {/* Detail Header */}
      <section className="pt-32 pb-16 bg-white border-b-3 border-primary relative overflow-hidden">
        <div className="container-max mx-auto px-4 relative z-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-8 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-highlight-yellow border-2 border-primary text-[10px] font-black uppercase shadow-neo-sm">
                  {project.theme}
                </span>
                <span className="px-3 py-1 bg-white border-2 border-primary text-[10px] font-black uppercase shadow-neo-sm">
                  {project.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight uppercase leading-none">
                {project.name}
              </h1>
            </div>
            
            <div className="flex gap-4">
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Source <Github size={16} />
                </a>
              )}
              {project.liveLink && (
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white border-2 border-primary font-bold uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Live Demo <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-max mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Preview */}
            <div className={`aspect-video w-full rounded-2xl border-3 border-primary shadow-neo overflow-hidden bg-slate-50 ${!project.imageUrl && 'flex flex-col items-center justify-center text-slate-200'}`}>
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Layers size={80} strokeWidth={1} />
                  <p className="font-black uppercase tracking-tighter mt-4 text-sm">Visual Documentation Unavailable</p>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-8 md:p-12 border-3 border-primary shadow-neo rounded-2xl">
              <h2 className="flex items-center gap-3 text-2xl font-black text-primary uppercase mb-6 italic">
                <Info size={24} className="text-blue-600" /> Executive Summary
              </h2>
              <div className="prose prose-slate max-w-none">
                <div 
                  className="text-slate-600 text-lg leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            </div>

            {/* Technical Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b-2 border-slate-50 pb-2">Technical Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-600 text-[11px] font-bold uppercase rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b-2 border-slate-50 pb-2">Development Team</h3>
                <div className="space-y-3">
                  {project.members?.map((member, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                      <div className="w-2 h-2 rounded-full bg-highlight-teal"></div>
                      {member}
                    </div>
                  ))}
                  {(!project.members || project.members.length === 0) && (
                    <p className="text-slate-300 italic text-sm">No members documented</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 border-3 border-primary shadow-neo rounded-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white/50 italic">Registry Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Project Mentor</p>
                    <p className="font-bold text-sm">{project.mentor || 'CID Cell Lead'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight-yellow">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Deployment Year</p>
                    <p className="font-bold text-sm">{project.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight-teal">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Current Status</p>
                    <p className="font-bold text-sm">{project.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight-purple">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Primary Domain</p>
                    <p className="font-bold text-sm uppercase">{project.theme}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Want to collaborate?</p>
              <p className="text-sm font-bold text-primary mb-6">Contact CID Cell to get in touch with this project's development team.</p>
              <Link to="/contact" className="block w-full py-3 bg-slate-50 border-2 border-primary text-primary font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
