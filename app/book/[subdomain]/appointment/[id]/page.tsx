'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SubdomainNavbar from '@/components/subdomain-navbar';
import {
  cancelPublicExternalAppointment,
  getAvailableTimeSlots,
  getPublicExternalAppointment,
  reschedulePublicExternalAppointment,
} from '@/lib/api';

type ExternalAppointment = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateTime: string;
  status: string;
  price: number | string;
  depositAmount?: number | string | null;
  remainingBalance?: number | string | null;
  depositPaid?: boolean;
  stylistName?: string | null;
  clientNoPreference?: boolean;
  servicesData?: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    addOns?: Array<{ title: string; price: number }>;
  }>;
  marketplace?: {
    id: string;
    businessName?: string;
    address?: string;
    customLink?: string;
  };
};

function money(n: number | string | null | undefined): string {
  return `$${Number(n || 0).toFixed(2)}`;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${date} • ${time}`;
}

function parseSlotToIso(dateYmd: string, slotLabel: string): string {
  const match = slotLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return `${dateYmd}T12:00:00.000Z`;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${dateYmd}T${hh}:${mm}:00.000Z`;
}

export default function ManageAppointmentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subdomain = params.subdomain as string;
  const appointmentId = params.id as string;
  const action = (searchParams.get('action') || '').toLowerCase();

  const [appointment, setAppointment] = useState<ExternalAppointment | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [emailConfirm, setEmailConfirm] = useState('');
  const [showReschedule, setShowReschedule] = useState(action === 'reschedule');
  const [showCancel, setShowCancel] = useState(action === 'cancel');
  const [dateYmd, setDateYmd] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getPublicExternalAppointment(appointmentId);
        if (cancelled) return;
        setAppointment(data);
        setEmailConfirm(data.email || '');
        const d = new Date(data.dateTime);
        if (!Number.isNaN(d.getTime())) {
          setDateYmd(d.toISOString().slice(0, 10));
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Appointment not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  const serviceId = appointment?.servicesData?.[0]?.serviceId;
  const marketplaceId = appointment?.marketplace?.id;

  useEffect(() => {
    if (!showReschedule || !marketplaceId || !serviceId || !dateYmd) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingSlots(true);
        const list = await getAvailableTimeSlots(
          marketplaceId,
          serviceId,
          dateYmd
        );
        if (!cancelled) {
          setSlots(list || []);
          setSelectedSlot(null);
        }
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showReschedule, marketplaceId, serviceId, dateYmd]);

  const servicesLabel = useMemo(() => {
    if (!appointment?.servicesData?.length) return 'Service';
    return appointment.servicesData.map((s) => s.serviceName).join(', ');
  }, [appointment]);

  const addOnsLabel = useMemo(() => {
    if (!appointment?.servicesData?.length) return null;
    const names = appointment.servicesData.flatMap((s) =>
      (s.addOns || []).map((a) => a.title)
    );
    return names.length ? names.join(', ') : null;
  }, [appointment]);

  const total = Number(appointment?.price || 0);
  const deposit = appointment?.depositPaid
    ? Number(appointment?.depositAmount || 0)
    : 0;
  const due =
    appointment?.remainingBalance != null
      ? Number(appointment.remainingBalance)
      : Math.max(total - deposit, 0);

  async function onCancel() {
    if (!appointment) return;
    try {
      setBusy(true);
      setMessage(null);
      const updated = await cancelPublicExternalAppointment(
        appointment.id,
        emailConfirm.trim()
      );
      setAppointment({ ...appointment, ...updated });
      setShowCancel(false);
      setMessage('Your appointment has been canceled.');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to cancel');
    } finally {
      setBusy(false);
    }
  }

  async function onReschedule() {
    if (!appointment || !selectedSlot || !dateYmd) return;
    try {
      setBusy(true);
      setMessage(null);
      const iso = parseSlotToIso(dateYmd, selectedSlot);
      const updated = await reschedulePublicExternalAppointment(
        appointment.id,
        emailConfirm.trim(),
        iso
      );
      setAppointment({ ...appointment, ...updated });
      setShowReschedule(false);
      setMessage('Your appointment has been rescheduled.');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to reschedule');
    } finally {
      setBusy(false);
    }
  }

  const businessName = appointment?.marketplace?.businessName || subdomain;
  const isCanceled = (appointment?.status || '').toLowerCase() === 'canceled';

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      <SubdomainNavbar businessName={businessName} />

      <div className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {loading && (
            <p className="text-center text-gray-500">Loading appointment…</p>
          )}
          {error && (
            <p className="text-center text-red-600">{error}</p>
          )}

          {!loading && !error && appointment && (
            <>
              <div className="text-center">
                <div className="font-serif text-lg font-bold text-gray-900">
                  {businessName}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                  {isCanceled
                    ? 'Appointment canceled'
                    : `You're booked, ${appointment.firstName || 'there'}!`}
                </h1>
              </div>

              <div className="mt-5 rounded-xl bg-[#E8F1F9] px-4 py-4 text-center">
                <div className="text-[15px] font-bold text-[#3B629B]">
                  {formatWhen(appointment.dateTime)}
                </div>
                {appointment.marketplace?.address ? (
                  <div className="text-sm text-[#5B82C2] mt-1">
                    {appointment.marketplace.address}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 divide-y divide-gray-200">
                <div className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-500">Services</span>
                  <span className="font-bold text-right text-gray-900">
                    {servicesLabel}
                  </span>
                </div>
                {addOnsLabel ? (
                  <div className="flex justify-between gap-4 py-3 text-sm">
                    <span className="text-gray-500">Add-on</span>
                    <span className="font-bold text-right text-gray-900">
                      {addOnsLabel}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-500">Stylist</span>
                  <span className="font-bold text-right text-gray-900">
                    {appointment.stylistName ||
                      (appointment.clientNoPreference
                        ? 'No preference'
                        : '—')}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gray-100 px-4 py-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Price</span>
                  <span className="font-semibold">{money(total)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Deposit Paid</span>
                  <span className="font-semibold">– {money(deposit)}</span>
                </div>
                <div className="flex justify-between font-bold text-[15px] pt-1">
                  <span>Amount Due at Appointment</span>
                  <span>{money(due)}</span>
                </div>
              </div>

              {message ? (
                <p className="mt-4 text-center text-sm text-[#3B629B]">
                  {message}
                </p>
              ) : null}

              {!isCanceled && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReschedule(true);
                      setShowCancel(false);
                    }}
                    className="rounded-[10px] bg-[#759CC9] text-white font-bold text-sm py-3"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancel(true);
                      setShowReschedule(false);
                    }}
                    className="rounded-[10px] bg-white text-red-600 font-bold text-sm py-3 border border-red-200"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {(showReschedule || showCancel) && !isCanceled && (
                <div className="mt-5 rounded-xl border border-gray-200 p-4 space-y-3">
                  <label className="block text-sm text-gray-600">
                    Confirm email on this booking
                    <input
                      type="email"
                      value={emailConfirm}
                      onChange={(e) => setEmailConfirm(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </label>

                  {showReschedule && (
                    <>
                      <label className="block text-sm text-gray-600">
                        New date
                        <input
                          type="date"
                          value={dateYmd}
                          onChange={(e) => setDateYmd(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                        />
                      </label>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">
                          Available times
                        </div>
                        {loadingSlots ? (
                          <p className="text-sm text-gray-400">Loading…</p>
                        ) : slots.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No slots for this date.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`px-3 py-1.5 rounded-lg text-sm border ${
                                  selectedSlot === slot
                                    ? 'bg-[#759CC9] text-white border-[#759CC9]'
                                    : 'bg-white text-gray-800 border-gray-300'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={busy || !selectedSlot || !emailConfirm.trim()}
                        onClick={onReschedule}
                        className="w-full rounded-[10px] bg-[#759CC9] text-white font-bold text-sm py-3 disabled:opacity-50"
                      >
                        {busy ? 'Saving…' : 'Confirm new time'}
                      </button>
                    </>
                  )}

                  {showCancel && (
                    <button
                      type="button"
                      disabled={busy || !emailConfirm.trim()}
                      onClick={onCancel}
                      className="w-full rounded-[10px] bg-white text-red-600 font-bold text-sm py-3 border border-red-200 disabled:opacity-50"
                    >
                      {busy ? 'Canceling…' : 'Confirm cancellation'}
                    </button>
                  )}
                </div>
              )}

              <p className="mt-8 text-center text-xs text-gray-400">
                Powered by <strong className="text-gray-500">Booqly</strong>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
