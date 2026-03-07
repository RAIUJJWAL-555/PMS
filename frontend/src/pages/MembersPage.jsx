import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, FolderKanban, LogOut, CheckCircle2, CheckCircle,
    Users, Shield, Mail, UserPlus, Search, MoreVertical, X
} from 'lucide-react';

const MembersPage = () => {
    const { user, logout } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberStats, setMemberStats] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // For admin, fetch all members and all tasks
            // For members, fetch coworkers (already filtered by backend) and their tasks
            const [membersRes, tasksRes] = await Promise.all([
                axios.get('/api/auth/members', config),
                user?.role === 'admin' ? axios.get('/api/tasks', config) : axios.get('/api/tasks/my-tasks', config)
            ]);

            setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
            setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setLoading(false);
        }
    };

    const handleMemberClick = async (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
        setStatsLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/auth/member/${member._id}/stats`, config);
            setMemberStats(data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setStatsLoading(false);
        }
    };

    const filteredMembers = Array.isArray(members)
        ? members.filter(m => {
            // First check if they have any tasks
            const hasTask = tasks.some(t => t.assigned_to === m._id || t.assigned_to?._id === m._id);
            if (!hasTask) return false;

            // Then apply search filter
            return (m.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (m.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        })
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

                    <Link to="/projects" className="w-full flex items-center space-x-3 px-4 py-3 text-[#D9E8E2]/70 hover:bg-[#D9E8E2]/10 hover:text-[#FFC801] rounded-[16px] transition-all font-black group">
                        <FolderKanban size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Projects</span>
                    </Link>

                    <Link to="/users" className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-br from-[#FFC801] to-[#FF9932] text-[#172B36] rounded-[16px] shadow-clay-yellow transition-all font-black group">
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
                        <h1 className="text-5xl font-black text-[#172B36] tracking-tight mb-2">Team</h1>
                        <p className="text-[#114C5A] font-bold uppercase tracking-widest text-sm opacity-60">
                            {user?.role === 'admin' ? 'Members with Active Tasks' : 'Project Coworkers'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#114C5A]/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search member..."
                                className="clay-input pl-12 py-3 w-64 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {user?.role === 'admin' && (
                            <button className="clay-button-primary px-8 py-4 flex items-center space-x-2 text-sm">
                                <UserPlus size={20} strokeWidth={3} />
                                <span>ADD MEMBER</span>
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <div
                                key={member._id}
                                onClick={() => handleMemberClick(member)}
                                className="clay-card p-10 bg-[#F1F6F4] group border border-[#114C5A]/5 hover:shadow-clay-teal transition-all duration-500 flex items-center space-x-8 hover:scale-[1.03] cursor-pointer"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-[24px] flex items-center justify-center text-[#FFC801] font-black text-3xl shadow-clay-teal border border-white/10 group-hover:from-[#FFC801] group-hover:to-[#FF9932] group-hover:text-[#172B36] transition-all duration-500">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FFC801] rounded-full border-4 border-[#F1F6F4] flex items-center justify-center text-[#172B36] shadow-clay">
                                        <Shield size={14} strokeWidth={3} />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-black text-[#172B36] tracking-tight">{member.name}</h3>
                                        <button className="text-[#114C5A]/20 hover:text-[#114C5A] transition-colors p-1">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[#114C5A]/60 text-xs font-black mb-4 uppercase tracking-widest">
                                        <Mail size={12} strokeWidth={3} className="text-[#FF9932]" />
                                        <span className="truncate max-w-[150px]">{member.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-[#114C5A]/10 text-[#114C5A] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-clay-inset border border-[#114C5A]/5">
                                            Member
                                        </span>
                                        <span className="bg-[#FF9932]/10 text-[#FF9932] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-clay-inset border border-[#FF9932]/5">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-[#D9E8E2]/30 rounded-[3rem] shadow-clay-inset border-2 border-dashed border-[#114C5A]/10">
                            <div className="text-6xl mb-6 opacity-20">👤</div>
                            <h3 className="text-2xl font-black text-[#172B36] mb-2">No members found.</h3>
                            <p className="text-[#114C5A] font-bold opacity-60 italic">Try searching for another member or add a new one.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Member Stats Modal */}
            {isModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-[#172B36]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#F1F6F4]/98 backdrop-blur-[32px] w-full max-w-2xl rounded-[3rem] shadow-clay animate-in zoom-in-95 duration-300 border border-white/60 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-10 border-b border-[#114C5A]/10 flex justify-between items-center bg-[#D9E8E2]/20">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#114C5A] to-[#172B36] rounded-[20px] flex items-center justify-center text-[#FFC801] font-black text-2xl shadow-clay-teal border border-white/10">
                                    {selectedMember.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#172B36] tracking-tight">{selectedMember.name}</h2>
                                    <p className="text-[#114C5A]/60 font-bold text-sm tracking-wide">{selectedMember.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setMemberStats(null);
                                }}
                                className="text-[#114C5A]/40 hover:text-[#FF9932] transition-all bg-white/50 p-3 rounded-[16px] shadow-clay active:shadow-clay-inset"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto space-y-10">
                            {statsLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#FFC801]"></div>
                                </div>
                            ) : memberStats ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="clay-card p-6 bg-white/80 border border-[#114C5A]/5">
                                            <p className="text-[10px] font-black text-[#114C5A]/40 uppercase tracking-widest mb-2">Total Deployments</p>
                                            <p className="text-4xl font-black text-[#172B36]">{memberStats.totalProjects}</p>
                                        </div>
                                        <div className="clay-card p-6 bg-[#FFC801]/10 border border-[#FFC801]/20">
                                            <p className="text-[10px] font-black text-[#FF9932] uppercase tracking-widest mb-2">Leadership</p>
                                            <p className="text-4xl font-black text-[#172B36]">{memberStats.ledProjects.length}</p>
                                        </div>
                                        <div className="clay-card p-6 bg-[#114C5A] border border-white/10">
                                            <p className="text-[10px] font-black text-[#FFC801] uppercase tracking-widest mb-2">Total Points</p>
                                            <p className="text-4xl font-black text-white">{memberStats.points || 0}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-black text-[#172B36] flex items-center space-x-3 uppercase tracking-widest">
                                            <div className="w-8 h-8 bg-[#114C5A] rounded-[10px] flex items-center justify-center text-[#FFC801] shadow-clay">
                                                <FolderKanban size={16} />
                                            </div>
                                            <span>ENROLLED PROJECTS</span>
                                        </h3>

                                        <div className="space-y-4">
                                            {[...memberStats.ledProjects, ...memberStats.taskProjects].length > 0 ? (
                                                [...memberStats.ledProjects.map(p => ({ ...p, isLead: true })), ...memberStats.taskProjects.map(p => ({ ...p, isLead: false }))].map((project) => (
                                                    <div key={project._id} className="flex items-center justify-between p-5 bg-white rounded-[20px] shadow-clay-inset border border-[#114C5A]/5">
                                                        <div>
                                                            <p className="font-black text-[#172B36] leading-tight">{project.project_name}</p>
                                                            <p className="text-[10px] font-bold text-[#114C5A]/40 mt-1 italic line-clamp-1">"{project.description}"</p>
                                                        </div>
                                                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-clay-yellow border border-white/50 ${project.isLead ? 'bg-[#FF9932]/20 text-[#FF9932]' : 'bg-[#D9E8E2] text-[#114C5A]'}`}>
                                                            {project.isLead ? 'Lead' : 'Member'}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center py-6 text-[#114C5A]/40 font-bold italic">No active projects found for this member.</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-[#114C5A]/40 font-bold italic">Error loading stats.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembersPage;
