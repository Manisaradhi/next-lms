import SideBar from "@/components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SideBar>{children}</SideBar>
}
