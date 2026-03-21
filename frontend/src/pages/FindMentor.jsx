import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';
import { Linkedin, Github, Code2, MessageCircle } from 'lucide-react';

// Static Mock Data
const staticMentors = [
  {
    _id: '1',
    designation: 'Senior Mentor',
    domain: 'Full Stack Development',
    user: {
      _id: 'user1',
      username: 'Rahul Sharma',
      batch: '2021-2025',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/rahulsharma',
        github: 'https://github.com/rahulsharma',
        leetcode: 'https://leetcode.com/rahulsharma'
      }
    }
  },
  {
    _id: '2',
    designation: 'Mentor',
    domain: 'Full Stack Development',
    user: {
      _id: 'user2',
      username: 'Priya Verma',
      batch: '2022-2026',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/priyaverma',
        github: 'https://github.com/priyaverma',
        leetcode: ''
      }
    }
  },
  {
    _id: '3',
    designation: 'Lead Mentor',
    domain: 'AI/ML',
    user: {
      _id: 'user3',
      username: 'Aditya Patel',
      batch: '2021-2025',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/adityapatel',
        github: 'https://github.com/adityapatel',
        leetcode: 'https://leetcode.com/adityapatel'
      }
    }
  },
  {
    _id: '4',
    designation: 'Mentor',
    domain: 'AI/ML',
    user: {
      _id: 'user4',
      username: 'Neha Singh',
      batch: '2022-2026',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/nehasingh',
        github: 'https://github.com/nehasingh',
        leetcode: 'https://leetcode.com/nehasingh'
      }
    }
  },
  {
    _id: '5',
    designation: 'Senior Mentor',
    domain: 'UI/UX Design',
    user: {
      _id: 'user5',
      username: 'Arjun Kumar',
      batch: '2021-2025',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/arjunkumar',
        github: 'https://github.com/arjunkumar',
        leetcode: ''
      }
    }
  },
  {
    _id: '6',
    designation: 'Mentor',
    domain: 'UI/UX Design',
    user: {
      _id: 'user6',
      username: 'Divya Reddy',
      batch: '2022-2026',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/divyareddy',
        github: 'https://github.com/divyareddy',
        leetcode: ''
      }
    }
  },
  {
    _id: '7',
    designation: 'Lead Mentor',
    domain: 'Mobile Development',
    user: {
      _id: 'user7',
      username: 'Rohit Gupta',
      batch: '2021-2025',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/rohitgupta',
        github: 'https://github.com/rohitgupta',
        leetcode: 'https://leetcode.com/rohitgupta'
      }
    }
  },
  {
    _id: '8',
    designation: 'Mentor',
    domain: 'Mobile Development',
    user: {
      _id: 'user8',
      username: 'Sakshi Nair',
      batch: '2022-2026',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sakshi-nair',
        github: 'https://github.com/sakshinnair',
        leetcode: 'https://leetcode.com/sakshi-nair'
      }
    }
  },
  {
    _id: '9',
    designation: 'Senior Mentor',
    domain: 'DevOps & Cloud',
    user: {
      _id: 'user9',
      username: 'Vivek Mishra',
      batch: '2021-2025',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/vivekmishra',
        github: 'https://github.com/vivekmishra',
        leetcode: ''
      }
    }
  },
  {
    _id: '10',
    designation: 'Mentor',
    domain: 'Competitive Programming',
    user: {
      _id: 'user10',
      username: 'Ananya Chakraborty',
      batch: '2022-2026',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ananya-chakraborty',
        github: 'https://github.com/ananyachakraborty',
        leetcode: 'https://leetcode.com/ananyachakraborty'
      }
    }
  },
  {
    _id: '11',
    designation: 'Lead Mentor',
    domain: 'Competitive Programming',
    user: {
      _id: 'user11',
      username: 'Harsh Patel',
      batch: '2021-2025',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/harshpatel',
        github: 'https://github.com/harshpatel',
        leetcode: 'https://leetcode.com/harshpatel'
      }
    }
  },
  {
    _id: '12',
    designation: 'Mentor',
    domain: 'Data Science',
    user: {
      _id: 'user12',
      username: 'Sneha Desai',
      batch: '2022-2026',
      branch: 'CSE',
      profilePicture: '',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/snehadesai',
        github: 'https://github.com/snehadesai',
        leetcode: ''
      }
    }
  }
];

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function MentorCard({ mentor, delay }) {
  const navigate = useNavigate();
  const name = mentor.user?.username || 'Unknown';
  const designation = mentor.designation || 'Mentor';
  const domain = mentor.domain || 'General';
  const profilePicture = mentor.user?.profilePicture;
  const linkedin = mentor.user?.socialLinks?.linkedin;
  const github = mentor.user?.socialLinks?.github;
  const leetcode = mentor.user?.socialLinks?.leetcode;
  const branch = mentor.user?.branch;
  const batch = mentor.user?.batch;
  const mentorId = mentor.user?._id;

  const accentColors = [
    'bg-highlight-blue',
    'bg-highlight-green',
    'bg-highlight-yellow',
    'bg-highlight-orange',
    'bg-highlight-purple',
    'bg-highlight-pink',
  ];

  // Derive accent color consistently based on name
  const accentClass = accentColors[Math.abs(name.charCodeAt(0) % accentColors.length)];

  const handleChat = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Login first to chat with mentor..');
      navigate('/auth');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/doubts/sessions`, {
        mentorId: mentorId,
        domain: domain
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/student/chat', { state: { selectedSessionId: res.data._id } });
    } catch (err) {
      console.error('Error starting chat session:', err);
      alert('Failed to start chat session. Please try again.');
    }
  };

  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="bg-white border-2 lg:border-3 border-primary shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300 flex flex-col h-full overflow-hidden flex-1 group">
        
        {/* Top Banner */}
        <div className={`h-24 md:h-28 ${accentClass} border-b-2 lg:border-b-3 border-primary relative overflow-hidden p-4 flex justify-end items-start`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-[2.5]"></div>
          
          {/* Domain Tag */}
          {domain && (
            <span className="bg-white text-primary border-2 border-primary px-3 py-1 text-[10px] font-bold uppercase z-10 shadow-neo-sm transform rotate-2 group-hover:rotate-0 transition-transform">
              {domain}
            </span>
          )}
        </div>
        
        {/* Content Area */}
        <div className="px-5 pb-6 pt-0 flex flex-col flex-grow items-center relative -mt-12 text-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Avatar */}
          <div className="w-24 h-24 bg-white border-2 lg:border-3 border-primary shadow-neo flex items-center justify-center mb-4 transform -rotate-3 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 z-10 overflow-hidden">
            {profilePicture ? (
              <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading font-black text-3xl text-primary leading-none tracking-widest">
                {getInitials(name)}
              </span>
            )}
          </div>

          {/* Name and Designation */}
          <h3 className="font-heading font-black text-2xl text-primary uppercase leading-tight mb-2 tracking-widest line-clamp-2">
            {name}
          </h3>
          <p className="inline-block bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider transform -rotate-1 mb-4 shadow-neo-sm">
            {designation}
          </p>

          {/* Batch and Branch */}
          {(batch || branch) && (
            <div className="text-[11px] font-bold text-primary/70 uppercase tracking-widest mb-6 flex flex-wrap gap-2 justify-center">
              {branch && <span className="bg-white px-2 py-0.5 border-2 border-primary/20 rounded shadow-sm">{branch}</span>}
              {batch && <span className="bg-white px-2 py-0.5 border-2 border-primary/20 rounded shadow-sm">{batch}</span>}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-auto w-full pt-4 flex flex-col gap-4 border-t-2 border-primary/10 bg-white/50 backdrop-blur-sm -mx-5 px-5 -mb-6 pb-6">
            <button
              onClick={handleChat}
              className="w-full bg-highlight-yellow text-primary border-2 border-primary px-4 py-3 font-heading font-bold uppercase tracking-wider text-sm shadow-neo transition-all duration-200 hover:bg-highlight-orange hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2"
              title="Chat with Mentor"
            >
              <MessageCircle size={20} />
              Start Chat
            </button>

            {/* Social Links */}
            {(linkedin || github || leetcode) && (
              <div className="flex gap-3 justify-center">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border-2 border-primary shadow-neo-sm bg-highlight-blue hover:bg-white text-primary transition-all hover:-translate-y-1 hover:shadow-neo rounded-full"
                    title="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border-2 border-primary shadow-neo-sm bg-highlight-purple hover:bg-white text-primary transition-all hover:-translate-y-1 hover:shadow-neo rounded-full"
                    title="GitHub"
                  >
                    <Github size={18} />
                  </a>
                )}
                {leetcode && (
                  <a
                    href={leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border-2 border-primary shadow-neo-sm bg-highlight-pink hover:bg-white text-primary transition-all hover:-translate-y-1 hover:shadow-neo rounded-full"
                    title="LeetCode"
                  >
                    <Code2 size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function MentorHub() {
  const [mentors, setMentors] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/mentors`);

      const mapped = res.data.map(m => ({
          _id: m._id,
          designation: 'Mentor',
          domain: m.domainOfExpertise,
          expertise: m.expertise || [],
          aboutMentor: m.aboutMentor || '',
          user: {
              _id: m._id,
              username: m.username,
              profilePicture: m.profilePicture,
              branch: m.department,
          }
      }));

      const mentorsWithDomain = mapped.filter(member => member.domain && member.domain.trim() !== '');
      setMentors(mentorsWithDomain);

      // Extract unique domains
      const uniqueDomains = [...new Set(mentorsWithDomain.map(m => m.domain))].sort();
      setDomains(uniqueDomains);

      // Set the first domain as selected by default
      if (uniqueDomains.length > 0) {
        setSelectedDomain(uniqueDomains[0]);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get mentors for selected domain
  const filteredMentors = selectedDomain
    ? mentors.filter(mentor => mentor.domain === selectedDomain)
    : mentors;

  return (
    <div className="min-h-screen bg-bg bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Hero Section */}
      <div className="relative bg-highlight-blue border-b-4 border-primary pt-32 pb-20 px-4 overflow-hidden mb-12">
        {/* Background Decorative patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 border-8 border-primary rounded-full bg-highlight-yellow opacity-50 translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-highlight-pink rounded-none rotate-45 -translate-x-1/2 translate-y-1/2 border-8 border-primary"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-highlight-yellow border-2 border-primary text-primary font-bold uppercase tracking-widest text-sm shadow-neo transform -rotate-2">
            Learn From The Best
          </div>
            <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-primary uppercase leading-tight mb-6 tracking-widest">
            Mentor <span className="text-white drop-shadow-[3px_3px_0_theme('colors.primary')]">Hub</span>
          </h1>
          <p className="font-sans font-medium text-lg md:text-2xl text-primary/80 max-w-3xl mx-auto border-t-4 border-primary/20 pt-8 mt-4">
            Connect with experienced domain experts, accelerate your learning journey, and get the guidance you need to reach the next level.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-8 border-primary border-t-highlight-blue rounded-full animate-spin shadow-neo mb-6"></div>
              <p className="text-2xl font-heading font-black text-primary uppercase animate-pulse">Loading Elite Mentors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white border-4 border-primary p-8 shadow-neo max-w-md mx-auto text-center transform rotate-1">
              <p className="text-red-500 font-heading font-black text-2xl uppercase mb-4">Error!</p>
              <p className="font-bold">{error}</p>
            </div>
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-highlight-yellow border-4 border-primary p-8 shadow-neo max-w-md mx-auto transform -rotate-1">
              <p className="text-primary font-heading font-black text-2xl uppercase">No mentors available</p>
              <p className="font-bold mt-2">Please check back later.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Domain Filter Section */}
            <ScrollReveal className="mb-16">
              <div className="flex flex-col items-center">
                <SectionHeading title="Select Domain" subtitle="Filter by Expertise" />
                
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-10">
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className={`px-6 py-3 border-2 border-primary font-heading font-bold uppercase tracking-wider text-sm transition-all duration-200 ${
                      selectedDomain === null
                        ? 'bg-primary text-white shadow-neo translate-x-[2px] translate-y-[2px]'
                        : 'bg-white text-primary hover:bg-highlight-yellow shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                    }`}
                  >
                    All Mentors 
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs border border-current ${selectedDomain === null ? 'bg-white/20' : 'bg-primary/10'}`}>
                      {mentors.length}
                    </span>
                  </button>

                  {domains.map((domain) => {
                    const count = mentors.filter(m => m.domain === domain).length;
                    const accentColors = [
                      'highlight-blue',
                      'highlight-green',
                      'highlight-yellow',
                      'highlight-orange',
                      'highlight-purple',
                      'highlight-pink',
                    ];
                    const bgClass =
                      accentColors[domains.indexOf(domain) % accentColors.length];

                    return (
                      <button
                        key={domain}
                        onClick={() => setSelectedDomain(domain)}
                        className={`px-6 py-3 border-2 border-primary font-heading font-bold uppercase tracking-wider text-sm transition-all duration-200 ${
                          selectedDomain === domain
                            ? `bg-primary shadow-neo text-white translate-x-[2px] translate-y-[2px]`
                            : `bg-white hover:bg-${bgClass} text-primary shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`
                        }`}
                      >
                        {domain}
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs border border-current ${selectedDomain === domain ? 'bg-white/20' : 'bg-primary/10'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Mentors Grid */}
            <div className="mb-20">
              {selectedDomain && (
                <div className="flex items-center gap-4 mb-8 pb-4 border-b-4 border-primary">
                  <h2 className="font-heading font-black text-3xl md:text-5xl text-primary uppercase tracking-widest">
                    {selectedDomain}
                  </h2>
                  <span className="bg-highlight-yellow border-2 border-primary px-3 py-1 font-bold text-sm shadow-neo-sm transform rotate-2">
                    {filteredMentors.length} AVAILABLE
                  </span>
                </div>
              )}

              {filteredMentors.length === 0 ? (
                <div className="text-center py-24">
                  <div className="bg-white border-4 border-primary border-dashed p-10 max-w-lg mx-auto">
                    <p className="text-primary font-heading font-black text-3xl uppercase opacity-50 tracking-widest">
                      No mentors found
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-8 lg:gap-10 items-stretch">
                  {filteredMentors.map((mentor, index) => (
                    <MentorCard key={mentor._id} mentor={mentor} delay={index * 100} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Stats Section */}
      {!loading && mentors.length > 0 && (
        <ScrollReveal className="bg-primary text-white border-t-4 border-primary relative overflow-hidden py-16 px-4">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px]"></div>
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="bg-white/5 border-2 border-white/20 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-5xl md:text-7xl font-heading font-black mb-2 text-highlight-yellow drop-shadow-md">
                {mentors.length}
              </p>
              <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white/80">Total Mentors</p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-5xl md:text-7xl font-heading font-black mb-2 text-highlight-pink drop-shadow-md">
                {domains.length}
              </p>
              <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white/80">Domains</p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-5xl md:text-7xl font-heading font-black mb-2 text-highlight-green drop-shadow-md">
                {new Set(mentors.map(m => m.user?._id)).size}
              </p>
              <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white/80">Unique Experts</p>
            </div>
            <div className="bg-white/5 border-2 border-white/20 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-5xl md:text-7xl font-heading font-black mb-2 text-highlight-blue drop-shadow-md">
                24/7
              </p>
              <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white/80">Guidance</p>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
