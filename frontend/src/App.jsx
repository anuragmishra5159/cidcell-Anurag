import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Developers from './pages/Developers';
import Roadmap from './pages/Roadmap';
import MentorHub from './pages/FindMentor';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import ProjectDetail from './pages/ProjectDetail';
import SubmitProject from './pages/SubmitProject';
import MyProjects from './pages/MyProjects';
import EventDetail from './pages/EventDetail';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Admin Imports
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import UserManagement from './admin/pages/UserManagement';
import ProjectManagement from './admin/pages/ProjectManagement';
import EventManagement from './admin/pages/EventManagement';
import MemberManagement from './admin/pages/MemberManagement';
import MentorDashboard from './mentor/pages/MentorDashboard';
import MentorChat from './mentor/pages/MentorChat';
import StudentChat from './student/pages/StudentChat';

// Faculty Imports
import FacultyDashboard from './faculty/pages/FacultyDashboard';
import ProposeEvent from './faculty/pages/ProposeEvent';

import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// Component to protect routes that require login
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null; // Or a spinner
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;

  return children;
};

// Check if a user's profile meets ALL required fields
const isProfileComplete = (user) => {
  if (!user) return false;
  if (user.userType === 'mentor') {
    return !!(user.domainOfExpertise && user.department && user.aboutMentor);
  }
  return (
    user.branch &&
    user.batch &&
    user.skills && user.skills.length > 0 &&
    user.socialLinks?.linkedin &&
    user.socialLinks?.github
  );
};

// Component to force onboarding if profile is incomplete
const OnboardingGuard = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  // Redirect to onboarding if any required field is missing
  if (user && !isProfileComplete(user) && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

// Component to protect routes that require admin role
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user || user.userType?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Component to protect routes that require mentor role
const MentorRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user || user.userType !== 'mentor') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Component to protect routes that require faculty role
const FacultyRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user || user.userType !== 'faculty') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <ScrollToTop />}
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/submit" element={
            <PrivateRoute>
              <OnboardingGuard>
                <SubmitProject />
              </OnboardingGuard>
            </PrivateRoute>
          } />
          <Route path="/projects/mine" element={
            <PrivateRoute>
              <OnboardingGuard>
                <MyProjects />
              </OnboardingGuard>
            </PrivateRoute>
          } />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/mentors" element={<MentorHub />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <OnboardingGuard>
                <Dashboard />
              </OnboardingGuard>
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <OnboardingGuard>
                <Profile />
              </OnboardingGuard>
            </PrivateRoute>
          } />

          <Route path="/onboarding" element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          } />

          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />

          <Route path="/find-mentor" element={
            <PrivateRoute>
              <MentorHub />
            </PrivateRoute>
          } />

          <Route path="/student/chat" element={
            <PrivateRoute>
              <StudentChat />
            </PrivateRoute>
          } />

          {/* Mentor Routes */}
          <Route path="/mentor/dashboard" element={
            <MentorRoute>
              <MentorDashboard />
            </MentorRoute>
          } />
          <Route path="/mentor/chat" element={
            <MentorRoute>
              <MentorChat />
            </MentorRoute>
          } />

          {/* Faculty Routes */}
          <Route path="/faculty/dashboard" element={
            <FacultyRoute>
              <FacultyDashboard />
            </FacultyRoute>
          } />
          <Route path="/faculty/propose-event" element={
            <FacultyRoute>
              <ProposeEvent />
            </FacultyRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="members" element={<MemberManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
export default App;
