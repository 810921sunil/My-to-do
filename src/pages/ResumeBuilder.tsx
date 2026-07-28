import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface ResumeData {
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    cgpa: string;
    year: string;
  }>;
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
  };
  projects: Array<{
    id: string;
    title: string;
    techStack: string;
    description: string;
    link: string;
  }>;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    duration: string;
    highlights: string;
  }>;
}

export const ResumeBuilder: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('z_resume_data');
    return saved ? JSON.parse(saved) : {
      fullName: 'Sunil Choudhary',
      targetRole: 'Full Stack Software Engineer',
      email: '810921sunil@gmail.com',
      phone: '+91 98765 43210',
      location: 'India',
      github: 'github.com/810921sunil',
      linkedin: 'linkedin.com/in/sunil-choudhary',
      summary: 'Passionate Computer Science student and Full Stack Developer proficient in React, Node.js, TypeScript, and Mobile App Architecture. Built high-scale web platforms with real-time AI and Firebase integrations.',
      education: [
        { id: 'e1', degree: 'B.Tech in Computer Science & Engineering', institution: 'State University of Technology', cgpa: '8.42 / 10.0', year: '2023 - 2027' }
      ],
      skills: {
        languages: 'TypeScript, JavaScript, C++, Python, HTML5, CSS3',
        frameworks: 'React.js, Node.js, Express, TailwindCSS, Vite, Capacitor',
        tools: 'Git, GitHub, Firebase, VS Code, Android Studio, Obsidian'
      },
      projects: [
        {
          id: 'p1',
          title: 'Life OS — Productivity & Task Engine',
          techStack: 'React, TypeScript, Firebase, Capacitor, Gemini AI',
          description: 'Designed and engineered an all-in-one personal operating system with AI natural language parsing, 12-hour time pickers, and native Android companion integration.',
          link: 'https://github.com/810921sunil/My-to-do'
        },
        {
          id: 'p2',
          title: 'Smart Placement & CGPA Tracker',
          techStack: 'React, TailwindCSS, LocalStorage API',
          description: 'Built automated SGPA/CGPA forecasting tools, subject credit weighting calculators, and mock placement interview question portals.',
          link: 'https://github.com/810921sunil/My-to-do'
        }
      ],
      experience: [
        {
          id: 'x1',
          role: 'Full Stack Developer Intern',
          company: 'Tech Solutions Lab',
          duration: 'May 2025 - July 2025',
          highlights: 'Optimized frontend rendering performance by 40%. Integrated OAuth & Firebase Auth fail-safe login systems.'
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('z_resume_data', JSON.stringify(resume));
  }, [resume]);

  const handlePrint = () => {
    window.print();
  };

  // Add Item Helpers
  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), degree: '', institution: '', cgpa: '', year: '' }]
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now().toString(), title: '', techStack: '', description: '', link: '' }]
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), role: '', company: '', duration: '', highlights: '' }]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Printable CSS Rules (Hides everything except resume sheet when printing) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-print-area, #resume-print-area * {
            visibility: visible;
          }
          #resume-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="no-print p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#0B0F19] to-indigo-950/40 border border-white/10 glass-panel shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              1-Click ATS Resume & Portfolio Builder
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Fill your details, live preview ATS-compliant layout, and export to PDF with 1 click.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-extrabold shadow-glow transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Export / Print PDF</span>
        </button>
      </div>

      {/* Main Grid: Left Form Editor + Right Live Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Editor (7 cols) */}
        <div className="no-print lg:col-span-6 space-y-5 text-xs">
          
          {/* Personal Info Section */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3 bg-white/[0.01]">
            <h3 className="font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Personal & Contact Details
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={e => setResume({ ...resume, fullName: e.target.value })}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={resume.targetRole}
                  onChange={e => setResume({ ...resume, targetRole: e.target.value })}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={e => setResume({ ...resume, email: e.target.value })}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={e => setResume({ ...resume, phone: e.target.value })}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">GitHub Profile</label>
                <input
                  type="text"
                  value={resume.github}
                  onChange={e => setResume({ ...resume, github: e.target.value })}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={resume.linkedin}
                  onChange={e => setResume({ ...resume, linkedin: e.target.value })}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Professional Summary</label>
              <textarea
                rows={3}
                value={resume.summary}
                onChange={e => setResume({ ...resume, summary: e.target.value })}
                className="w-full bg-[#060813] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3 bg-white/[0.01]">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              Technical Skills
            </h3>

            <div>
              <label className="block text-gray-400 mb-1">Languages</label>
              <input
                type="text"
                value={resume.skills.languages}
                onChange={e => setResume({ ...resume, skills: { ...resume.skills, languages: e.target.value } })}
                className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Frameworks & Libraries</label>
              <input
                type="text"
                value={resume.skills.frameworks}
                onChange={e => setResume({ ...resume, skills: { ...resume.skills, frameworks: e.target.value } })}
                className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Tools & Platforms</label>
              <input
                type="text"
                value={resume.skills.tools}
                onChange={e => setResume({ ...resume, skills: { ...resume.skills, tools: e.target.value } })}
                className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Projects Section */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Featured Projects ({resume.projects.length})
              </h3>
              <button onClick={addProject} className="text-emerald-400 font-bold text-[11px] hover:underline">+ Add Project</button>
            </div>

            {resume.projects.map((proj, idx) => (
              <div key={proj.id} className="p-3 rounded-xl border border-white/5 bg-[#060813] space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-300">Project #{idx + 1}</span>
                  <button onClick={() => setResume({ ...resume, projects: resume.projects.filter(p => p.id !== proj.id) })} className="text-gray-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={e => {
                    const val = e.target.value;
                    setResume(prev => ({
                      ...prev,
                      projects: prev.projects.map(p => p.id === proj.id ? { ...p, title: val } : p)
                    }));
                  }}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tech Stack (e.g. React, TypeScript)"
                  value={proj.techStack}
                  onChange={e => {
                    const val = e.target.value;
                    setResume(prev => ({
                      ...prev,
                      projects: prev.projects.map(p => p.id === proj.id ? { ...p, techStack: val } : p)
                    }));
                  }}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Key features and accomplishments..."
                  value={proj.description}
                  onChange={e => {
                    const val = e.target.value;
                    setResume(prev => ({
                      ...prev,
                      projects: prev.projects.map(p => p.id === proj.id ? { ...p, description: val } : p)
                    }));
                  }}
                  className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Right Live Printable ATS Sheet (6 cols) */}
        <div className="lg:col-span-6">
          <div 
            id="resume-print-area"
            className="p-8 bg-white text-gray-900 rounded-3xl border border-gray-200 shadow-2xl space-y-5 font-sans min-h-[700px]"
          >
            {/* Header */}
            <div className="border-b border-gray-300 pb-4 text-center space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                {resume.fullName || 'YOUR NAME'}
              </h1>
              <p className="text-sm font-bold text-blue-700 uppercase tracking-wider">
                {resume.targetRole || 'Software Engineer'}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] text-gray-600 pt-1 font-medium">
                {resume.email && <span>{resume.email}</span>}
                {resume.phone && <span>• {resume.phone}</span>}
                {resume.github && <span>• {resume.github}</span>}
                {resume.linkedin && <span>• {resume.linkedin}</span>}
              </div>
            </div>

            {/* Summary */}
            {resume.summary && (
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase text-gray-900 border-b border-gray-300 pb-0.5 tracking-wider">
                  Professional Summary
                </h2>
                <p className="text-[11px] text-gray-700 leading-relaxed pt-1">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase text-gray-900 border-b border-gray-300 pb-0.5 tracking-wider">
                  Education
                </h2>
                {resume.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-start text-[11px] pt-1">
                    <div>
                      <span className="font-bold text-gray-900">{edu.degree}</span>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-right text-gray-700">
                      <span className="font-bold">{edu.year}</span>
                      <p className="text-[10px] text-gray-600">CGPA: {edu.cgpa}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase text-gray-900 border-b border-gray-300 pb-0.5 tracking-wider">
                Technical Skills
              </h2>
              <div className="text-[11px] space-y-1 pt-1">
                {resume.skills.languages && <p><strong className="text-gray-900">Languages:</strong> {resume.skills.languages}</p>}
                {resume.skills.frameworks && <p><strong className="text-gray-900">Frameworks:</strong> {resume.skills.frameworks}</p>}
                {resume.skills.tools && <p><strong className="text-gray-900">Tools & Platforms:</strong> {resume.skills.tools}</p>}
              </div>
            </div>

            {/* Projects */}
            {resume.projects.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase text-gray-900 border-b border-gray-300 pb-0.5 tracking-wider">
                  Key Projects
                </h2>
                {resume.projects.map(proj => (
                  <div key={proj.id} className="space-y-0.5 text-[11px]">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{proj.title}</span>
                      <span className="text-[10px] text-blue-700 font-normal">{proj.techStack}</span>
                    </div>
                    <p className="text-gray-700 leading-normal">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {resume.experience.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase text-gray-900 border-b border-gray-300 pb-0.5 tracking-wider">
                  Work Experience
                </h2>
                {resume.experience.map(exp => (
                  <div key={exp.id} className="text-[11px] space-y-0.5">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="text-gray-600 font-normal">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700">{exp.highlights}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
