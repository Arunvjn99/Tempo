import { FadeIn } from "@/ui/animations";

export function ProfileHeader() {
  return (
    <FadeIn duration="normal" ease="smooth">
      <header className="flex flex-col gap-xs">
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
        <p className="text-sm text-secondary">
          Manage your personal information, beneficiaries, and preferences.
        </p>
      </header>
    </FadeIn>
  );
}
