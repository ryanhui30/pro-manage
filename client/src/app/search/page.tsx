"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useAppSelector } from "../redux";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "tasks" | "users">("all");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const debouncedSearch = debounce((term: string) => {
    if (term.length >= 3) {
      // The query will automatically run due to the useSearchQuery hook
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredResults = {
    projects: (activeTab === "all" || activeTab === "projects") ? searchResults?.projects || [] : [],
    tasks: (activeTab === "all" || activeTab === "tasks") ? searchResults?.tasks || [] : [],
    users: (activeTab === "all" || activeTab === "users") ? searchResults?.users || [] : [],
  };

  const hasResults =
    filteredResults.projects.length > 0 ||
    filteredResults.tasks.length > 0 ||
    filteredResults.users.length > 0;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Search" />

      {/* Search Box */}
      <div className={`mb-6 rounded-lg p-6 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow`}>
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects, tasks, or users..."
            className={`block w-full pl-10 pr-12 py-2 border rounded-lg ${
              isDarkMode
                ? 'bg-dark-tertiary border-dark-tertiary text-white'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            onChange={handleInputChange}
            value={searchTerm}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              type="button"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Extended Results Container */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow min-h-[calc(100vh-300px)]`}>
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-dark-tertiary mb-6">
          {["all", "projects", "tasks", "users"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(tab as any)}
              type="button"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : isError ? (
          <div className={`p-4 rounded ${
            isDarkMode
              ? 'bg-red-900/20 border-red-600 text-red-300'
              : 'bg-red-50 border-red-500 text-red-700'
          } border-l-4`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Error loading search results
                </p>
              </div>
            </div>
          </div>
        ) : searchTerm.length < 3 ? (
          <div className="py-8 text-center">
            <Search className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className={`mt-2 text-lg font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Start searching
            </h3>
            <p className={`mt-1 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Enter at least 3 characters
            </p>
          </div>
        ) : !hasResults ? (
          <div className="py-8 text-center">
            <Search className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className={`mt-2 text-lg font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No results found
            </h3>
            <p className={`mt-1 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredResults.projects.length > 0 && (
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Projects ({filteredResults.projects.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {filteredResults.tasks.length > 0 && (
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Tasks ({filteredResults.tasks.length})
                </h2>
                <div className="space-y-3">
                  {filteredResults.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {filteredResults.users.length > 0 && (
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Users ({filteredResults.users.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
