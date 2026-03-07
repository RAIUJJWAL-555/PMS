import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Plus, X, Users, Calendar, CheckCircle2, CheckCircle, Clock, Trophy } from 'lucide-react';

const ProjectDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [newProject, setNewProject] = useState({ project_name: '', description: '', project_leader: '' });
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

    const fetchProjectTasks = async (projectId) => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/tasks/project/${projectId}`, config);
            setProjectTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch project tasks', err);
            setProjectTasks([]);
        }
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        fetchProjectTasks(project._id);
        setIsDetailModalOpen(true);
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/projects', newProject, config);
            setIsCreateModalOpen(false);
            setNewProject({ project_name: '', description: '', project_leader: '' });
            fetchProjects(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-[#114C5A]/15 text-[#114C5A]';
            case 'In Progress': return 'bg-[#FFC801]/20 text-[#114C5A]';
            case 'Review': return 'bg-[#FF9932]/20 text-[#FF9932]';
            default: return 'bg-[#172B36]/10 text-[#172B36]';
        }
    };

    const getProgress = (status) => {
        switch (status) {
            case 'Completed': return 100;
            case 'In Progress': return 50;
            default: return 10;
        }
    };

    const getOverallProgress = () => {
        if (projectTasks.length === 0) return 0;
        const totalProgress = projectTasks.reduce((acc, task) => acc + getProgress(task.status), 0);
        return Math.round(totalProgress / projectTasks.length);
    };

    const getProjectTeam = () => {
        const team = new Map();

        // Add leader
        if (selectedProject?.project_leader) {
            team.set(selectedProject.project_leader._id, {
                ...selectedProject.project_leader,
                roleInProject: 'Project Leader'
            });
        }

        // Add members from tasks
        projectTasks.forEach(task => {
            if (task.assigned_to && !team.has(task.assigned_to._id)) {
                team.set(task.assigned_to._id, {
                    ...task.assigned_to,
                    roleInProject: 'Member'
                });
            }
        });

        return Array.from(team.values());
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F6F4]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FFC801] shadow-[0_0_15px_rgba(255,200,1,0.3)]"></div>
        </div>
    );

    return (
        <div className="min-h-screen text-[#172B36] flex font-semibold bg-[#F1F6F4]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#114C5A] shadow-clay border-r-2 border-[#FFC801]/30 p-6 flex flex-col fixed h-full z-10 transition-all duration-500">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFC801] to-[#FF9932] rounded-[16px] flex items-center justify-center font-black text-xl text-[#172B36] shadow-clay-yellow border border-white/40">P</div>
                    <span className="text-2xl font-black tracking-tight text-[#F1F6F4]">PMS</span>
                </div>

                <nav className="flex-1 space-y-3">
                    <Link to="/dashboard" className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] rounded-[16px] shadow-clay-yellow transition-all font-black group">
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

                    <Link to="/projects" className="w-full flex items-center space-x-3 px-4 py-3 text-[#D9E8E2]/70 hover:bg-[#D9E8E2]/10 hover:text-[#FFC801] rounded-[16px] transition-all font-black group">
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
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-y-auto p-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-[#172B36] mb-2 tracking-tight">Dashboard</h1>
                        <p className="text-[#114C5A] font-bold uppercase tracking-widest text-sm opacity-60">Welcome back, <span className="text-[#FF9932]">{user?.name}</span>.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="clay-button-primary px-10 py-5 text-base flex items-center space-x-3"
                        >
                            <Plus size={22} strokeWidth={3} />
                            <span>NEW PROJECT</span>
                        </button>
                    )}
                </header>

                {/* Dashboard Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="clay-card p-8 bg-gradient-to-br from-[#114C5A] to-[#172B36] text-[#F1F6F4] border border-white/10 group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Projects</span>
                            <FolderKanban size={20} className="text-[#FFC801]" />
                        </div>
                        <div className="text-4xl font-black">{projects.length}</div>
                        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#FFC801]/60">Live Operations</div>
                    </div>

                    <div className="clay-card p-8 bg-[#F1F6F4] border border-[#114C5A]/10 group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/40">
                                {user?.role === 'admin' ? 'Available Members' : 'Team Members'}
                            </span>
                            <Users size={20} className="text-[#FF9932]" />
                        </div>
                        <div className="text-4xl font-black text-[#172B36]">{members.length}</div>
                        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#114C5A]/40 italic">Registered Members</div>
                    </div>

                    <div className="clay-card-mint p-8 bg-[#D9E8E2] border border-[#114C5A]/10 group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/60">System Status</span>
                            <CheckCircle2 size={20} className="text-[#114C5A]" />
                        </div>
                        <div className="text-xl font-black text-[#114C5A]">FULLY OPERATIONAL</div>
                        <div className="mt-4 h-1.5 w-full bg-[#114C5A]/10 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-[#114C5A] animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Section */}
                {user?.role === 'admin' && members.length > 0 && (
                    <div className="clay-card-mint p-10 mb-12 bg-gradient-to-br from-[#D9E8E2] to-[#F1F6F4] border border-[#114C5A]/10 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 opacity-5 rotate-12">
                            <Trophy size={200} />
                        </div>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-[#FFC801] rounded-[18px] flex items-center justify-center text-[#172B36] shadow-clay border border-white/40">
                                <Trophy size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-[#172B36] uppercase tracking-tight">Top Performers</h2>
                                <p className="text-[10px] font-black text-[#114C5A]/40 uppercase tracking-widest">Global Leaderboard</p>
                            </div>
                        </div>
                        <div className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide">
                            {members.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5).map((m, i) => (
                                <div key={m._id} className="flex-shrink-0 flex items-center space-x-4 bg-white/60 px-6 py-4 rounded-[24px] shadow-clay-inset border border-white">
                                    <span className={`text-xl font-black ${i === 0 ? 'text-[#FF9932]' : 'text-[#114C5A]/20'}`}>#{i + 1}</span>
                                    <div className="w-10 h-10 bg-[#114C5A] rounded-full flex items-center justify-center text-[#FFC801] font-black shadow-clay border-2 border-white">
                                        {m.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#172B36] leading-none mb-1">{m.name}</p>
                                        <p className="text-[10px] font-black text-[#FF9932] tracking-widest uppercase">{m.points || 0} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => handleProjectClick(project)}
                                className="clay-card group cursor-pointer border border-[#114C5A]/5 bg-[#F1F6F4] hover:shadow-clay-teal transition-all duration-500"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-[16px] flex items-center justify-center text-[#FFC801] border border-white/10 group-hover:from-[#FFC801] group-hover:to-[#FF9932] group-hover:text-[#172B36] transition-all duration-500 shadow-clay-inset">
                                        <FolderKanban size={32} />
                                    </div>
                                    <div className="text-[10px] font-black tracking-widest bg-[#114C5A]/10 text-[#114C5A] px-4 py-2 rounded-full shadow-clay-inset border border-[#114C5A]/5">
                                        ACTIVE
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-[#172B36] transition-colors group-hover:text-[#FF9932]">{project.project_name}</h3>
                                <p className="text-[#114C5A] text-sm mb-10 line-clamp-2 leading-relaxed font-bold opacity-70 italic">"{project.description}"</p>

                                <div className="flex items-center justify-between pt-6 border-t border-[#114C5A]/10 mt-auto">
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex items-center text-[#114C5A]/60 text-xs font-black bg-[#D9E8E2]/50 px-3 py-1.5 rounded-full shadow-clay-inset w-fit">
                                            <Calendar size={14} className="mr-2 text-[#FF9932]" />
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
                                    <div className="flex items-center space-x-1 text-[#172B36] text-xs font-black tracking-widest bg-[#FFC801]/40 px-3 py-1.5 rounded-full transform group-hover:scale-105 transition-all border border-[#FFC801]/20 shadow-clay-yellow">
                                        <span>EXPLORE</span>
                                        <Plus size={12} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-[#D9E8E2]/30 rounded-[3rem] shadow-clay-inset border-2 border-dashed border-[#114C5A]/10">
                            <div className="text-6xl mb-6 opacity-20">📂</div>
                            <h3 className="text-2xl font-black text-[#172B36] mb-2">No projects found.</h3>
                            <p className="text-[#114C5A] font-bold opacity-60">Add a new project to get started.</p>
                        </div>
                    )}
                </div>

                {/* All Members Section for Admin */}
                {user?.role === 'admin' && (
                    <div className="mt-20">
                        <div className="flex items-center space-x-4 mb-10">
                            <div className="w-12 h-12 bg-[#114C5A] rounded-[18px] flex items-center justify-center text-[#FFC801] shadow-clay-teal border border-white/20">
                                <Users size={24} strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black text-[#172B36] uppercase tracking-widest">Registered Members</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {members.slice(0, 12).map((m, index) => (
                                <div key={m._id} className="clay-card p-6 bg-white/80 border border-[#114C5A]/5 flex flex-col items-center group hover:bg-[#F1F6F4] transition-all relative">
                                    {index < 3 && (
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFC801] rounded-full flex items-center justify-center shadow-clay border-2 border-white z-10">
                                            <span className="text-[10px] font-black text-[#172B36]">#{index + 1}</span>
                                        </div>
                                    )}
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-full flex items-center justify-center text-[#FFC801] font-black text-xl mb-4 shadow-clay group-hover:scale-110 transition-all border-4 border-white/50">
                                        {m.name.charAt(0)}
                                    </div>
                                    <p className="text-xs font-black text-[#172B36] text-center mb-1 truncate w-full">{m.name}</p>
                                    <div className="flex items-center space-x-1.5 bg-[#FFC801]/10 px-2 py-0.5 rounded-full border border-[#FFC801]/20">
                                        <div className="w-1.5 h-1.5 bg-[#FFC801] rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-black text-[#FF9932] uppercase tracking-widest">{m.points || 0} PTS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal for Creating Project */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-[#172B36]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#F1F6F4]/95 backdrop-blur-[24px] w-full max-w-lg rounded-[2.5rem] shadow-clay animate-in zoom-in-95 duration-300 border border-white/50">
                        <div className="p-10 border-b border-[#114C5A]/10 flex justify-between items-center">
                            <h2 className="text-3xl font-black tracking-tight text-[#172B36]">Create Project</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-[#114C5A]/40 hover:text-[#FF9932] transition-all bg-[#D9E8E2]/30 p-2 rounded-[16px] shadow-clay active:shadow-clay-inset">
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
                                    <option value="">Select Project Leader (Ranked by Pts)</option>
                                    {members.sort((a, b) => (b.points || 0) - (a.points || 0)).map(m => (
                                        <option key={m._id} value={m._id}>
                                            {m.name} — {m.points || 0} pts
                                        </option>
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
                            <button type="submit" className="w-full clay-button-primary py-5 text-lg">
                                CREATE PROJECT
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Project Details & Tasks */}
            {isDetailModalOpen && selectedProject && (
                <div className="fixed inset-0 bg-[#172B36]/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#F1F6F4]/98 backdrop-blur-[32px] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-clay flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/60">
                        {/* Header */}
                        <div className="p-12 border-b border-[#114C5A]/10 flex justify-between items-start bg-[#D9E8E2]/20">
                            <div>
                                <div className="flex items-center space-x-3 text-[#FF9932] mb-3 bg-[#114C5A] w-fit px-4 py-1.5 rounded-full shadow-clay-teal border border-white/20">
                                    <FolderKanban size={18} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC801]">Project Details</span>
                                </div>
                                <h2 className="text-5xl font-black text-[#172B36] tracking-tight">{selectedProject.project_name}</h2>
                                <p className="text-[#114C5A] mt-3 font-bold text-lg leading-relaxed opacity-80 max-w-2xl italic">"{selectedProject.description}"</p>
                                {selectedProject.project_leader && (
                                    <div className="mt-6 flex items-center space-x-4 bg-[#114C5A]/10 px-6 py-4 rounded-[2rem] w-fit shadow-clay-inset border border-white/50">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#FFC801] to-[#FF9932] rounded-full flex items-center justify-center text-lg font-black text-[#172B36] shadow-clay-yellow border border-white/40">
                                            {selectedProject.project_leader.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/60 leading-none mb-1">Project Leader</p>
                                            <p className="text-lg font-black text-[#172B36] leading-none">{selectedProject.project_leader.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="bg-[#D9E8E2]/50 hover:bg-[#D9E8E2] text-[#114C5A]/40 hover:text-[#172B36] p-4 rounded-[1.5rem] transition-all shadow-clay active:shadow-clay-inset border border-whiteactive:scale-95"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#D9E8E2]/10">
                            {/* Project Health / Overall Progress */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="clay-card p-8 bg-[#F1F6F4] flex flex-col justify-center items-center border border-[#114C5A]/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/40 mb-2">Operations Count</span>
                                    <span className="text-5xl font-black text-[#172B36]">{projectTasks.length}</span>
                                </div>
                                <div className="clay-card-mint md:col-span-2 p-8 flex flex-col justify-center">
                                    <div className="flex justify-between items-end mb-5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/60">Mission Completion</span>
                                        <span className="text-3xl font-black text-[#FF9932]">{getOverallProgress()}%</span>
                                    </div>
                                    <div className="w-full bg-[#172B36]/10 h-6 rounded-full shadow-clay-inset p-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#FFC801] to-[#FF9932] rounded-full transition-all duration-1000 ease-out shadow-clay-yellow"
                                            style={{ width: `${getOverallProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Team Members */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black flex items-center space-x-4 text-[#172B36] uppercase tracking-widest">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#114C5A] to-[#172B36] flex items-center justify-center rounded-[16px] text-[#FF9932] shadow-clay-teal border border-white/20">
                                        <Users size={24} strokeWidth={3} />
                                    </div>
                                    <span>PROJECT TEAM</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {getProjectTeam().map((member) => (
                                        <div key={member._id} className="clay-card p-6 bg-[#F1F6F4]/80 flex items-center space-x-4 border border-[#114C5A]/5">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-[12px] flex items-center justify-center text-[#FFC801] font-black text-lg shadow-clay-teal border border-white/10">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#172B36] leading-tight">{member.name}</p>
                                                <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${member.roleInProject === 'Project Leader' ? 'text-[#FF9932]' : 'text-[#114C5A]/40'}`}>
                                                    {member.roleInProject}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Task Breakdown */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black flex items-center space-x-4 text-[#172B36] uppercase tracking-widest">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#114C5A] to-[#172B36] flex items-center justify-center rounded-[16px] text-[#FFC801] shadow-clay-teal border border-white/20">
                                        <CheckCircle2 size={24} strokeWidth={3} />
                                    </div>
                                    <span>TASKS</span>
                                </h3>

                                {projectTasks.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6">
                                        {projectTasks.map((task) => (
                                            <div key={task._id} className="bg-white/80 backdrop-blur-sm rounded-[24px] p-8 shadow-clay border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white transition-all duration-300">
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-black text-[#172B36] mb-3">{task.title}</h4>
                                                    <div className="flex items-center space-x-6">
                                                        <div className="flex items-center space-x-3 bg-[#D9E8E2]/50 px-3 py-1.5 rounded-[16px] shadow-clay-inset">
                                                            <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-[#FFC801] to-[#FF9932] flex items-center justify-center text-sm font-black text-[#172B36] shadow-clay-yellow border border-white/50">
                                                                {task.assigned_to?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <span className="text-sm text-[#114C5A] font-bold">{task.assigned_to?.name || 'Unassigned'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-[#FF9932] bg-[#F1F6F4] px-3 py-1.5 rounded-[12px] shadow-clay-inset border border-[#FFC801]/10">
                                                            <Clock size={16} strokeWidth={3} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]">{new Date(task.deadline).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-8 min-w-[240px]">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-2 items-center">
                                                            <span className="text-[10px] font-black text-[#114C5A]/40 tracking-wider">STATUS</span>
                                                            <span className="text-xs font-black text-[#114C5A]">{getProgress(task.status)}%</span>
                                                        </div>
                                                        <div className="w-full bg-[#172B36]/10 h-3 rounded-full shadow-clay-inset overflow-hidden">
                                                            <div
                                                                className={`h-full bg-gradient-to-r from-[#FFC801] to-[#FF9932] transition-all duration-700`}
                                                                style={{ width: `${getProgress(task.status)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-clay-yellow border border-white/50 ${getStatusStyle(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 bg-[#D9E8E2]/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-[#114C5A]/10 text-center shadow-clay-inset">
                                        <p className="text-[#114C5A] font-bold italic text-lg opacity-40 uppercase tracking-widest">No tasks found for this project</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;
