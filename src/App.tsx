import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { VideosProvider } from '@/contexts/VideosContext';
import { HomePage } from '@/pages/HomePage';
import { VideosPage } from '@/pages/VideosPage';
import { VideoPlayerPage } from '@/pages/VideoPlayerPage';
import { NewVideoPage } from '@/pages/NewVideoPage';
import { VideoManagementPage } from '@/pages/VideoManagementPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './index.css';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/videos/create" element={<NewVideoPage />} />
      <Route path="/videos/:id" element={<VideoPlayerPage />} />
      <Route path="/manage" element={<VideoManagementPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <VideosProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col">
          <Navbar />
          <main className="pt-16 sm:pt-20 flex-1">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </VideosProvider>
  );
}