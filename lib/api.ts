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
    console.log("Hehe", response)

    if (!response.ok) {
      throw new Error('Failed to fetch available time slots');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
}

export async function createExternalAppointment(appointmentData: {
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
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/public/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create appointment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function createExternalAppointmentWithDeposit(appointmentData: {
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
  paymentMethodId: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/public/book-with-deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create appointment with deposit');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment with deposit:', error);
    throw error;
  }
}
