import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader, AlertTriangle, ArrowLeft, ExternalLink, Github } from 'lucide-react';

const statusColors = {
  draft: 'bg-slate-200 text-slate-600',
  pending_mentor_review: 'bg-highlight-yellow text-primary',
  pending_faculty_review: 'bg-highlight-yellow text-primary',
  pending_admin_approval: 'bg-highlight-yellow text-primary',
  active: 'bg-green-300 text-green-900',
  rejected: 'bg-red-300 text-red-900',
  completed: 'bg-blue-300 text-blue-900',
  inactive: 'bg-slate-300 text-slate-700',
};

const statusLabels = {
  draft: 'Draft',
  pending_mentor_review: 'Pending Mentor Review',
  pending_faculty_review: 'Pending Faculty Review',
  pending_admin_approval: 'Pending Admin Approval',
  active: 'Active',
  rejected: 'Rejected',
  completed: 'Completed',
  inactive: 'Inactive',
};

export default function MyProjects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/mine/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load your projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <div className="pt-32 pb-20 container-max mx-auto section-padding">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>

        <h1 className="mb-2 uppercase font-black text-primary font-heading text-4xl">My Projects</h1>
        <p className="font-body normal-case tracking-normal text-primary/70 mb-10 border-l-4 border-primary pl-4">
          Track the review status of all projects you've submitted.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        ) : error ? (
          <div className="neo-card p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={32} />
            <p className="font-bold text-red-600">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="neo-card p-12 text-center">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm mb-4">No projects submitted yet</p>
            <Link to="/projects/submit" className="btn-neo inline-block">Submit Your First Project</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map(project => (
              <div key={project._id} className="neo-card p-6 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-heading text-xl font-black text-primary uppercase leading-tight">{project.title}</h3>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase border-2 border-primary ${statusColors[project.status] || 'bg-slate-100'}`}>
                        {statusLabels[project.status] || project.status}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-slate-300 text-slate-500">
                        {project.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium line-clamp-2 mb-3">{project.description}</p>

                    {/* Tech stack chips */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase text-slate-500">{tech}</span>
                        ))}
                      </div>
                    )}

                    {/* Rejection feedback */}
                    {project.status === 'rejected' && (
                      <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded">
                        <p className="text-[10px] font-black uppercase text-red-500 mb-1">Rejection Feedback</p>
                        {project.mentorFeedback && <p className="text-xs text-red-700 font-medium"><strong>Mentor:</strong> {project.mentorFeedback}</p>}
                        {project.facultyFeedback && <p className="text-xs text-red-700 font-medium"><strong>Faculty:</strong> {project.facultyFeedback}</p>}
                        {project.adminFeedback && <p className="text-xs text-red-700 font-medium"><strong>Admin:</strong> {project.adminFeedback}</p>}
                        {!project.mentorFeedback && !project.facultyFeedback && !project.adminFeedback && <p className="text-xs text-red-600 italic">No feedback provided.</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {project.githubRepo && (
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border-2 border-primary bg-white flex items-center justify-center hover:bg-highlight-blue transition-all shadow-neo-sm hover:shadow-none">
                        <Github size={16} />
                      </a>
                    )}
                    {project.deployedLink && (
                      <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border-2 border-primary bg-white flex items-center justify-center hover:bg-highlight-green transition-all shadow-neo-sm hover:shadow-none">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
