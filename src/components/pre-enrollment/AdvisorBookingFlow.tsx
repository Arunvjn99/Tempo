import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X, Check } from "lucide-react";
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

function getTimeSlotsForDate(date: Date): { time: string; displayTime: string; disabled: boolean }[] {
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
  const daySeed = date.getDate() + date.getMonth() * 31;
  return slots.map((s, i) => ({
    time: s.time,
    displayTime: formatTime(s.time),
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

export type BookingStep = "selectAdvisor" | "selectDate" | "selectTime" | "confirm" | "success";

interface AdvisorBookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  advisors: Advisor[];
  getAdvisorDisplayName: (advisor: Advisor) => string;
  getAdvisorRole: (advisor: Advisor) => string;
  getAdvisorBio: (advisor: Advisor) => string;
}

export function AdvisorBookingFlow({
  isOpen,
  onClose,
  advisors,
  getAdvisorDisplayName,
  getAdvisorRole,
  getAdvisorBio,
}: AdvisorBookingFlowProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<BookingStep>("selectAdvisor");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dateOptions = useMemo(() => getDateOptions(), []);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlotsForDate(selectedDate);
  }, [selectedDate]);

  const availableSlots = timeSlots.filter((s) => !s.disabled);

  const resetAndClose = () => {
    setStep("selectAdvisor");
    setSelectedAdvisor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    onClose();
  };

  const handleChooseAdvisor = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setStep("selectDate");
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    setStep("success");
  };

  const stepTitle =
    step === "selectAdvisor"
      ? t("preEnrollment.bookingSelectAdvisor")
      : step === "selectDate"
        ? t("preEnrollment.bookingSelectDate")
        : step === "selectTime"
          ? t("preEnrollment.bookingSelectTime")
          : step === "confirm"
            ? t("preEnrollment.bookingConfirmTitle")
            : t("preEnrollment.bookingSuccessTitle");

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} closeOnOverlayClick={false} dialogClassName="max-w-lg" wizard>
      <div className="flex flex-col min-h-[400px] max-h-[85vh]">
        {step !== "success" && (
          <div className="flex items-center justify-between shrink-0 p-4 sm:p-6 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{stepTitle}</h2>
            <button
              type="button"
              onClick={resetAndClose}
              className="p-2 rounded-lg text-[var(--color-textSecondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Step 1: Select Advisor */}
          {step === "selectAdvisor" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--color-textSecondary)]">
                {t("preEnrollment.bookingSelectAdvisorSubtitle")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advisors.map((advisor) => {
                  const name = getAdvisorDisplayName(advisor);
                  const role = getAdvisorRole(advisor);
                  const bio = getAdvisorBio(advisor);
                  return (
                    <div
                      key={advisor.id}
                      className="rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow shrink-0">
                          <img src={advisor.image} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[var(--color-text)] truncate">{name}</h3>
                          <p className="text-xs text-brand-600 font-medium truncate">{role}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--color-textSecondary)] leading-relaxed line-clamp-2">
                        {bio}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleChooseAdvisor(advisor)}
                        className="h-12 w-full rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        {t("preEnrollment.bookingChooseCta")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === "selectDate" && selectedAdvisor && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--color-textSecondary)]">
                {t("preEnrollment.bookingSelectDateSubtitle", { name: getAdvisorDisplayName(selectedAdvisor) })}
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
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep("selectAdvisor")}
                  className="h-12 px-6 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {t("preEnrollment.bookingBack")}
                </button>
                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => setStep("selectTime")}
                  className="h-12 flex-1 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {t("preEnrollment.bookingContinue")}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === "selectTime" && selectedDate && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--color-textSecondary)]">
                {formatDateFull(selectedDate)} — {t("preEnrollment.bookingSelectTimeSubtitle")}
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
                      onClick={() => !slot.disabled && setSelectedTime(slot.displayTime)}
                      className={`h-12 rounded-xl border-2 px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        slot.disabled
                          ? "border-[var(--color-border)] bg-[var(--color-surface)]/50 text-[var(--color-textSecondary)] cursor-not-allowed"
                          : selectedTime === slot.displayTime
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border)]/80"
                      }`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep("selectDate")}
                  className="h-12 px-6 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {t("preEnrollment.bookingBack")}
                </button>
                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setStep("confirm")}
                  className="h-12 flex-1 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {t("preEnrollment.bookingContinue")}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && selectedAdvisor && selectedDate && selectedTime && (
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Advisor</p>
                <p className="text-base font-semibold text-[var(--color-text)]">
                  {getAdvisorDisplayName(selectedAdvisor)}
                </p>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Date</p>
                <p className="text-base text-[var(--color-text)]">{formatDateFull(selectedDate)}</p>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Time</p>
                <p className="text-base text-[var(--color-text)]">{selectedTime}</p>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Duration</p>
                <p className="text-base text-[var(--color-text)]">{t("preEnrollment.bookingDuration")}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("selectTime")}
                  className="h-12 px-6 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {t("preEnrollment.bookingBack")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="h-12 flex-1 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {t("preEnrollment.bookingConfirmCta")}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === "success" && selectedAdvisor && selectedDate && selectedTime && (
            <div className="flex flex-col items-center text-center py-6 px-2">
              <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center mb-6">
                <Check size={28} className="text-[var(--color-success)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                {t("preEnrollment.bookingSuccessTitle")}
              </h2>
              <p className="text-sm text-[var(--color-textSecondary)] mb-8 max-w-sm">
                {t("preEnrollment.bookingSuccessMessage", {
                  name: getAdvisorDisplayName(selectedAdvisor),
                  date: formatDateFull(selectedDate),
                  time: selectedTime,
                })}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="h-12 flex-1 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Done
                </button>
                <button
                  type="button"
                  className="h-12 flex-1 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {t("preEnrollment.bookingAddToCalendar")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
