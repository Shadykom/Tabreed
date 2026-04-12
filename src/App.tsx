import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Admin from './pages/admin/Admin';
import './i18n';
import './index.scss';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
