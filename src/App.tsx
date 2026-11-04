import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Locale } from './types/boutique';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { DesignDetailsPage } from './pages/DesignDetailsPage';
import { ServicesPage } from './pages/ServicesPage';
import { VirtualBoutiquePage } from './pages/VirtualBoutiquePage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { AdminPage } from './pages/AdminPage';

const LocalizedShell: React.FC = () => {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  if (rawLocale !== 'en' && rawLocale !== 'ar') {
    return <Navigate to="/en" replace />;
  }
  const locale: Locale = rawLocale;

  return (
    <Routes>
      <Route
        index
        element={
          <Layout locale={locale}>
            <HomePage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="collections"
        element={
          <Layout locale={locale}>
            <CollectionsPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="designs/:slug"
        element={
          <Layout locale={locale}>
            <DesignDetailsPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="services"
        element={
          <Layout locale={locale}>
            <ServicesPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="virtual-boutique"
        element={
          <Layout locale={locale} hideFooter>
            <VirtualBoutiquePage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="gallery"
        element={
          <Layout locale={locale}>
            <GalleryPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="about"
        element={
          <Layout locale={locale}>
            <AboutPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="contact"
        element={
          <Layout locale={locale}>
            <ContactPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="custom-order"
        element={
          <Layout locale={locale}>
            <CustomOrderPage locale={locale} />
          </Layout>
        }
      />
      <Route
        path="admin"
        element={
          <Layout locale={locale}>
            <AdminPage locale={locale} />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to={`/${locale}`} replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:locale/*" element={<LocalizedShell />} />
          <Route path="*" element={<Navigate to="/en" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
