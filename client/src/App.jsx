import { Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import CreateProjectPage from './pages/CreateProjectPage';
import EditProfilePage from './pages/EditProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <Layout>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/users/:id" element={<ProfilePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/projects/:id" element={<ProjectPage />} />
      {/* Protected Routes */}
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/projects/new" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
        
        
      </Routes>
    </Layout>
  )
}

export default App