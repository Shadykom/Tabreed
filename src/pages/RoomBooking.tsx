import { useState, useEffect, useCallback, useContext } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Monitor,
  PenLine,
  X,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Trash2,
  Clock,
  Building2,
  Loader2,
} from 'lucide-react';
import { AppContext } from '../context/appContextDef';
import Button from '../components/common/Button';
import type { MeetingRoom } from '../types';
import styles from './RoomBooking.module.scss';

// ── Types ──────────────────────────────────────────────────────────────────
interface RoomBooking {
  id: number;
  roomId: number;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  attendees: number;
  bookedBy: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

interface SlotInfo {
  time: string;
  label: string;
  booking: RoomBooking | null;
  mine: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────
const SLOT_START = 8;
const SLOT_END   = 18;

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START; h < SLOT_END; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}
const ALL_SLOTS = buildSlots();

function slotLabel(time: string): string {
  const [hStr, min] = time.split(':');
  const h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return min === '00' ? `${display}${suffix}` : `${display}:${min}`;
}

function slotCoveredBy(slotTime: string, booking: RoomBooking): boolean {
  return slotTime >= booking.startTime && slotTime < booking.endTime;
}

function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return dt.toISOString().split('T')[0];
}

function weekStart(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay();
  dt.setDate(dt.getDate() - day);
  return dt.toISOString().split('T')[0];
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function RoomBooking() {
  const ctx = useContext(AppContext);
  const currentUser = ctx?.user?.name ?? 'Ahmed Al-Qahtani';

  const [selectedDate, setSelectedDate] = useState<string>(today());

  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const [allBookings, setAllBookings] = useState<RoomBooking[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRoom, setModalRoom] = useState<MeetingRoom | null>(null);
  const [modalDate, setModalDate] = useState<string>('');
  const [modalStartTime, setModalStartTime] = useState<string>('09:00');
  const [modalEndTime, setModalEndTime] = useState<string>('10:00');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [attendees, setAttendees] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [myBookings, setMyBookings] = useState<RoomBooking[]>([]);

  useEffect(() => {
    setRoomsLoading(true);
    fetch('/api/meetingRooms')
      .then(r => r.json())
      .then((data: MeetingRoom[]) => setRooms(data))
      .catch(() => setRooms([]))
      .finally(() => setRoomsLoading(false));
  }, []);

  const fetchBookings = useCallback(() => {
    fetch(`/api/room-bookings?date=${selectedDate}`)
      .then(r => r.json())
      .then((data: RoomBooking[]) => setAllBookings(data))
      .catch(() => setAllBookings([]));
  }, [selectedDate]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const fetchMyBookings = useCallback(() => {
    fetch('/api/room-bookings')
      .then(r => r.json())
      .then((data: RoomBooking[]) => {
        setMyBookings(data.filter(b => b.bookedBy === currentUser && b.status !== 'cancelled'));
      })
      .catch(() => setMyBookings([]));
  }, [currentUser]);

  useEffect(() => { fetchMyBookings(); }, [fetchMyBookings]);

  const goToday    = () => setSelectedDate(today());
  const goTomorrow = () => setSelectedDate(addDays(today(), 1));
  const goThisWeek = () => setSelectedDate(weekStart(today()));
  const goPrev     = () => setSelectedDate(prev => addDays(prev, -1));
  const goNext     = () => setSelectedDate(prev => addDays(prev, 1));

  function quickActive(): 'today' | 'tomorrow' | 'week' | null {
    const t = today();
    if (selectedDate === t) return 'today';
    if (selectedDate === addDays(t, 1)) return 'tomorrow';
    if (selectedDate === weekStart(t)) return 'week';
    return null;
  }

  function getSlotsForRoom(room: MeetingRoom): SlotInfo[] {
    const dayBookings = allBookings.filter(b => b.roomId === room.id && b.status !== 'cancelled');
    return ALL_SLOTS.map(time => {
      const booking = dayBookings.find(b => slotCoveredBy(time, b)) ?? null;
      const mine = booking?.bookedBy === currentUser;
      return { time, label: slotLabel(time), booking, mine };
    });
  }

  function openBookingModal(room: MeetingRoom, slotTime: string) {
    setModalRoom(room);
    setModalDate(selectedDate);
    setModalStartTime(slotTime);
    const idx = ALL_SLOTS.indexOf(slotTime);
    const endIdx = Math.min(idx + 2, ALL_SLOTS.length - 1);
    setModalEndTime(ALL_SLOTS[endIdx] ?? '10:00');
    setMeetingTitle('');
    setAttendees(5);
    setSubmitError(null);
    setSubmitSuccess(false);
    setModalOpen(true);
  }

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modalRoom) return;
    if (!meetingTitle.trim()) { setSubmitError('Meeting title is required.'); return; }
    if (modalStartTime >= modalEndTime) { setSubmitError('End time must be after start time.'); return; }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/room-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: modalRoom.id,
          roomName: modalRoom.name,
          date: modalDate,
          startTime: modalStartTime,
          endTime: modalEndTime,
          title: meetingTitle.trim(),
          attendees,
          bookedBy: currentUser,
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      setSubmitSuccess(true);
      fetchBookings();
      fetchMyBookings();
      setTimeout(() => { setModalOpen(false); setSubmitSuccess(false); }, 1400);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to book. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id: number) {
    setCancellingId(id);
    try {
      await fetch(`/api/room-bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
      fetchMyBookings();
    } finally {
      setCancellingId(null);
    }
  }

  function endTimeOptions(): string[] {
    const startIdx = ALL_SLOTS.indexOf(modalStartTime);
    return [...ALL_SLOTS.slice(startIdx + 1), '18:00'];
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Meeting Rooms</h1>
        <p className={styles.pageSubtitle}>Browse and book available meeting rooms across all floors.</p>
      </div>

      {/* Date Navigator */}
      <div className={styles.dateNav}>
        <div className={styles.dateNavCenter}>
          <button className={styles.navArrow} onClick={goPrev} title="Previous day">
            <ChevronLeft size={18} />
          </button>
          <span className={styles.dateLabel}>{formatDateLabel(selectedDate)}</span>
          <button className={styles.navArrow} onClick={goNext} title="Next day">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className={styles.quickDates}>
          <button className={`${styles.quickBtn} ${quickActive() === 'today' ? styles.activeQuick : ''}`} onClick={goToday}>Today</button>
          <button className={`${styles.quickBtn} ${quickActive() === 'tomorrow' ? styles.activeQuick : ''}`} onClick={goTomorrow}>Tomorrow</button>
          <button className={`${styles.quickBtn} ${quickActive() === 'week' ? styles.activeQuick : ''}`} onClick={goThisWeek}>This Week</button>
        </div>
      </div>

      {/* Rooms Grid */}
      {roomsLoading ? (
        <div className={styles.loadingSpinner}>
          <Loader2 size={24} />
          <span>Loading rooms…</span>
        </div>
      ) : (
        <div className={styles.roomsGrid}>
          {rooms.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              slots={getSlotsForRoom(room)}
              animDelay={i * 60}
              onSlotClick={(time) => openBookingModal(room, time)}
            />
          ))}
        </div>
      )}

      {/* My Bookings */}
      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <CalendarDays size={20} />
            My Bookings
            {myBookings.length > 0 && <span className={styles.bookingsCount}>{myBookings.length}</span>}
          </h2>
        </div>

        {myBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <CalendarDays size={48} />
            <p>No upcoming bookings</p>
            <small>Book a meeting room above to see it here.</small>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Meeting Title</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                        {b.roomName}
                      </span>
                    </td>
                    <td>{formatDateLabel(b.date)}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} style={{ color: 'var(--color-text-secondary)' }} />
                        {slotLabel(b.startTime)} – {slotLabel(b.endTime)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{b.title}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={13} style={{ color: 'var(--color-text-secondary)' }} />
                        {b.attendees}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusChip} ${styles[b.status]}`}>{b.status}</span>
                    </td>
                    <td>
                      <button
                        className={styles.cancelBtn}
                        disabled={cancellingId === b.id}
                        onClick={() => handleCancel(b.id)}
                      >
                        {cancellingId === b.id ? <Loader2 size={13} /> : <Trash2 size={13} />}
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {modalOpen && modalRoom && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>Book {modalRoom.name}</div>
                <div className={styles.modalSubtitle}>{formatDateLabel(modalDate)}</div>
              </div>
              <button className={styles.modalClose} onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className={styles.modalBody}>
                {submitSuccess && (
                  <div className={styles.successBanner}>
                    <CheckCircle size={18} /> Room booked successfully!
                  </div>
                )}
                {submitError && (
                  <div className={styles.errorBanner}>
                    <AlertCircle size={18} /> {submitError}
                  </div>
                )}

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label className={styles.label}>Start Time</label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={modalStartTime}
                        onChange={e => {
                          const newStart = e.target.value;
                          setModalStartTime(newStart);
                          if (modalEndTime <= newStart) {
                            const idx = ALL_SLOTS.indexOf(newStart);
                            setModalEndTime(ALL_SLOTS[idx + 2] ?? '18:00');
                          }
                        }}
                      >
                        {ALL_SLOTS.map(s => (
                          <option key={s} value={s}>{slotLabel(s)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>End Time</label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={modalEndTime}
                        onChange={e => setModalEndTime(e.target.value)}
                      >
                        {endTimeOptions().map(s => (
                          <option key={s} value={s}>{slotLabel(s)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>
                    Meeting Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. Weekly Team Sync"
                    value={meetingTitle}
                    onChange={e => setMeetingTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Number of Attendees</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    max={modalRoom.capacity}
                    value={attendees}
                    onChange={e => setAttendees(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <Button type="button" variant="outline" size="md" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={submitting || submitSuccess}>
                  {submitting ? 'Booking…' : 'Book Room'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Room Card ──────────────────────────────────────────────────────────────
interface RoomCardProps {
  room: MeetingRoom;
  slots: SlotInfo[];
  animDelay: number;
  onSlotClick: (time: string) => void;
}

function RoomCard({ room, slots, animDelay, onSlotClick }: RoomCardProps) {
  return (
    <div className={styles.roomCard} style={{ animationDelay: `${animDelay}ms` }}>
      <div className={styles.roomImageWrap}>
        <img className={styles.roomImage} src={room.image} alt={room.name} loading="lazy" />
        <div className={styles.roomImageOverlay} />
        <div className={`${styles.statusBadge} ${room.status === 'available' ? styles.available : styles.busy}`}>
          {room.status === 'available' ? 'Available' : 'In Use'}
        </div>
      </div>

      <div className={styles.roomBodyPadding}>
        <div className={styles.roomHeader}>
          <div className={styles.roomName}>{room.name}</div>
        </div>
        <div className={styles.roomMeta}>
          <span><Users size={13} /> {room.capacity} people</span>
          {room.floor && <span><Building2 size={13} /> {room.floor}</span>}
        </div>
        <div className={styles.amenities}>
          <span className={styles.amenityTag}><Monitor size={11} /> Video</span>
          <span className={styles.amenityTag}><PenLine size={11} /> Whiteboard</span>
        </div>

        <div className={styles.timeSlotsSection}>
          <div className={styles.timeSlotsTitle}>Time Slots — Click green to book</div>
          <div className={styles.slotsScroll}>
            <div className={styles.slotsRow}>
              {slots.map(slot => {
                const isAvailable = !slot.booking;
                const barClass = slot.mine
                  ? styles.slotBarMine
                  : isAvailable
                  ? styles.slotBarAvailable
                  : styles.slotBarBooked;

                return (
                  <div
                    key={slot.time}
                    className={styles.slot}
                    title={
                      slot.mine
                        ? `Your booking: ${slot.booking?.title}`
                        : slot.booking
                        ? `Booked by ${slot.booking.bookedBy}: ${slot.booking.title}`
                        : `Available – click to book at ${slot.label}`
                    }
                    onClick={() => isAvailable && onSlotClick(slot.time)}
                    style={{ cursor: isAvailable ? 'pointer' : 'default' }}
                  >
                    <div className={`${styles.slotBar} ${barClass}`} />
                    <span className={styles.slotLabel}>{slot.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <LegendItem color="var(--color-success)" label="Available" />
            <LegendItem color="var(--color-danger)" label="Booked" />
            <LegendItem color="var(--color-accent)" label="Mine" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}
