"use client";

import Header from "@/components/Header";
import React from "react";
import { useAppSelector } from "../redux";

const Settings = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  const labelStyles = "block text-sm font-medium mb-1 dark:text-gray-300";
  const textStyles = `mt-1 block w-full rounded-md border ${
    isDarkMode
      ? 'bg-dark-secondary border-gray-600 text-gray-300'
      : 'bg-gray-50 border-gray-200 text-gray-700'
  } p-2 shadow-sm sm:text-sm`;

  return (
    <div className="flex w-full flex-col p-6">
      <Header name="User Settings" />

      {/* Left-aligned container matching other pages */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow`}>
        <div className="p-6">
          <div className="space-y-4">
            <div className="text-left">
              <label className={labelStyles}>Username</label>
              <div className={textStyles}>{userSettings.username}</div>
            </div>
            <div className="text-left">
              <label className={labelStyles}>Email</label>
              <div className={textStyles}>{userSettings.email}</div>
            </div>
            <div className="text-left">
              <label className={labelStyles}>Team</label>
              <div className={textStyles}>{userSettings.teamName}</div>
            </div>
            <div className="text-left">
              <label className={labelStyles}>Role</label>
              <div className={textStyles}>{userSettings.roleName}</div>
            </div>

            {/* Left-aligned Save Changes Button */}
            <div className="text-left">
              <button
                className={`mt-6 rounded px-4 py-2 font-medium text-white ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
