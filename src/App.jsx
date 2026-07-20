import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CoachDashboard from './pages/CoachDashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import VideoCall from './pages/VideoCall';

// Student Feature Pages
import Gamification from './pages/Gamification';
import TrialExams from './pages/TrialExams';
import Analytics from './pages/Analytics';
import Planner from './pages/Planner';
import Discovery from './pages/Discovery';
import MoodAnalysis from './pages/MoodAnalysis';
import OsymTarget from './pages/OsymTarget';
import OsymCurriculum from './pages/OsymCurriculum';
import Goals from './pages/Goals';
import CoachAdvice from './pages/CoachAdvice';
import StudyMapPage from './pages/StudyMapPage';
import StudyMethodGuide from './pages/StudyMethodGuide';
import LiveLeaderboard from './pages/LiveLeaderboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)'
    }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <span>Yükleniyor...</span>
      </div>
    </div>
  );

  if (!currentUser) return <Navigate to="/login" />;
  
  if (allowedRole && userRole !== allowedRole) {
    if (userRole === 'coach') return <Navigate to="/coach" />;
    return <Navigate to="/student" />;
  }
  
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/study-map" element={<ProtectedRoute allowedRole="student"><StudentDashboard><StudyMapPage /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/planner" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Planner /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/goals" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Goals /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/gamification" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Gamification /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/trial-exams" element={<ProtectedRoute allowedRole="student"><StudentDashboard><TrialExams /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/analytics" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Analytics /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/mood" element={<ProtectedRoute allowedRole="student"><StudentDashboard><MoodAnalysis /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/discovery" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Discovery /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/osym-target" element={<ProtectedRoute allowedRole="student"><StudentDashboard><OsymTarget /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/osym-curriculum" element={<ProtectedRoute allowedRole="student"><StudentDashboard><OsymCurriculum /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/coach-advice" element={<ProtectedRoute allowedRole="student"><StudentDashboard><CoachAdvice /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/study-methods" element={<ProtectedRoute allowedRole="student"><StudentDashboard><StudyMethodGuide /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/leaderboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard><LiveLeaderboard /></StudentDashboard></ProtectedRoute>} />

        {/* Coach Routes */}
        <Route path="/coach" element={<ProtectedRoute allowedRole="coach"><CoachDashboard /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/video-call" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
