import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Modal } from "../ui/Modal";
import type { Advisor } from "./types";

const NUM_DAYS = 14;
const SLOT_INTERVAL_MINUTES = 30;
const START_HOUR = 9;
const END_HOUR = 17;

function getDateOptions(): Date[] {
  const options: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < NUM_DAYS; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    options.push(d);
  }
  return options;
}

function getTimeSlotsForDate(date: Date): { time: string; disabled: boolean }[] {
  const slots: { time: string; minutes: number; disabled: boolean }[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL_MINUTES) {
      slots.push({
        time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        minutes: h * 60 + m,
        disabled: false,
      });
    }
  }
  // Mock: disable ~30% of slots for variety
  const daySeed = date.getDate() + date.getMonth() * 31;
  return slots.map((s, i) => ({
    time: formatTime(s.time),
    disabled: (daySeed + i) % 3 === 0,
  }));
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDateLabel(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dNorm = new Date(d);
  dNorm.setHours(0, 0, 0, 0);
  const diff = Math.round((dNorm.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  const dateNum = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" });
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${dayName}, ${month} ${dateNum}`;
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface AdvisorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisor: Advisor;
  advisorDisplayName: string;
}

export function AdvisorBookingModal({
  isOpen,
  onClose,
  advisor,
  advisorDisplayName,
}: AdvisorBookingModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dateOptions = useMemo(() => getDateOptions(), []);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlotsForDate(selectedDate);
  }, [selectedDate]);

  const availableSlots = timeSlots.filter((s) => !s.disabled);

  const resetAndClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    onClose();
  };

  const handleConfirmAppointment = () => {
    // In a real app would submit booking here
    resetAndClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} closeOnOverlayClick={false} dialogClassName="max-w-lg" wizard>
      <div className="flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between shrink-0 p-4 sm:p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {step === 1 ? t("preEnrollment.bookingSelectDate") : step === 2 ? t("preEnrollment.bookingSelectTime") : t("preEnrollment.bookingConfirmTitle")}
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 rounded-lg text-[var(--color-textSecondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--color-textSecondary)]">
                Choose a date for your 30-minute call with {advisorDisplayName}.
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {dateOptions.map((d) => {
                  const isSelected = selectedDate?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={d.getTime()}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`shrink-0 rounded-xl border-2 px-4 py-3 text-left min-w-[120px] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        isSelected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border)]/80"
                      }`}
                    >
                      <span className="block text-xs font-medium text-[var(--color-textSecondary)]">
                        {d.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="block text-lg font-semibold">{d.getDate()}</span>
                      <span className="block text-xs text-[var(--color-textSecondary)]">{formatDateLabel(d)}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={!selectedDate}
                onClick={() => setStep(2)}
                className="mt-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && selectedDate && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--color-textSecondary)]">
                {formatDateFull(selectedDate)} — select an available time.
              </p>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-[var(--color-textSecondary)] py-4">
                  {t("preEnrollment.bookingNoSlots")}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.disabled}
                      onClick={() => !slot.disabled && setSelectedTime(slot.time)}
                      className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        slot.disabled
                          ? "border-[var(--color-border)] bg-[var(--color-surface)]/50 text-[var(--color-textSecondary)] cursor-not-allowed"
                          : selectedTime === slot.time
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border)]/80"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedDate && selectedTime && (
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Advisor</p>
                <p className="text-base font-semibold text-[var(--color-text)]">{advisorDisplayName}</p>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Date</p>
                <p className="text-base text-[var(--color-text)]">{formatDateFull(selectedDate)}</p>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Time</p>
                <p className="text-base text-[var(--color-text)]">{selectedTime}</p>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Duration</p>
                <p className="text-base text-[var(--color-text)]">{t("preEnrollment.bookingDuration")}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAppointment}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {t("preEnrollment.bookingConfirmCta")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
