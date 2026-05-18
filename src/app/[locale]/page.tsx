import LoginPage from "./login/page";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalePage({
  params,
}: LocalePageProps) {
  const { locale } = await params;

  return <LoginPage params={Promise.resolve({ locale })} />;
}