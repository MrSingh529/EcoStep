
import { ProfileForm } from "./components/profile-form";
import { ContactCard } from "./components/contact-card";
import { SupportCard } from "@/components/support-card";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          My Profile
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your account settings and public profile.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <ProfileForm />
        </div>
        <div className="space-y-8">
            <SupportCard />
            <ContactCard />
        </div>
      </div>
    </div>
  );
}
