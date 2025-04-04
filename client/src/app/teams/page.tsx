"use client";
import { useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { Search, X } from "lucide-react";

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  { field: "projectManagerUsername", headerName: "Project Manager", width: 200 },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTeams = teams?.filter(team =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.productOwnerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.projectManagerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.id.toString().includes(searchTerm)
  ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (isLoading) return (
    <div className="flex w-full flex-col p-6">
      <Header name="Teams List" />
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  if (isError || !teams) return (
    <div className="flex w-full flex-col p-6">
      <Header name="Teams List" />
      <div className={`p-4 rounded-lg ${
        isDarkMode
          ? 'bg-red-900/20 border-red-600 text-red-300'
          : 'bg-red-50 border-red-500 text-red-700'
      } border-l-4`}>
        <div className="flex items-center">
          <X className="h-5 w-5 mr-3" />
          <p>Error fetching teams. Please try again.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col p-6">
      <Header name="Teams List" />

      {/* Search Container */}
      <div className={`mb-6 rounded-lg p-6 ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow`}>
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            className={`block w-full pl-10 pr-12 py-2 border rounded-lg ${
              isDarkMode
                ? 'bg-dark-tertiary border-dark-tertiary text-white'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            onChange={handleSearchChange}
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

      {/* DataGrid Container */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow`}>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredTeams}
            columns={columns}
            pagination
            pageSizeOptions={[10, 25, 50]}
            slots={{
              toolbar: () => (
                <GridToolbarContainer className="flex gap-2 p-2">
                  <GridToolbarFilterButton />
                  <GridToolbarExport />
                </GridToolbarContainer>
              ),
            }}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default Teams;
