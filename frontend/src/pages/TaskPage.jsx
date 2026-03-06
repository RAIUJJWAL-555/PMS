import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, FolderKanban, LogOut, Plus, Users, Calendar, CheckCircle2, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskPage = () => {
    const { user, logout } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        deadline: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProjects();
        fetchMembers();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchTasks(selectedProject);
        }
    }, [selectedProject]);

    const fetchProjects = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/projects', config);
            setProjects(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch projects');
        }
    };

    const fetchMembers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/auth/members', config);
            setMembers(data);
        } catch (err) {
            console.error('Failed to fetch members');
        }
    };

    const fetchTasks = async (projectId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/tasks/project/${projectId}`, config);
            setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            setMessage({ type: 'error', text: 'Please select a project first' });
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/tasks', { ...formData, project_id: selectedProject }, config);
            setMessage({ type: 'success', text: 'Task created successfully!' });
            setFormData({ title: '', description: '', assigned_to: '', deadline: '' });
            fetchTasks(selectedProject);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create task' });
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

    const getProgressColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500';
            case 'In Progress': return 'bg-blue-500';
            default: return 'bg-yellow-500';
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
            <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col fixed h-full">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">P</div>
                    <span className="text-xl font-bold tracking-tight">PMS</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-xl transition font-medium">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/tasks" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${window.location.pathname === '/tasks' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                        <CheckCircle2 size={20} />
                        <span>Manage Tasks</span>
                    </Link>
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
                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Task Management</h1>
                    <p className="text-gray-400">Create and monitor tasks for each project.</p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Create Task Form */}
                    <div className="xl:col-span-1">
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                                <Plus size={20} className="text-blue-500" />
                                <span>Create New Task</span>
                            </h2>

                            {message.text && (
                                <div className={`p-4 rounded-xl mb-6 border text-sm ${message.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleCreateTask} className="space-y-5">
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Project</label>
                                    <select
                                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p._id} value={p._id}>{p.project_name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Task Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        placeholder="Enter task title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        rows="3"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        placeholder="Task description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Assign To</label>
                                    <select
                                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        value={formData.assigned_to}
                                        onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Member</option>
                                        {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        required
                                    />
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/20 active:scale-95">
                                    Create Task
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Task List Table */}
                    <div className="xl:col-span-2">
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Project Tasks</h2>
                                <span className="text-xs bg-gray-700 text-gray-400 px-3 py-1 rounded-full border border-gray-600">
                                    {tasks.length} Total
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-8 py-4 font-semibold">Title</th>
                                            <th className="px-8 py-4 font-semibold">Assigned To</th>
                                            <th className="px-8 py-4 font-semibold">Progress</th>
                                            <th className="px-8 py-4 font-semibold">Deadline</th>
                                            <th className="px-8 py-4 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {tasks.length > 0 ? (
                                            tasks.map(task => (
                                                <tr key={task._id} className="hover:bg-gray-700/30 transition">
                                                    <td className="px-8 py-5">
                                                        <div className="font-medium text-white">{task.title}</div>
                                                        <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">{task.description}</div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold ring-2 ring-gray-600 text-indigo-400">
                                                                {task.assigned_to?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <span className="text-sm">{task.assigned_to?.name || 'Unassigned'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="w-32">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-[10px] text-gray-500 font-bold">{getProgress(task.status)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-500 ${getProgressColor(task.status)}`}
                                                                    style={{ width: `${getProgress(task.status)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center text-sm text-red-500 font-medium">
                                                            <Clock size={14} className="mr-2" />
                                                            {new Date(task.deadline).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusStyle(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-20 text-center text-gray-500">
                                                    {selectedProject ? 'No tasks found for this project.' : 'Select a project to view tasks.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TaskPage;
