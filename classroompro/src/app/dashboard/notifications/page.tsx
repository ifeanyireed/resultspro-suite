"use client";

import {
  IconBell as Bell,
  IconMessage as MessageSquare,
  IconCheck as Check,
  IconClock as Clock,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MotionRise } from "@/components/ScrollRiseProvider";
import { getCampusNotices } from "@/lib/api";

export default function NotificationsPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadNotices = async () => {
      setLoading(true);
      try {
        const res = await getCampusNotices().catch(() => ({ notices: [] }));
        if (!cancelled) {
          setNotices(Array.isArray(res?.notices) ? res.notices : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadNotices();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1">
      <main className="p-8 max-w-4xl space-y-6">
        <MotionRise className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              School Notices &amp; Inbox
            </h2>
            <p className="text-sm text-gray-500">
              Official circulars and academic announcements synced from CampusPRO.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setNotices((prev) => prev.map((n) => ({ ...n, read: true })))
            }
            className="text-xs font-bold border-gray-100 hover:bg-gray-50 text-gray-900"
          >
            Mark all as read
          </Button>
        </MotionRise>

        <MotionRise
          delay={0.08}
          className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading circulars from <code>service_campuspro</code>...
            </div>
          ) : notices.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No school circulars or announcements published on <code>service_campuspro</code> yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notices.map((notif, idx) => (
                <div
                  key={notif.id || idx}
                  className={cn(
                    "p-6 flex items-start justify-between hover:bg-gray-50/50 transition-colors group relative"
                  )}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-[#146ef5]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900">
                          {notif.title || "Campus Circular"}
                        </h3>
                        {notif.category && (
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600 uppercase">
                            {notif.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">
                        {notif.body || notif.message || notif.summary}
                      </p>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />{" "}
                        {notif.published_at || notif.created_at || notif.audience || "CampusPRO"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionRise>
      </main>
    </div>
  );
}
