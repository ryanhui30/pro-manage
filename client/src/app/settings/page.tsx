"use client";

import Header from "@/components/Header";
import React from "react";
import { useAppSelector } from "../redux";
import { useGetAuthUserQuery } from "@/state/api";

const Settings = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: currentUser, isLoading, error } = useGetAuthUserQuery({});

  const labelStyles = "block text-sm font-medium mb-1 dark:text-gray-300";
  const textStyles = `mt-1 block w-full rounded-md border ${
    isDarkMode
      ? 'bg-dark-secondary border-gray-600 text-gray-300'
      : 'bg-gray-50 border-gray-200 text-gray-700'
  } p-2 shadow-sm sm:text-sm`;

  if (isLoading) return <div className="p-6">Loading user settings...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading user settings</div>;

  return (
    <div className="flex w-full flex-col p-6">
      <Header name="Account Settings" />

      <div className={`rounded-lg ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow`}>
        <div className="p-6">
          <div className="space-y-4">

            {/* Username Field */}
            <div className="text-left">
              <label className={labelStyles}>Username</label>
              <div className={textStyles}>
                {currentUser?.user?.username || "No email"}
              </div>
            </div>

            {/* Edit Button (optional) */}
            <div className="text-left pt-4">
              <button
                className={`rounded px-4 py-2 font-medium text-white ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => {
                  // Add edit functionality here
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
