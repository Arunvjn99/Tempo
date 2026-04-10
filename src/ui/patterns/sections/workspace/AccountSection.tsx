import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "@/ui/components/Button";
import { Mail, Phone, MapPin, Pencil, Check } from "lucide-react";
import { FormSection, FieldGroup } from "@/ui/patterns";
import type { ProfileMockData, ProfileNotificationsState, ProfileContactFormState } from "./profileTypes";

export function AccountSection({
  mock,
  editingContact,
  setEditingContact,
  contact,
  setContact,
  notifications,
  setNotifications,
  middleSlot,
}: {
  mock: ProfileMockData;
  editingContact: boolean;
  setEditingContact: (v: boolean) => void;
  contact: ProfileContactFormState;
  setContact: Dispatch<SetStateAction<ProfileContactFormState>>;
  notifications: ProfileNotificationsState;
  setNotifications: Dispatch<SetStateAction<ProfileNotificationsState>>;
  middleSlot: ReactNode;
}) {
  return (
    <>
      <section id="contact">
        <FormSection
          title="Contact Information"
          description={editingContact ? "Edit your contact details below." : undefined}
        >
          {editingContact ? (
            <div className="space-y-md">
              <FieldGroup label="Email">
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </FieldGroup>
              <FieldGroup label="Phone">
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </FieldGroup>
              <FieldGroup label="Address">
                <textarea
                  value={contact.address}
                  onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </FieldGroup>
              <div className="flex gap-sm">
                <Button
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => setEditingContact(false)}
                  className="rounded-button bg-primary px-md py-sm text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  <Check className="mr-xs inline h-4 w-4" aria-hidden />
                  Save
                </Button>
                <Button
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => setEditingContact(false)}
                  className="rounded-button border border-border px-md py-sm text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-md">
              {[
                { icon: Mail, label: "Email", value: contact.email },
                { icon: Phone, label: "Phone", value: contact.phone },
                { icon: MapPin, label: "Address", value: contact.address },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-md">
                  <row.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div>
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-medium text-foreground">{row.value}</p>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="custom"
                onClick={() => setEditingContact(true)}
                className="inline-flex h-auto min-h-0 items-center gap-xs px-0 py-0 text-sm font-medium text-primary hover:bg-transparent hover:underline"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit contact info
              </Button>
            </div>
          )}
        </FormSection>
      </section>

      <section id="employment">
        <FormSection title="Employment">
          <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
            {[
              { label: "Employer", value: mock.employer },
              { label: "Department", value: mock.department },
              { label: "Hire date", value: mock.hireDate },
              { label: "Employee ID", value: mock.employeeId },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="mt-xs text-sm font-medium text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </FormSection>
      </section>

      <section id="beneficiaries">
        <FormSection title="Beneficiaries">
          <div className="space-y-sm">
            {mock.beneficiaries.map((b) => (
              <div
                key={b.name}
                className="flex items-center justify-between rounded-card border border-border bg-surface px-md py-sm"
              >
                <div className="flex items-center gap-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {b.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.relationship}</p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-sm py-0.5 text-xs font-semibold text-primary">
                  {b.percentage}%
                </span>
              </div>
            ))}
          </div>
        </FormSection>
      </section>

      {middleSlot}

      <section id="notifications">
        <FormSection title="Notification Preferences">
          <div className="space-y-md">
            {(
              [
                { key: "email" as const, label: "Email notifications", description: "Receive updates via email" },
                { key: "sms" as const, label: "SMS notifications", description: "Text alerts for important events" },
                { key: "push" as const, label: "Push notifications", description: "Browser push notifications" },
              ] as const
            ).map((pref) => (
              <label
                key={pref.key}
                className="flex cursor-pointer items-center justify-between rounded-card border border-border bg-surface px-md py-sm"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[pref.key]}
                  onChange={(e) => setNotifications((n) => ({ ...n, [pref.key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
        </FormSection>
      </section>
    </>
  );
}
