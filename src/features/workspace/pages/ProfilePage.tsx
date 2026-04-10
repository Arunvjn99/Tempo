// ─────────────────────────────────────────────
// V4 Profile — composes workspace profile UI from /ui
// ─────────────────────────────────────────────

import { PageLayout } from "@/ui/patterns";
import { useProfilePage } from "../hooks/useProfilePage";
import {
  ProfileHeader,
  ProfilePageNav,
  PersonalInfoSection,
  AccountSection,
  DocumentsSection,
} from "@/ui/patterns/sections/workspace";

export function ProfilePage() {
  const {
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
  } = useProfilePage();

  return (
    <PageLayout>
      <ProfileHeader />

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-[240px_1fr]">
        <ProfilePageNav items={NAV_ITEMS} activeSection={activeSection} onSelect={handleNav} />

        <div className="space-y-lg">
          <PersonalInfoSection mock={MOCK} />
          <AccountSection
            mock={MOCK}
            editingContact={editingContact}
            setEditingContact={setEditingContact}
            contact={contact}
            setContact={setContact}
            notifications={notifications}
            setNotifications={setNotifications}
            middleSlot={<DocumentsSection documents={MOCK.documents} />}
          />
        </div>
      </div>
    </PageLayout>
  );
}
