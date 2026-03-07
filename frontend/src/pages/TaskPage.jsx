import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    PlusSquare, X, CheckCircle2, CheckCircle, Clock, AlertCircle,
    Calendar, FolderKanban, LayoutDashboard, Users, LogOut, Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskPage = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assigned_to: '',
        project_id: '',
        deadline: '',
        status: 'Pending',
        exp_points: 50
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [tasksRes, projectsRes, membersRes] = await Promise.all([
                axios.get('/api/tasks', config).catch(e => ({ data: [] })),
                axios.get('/api/projects', config).catch(e => ({ data: [] })),
                axios.get('/api/auth/members', config).catch(e => ({ data: [] }))
            ]);

            setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
            setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
            setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setMessage('Error loading data. Please refresh.');
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/tasks', newTask, config);
            setIsModalOpen(false);
            setNewTask({
                title: '',
                description: '',
                assigned_to: '',
                project_id: '',
                deadline: '',
                status: 'Pending',
                exp_points: 50
            });
            fetchData();
            setMessage('Task created successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Failed to create task');
            setMessage(err.response?.data?.message || 'Failed to create task');
            setTimeout(() => setMessage(''), 3000);
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
                        <Link to="/tasks" className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] rounded-[16px] shadow-clay-yellow transition-all font-black group">
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
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-[#172B36] tracking-tight mb-2">All Tasks</h1>
                        <p className="text-[#114C5A] font-bold uppercase tracking-widest text-sm opacity-60">Manage all project tasks</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="clay-button-primary px-10 py-5 flex items-center space-x-3"
                    >
                        <PlusSquare size={22} strokeWidth={3} />
                        <span>CREATE TASK</span>
                    </button>
                </header>

                {message && <div className="max-w-md mx-auto bg-[#FFC801]/20 text-[#114C5A] p-5 rounded-[20px] mb-8 text-center font-black shadow-clay-yellow border border-[#FFC801]/30 animate-bounce">{message}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task._id} className="clay-card p-10 bg-[#F1F6F4] group border border-[#114C5A]/5 hover:shadow-clay-teal transition-all duration-500 flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex flex-col">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-clay-inset border border-white/50 w-fit mb-4 ${getStatusStyle(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <h3 className="text-2xl font-black text-[#172B36] group-hover:text-[#FF9932] transition-colors">{task.title}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-[16px] flex flex-col items-center justify-center text-[#FFC801] shadow-clay-teal border border-white/10 group-hover:from-[#FFC801] group-hover:to-[#FF9932] group-hover:text-[#172B36] transition-all">
                                        <Trophy size={18} className="mb-0.5" />
                                        <span className="text-[8px] font-black">{task.exp_points || 50}</span>
                                    </div>
                                </div>

                                <p className="text-[#114C5A] text-sm font-bold opacity-70 mb-10 leading-relaxed italic line-clamp-2">"{task.description}"</p>

                                <div className="space-y-6 bg-[#D9E8E2]/30 p-6 rounded-[24px] shadow-clay-inset mb-10 border border-[#114C5A]/5">
                                    <div className="flex items-center space-x-5">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#FFC801] to-[#FF9932] rounded-xl flex items-center justify-center font-black text-[#172B36] shadow-clay-yellow border border-white/50">{task.assigned_to?.name?.charAt(0) || 'U'}</div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/40 mb-1">Assigned To</p>
                                            <p className="text-sm font-black text-[#114C5A]">{task.assigned_to?.name || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="w-10 h-10 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A] shadow-clay-inset"><FolderKanban size={20} strokeWidth={3} /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#114C5A]/40 mb-1">Project</p>
                                            <p className="text-sm font-black text-[#114C5A]">{task.project_id?.project_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#114C5A]/10">
                                    <div className="flex items-center space-x-3 text-[#FF9932] font-black bg-[#114C5A] px-4 py-2 rounded-full shadow-clay-teal">
                                        <Calendar size={14} strokeWidth={3} />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFC801]">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No date'}</span>
                                    </div>
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#FFC801] to-[#FF9932] shadow-sm"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-[#D9E8E2]/30 rounded-[3rem] shadow-clay-inset border-2 border-dashed border-[#114C5A]/10">
                            <div className="text-6xl mb-6 opacity-20">📝</div>
                            <h3 className="text-2xl font-black text-[#172B36] mb-2">No tasks found.</h3>
                            <p className="text-[#114C5A] font-bold opacity-60 italic">Start by creating a new task for your projects.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Creating Task */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#172B36]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#F1F6F4]/98 backdrop-blur-[24px] w-full max-w-xl rounded-[3rem] shadow-clay animate-in zoom-in-95 duration-300 border border-white/60">
                        <div className="p-10 border-b border-[#114C5A]/10 flex justify-between items-center text-[#172B36]">
                            <h2 className="text-4xl font-black tracking-tight">New Task</h2>
                            <button onClick={() => setIsModalOpen(false)} className="bg-[#D9E8E2]/50 hover:bg-[#D9E8E2] text-[#114C5A]/40 hover:text-[#172B36] p-4 rounded-[20px] transition-all shadow-clay active:shadow-clay-inset">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTask} className="p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Task Title</label>
                                    <input
                                        type="text"
                                        className="w-full clay-input"
                                        placeholder="Enter task title..."
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full clay-input"
                                        value={newTask.deadline}
                                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Reward EXP</label>
                                    <input
                                        type="number"
                                        className="w-full clay-input"
                                        placeholder="Points (e.g. 100)"
                                        value={newTask.exp_points}
                                        onChange={(e) => setNewTask({ ...newTask, exp_points: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Project</label>
                                <select
                                    className="w-full clay-input"
                                    value={newTask.project_id}
                                    onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.project_name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Assign To</label>
                                <select
                                    className="w-full clay-input"
                                    value={newTask.assigned_to}
                                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                                    required
                                >
                                    <option value="">Select Team Member (Ranked by Pts)</option>
                                    {members.sort((a, b) => (b.points || 0) - (a.points || 0)).map(m => (
                                        <option key={m._id} value={m._id}>{m.name} — {m.points || 0} pts</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[#114C5A]/60 text-xs font-black uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    className="w-full clay-input resize-none"
                                    rows="3"
                                    placeholder="Enter task description..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full clay-button-primary py-5 text-lg mt-4 font-black">
                                CREATE TASK
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskPage;
