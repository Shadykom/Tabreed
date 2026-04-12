import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import './i18n';
import './index.scss';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
