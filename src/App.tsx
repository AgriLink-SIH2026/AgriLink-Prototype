import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoBanner } from './components/layout/DemoBanner';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerProfile } from './pages/farmer/FarmerProfile';
import { FarmerCrops } from './pages/farmer/FarmerCrops';
import { RegisterCropPage } from './pages/farmer/RegisterCropPage';
import { FarmerProcurement } from './pages/farmer/FarmerProcurement';
import { FactoryLocator } from './pages/farmer/FactoryLocator';
import { FarmerNotifications } from './pages/farmer/FarmerNotifications';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerFarmers } from './pages/officer/OfficerFarmers';
import { OfficerVerification } from './pages/officer/OfficerVerification';
import { OfficerReports } from './pages/officer/OfficerReports';
import { OfficerNotifications } from './pages/officer/OfficerNotifications';

// Factory Pages
import { FactoryDashboard } from './pages/factory/FactoryDashboard';
import { FactoryFarmers } from './pages/factory/FactoryFarmers';
import { FactoryCrops } from './pages/factory/FactoryCrops';
import { FactoryProcurement } from './pages/factory/FactoryProcurement';
import { FactoryScheduling } from './pages/factory/FactoryScheduling';
import { FactoryTransport } from './pages/factory/FactoryTransport';
import { FactoryQuality } from './pages/factory/FactoryQuality';
import { FactoryBilling } from './pages/factory/FactoryBilling';
import { FactoryAnalytics } from './pages/factory/FactoryAnalytics';
import { FactoryNotifications } from './pages/factory/FactoryNotifications';

const Router: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.origin === window.location.origin &&
        !target.hasAttribute('download') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        const url = new URL(target.href);
        const path = url.pathname + url.search;
        window.history.pushState(null, '', path);
        setCurrentPath(url.pathname);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('agrilink_navigate', handleNavigation);
    document.addEventListener('click', handleLinkClick);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('agrilink_navigate', handleNavigation);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const isPublicPage =
    currentPath === '/' || currentPath === '/login' || currentPath === '/signup';

  // Render matching view
  const renderContent = () => {
    // 1. Public Routes
    if (currentPath === '/') return <LandingPage />;
    if (currentPath === '/login') return <LoginPage />;
    if (currentPath === '/signup') return <SignupPage />;

    // 2. Farmer Routes (Protected, role = farmer)
    if (currentPath.startsWith('/farmer/')) {
      return (
        <ProtectedRoute allowedRole="farmer" currentPath={currentPath}>
          {(() => {
            switch (currentPath) {
              case '/farmer/dashboard':
                return <FarmerDashboard />;
              case '/farmer/profile':
                return <FarmerProfile />;
              case '/farmer/crops':
                return <FarmerCrops />;
              case '/farmer/crops/register':
                return <RegisterCropPage />;
              case '/farmer/procurement':
                return <FarmerProcurement />;
              case '/farmer/factories':
                return <FactoryLocator />;
              case '/farmer/notifications':
                return <FarmerNotifications />;
              default:
                return <FarmerDashboard />;
            }
          })()}
        </ProtectedRoute>
      );
    }

    // 3. Officer Routes (Protected, role = officer)
    if (currentPath.startsWith('/officer/')) {
      return (
        <ProtectedRoute allowedRole="officer" currentPath={currentPath}>
          {(() => {
            switch (currentPath) {
              case '/officer/dashboard':
                return <OfficerDashboard />;
              case '/officer/farmers':
                return <OfficerFarmers />;
              case '/officer/verification':
                return <OfficerVerification />;
              case '/officer/inspection-reports':
                return <OfficerReports />;
              case '/officer/notifications':
                return <OfficerNotifications />;
              default:
                return <OfficerDashboard />;
            }
          })()}
        </ProtectedRoute>
      );
    }

    // 4. Factory Routes (Protected, role = factory)
    if (currentPath.startsWith('/factory/')) {
      return (
        <ProtectedRoute allowedRole="factory" currentPath={currentPath}>
          {(() => {
            switch (currentPath) {
              case '/factory/dashboard':
                return <FactoryDashboard />;
              case '/factory/farmers':
                return <FactoryFarmers />;
              case '/factory/crops':
                return <FactoryCrops />;
              case '/factory/procurement':
                return <FactoryProcurement />;
              case '/factory/scheduling':
                return <FactoryScheduling />;
              case '/factory/transport':
                return <FactoryTransport />;
              case '/factory/quality':
                return <FactoryQuality />;
              case '/factory/billing':
                return <FactoryBilling />;
              case '/factory/analytics':
                return <FactoryAnalytics />;
              case '/factory/notifications':
                return <FactoryNotifications />;
              default:
                return <FactoryDashboard />;
            }
          })()}
        </ProtectedRoute>
      );
    }

    // Default fallback to Landing Page
    return <LandingPage />;
  };

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#F2EEE2] flex flex-col font-sans text-[#192019]">
        <DemoBanner />
        <main className="flex-1">{renderContent()}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EEE2] flex flex-col font-sans text-[#192019]">
      <DemoBanner />
      <div className="flex-1 flex w-full">
        <Sidebar
          currentPath={currentPath}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppDataProvider>
          <Router />
        </AppDataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
