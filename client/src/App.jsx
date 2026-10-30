import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReadingProvider } from './context/ReadingContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { AudioProvider } from './context/AudioContext';
import { LanguageProvider } from './context/LanguageContext';
import { PWAProvider } from './context/PWAContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SearchModal from './components/common/SearchModal';
import AudioPlayerBar from './components/audio/AudioPlayerBar';
import InstallModal from './components/pwa/InstallModal';
import OfflineBanner from './components/pwa/OfflineBanner';

import HomePage from './pages/HomePage';
import SurahsPage from './pages/SurahsPage';
import SurahDetailPage from './pages/SurahDetailPage';
import AyahDetailPage from './pages/AyahDetailPage';
import SciencePage from './pages/SciencePage';
import ScienceDetailPage from './pages/ScienceDetailPage';
import TopicsPage from './pages/TopicsPage';
import TopicDetailPage from './pages/TopicDetailPage';
import AITutorPage from './pages/AITutorPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    window.onOpenSearchGlobal = () => setIsSearchOpen(true);
    return () => {
      delete window.onOpenSearchGlobal;
    };
  }, []);

  return (
    <LanguageProvider>
      <PWAProvider>
        <AuthProvider>
          <ReadingProvider>
            <BookmarkProvider>
              <AudioProvider>
                <Router>
                  <ScrollToTop />
                  <div className="min-h-screen flex flex-col bg-ivory-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-ivory-100 transition-colors selection:bg-emerald-700 selection:text-white">
                    
                    {/* Top Offline / Update Banner */}
                    <OfflineBanner />

                    {/* Global Navbar */}
                    <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

                    {/* Main Content Viewport */}
                    <main className="flex-1 pb-16">
                    <Routes>
                      <Route path="/" element={<HomePage onOpenSearch={() => setIsSearchOpen(true)} />} />
                      <Route path="/surahs" element={<SurahsPage />} />
                      <Route path="/surah/:surahNumber" element={<SurahDetailPage />} />
                      <Route path="/ayah/:surah/:ayah" element={<AyahDetailPage />} />
                      <Route path="/science" element={<SciencePage />} />
                      <Route path="/science/:slug" element={<ScienceDetailPage />} />
                      <Route path="/topics" element={<TopicsPage />} />
                      <Route path="/topics/:slug" element={<TopicDetailPage />} />
                      <Route path="/ai-tutor" element={<AITutorPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>

                  {/* Sticky Audio Player Bar */}
                  <AudioPlayerBar />

                  {/* Search Modal */}
                  <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

                  {/* Global Footer */}
                  <Footer />

                  {/* PWA Custom Install Modal */}
                  <InstallModal />
                  
                </div>
              </Router>
            </AudioProvider>
          </BookmarkProvider>
        </ReadingProvider>
      </AuthProvider>
    </PWAProvider>
  </LanguageProvider>
  );
}
