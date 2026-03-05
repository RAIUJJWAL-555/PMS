import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, FolderKanban, LogOut, Plus, X, Users, Calendar } from 'lucide-react';

const ProjectDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/projects', newProject, config);
            setIsModalOpen(false);
            setNewProject({ project_name: '', description: '' });
            fetchProjects(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">P</div>
                    <span className="text-xl font-bold tracking-tight">PMS</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600/10 text-blue-500 rounded-xl transition font-medium">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium">
                        <FolderKanban size={20} />
                        <span>My Projects</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium">
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
            <main className="flex-1 overflow-y-auto p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Project Workspace</h1>
                        <p className="text-gray-400">Welcome, {user?.name}. Here's what's happening today.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-blue-500/20"
                        >
                            <Plus size={20} />
                            <span>Create Project</span>
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project._id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition duration-300 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                                        <FolderKanban size={24} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition">{project.project_name}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-700 mt-auto">
                                    <div className="flex items-center text-gray-500 text-xs">
                                        <Calendar size={14} className="mr-1" />
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-xs bg-gray-700 text-gray-400 px-3 py-1 rounded-full border border-gray-600">
                                        Active
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-gray-800/50 rounded-3xl border border-dashed border-gray-700">
                            <div className="text-5xl mb-6 opacity-30">📂</div>
                            <h3 className="text-xl font-bold text-white mb-2">No projects found.</h3>
                            <p className="text-gray-500 font-light">Bring your ideas to life by creating your first project.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Creating Project */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 w-full max-w-lg rounded-3xl border border-gray-700 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-8 space-y-6">
                            {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500">{error}</div>}
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Project Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="Enter project name"
                                    value={newProject.project_name}
                                    onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="Short summary of the project"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-500/20">
                                Launch Project
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;
