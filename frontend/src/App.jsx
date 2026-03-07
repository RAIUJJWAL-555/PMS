import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectDashboard from './pages/ProjectDashboard';
import TaskPage from './pages/TaskPage';
import MyTasksPage from './pages/MyTasksPage';
import ProjectsPage from './pages/ProjectsPage';
import MembersPage from './pages/MembersPage';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Loading component
const Loading = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F6F4]">
        <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FFC801] shadow-[0_0_15px_rgba(255,200,1,0.3)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#FF9932] rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" replace />;

    // Optional: Role-based access control
    if (roles && user && !roles.includes(user.role)) {
        // Redirect to dashboard or an unauthorized page if user doesn't have required role
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppContent = () => {
    const { loading } = useContext(AuthContext);

    if (loading) return <Loading />;

    return (
        <Router>
            <div className="min-h-screen font-semibold bg-[#F1F6F4] text-[#172B36] selection:bg-[#FFC801]/30">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <ProjectDashboard />
                            </ProtectedRoute>
                        } />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <ProjectsPage />
                            </ProtectedRoute>
                        } />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <MembersPage />
                            </ProtectedRoute>
                        } />
                    <Route
                        path="/tasks"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <TaskPage />
                            </ProtectedRoute>
                        } />
                    <Route
                        path="/my-tasks"
                        element={
                            <ProtectedRoute>
                                <MyTasksPage />
                            </ProtectedRoute>
                        } />
                    {/* Catch all to redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
