import ProfileView from "../ProfileView";

type ProfileByIdProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfileById({ params }: ProfileByIdProps) {
  const { id } = await params;
  return <ProfileView userId={id} />;
}
