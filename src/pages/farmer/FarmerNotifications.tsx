import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import {
  Bell,
  CheckCheck,
  Smartphone,
  Radio,
  ExternalLink,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const FarmerNotifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const userNotifs = currentUser
    ? notifications.filter((n) => n.recipientUserId === currentUser.id)
    : [];

  const filtered = userNotifs.filter((n) => {
    if (categoryFilter === 'all') return true;
    return n.category === categoryFilter;
  });

  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-emerald-700" />
            <span>Multi-Channel Communication Dispatcher</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifications &amp; Alerts Inbox
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time procurement updates dispatched via In-App, SMS text alerts, and automated IVR voice calls.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'crop', 'verification', 'procurement', 'transport', 'payment'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              categoryFilter === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No notifications in this category</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.isRead ? 'bg-emerald-50/30' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                {/* Delivery Channel Badges */}
                <div className="flex items-center gap-2 pt-1.5 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    In-App
                  </span>

                  {item.channels.sms && (
                    <span className="flex items-center gap-1 font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                      <Smartphone className="w-3 h-3 text-blue-600" />
                      SMS Carrier Dispatch
                    </span>
                  )}

                  {item.channels.ivr && (
                    <span className="flex items-center gap-1 font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Radio className="w-3 h-3 text-amber-600" />
                      Automated IVR Call
                    </span>
                  )}

                  <span className="text-slate-400 text-[10px] ml-auto">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markNotificationRead(item.id)}
                    className="p-2 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 text-xs font-semibold transition"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}

                {item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>Open</span>
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
