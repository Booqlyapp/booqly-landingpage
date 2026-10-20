export interface Service {
  id: string;
  name: string;
  description: string;
  price: number | string;
  duration: number | string;
  category: string;
  subcategory: string;
  requireDeposit: boolean;
  depositType?: 'fixed' | 'percentage';
  depositAmount?: number | string;
  imageUrl?: string;
  addOns?: ServiceAddOn[];
  selectedAddOns?: ServiceAddOn[]; // Selected add-ons from modal
}

export interface ServiceAddOn {
  id: string;
  serviceId: string;
  title: string;
  price: number | string;
  isActive: boolean;
}

export interface Review {
  id: string;
  clientId: string;
  providerId: string;
  rating: number;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
  createdAt: string;
  client?: {
    name: string;
    profilePic?: string;
  };
}

export interface Schedule {
  id: string;
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

export interface Marketplace {
  id: string;
  businessName: string;
  phoneNumber: string;
  businessEmail?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  imagesList?: string[];
  portfolioImages?: string[];
  bio?: string;
  policyRules?: string;
  showPolicyRules?: boolean;
  customLink: string;
  bookingPageTitle?: string;
  bookingPageSubtitle?: string;
  bookingPageHeaderImage?: string;
  bookingPageHeaderPdf?: string;
  userId?: string;
  services: Service[];
  schedule?: Schedule;
  reviews?: Review[];
}

export interface BookingData {
  service: Service | null;
  date: string | null;
  time: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
  notes: string;
}
