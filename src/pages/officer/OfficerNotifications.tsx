import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Bell, CheckCheck, ExternalLink, CheckCircle2 } from 'lucide-react';

export const OfficerNotifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();

  const userNotifs = currentUser
    ? notifications.filter(
        (n) => n.recipientUserId === currentUser.id || n.recipientRole === 'officer'
      )
    : [];

  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-blue-700" />
            <span>Field Officer Dispatch Desk</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Officer Notifications &amp; Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            New crop submissions, farmer responses, and mill verification assignments.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {userNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No officer notifications logged</p>
          </div>
        ) : (
          userNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.isRead ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!item.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markNotificationRead(item.id)}
                    className="p-2 text-slate-400 hover:text-blue-700 rounded-lg text-xs"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
