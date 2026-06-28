import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CoachDashboard from './pages/CoachDashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import VideoCall from './pages/VideoCall';

// New Pages
import Gamification from './pages/Gamification';
import TrialExams from './pages/TrialExams';
import Analytics from './pages/Analytics';
import Planner from './pages/Planner';
import Discovery from './pages/Discovery';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Yükleniyor...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRole && userRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'student' ? '/student' : '/coach'} />;
  }
  return children;
};

// Component to handle AnimatePresence with router
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/student" 
          element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} 
        >
          {/* Default child route or can be separate routes. Let's make them separate for simplicity if we don't have nested routing set up */}
        </Route>
        
        {/* Student Feature Routes - Wrapped in layout usually, but for now we navigate standalone or wrap with Dashboard Layout */}
        <Route path="/student/gamification" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Gamification /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/trial-exams" element={<ProtectedRoute allowedRole="student"><StudentDashboard><TrialExams /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/analytics" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Analytics /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/planner" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Planner /></StudentDashboard></ProtectedRoute>} />
        <Route path="/student/discovery" element={<ProtectedRoute allowedRole="student"><StudentDashboard><Discovery /></StudentDashboard></ProtectedRoute>} />

        <Route 
          path="/coach" 
          element={<ProtectedRoute allowedRole="coach"><CoachDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
        <Route 
          path="/messages" 
          element={<ProtectedRoute><Messages /></ProtectedRoute>} 
        />
        <Route 
          path="/video-call" 
          element={<ProtectedRoute><VideoCall /></ProtectedRoute>} 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
