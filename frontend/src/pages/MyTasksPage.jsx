import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, FolderKanban, LogOut, Clock, Calendar, CheckCircle, X, AlignLeft, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTasksPage = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/tasks/my-tasks', config);
            setTasks(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch my tasks');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        setUpdateLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/tasks/${taskId}/status`, { status: newStatus }, config);

            // Update local state
            setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            if (selectedTask?._id === taskId) {
                setSelectedTask({ ...selectedTask, status: newStatus });
            }
            setUpdateLoading(false);
        } catch (err) {
            console.error('Failed to update status');
            setUpdateLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20 ring-green-500/10 shadow-lg shadow-green-500/5';
            case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 ring-blue-500/10 shadow-lg shadow-blue-500/5';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 ring-yellow-500/10 shadow-lg shadow-yellow-500/5';
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

    const openTaskDetails = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
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
                    <Link to="/my-tasks" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${window.location.pathname === '/my-tasks' ? 'bg-indigo-600/10 text-indigo-500' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                        <CheckCircle size={20} />
                        <span>My Tasks</span>
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
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">My Assigned Tasks</h1>
                        <p className="text-gray-400">Track your progress and update task statuses.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                key={task._id}
                                onClick={() => openTaskDetails(task)}
                                className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:border-indigo-500/50 hover:shadow-indigo-500/20 transition duration-300 cursor-pointer group transform hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center space-x-2 text-indigo-400">
                                        <FolderKanban size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">{task.project_id?.project_name || 'Project'}</span>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-indigo-400 transition">{task.title}</h3>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Progress</span>
                                        <span className="text-[10px] text-gray-400 font-bold">{getProgress(task.status)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ease-out ${getProgressColor(task.status)}`}
                                            style={{ width: `${getProgress(task.status)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-light">{task.description}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                                    <div className="flex items-center space-x-2 text-red-500 font-bold">
                                        <Calendar size={14} />
                                        <span className="text-xs">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-indigo-400 font-bold">
                                        <Info size={14} />
                                        <span>View</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-gray-800/30 rounded-3xl border border-dashed border-gray-700">
                            <div className="text-6xl mb-6 opacity-30">✅</div>
                            <h3 className="text-2xl font-bold text-white mb-2">You're all caught up!</h3>
                            <p className="text-gray-500 font-light max-w-sm mx-auto">No tasks currently assigned to you. Enjoy your productivity win!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Task Detail Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-gray-800 w-full max-w-2xl rounded-[2.5rem] border border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="relative p-8 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                                    <CheckCircle size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Task Details</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Update your progress</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-500 p-3 rounded-2xl transition-all shadow-lg hover:shadow-red-500/10 active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 text-indigo-400 mb-3">
                                        <FolderKanban size={20} />
                                        <span className="text-sm font-black uppercase tracking-[0.2em]">{selectedTask.project_id?.project_name}</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white leading-tight mb-4">{selectedTask.title}</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <span className={`px-6 py-2 rounded-2xl border text-xs font-black uppercase tracking-widest shadow-lg ${getStatusStyle(selectedTask.status)}`}>
                                            {selectedTask.status}
                                        </span>
                                        <div className="flex items-center space-x-2 text-red-500 font-black bg-red-500/10 px-6 py-2 rounded-2xl border border-red-500/20 shadow-lg">
                                            <Calendar size={18} />
                                            <span className="text-xs uppercase tracking-widest">Deadline: {new Date(selectedTask.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Progress Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h4 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] flex items-center space-x-2">
                                        <Info size={16} className="text-indigo-400" />
                                        <span>Current Progress</span>
                                    </h4>
                                    <span className={`text-2xl font-black ${getProgress(selectedTask.status) === 100 ? 'text-green-500' : 'text-indigo-400'}`}>
                                        {getProgress(selectedTask.status)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-900 h-4 rounded-full overflow-hidden border border-gray-700/50 p-1">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${getProgressColor(selectedTask.status)} shadow-[0_0_15px_rgba(99,102,241,0.3)]`}
                                        style={{ width: `${getProgress(selectedTask.status)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 rounded-3xl p-8 border border-gray-700/50 shadow-inner">
                                <h4 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center space-x-2">
                                    <AlignLeft size={18} />
                                    <span>Task Description</span>
                                </h4>
                                <p className="text-gray-300 text-lg leading-relaxed font-light whitespace-pre-line italic">
                                    "{selectedTask.description}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center space-x-4 bg-gray-900/50 px-6 py-3 rounded-2xl border border-gray-700/50">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Assignee</p>
                                        <p className="text-lg font-black text-white">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-700/30">
                                    {['Pending', 'In Progress', 'Completed'].map((status) => (
                                        <button
                                            key={status}
                                            disabled={updateLoading}
                                            onClick={() => handleUpdateStatus(selectedTask._id, status)}
                                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedTask.status === status
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105'
                                                    : 'text-gray-500 hover:text-white hover:bg-gray-700'
                                                } ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasksPage;
