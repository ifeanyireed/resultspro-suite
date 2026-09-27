"use client";
import React, { useEffect, useState } from 'react';
import { CalendarIcon, VideoCameraIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  isGoing: boolean;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/student/events');
        setEvents(res.data || []);
      } catch (err) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRsvp = async (eventId: string, currentStatus: boolean) => {
    try {
      const newStatus = currentStatus ? "declined" : "going";
      await api.post(`/student/events/${eventId}/rsvp`, { status: newStatus });
      setEvents(events.map(e => e.id === eventId ? { ...e, isGoing: !currentStatus } : e));
      toast.success(newStatus === "going" ? "RSVP confirmed!" : "RSVP canceled.");
    } catch (err) {
      toast.error("Failed to update RSVP");
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getMonthAndDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.toLocaleDateString('en-US', { day: 'numeric' })
    };
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Schedule & Events</h1>
          <p className="text-sm text-gray-500 mt-1">Upcoming live sessions, mentor syncs, and project deadlines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No upcoming events scheduled.</div>
          ) : (
            events.map((event) => {
              const { month, day } = getMonthAndDay(event.startTime);
              return (
                <div key={event.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6 transition-all hover:shadow-md">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex flex-col items-center justify-center shrink-0 text-[#146ef5]">
                    <span className="text-xs font-bold uppercase">{month}</span>
                    <span className="text-xl font-black">{day}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4"/> 
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wide">
                        {event.eventType}
                      </span>
                      {event.meetingUrl && event.isGoing && (
                        <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                          <VideoCameraIcon className="w-4 h-4"/> Join Link
                        </a>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRsvp(event.id, event.isGoing)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                      event.isGoing 
                      ? "bg-[#146ef5] text-white border-[#146ef5] hover:bg-[#105bd1]" 
                      : "bg-white text-[#146ef5] border-[#146ef5] hover:bg-gray-50"
                    }`}
                  >
                    {event.isGoing ? "Going" : "RSVP"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
