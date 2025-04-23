"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import React, { useState } from "react";
import {
  LockIcon,
  LucideIcon,
  Home,
  X,
  Briefcase,
  Search,
  Settings,
  User,
  Users,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Layers3
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setIsSidebarCollasped } from "@/state";
import { useGetAuthUserQuery, useGetProjectsQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollasped,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!currentUser) return null;

  const username = currentUser?.userDetails?.username || currentUser?.user?.username || "Guest";
  const profilePictureUrl = currentUser?.userDetails?.profilePictureUrl;

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-100 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[calc(100vh-56px)] w-full flex-col justify-between">
        <div>
          {/* Top Logo */}
          <div className="z-50 flex min-h-[56px] items-center justify-between bg-white px-6 pt-3 dark:bg-black transition-colors duration-100">
            <div className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-100">
              Pro Manage
            </div>
            {!isSidebarCollapsed && (
              <button
                className="py-3"
                onClick={() => dispatch(setIsSidebarCollasped(true))}
              >
                <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white transition-colors duration-100" />
              </button>
            )}
          </div>

          {/* User Profile */}
          <Link href="/settings" className="w-full">
            <div className="flex items-center gap-4 border-y border-gray-200 px-6 py-4 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100">
              <div className="flex-shrink-0">
                {profilePictureUrl ? (
                  <Image
                    src={`/${profilePictureUrl}`}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-100">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors duration-100" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-md font-bold truncate text-gray-800 dark:text-gray-200 transition-colors duration-100">
                  {username}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <LockIcon className="h-3 w-3 text-gray-500 dark:text-gray-400 transition-colors duration-100" />
                  <p className="text-xs truncate text-gray-500 dark:text-gray-400 transition-colors duration-100">Private</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Main Navigation - Collapsible */}
          <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-100">
            <button
              onClick={() => setShowNavigation((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-100"
            >
              <span className="font-medium">Navigation</span>
              {showNavigation ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {showNavigation && (
              <nav className="w-full">
                <SidebarLink icon={Home} label="Home" href="/" />
                <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
                <SidebarLink icon={Search} label="Search" href="/search" />
                <SidebarLink icon={User} label="Users" href="/users" />
                <SidebarLink icon={Users} label="Teams" href="/teams" />
                <SidebarLink icon={Settings} label="Settings" href="/settings" />
              </nav>
            )}
          </div>

          {/* Projects Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-100">
            <button
              onClick={() => setShowProjects((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-100"
            >
              <span className="font-medium">Projects</span>
              {showProjects ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {showProjects && (
              <div className="pb-2">
                {projects?.map((project) => (
                  <SidebarLink
                    key={project.id}
                    icon={Briefcase}
                    label={project.name}
                    href={`/projects/${project.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Priority Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-100">
            <button
              onClick={() => setShowPriority((prev) => !prev)}
              className="flex w-full items-center justify-between px-6 py-3 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-100"
            >
              <span className="font-medium">Priority</span>
              {showPriority ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {showPriority && (
              <div className="pb-2">
                <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
                <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
                <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
                <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
                <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sign Out - Only visible on mobile */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 transition-colors duration-100">
          <div className="flex items-center justify-between p-4">
            <button
              className="flex items-center rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 transition-colors duration-100"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex items-center gap-3 px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
        } transition-colors duration-100`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
        )}
        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'} transition-colors duration-100`} />
        <span className={`font-medium ${isActive ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'} transition-colors duration-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
