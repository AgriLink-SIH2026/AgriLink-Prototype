import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  PlusCircle,
  Sprout,
  Milestone,
  Store,
  Bell,
  Users,
  Calendar,
  Scale,
  Receipt,
  BarChart3,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  if (!currentUser) return null;

  const farmerNav = [
    { label: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/farmer/profile', icon: User },
    { label: 'Register Crop', path: '/farmer/crops/register', icon: PlusCircle, highlight: true },
    { label: 'My Crops', path: '/farmer/crops', icon: Sprout },
    { label: 'Procurement Status', path: '/farmer/procurement', icon: Milestone },
    { label: 'Factory Marketplace', path: '/farmer/marketplace', icon: Store, highlight: true },
    { label: 'Notifications', path: '/farmer/notifications', icon: Bell },
  ];

  const factoryNav = [
    { label: 'Dashboard', path: '/factory/dashboard', icon: LayoutDashboard },
    { label: 'Farmers', path: '/factory/farmers', icon: Users },
    { label: 'Registered Crops', path: '/factory/crops', icon: Sprout },
    { label: 'Procurement Queue', path: '/factory/procurement', icon: Milestone, highlight: true },
    { label: 'Scheduling', path: '/factory/scheduling', icon: Calendar },
    { label: 'Quality & Weighment', path: '/factory/quality', icon: Scale },
    { label: 'Billing & Invoices', path: '/factory/billing', icon: Receipt },
    { label: 'Analytics', path: '/factory/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/factory/notifications', icon: Bell },
  ];

  const navItems = currentUser.role === 'farmer' ? farmerNav : factoryNav;

  const workspaceLabel = currentUser.role === 'farmer' ? 'FARMER WORKSPACE' : 'FACTORY WORKSPACE';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#132619]/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#173522] text-[#EBE5D6] border-r border-[#244532] flex flex-col justify-between py-6 px-4 z-40 transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Logo matching Screenshot 1 */}
          <div className="px-2 pt-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97824] flex items-center justify-center text-white shadow-sm font-serif font-black text-xl shrink-0">
              A
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#EBE5D6] block leading-none">
                AgriLink
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#EBE5D6]/60 block mt-1">
                {workspaceLabel}
              </span>
            </div>
          </div>

          {/* Section Category */}
          <div>
            <div className="px-3 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#EBE5D6]/40">
                MAIN
              </p>
            </div>

            {/* Nav items list matching Screenshot 1 */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#D97824] text-white shadow-xs'
                        : 'text-[#EBE5D6]/80 hover:text-white hover:bg-[#244532]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#EBE5D6]/60'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Profile card matching Screenshot 1 */}
        <div className="pt-4 border-t border-[#244532] space-y-2">
          <div className="p-3 bg-[#12281A] rounded-2xl border border-[#244532] text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#244532] text-[#D97824] font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#EBE5D6] truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#EBE5D6]/50 truncate leading-tight capitalize mt-0.5">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#EBE5D6]/70 hover:text-[#D97824] hover:bg-[#244532] rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
