"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: "delivery" | "incoming" | "lead" | "message" | "urgent" | "general";
  notes: string;
  linkedId?: string;
}

const eventTypeConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  delivery: {
    label: "Delivery",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
  },
  incoming: {
    label: "Incoming",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
  lead: {
    label: "Lead",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    dot: "bg-green-500",
  },
  message: {
    label: "Message",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    dot: "bg-purple-500",
  },
  urgent: {
    label: "Urgent",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-500",
  },
  general: {
    label: "General",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    dot: "bg-zinc-500",
  },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "general" as CalendarEvent["type"],
    notes: "",
    time: "09:00",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const snap = await getDocs(collection(db, "events"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CalendarEvent[];
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !selectedDate) return;
    setSaving(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd") + "T" + newEvent.time;
      const ref = await addDoc(collection(db, "events"), {
        title: newEvent.title.trim(),
        date: dateStr,
        type: newEvent.type,
        notes: newEvent.notes.trim(),
        createdAt: serverTimestamp(),
      });
      setEvents([
        ...events,
        {
          id: ref.id,
          title: newEvent.title.trim(),
          date: dateStr,
          type: newEvent.type,
          notes: newEvent.notes.trim(),
        },
      ]);
      setNewEvent({ title: "", type: "general", notes: "", time: "09:00" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter((ev) => ev.id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (d: Date) =>
    events.filter((ev) => {
      const evDate = new Date(ev.date);
      return isSameDay(evDate, d);
    });

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Calendar</h2>
          <p className="text-[13px] text-muted">Deliveries, incoming purchases, leads, and more.</p>
        </div>
        <button
          onClick={() => {
            if (!selectedDate) setSelectedDate(new Date());
            setShowForm(true);
          }}
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
        >
          + New Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(eventTypeConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-[10px] text-muted-fg">{cfg.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
            >
              ←
            </button>
            <h3 className="text-[15px] font-semibold text-white">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
            >
              →
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[10px] font-semibold text-muted uppercase tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {days.map((d, i) => {
              const dayEvents = getEventsForDay(d);
              const inMonth = isSameMonth(d, currentMonth);
              const today = isToday(d);
              const selected = selectedDate && isSameDay(d, selectedDate);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`min-h-[80px] p-1.5 border-b border-r border-border text-left transition-colors ${
                    !inMonth ? "opacity-30" : ""
                  } ${selected ? "bg-accent/5" : "hover:bg-white/[0.02]"}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-[11px] font-medium rounded-full ${
                      today
                        ? "bg-accent text-white"
                        : selected
                        ? "text-accent"
                        : "text-muted-fg"
                    }`}
                  >
                    {format(d, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => {
                      const cfg = eventTypeConfig[ev.type] || eventTypeConfig.general;
                      return (
                        <div
                          key={ev.id}
                          className={`text-[8px] font-medium px-1 py-0.5 rounded truncate ${cfg.bg} ${cfg.color}`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[8px] text-muted">+{dayEvents.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel — Selected Day */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
            <h3 className="text-[14px] font-semibold text-white mb-1">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a day"}
            </h3>
            {selectedDate && (
              <p className="text-[11px] text-muted mb-4">{format(selectedDate, "yyyy")}</p>
            )}

            {selectedDate && selectedDayEvents.length === 0 && !showForm && (
              <div className="text-center py-6">
                <p className="text-[12px] text-muted">No events</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 text-[11px] text-accent hover:text-accent/80"
                >
                  + Add event
                </button>
              </div>
            )}

            {selectedDayEvents.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedDayEvents.map((ev) => {
                  const cfg = eventTypeConfig[ev.type] || eventTypeConfig.general;
                  return (
                    <div
                      key={ev.id}
                      className={`p-3 rounded-lg border ${cfg.border} ${cfg.bg}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-[12px] font-medium ${cfg.color}`}>{ev.title}</p>
                          <span className="text-[9px] text-muted uppercase font-bold">
                            {cfg.label}
                          </span>
                          {ev.notes && (
                            <p className="text-[10px] text-muted-fg mt-1">{ev.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Event Form */}
            {showForm && selectedDate && (
              <form onSubmit={handleAddEvent} className="space-y-3 border-t border-border pt-4">
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title..."
                  className="w-full h-9 px-3 text-[12px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
                  autoFocus
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent["type"] })
                    }
                    className="h-9 px-2 text-[11px] bg-background border border-border rounded-lg text-white focus:outline-none"
                  >
                    <option value="delivery">🟠 Delivery</option>
                    <option value="incoming">🔵 Incoming</option>
                    <option value="lead">🟢 Lead</option>
                    <option value="message">🟣 Message</option>
                    <option value="urgent">🔴 Urgent</option>
                    <option value="general">⚪ General</option>
                  </select>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="h-9 px-2 text-[11px] bg-background border border-border rounded-lg text-white focus:outline-none"
                  />
                </div>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full px-3 py-2 text-[11px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-8 text-[11px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Add Event"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="h-8 px-3 text-[11px] text-muted-fg bg-background border border-border rounded-lg hover:bg-card"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
