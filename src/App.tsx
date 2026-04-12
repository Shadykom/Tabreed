import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import Departments from './pages/Departments';
import PoliciesPage from './pages/PoliciesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SettingsPage from './pages/SettingsPage';
import UserAccount from './pages/UserAccount';
import ServiceRequest from './pages/ServiceRequest';
import ChairmanPage from './pages/ChairmanPage';
import Login from './pages/Login';
import Admin from './pages/admin/Admin';
import './i18n';
import './index.scss';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/policies" element={<PoliciesPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/services" element={<ServiceRequest />} />
                <Route path="/chairman" element={<ChairmanPage />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
