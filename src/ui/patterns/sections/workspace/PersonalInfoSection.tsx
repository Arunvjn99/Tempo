import { Shield } from "lucide-react";
import { FormSection } from "@/ui/patterns";
import type { ProfileMockData } from "./profileTypes";

export function PersonalInfoSection({ mock }: { mock: ProfileMockData }) {
  return (
    <section id="personal">
      <FormSection title="Personal Information">
        <div className="flex items-center gap-lg">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {mock.initials}
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{mock.name}</p>
            <p className="text-sm text-secondary">Employee ID: {mock.employeeId}</p>
            <span className="mt-xs inline-flex items-center gap-xs rounded-full bg-success/10 px-sm py-0.5 text-xs font-medium text-success">
              <Shield className="h-3 w-3" aria-hidden />
              Verified
            </span>
          </div>
        </div>
      </FormSection>
    </section>
  );
}
