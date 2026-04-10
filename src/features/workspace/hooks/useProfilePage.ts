import { useState } from "react";
import { User, Mail, Briefcase, Users, FileText, Bell } from "lucide-react";
import type {
  ProfileContactFormState,
  ProfileMockData,
  ProfileNavItem,
  ProfileNotificationsState,
} from "@/ui/patterns/sections/workspace/profileTypes";

export const MOCK: ProfileMockData = {
  name: "Alex Johnson",
  initials: "AJ",
  email: "alex.johnson@example.com",
  phone: "(555) 123-4567",
  address: "123 Main St, Austin, TX 78701",
  employer: "Acme Corp",
  employeeId: "EMP-10452",
  department: "Engineering",
  hireDate: "Jan 15, 2020",
  beneficiaries: [
    { name: "Sarah Johnson", relationship: "Spouse", percentage: 75 },
    { name: "David Johnson", relationship: "Child", percentage: 25 },
  ],
  documents: [
    { name: "Plan Summary", date: "Jan 2026", type: "PDF" },
    { name: "Beneficiary Form", date: "Mar 2025", type: "PDF" },
    { name: "Quarterly Statement", date: "Mar 2026", type: "PDF" },
  ],
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
};

export const NAV_ITEMS: ProfileNavItem[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "beneficiaries", label: "Beneficiaries", icon: Users },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function useProfilePage() {
  const [activeSection, setActiveSection] = useState("personal");
  const [editingContact, setEditingContact] = useState(false);
  const [contact, setContact] = useState<ProfileContactFormState>({
    email: MOCK.email,
    phone: MOCK.phone,
    address: MOCK.address,
  });
  const [notifications, setNotifications] = useState<ProfileNotificationsState>(MOCK.notifications);

  const handleNav = (id: string) => {
    setActiveSection(id);
    scrollTo(id);
  };

  return {
    activeSection,
    NAV_ITEMS,
    handleNav,
    MOCK,
    editingContact,
    setEditingContact,
    contact,
    setContact,
    notifications,
    setNotifications,
  };
}
