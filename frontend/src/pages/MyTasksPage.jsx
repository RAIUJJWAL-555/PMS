import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
    LayoutDashboard, FolderKanban, LogOut, Clock, Calendar,
    CheckCircle, X, AlignLeft, Info, CheckCircle2, AlertCircle, Users, Trophy
} from 'lucide-react';
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
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/tasks/my-tasks', config);
            setTasks(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch my tasks', err);
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
            case 'Review': return 75;
            default: return 10;
        }
    };

    const openTaskDetails = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
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
                    <Link to="/my-tasks" className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] rounded-[16px] shadow-clay-yellow transition-all font-black group">
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
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-[#172B36] tracking-tight mb-2">My Tasks</h1>
                    <p className="text-[#114C5A] font-bold uppercase tracking-widest text-sm opacity-60">Tasks assigned to you</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                key={task._id}
                                onClick={() => openTaskDetails(task)}
                                className="clay-card p-10 group bg-[#F1F6F4] cursor-pointer border border-[#114C5A]/5 hover:shadow-clay-teal transition-all duration-500 hover:scale-[1.02]"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center space-x-2 text-[#FF9932] bg-[#114C5A] px-3 py-1.5 rounded-full shadow-clay-teal border border-white/20">
                                        <FolderKanban size={14} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC801]">{task.project_id?.project_name || 'Operation'}</span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-clay-inset border border-white/50 ${getStatusStyle(task.status)}`}>
                                        {task.status}
                                    </div>
                                    <div className="flex flex-col items-center justify-center bg-[#114C5A] px-3 py-1.5 rounded-[12px] shadow-clay-teal border border-white/10 text-[#FFC801]">
                                        <Trophy size={14} className="mb-0.5" />
                                        <span className="text-[8px] font-black">{task.exp_points || 50}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black mb-6 text-[#172B36] group-hover:text-[#FF9932] transition-colors line-clamp-2 tracking-tight">
                                    {task.title}
                                </h3>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] text-[#114C5A]/40 font-black tracking-widest uppercase">Progress Status</span>
                                        <span className="text-xs font-black text-[#172B36]">{getProgress(task.status)}%</span>
                                    </div>
                                    <div className="w-full bg-[#172B36]/10 h-3 rounded-full shadow-clay-inset overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#FFC801] to-[#FF9932] transition-all duration-700 ease-out shadow-clay-yellow"
                                            style={{ width: `${getProgress(task.status)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-[#114C5A] text-sm font-bold opacity-70 mb-10 leading-relaxed italic line-clamp-2">"{task.description}"</p>

                                <div className="flex items-center justify-between pt-8 border-t border-[#114C5A]/10">
                                    <div className="flex items-center space-x-2 text-[#172B36] font-black bg-[#D9E8E2]/50 px-4 py-2 rounded-[16px] shadow-clay-inset border border-[#114C5A]/5">
                                        <Calendar size={14} strokeWidth={3} className="text-[#FF9932]" />
                                        <span className="text-[10px] uppercase tracking-widest">{new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-[#172B36] text-[10px] font-black tracking-widest bg-[#FFC801]/40 px-4 py-2 rounded-full transform group-hover:scale-105 transition-all shadow-clay-yellow border border-[#FFC801]/20">
                                        <Info size={14} strokeWidth={3} />
                                        <span>REVIEW</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-[#D9E8E2]/30 rounded-[3rem] shadow-clay-inset border-2 border-dashed border-[#114C5A]/10">
                            <div className="text-6xl mb-6 opacity-20">🎯</div>
                            <h3 className="text-2xl font-black text-[#172B36] mb-2">No tasks found.</h3>
                            <p className="text-[#114C5A] font-bold opacity-60 italic">You have no tasks assigned at the moment.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Task Detail Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 bg-[#172B36]/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#F1F6F4]/98 backdrop-blur-[24px] w-full max-w-2xl rounded-[3rem] shadow-clay animate-in zoom-in-95 duration-300 border border-white/60 overflow-hidden">
                        <div className="p-10 border-b border-[#114C5A]/10 flex justify-between items-center text-[#172B36] bg-[#D9E8E2]/20">
                            <div className="flex items-center space-x-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-[20px] flex items-center justify-center text-[#FFC801] shadow-clay-teal border border-white/10">
                                    <CheckCircle size={32} strokeWidth={3} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight">Task Details</h2>
                                    <p className="text-[10px] text-[#114C5A]/60 font-black uppercase tracking-[0.2em] mt-1">Task Information</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-[#D9E8E2]/50 hover:bg-[#D9E8E2] text-[#114C5A]/40 hover:text-[#172B36] p-4 rounded-[20px] transition-all shadow-clay active:shadow-clay-inset border border-white activescale-95"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="p-10 space-y-12 overflow-y-auto max-h-[70vh]">
                            <div>
                                <div className="flex items-center space-x-3 text-[#FF9932] mb-5 bg-[#114C5A] w-fit px-4 py-1.5 rounded-full shadow-clay-teal border border-white/20">
                                    <FolderKanban size={18} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC801]">{selectedTask.project_id?.project_name}</span>
                                </div>
                                <h3 className="text-5xl font-black text-[#172B36] leading-tight mb-8 tracking-tighter">{selectedTask.title}</h3>
                                <div className="flex flex-wrap gap-6">
                                    <span className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-clay-inset border border-white/50 ${getStatusStyle(selectedTask.status)}`}>
                                        {selectedTask.status}
                                    </span>
                                    <div className="flex items-center space-x-3 text-[#172B36] font-black bg-[#D9E8E2]/50 px-6 py-3 rounded-full border border-[#114C5A]/10 shadow-clay-inset">
                                        <Calendar size={18} strokeWidth={3} className="text-[#FF9932]" />
                                        <span className="text-[10px] uppercase tracking-widest">Deadline: {new Date(selectedTask.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-[#FFC801] font-black bg-[#114C5A] px-6 py-3 rounded-full border border-white/10 shadow-clay-teal">
                                        <Trophy size={18} strokeWidth={3} />
                                        <span className="text-[10px] uppercase tracking-widest">Rewards: {selectedTask.exp_points || 50} XP</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <h4 className="text-[#114C5A]/40 text-[10px] font-black uppercase tracking-widest flex items-center space-x-3">
                                        <AlertCircle size={16} strokeWidth={3} className="text-[#FFC801]" />
                                        <span>Status</span>
                                    </h4>
                                    <span className="text-4xl font-black text-[#172B36]">{getProgress(selectedTask.status)}%</span>
                                </div>
                                <div className="w-full bg-[#172B36]/10 h-6 rounded-full shadow-clay-inset p-1.5">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#FFC801] to-[#FF9932] shadow-clay-yellow transition-all duration-1000 ease-out"
                                        style={{ width: `${getProgress(selectedTask.status)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-[#D9E8E2]/20 rounded-[3rem] p-10 shadow-clay-inset border border-[#114C5A]/5">
                                <h4 className="text-[#114C5A]/40 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center space-x-3">
                                    <AlignLeft size={18} strokeWidth={3} className="text-[#FF9932]" />
                                    <span>Description</span>
                                </h4>
                                <p className="text-[#172B36] text-2xl leading-relaxed font-bold italic opacity-80">
                                    "{selectedTask.description}"
                                </p>
                            </div>

                            <div className="pt-10 border-t border-[#114C5A]/10 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="flex items-center space-x-5 bg-[#D9E8E2]/50 px-8 py-5 rounded-[2.5rem] shadow-clay-inset">
                                    <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#114C5A] to-[#172B36] flex items-center justify-center text-[#FFC801] font-black text-2xl shadow-clay-teal">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#114C5A]/40 uppercase tracking-widest font-black">Assigned To</p>
                                        <p className="text-xl font-black text-[#172B36] tracking-tight">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 bg-[#172B36]/5 p-3 rounded-[2.5rem] shadow-clay-inset">
                                    {['Pending', 'In Progress', 'Completed'].map((status) => (
                                        <button
                                            key={status}
                                            disabled={updateLoading}
                                            onClick={() => handleUpdateStatus(selectedTask._id, status)}
                                            className={`px-6 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedTask.status === status
                                                ? 'bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] shadow-clay-yellow border border-white/20'
                                                : 'text-[#114C5A] hover:bg-[#D9E8E2]/50'
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
