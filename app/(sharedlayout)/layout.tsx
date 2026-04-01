import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";
import Navbar from "@/components/web/Navbar";
import { getToken } from "../lib/auth-server";

export default async function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  return (
    <ConvexClientProvider initialToken={token}>
      <Navbar />
      {children}
    </ConvexClientProvider>
  );
}
