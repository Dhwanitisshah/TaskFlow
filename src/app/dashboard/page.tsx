import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { getCurrentUser } from "@/lib/auth";
import { serializeTask } from "@/lib/serializers";
import { listTasksByUserId } from "@/lib/store";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const tasks = await listTasksByUserId(user.id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 lg:px-10">
      <DashboardClient initialTasks={tasks.map((task) => serializeTask(task))} userName={user.name} />
    </main>
  );
}
