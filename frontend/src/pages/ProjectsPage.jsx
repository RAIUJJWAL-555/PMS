import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, FolderKanban, LogOut, Plus, X,
    Users, Calendar, CheckCircle2, CheckCircle, Clock, Search, Filter
} from 'lucide-react';

const ProjectsPage = () => {
    const { user, logout } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ project_name: '', description: '', project_leader: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [projectsRes, membersRes] = await Promise.all([
                axios.get('/api/projects', config),
                axios.get('/api/auth/members', config)
            ]);
            setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
            setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setError('Error loading data. Please refresh.');
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/projects', config);
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch projects', err);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/projects', newProject, config);
            setIsCreateModalOpen(false);
            setNewProject({ project_name: '', description: '', project_leader: '' });
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        }
    };

    const filteredProjects = Array.isArray(projects)
        ? projects.filter(p =>
            p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F6F4]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FFC801] shadow-[0_0_15px_rgba(255,200,1,0.3)]"></div>
        </div>
    );

    return (
        <div className="min-h-screen text-[#172B36] flex font-semibold bg-[#F1F6F4]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#114C5A] shadow-clay border-r-2 border-[#FFC801]/30 p-6 flex flex-col fixed h-full z-10 transition-all duration-500">
                <div className="flex items-center space-x-3 mb-10 text-[#F1F6F4]">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFC801] to-[#FF9932] rounded-[16px] flex items-center justify-center font-black text-xl text-[#172B36] shadow-clay-yellow border border-white/40">P</div>
                    <span className="text-2xl font-black tracking-tight font-black">PMS</span>
                </div>

                <nav className="flex-1 space-y-3">
                    <Link to="/dashboard" className="w-full flex items-center space-x-3 px-4 py-3 text-[#D9E8E2]/70 hover:bg-[#D9E8E2]/10 hover:text-[#FFC801] rounded-[16px] transition-all font-black group">
                        <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Dashboard</span>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/tasks" className="w-full flex items-center space-x-3 px-4 py-3 text-[#D9E8E2]/70 hover:bg-[#D9E8E2]/10 hover:text-[#FFC801] rounded-[16px] transition-all font-black group">
                            <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Tasks</span>
                        </Link>
                    )}

                    <Link to="/my-tasks" className="w-full flex items-center space-x-3 px-4 py-3 text-[#D9E8E2]/70 hover:bg-[#D9E8E2]/10 hover:text-[#FFC801] rounded-[16px] transition-all font-black group">
                        <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                        <span>My Tasks</span>
                    </Link>

                    <Link to="/projects" className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] rounded-[16px] shadow-clay-yellow transition-all font-black group">
                        <FolderKanban size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Projects</span>
                    </Link>

                    <Link to="/users" className="w-full flex items-center space-x-3 px-4 py-3 text-[#D9E8E2]/70 hover:bg-[#D9E8E2]/10 hover:text-[#FFC801] rounded-[16px] transition-all font-black group">
                        <Users size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Team</span>
                    </Link>
                </nav>

                <div className="mt-8 mb-4 px-4 py-3 bg-[#114C5A]/50 rounded-[16px] border border-[#FFC801]/20 shadow-clay-inset">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC801]">Account Type</p>
                    <p className="text-sm font-black text-[#F1F6F4] uppercase italic tracking-wider">
                        {user?.role === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
                    </p>
                </div>

                <div className="pt-6 border-t border-[#D9E8E2]/10 mt-auto">
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-[#FF9932] hover:bg-[#FF9932]/10 rounded-[16px] transition-all font-black group">
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-[#172B36] tracking-tight mb-2">Projects</h1>
                        <p className="text-[#114C5A] font-bold uppercase tracking-widest text-sm opacity-60">Manage all projects</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#114C5A]/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search project..."
                                className="clay-input pl-12 py-3 w-64 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="clay-button-primary px-8 py-4 flex items-center space-x-2 text-sm"
                            >
                                <Plus size={20} strokeWidth={3} />
                                <span>NEW PROJECT</span>
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <div key={project._id} className="clay-card p-8 bg-[#F1F6F4] group border border-[#114C5A]/5 hover:shadow-clay-teal transition-all duration-500 flex flex-col hover:scale-[1.02]">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 bg-[#114C5A] rounded-[16px] flex items-center justify-center text-[#FFC801] shadow-clay-teal border border-white/10 group-hover:from-[#FFC801] group-hover:to-[#FF9932] group-hover:text-[#172B36] transition-all duration-500 bg-gradient-to-br">
                                        <FolderKanban size={28} />
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest bg-[#114C5A]/10 text-[#114C5A] px-4 py-2 rounded-full shadow-clay-inset uppercase">
                                        Project
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-[#172B36] mb-4 group-hover:text-[#FF9932] transition-colors">{project.project_name}</h3>
                                <p className="text-[#114C5A] text-sm font-bold opacity-70 mb-10 leading-relaxed italic line-clamp-3">"{project.description}"</p>

                                <div className="mt-auto pt-6 border-t border-[#114C5A]/10 flex items-center justify-between">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-2 text-[#114C5A]/60 text-xs font-black">
                                            <Calendar size={14} className="text-[#FF9932]" />
                                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {project.project_leader && (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-[#FFC801] rounded-full flex items-center justify-center text-[10px] font-black text-[#172B36] border border-white/50">
                                                    {project.project_leader.name.charAt(0)}
                                                </div>
                                                <span className="text-[10px] font-black text-[#114C5A] uppercase tracking-widest leading-none">
                                                    Lead: {project.project_leader.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <button className="flex items-center space-x-2 text-[#172B36] text-[10px] font-black tracking-widest bg-[#FFC801]/40 px-4 py-2 rounded-full transform group-hover:scale-105 transition-all shadow-clay-yellow border border-[#FFC801]/20 uppercase">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-[#D9E8E2]/30 rounded-[3rem] shadow-clay-inset border-2 border-dashed border-[#114C5A]/10">
                            <div className="text-6xl mb-6 opacity-20">📡</div>
                            <h3 className="text-2xl font-black text-[#172B36] mb-2">No projects found.</h3>
                            <p className="text-[#114C5A] font-bold opacity-60">Add a new project or change your search.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Project Creation Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-[#172B36]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#F1F6F4]/95 backdrop-blur-[24px] w-full max-w-lg rounded-[2.5rem] shadow-clay animate-in zoom-in-95 duration-300 border border-white/50">
                        <div className="p-10 border-b border-[#114C5A]/10 flex justify-between items-center text-[#172B36]">
                            <h2 className="text-3xl font-black tracking-tight">New Project</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="bg-[#D9E8E2]/30 p-3 rounded-[16px] text-[#114C5A]/40 hover:text-[#FF9932] transition-all shadow-clay active:shadow-clay-inset">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-10 space-y-8">
                            {error && <div className="bg-[#FF9932]/10 text-[#FF9932] p-4 rounded-[16px] mb-6 text-sm text-center font-black shadow-clay-inset border border-[#FF9932]/20 uppercase tracking-widest">{error}</div>}
                            <div className="space-y-3">
                                <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Project Name</label>
                                <input
                                    type="text"
                                    className="w-full clay-input"
                                    placeholder="e.g. Website Redesign"
                                    value={newProject.project_name}
                                    onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Project Leader</label>
                                <select
                                    className="w-full clay-input"
                                    value={newProject.project_leader}
                                    onChange={(e) => setNewProject({ ...newProject, project_leader: e.target.value })}
                                    required
                                >
                                    <option value="">Select Project Leader</option>
                                    {members.map(m => (
                                        <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    rows="3"
                                    className="w-full clay-input resize-none"
                                    placeholder="Enter project details..."
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full clay-button-primary py-5 text-lg font-black uppercase tracking-widest">
                                CREATE PROJECT
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
