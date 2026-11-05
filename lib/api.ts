import type { BookingPageColors } from './booking-page-colors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export async function getMarketplaceByCustomLink(customLink: string) {
  try {
    console.log("API_BASE_URL:", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/public/marketplace/${customLink}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Marketplace not found');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    throw error;
  }
}

export async function getAvailableTimeSlots(
  marketplaceId: string,
  serviceId: string,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/available-slots?marketplaceId=${marketplaceId}&serviceId=${serviceId}&date=${date}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch available time slots');
    }

    const data = await response.json();
    return data.data as string[];
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
}

export async function getBookableDates(
  marketplaceId: string,
  from: string,
  to: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/bookable-dates?marketplaceId=${marketplaceId}&from=${from}&to=${to}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch bookable dates');
    }

    const data = await response.json();
    return (data.data?.dates || []) as string[];
  } catch (error) {
    console.error('Error fetching bookable dates:', error);
    throw error;
  }
}

export class BookingApiError extends Error {
  reason?: string;

  constructor(message: string, reason?: string) {
    super(message);
    this.name = 'BookingApiError';
    this.reason = reason;
  }
}

type ExternalAppointmentPayload = {
  marketplaceId: string;
  services: Array<{
    serviceId: string;
    addOnIds: string[];
  }>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateTime: string;
  price: number;
  depositAmount?: number;
  remainingBalance?: number;
  acceptedTerms: boolean;
  marketingConsent: boolean;
  notes?: string;
  /** null / omitted = No Preference (auto-assign least-booked free member) */
  assignedTeamMemberId?: string | null;
};

function throwBookingError(errorBody: {
  message?: string;
  reason?: string;
  data?: { reason?: string };
}, fallback: string): never {
  const reason = errorBody.reason || errorBody.data?.reason;
  throw new BookingApiError(errorBody.message || fallback, reason);
}

export async function createExternalAppointment(
  appointmentData: ExternalAppointmentPayload
) {
  try {
    const response = await fetch(`${API_BASE_URL}/public/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throwBookingError(error, 'Failed to create appointment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function createExternalAppointmentWithDeposit(
  appointmentData: ExternalAppointmentPayload & { paymentMethodId: string }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/public/book-with-deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throwBookingError(error, 'Failed to create appointment with deposit');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment with deposit:', error);
    throw error;
  }
}

export async function getPublicExternalAppointment(appointmentId: string) {
  const response = await fetch(
    `${API_BASE_URL}/public/external-appointments/${appointmentId}`,
    { cache: 'no-store' }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Appointment not found');
  }
  return data.data;
}

export async function cancelPublicExternalAppointment(
  appointmentId: string,
  email: string
) {
  const response = await fetch(
    `${API_BASE_URL}/public/external-appointments/${appointmentId}/cancel`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Failed to cancel appointment');
  }
  return data.data;
}

export async function reschedulePublicExternalAppointment(
  appointmentId: string,
  email: string,
  dateTime: string
) {
  const response = await fetch(
    `${API_BASE_URL}/public/external-appointments/${appointmentId}/reschedule`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, dateTime }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Failed to reschedule appointment');
  }
  return data.data;
}

export async function saveBookingPageColors(
  marketplaceId: string,
  bookingPageColors: BookingPageColors,
  accessToken: string
) {
  const response = await fetch(
    `${API_BASE_URL}/marketplace/update-booking-page-colors`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ marketplaceId, bookingPageColors }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Failed to save booking page colors');
  }
  return data;
}
