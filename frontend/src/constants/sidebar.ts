import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  ShieldAlert,
  MapPinned,
  FileText,
  Bell,
  Settings,
  User,
  AlertTriangle,
  Bot,
  Users,
} from "lucide-react";
import { SidebarItem } from "@/types/sidebar";
import { ROUTES } from "./routes";

export const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    title: "AI Prediction",
    href: ROUTES.PREDICTION,
    icon: BrainCircuit,
  },
  {
    title: "Emergency",
    href: ROUTES.EMERGENCY,
    icon: ShieldAlert,
  },
  {
    title: "Venue",
    href: ROUTES.VENUES,
    icon: MapPinned,
  },
  {
    title: "Incidents",
    href: ROUTES.INCIDENTS.LIST,
    icon: AlertTriangle,
  },
  {
    title: "Reports",
    href: ROUTES.REPORTS,
    icon: FileText,
  },
  {
    title: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  {
    title: "AI Assistant",
    href: ROUTES.AI_ASSISTANT,
    icon: Bot,
  },
  {
    title: "Users",
    href: ROUTES.USERS,
    icon: Users,
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
  {
    title: "Profile",
    href: ROUTES.PROFILE,
    icon: User,
  },
];
