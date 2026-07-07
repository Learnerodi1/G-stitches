import AdminShell from "./components/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        div[class*="fixed"][class*="z-50"],
        div[class*="fixed"][class*="z-[100]"] { display: none !important; }
        nav { display: none !important; }
        main { padding-top: 0 !important; }
        main ~ * { display: none !important; }
      `}</style>
      <AdminShell>{children}</AdminShell>
    </>
  );
}
