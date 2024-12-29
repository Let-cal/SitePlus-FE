import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";

export default function AdminPage() {
  const adminItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/admin/home",
      isActive: true,
    },
    {
      icon: <FileText size={20} />,
      label: "YÊU CẦU",
      href: "/admin/requests",
    },
    {
      icon: <Briefcase size={20} />,
      label: "GIAO VIỆC",
      href: "/admin/assignments",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "NHẬN KHẢO SÁT",
      href: "/admin/surveys",
    },
  ];

  return (
    <Sidebar
      logoHref={LogoSitePlus}
      title="Admin Page"
      mainNavItems={adminItems}
    />
  );
}
