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
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

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

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/auth" element={<Auth />} />

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
