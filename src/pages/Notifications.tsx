import React from 'react';
import { useSim } from '../sim/store';
import { Card, SectionHeader, EmptyState } from '../components/ui';
import { Bell, MessageSquare, Globe, ArrowRight } from 'lucide-react';

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export function Notifications() {
  const { state } = useSim();
  const notifications = state.notifications || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <SectionHeader 
        icon={<Bell className="w-5 h-5" />} 
        title="Notifications Center" 
        subtitle="System alerts and citizen messages"
      />

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="w-8 h-8" />} title="No notifications yet" message="When events occur in the system, they will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notifications.map((notif) => (
            <Card key={notif.id} className="p-4 flex gap-3">
              <div className="shrink-0 mt-1">
                {notif.type === 'sms' ? (
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                ) : notif.type === 'whatsapp' ? (
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 bg-navy-50 text-navy-600 rounded-lg">
                    <Globe className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-slate-800">{notif.title}</p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                    {timeAgo(notif.at)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                {notif.caseId && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-navy-600 hover:text-navy-700 cursor-pointer">
                    View Case {notif.caseId} <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
