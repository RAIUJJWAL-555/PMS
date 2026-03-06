import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, Plus, X, Users, Calendar, CheckCircle2, CheckCircle, Clock } from 'lucide-react';

const ProjectDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [newProject, setNewProject] = useState({ project_name: '', description: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/projects', config);
            setProjects(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch projects');
            setLoading(false);
        }
    };

    const fetchProjectTasks = async (projectId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/tasks/project/${projectId}`, config);
            setProjectTasks(data);
        } catch (err) {
            console.error('Failed to fetch project tasks');
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
            setNewProject({ project_name: '', description: '' });
            fetchProjects(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
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

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col fixed h-full">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">P</div>
                    <span className="text-xl font-bold tracking-tight">PMS</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition font-medium">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    {user?.role === 'admin' ? (
                        <Link to="/tasks" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium">
                            <CheckCircle2 size={20} />
                            <span>Manage Tasks</span>
                        </Link>
                    ) : (
                        <Link to="/my-tasks" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium">
                            <CheckCircle size={20} />
                            <span>My Tasks</span>
                        </Link>
                    )}

                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium text-left">
                        <FolderKanban size={20} />
                        <span>All Projects</span>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium text-left">
                        <Users size={20} />
                        <span>Team Members</span>
                    </button>
                </nav>

                <div className="pt-6 border-t border-gray-700 mt-auto">
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition font-medium">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-y-auto p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">Workspace Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.name}. Manage your team effectively.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 transition shadow-xl shadow-blue-500/20 active:scale-95"
                        >
                            <Plus size={20} />
                            <span>NEW PROJECT</span>
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => handleProjectClick(project)}
                                className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300 group cursor-pointer transform hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                        <FolderKanban size={28} />
                                    </div>
                                    <div className="text-[10px] font-black tracking-widest bg-gray-700 text-gray-400 px-3 py-1.5 rounded-xl border border-gray-600 group-hover:border-blue-500/30 transition-colors">
                                        ACTIVE
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black mb-3 group-hover:text-blue-400 transition">{project.project_name}</h3>
                                <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-light">{project.description}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-700 mt-auto">
                                    <div className="flex items-center text-gray-500 text-xs font-bold">
                                        <Calendar size={14} className="mr-2" />
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-blue-500 text-xs font-black tracking-widest">
                                        <span>DETAILS</span>
                                        <Plus size={12} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-700">
                            <div className="text-6xl mb-6 opacity-20 text-blue-500">📂</div>
                            <h3 className="text-2xl font-black text-white mb-2">No projects found.</h3>
                            <p className="text-gray-500 font-light">Create your first workspace to start managing tasks.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Creating Project */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 w-full max-w-lg rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-2xl font-black tracking-tight">Create New Project</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition bg-gray-700 p-2 rounded-xl">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-10 space-y-8">
                            {error && <div className="text-red-500 text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/30 font-bold">{error}</div>}
                            <div className="space-y-3">
                                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest ml-1">Project Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner font-medium"
                                    placeholder="e.g. Mobile App Dev"
                                    value={newProject.project_name}
                                    onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner font-medium"
                                    placeholder="Describe the project scope..."
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition shadow-xl shadow-blue-500/20 active:scale-95">
                                LAUNCH WORKSPACE
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Project Details & Tasks */}
            {isDetailModalOpen && selectedProject && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-gray-700 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-10 border-b border-gray-700 flex justify-between items-start bg-gray-800/80">
                            <div>
                                <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                                    <FolderKanban size={18} />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Project Overview</span>
                                </div>
                                <h2 className="text-4xl font-black text-white">{selectedProject.project_name}</h2>
                                <p className="text-gray-400 mt-2 font-light text-lg">{selectedProject.description}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="bg-gray-700 hover:bg-red-500 text-gray-400 hover:text-white p-3 rounded-2xl transition shadow-lg active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                            {/* Project Health / Overall Progress */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-700/50 flex flex-col justify-center items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Tasks</span>
                                    <span className="text-4xl font-black text-white">{projectTasks.length}</span>
                                </div>
                                <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-700/50 md:col-span-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Overall Completion</span>
                                        <span className="text-2xl font-black text-indigo-400">{getOverallProgress()}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-4 rounded-full border border-gray-700 p-1">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                            style={{ width: `${getOverallProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Task Breakdown */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-black flex items-center space-x-3 text-white">
                                    <CheckCircle2 size={24} className="text-blue-500" />
                                    <span>TASK BREAKDOWN</span>
                                </h3>

                                {projectTasks.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {projectTasks.map((task) => (
                                            <div key={task._id} className="bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-900/50 transition">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-white mb-2">{task.title}</h4>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                                                {task.assigned_to?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <span className="text-xs text-gray-400 font-bold">{task.assigned_to?.name || 'Unassigned'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-red-500/80 text-[10px] font-black uppercase tracking-widest bg-red-500/5 px-3 py-1 rounded-full border border-red-500/10">
                                                            <Clock size={12} />
                                                            <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-6 min-w-[200px]">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-[10px] font-black text-gray-500">{getProgress(task.status)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                                                style={{ width: `${getProgress(task.status)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <span className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 bg-gray-900/20 rounded-3xl border border-dashed border-gray-700 text-center">
                                        <p className="text-gray-500 font-bold italic">No tasks have been created for this project yet.</p>
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
