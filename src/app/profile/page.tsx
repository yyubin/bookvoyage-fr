import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";
import { getServerUser } from "../services/authServer";

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth?redirect=/profile");
  }

  const userId = user.id ? String(user.id) : "1";
  return <ProfileView userId={userId} />;
}
