/** Presentation types for profile workspace sections (decoupled from feature hooks). */

import type { LucideIcon } from "lucide-react";

export interface ProfileNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ProfileContactFormState {
  email: string;
  phone: string;
  address: string;
}

export interface ProfileDocumentRow {
  name: string;
  date: string;
  type: string;
}

export interface ProfileBeneficiaryRow {
  name: string;
  relationship: string;
  percentage: number;
}

export interface ProfileNotificationsState {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface ProfileMockData {
  name: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  employer: string;
  employeeId: string;
  department: string;
  hireDate: string;
  beneficiaries: ProfileBeneficiaryRow[];
  documents: ProfileDocumentRow[];
  notifications: ProfileNotificationsState;
}
