import { redirect } from "next/navigation";
import { Locale } from "@/lib/constants";

type TasksRouteProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function TasksRoute({ params }: TasksRouteProps) {
  const { locale } = await params;

  redirect(`/${locale}/tasks/backlog`);
}