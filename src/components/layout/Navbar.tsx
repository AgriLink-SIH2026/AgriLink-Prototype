import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { RoleBadge } from './RoleBadge';
import { JudgeDemoModal } from './JudgeDemoModal';
import { navigate } from '../../utils/navigation';
import {
  Sprout,
  Bell,
  LogOut,
  CheckCheck,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  // Filter notifications for current user
  const userNotifs = currentUser
    ? notifications.filter((n) => n.recipientUserId === currentUser.id)
    : [];
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'TG';

  return (
    <>
      <header className="bg-[#F3EFE4] border-b border-[#DFD7C4] sticky top-0 z-30 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="lg:hidden p-2 rounded-xl text-[#171713] hover:bg-[#EBE5D6] transition"
                  aria-label="Toggle menu"
                >
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              <a href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-[#173522] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <span className="font-serif font-black text-base text-[#D97824]">A</span>
                </div>
                <div>
                  <span className="font-serif text-lg font-bold tracking-tight text-[#171713] flex items-center gap-1 leading-tight">
                    Agri<span className="text-[#D97824]">Link</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#777268] block leading-none">
                    Procurement Network
                  </span>
                </div>
              </a>
            </div>

            {/* Right Navigation controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* SIH Judge Demo Trigger */}
              <button
                type="button"
                onClick={() => setIsJudgeModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] text-xs font-bold transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97824]" />
                <span>Judge Demo</span>
              </button>

              {currentUser && (
                <>
                  <div className="hidden md:block">
                    <RoleBadge role={currentUser.role} />
                  </div>

                  {/* Notifications Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-[#777268] hover:text-[#171713] hover:bg-[#EBE5D6] rounded-xl transition"
                      aria-label="View notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#D97824] text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-[#F3EFE4]">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Popover */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF7F0] rounded-2xl shadow-xl border border-[#DFD7C4] overflow-hidden z-50 animate-in fade-in zoom-in-95">
                        <div className="p-3.5 bg-[#EBE5D6] border-b border-[#DFD7C4] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-sm text-[#171713]">
                              Notifications
                            </h4>
                            {unreadCount > 0 && (
                              <span className="bg-[#173522] text-[#EBE5D6] text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllNotificationsRead}
                              className="text-xs text-[#D97824] hover:text-[#C3681B] font-semibold flex items-center gap-1"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-[#DFD7C4]">
                          {userNotifs.length === 0 ? (
                            <div className="p-6 text-center text-[#777268] text-xs">
                              No notifications yet.
                            </div>
                          ) : (
                            userNotifs.slice(0, 6).map((n) => (
                              <div
                                key={n.id}
                                onClick={() => {
                                  markNotificationRead(n.id);
                                  if (n.linkUrl) navigate(n.linkUrl);
                                }}
                                className={`p-3.5 text-left hover:bg-white cursor-pointer transition ${
                                  !n.isRead ? 'bg-[#EBE5D6]/50' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-bold text-[#171713]">{n.title}</p>
                                  <span className="text-[10px] text-[#777268] shrink-0">
                                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-[#777268] mt-1 line-clamp-2">
                                  {n.message}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="p-2.5 bg-[#EBE5D6] border-t border-[#DFD7C4] text-center">
                          <a
                            href={`/${currentUser.role}/notifications`}
                            className="text-xs text-[#173522] hover:text-[#D97824] font-semibold inline-flex items-center gap-1"
                          >
                            View all notifications
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Info & Avatar Circle matching Screenshot 1 */}
                  <div className="flex items-center gap-3 pl-2 border-l border-[#DFD7C4]">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-[#171713] leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-[#777268] leading-tight capitalize">
                        {currentUser.role}
                      </p>
                    </div>

                    {/* Circle Avatar (e.g. TG in Screenshot 1) */}
                    <div className="w-9 h-9 rounded-full bg-[#173522] text-[#EBE5D6] font-bold text-xs flex items-center justify-center shadow-2xs border border-[#244532]">
                      {initials}
                    </div>

                    <button
                      onClick={logout}
                      title="Sign Out"
                      className="p-2 text-[#777268] hover:text-rose-700 hover:bg-[#EBE5D6] rounded-xl transition"
                      aria-label="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              {!currentUser && (
                <div className="flex items-center gap-2">
                  <a
                    href="/login"
                    className="px-3.5 py-2 text-xs font-semibold text-[#171713] hover:bg-[#EBE5D6] rounded-xl transition"
                  >
                    Log In
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 text-xs font-bold text-[#EBE5D6] bg-[#173522] hover:bg-[#244532] rounded-xl shadow-xs transition"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SIH Judge Demo Modal */}
      <JudgeDemoModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />
    </>
  );
};

