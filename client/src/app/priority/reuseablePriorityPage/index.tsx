"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import ModalNewTask from "@/components/ModalNewTask";
import TaskCard from "@/components/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { Priority, Task, useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PlusSquare } from "lucide-react";
import React, { useState } from "react";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 100,
    renderCell: (params) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        params.value === Priority.Urgent ? 'bg-red-100 text-red-800' :
        params.value === Priority.High ? 'bg-orange-100 text-orange-800' :
        params.value === Priority.Medium ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {params.value}
      </span>
    ),
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

type Props = {
  priority: Priority;
  projectId?: number;
};

const ReusablePriorityPage = ({ priority, projectId: initialProjectId = 1 }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(initialProjectId);

  const { data: tasks = [], isLoading, isError } = useGetTasksQuery(
    { projectId: selectedProjectId },
    { skip: !selectedProjectId }
  );

  const { data: projects = [] } = useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter((task: Task) => task.priority === priority);

  if (isError) return <div>Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        projectId={selectedProjectId}
      />

      <div className="flex flex-col mb-4 gap-4">
        <div className="flex justify-between items-center gap-4">
          <Header
            name={`${priority} Priority Tasks`}
            className="flex-1"  // Now this will work
          />

          <div className="flex items-center gap-4">
            <button
              className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 whitespace-nowrap"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> Add Task
            </button>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="px-4 py-2 text-lg border rounded-lg dark:bg-dark-secondary dark:text-white min-w-[200px]"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || `Project ${project.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === "list" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${
            view === "table" ? "bg-gray-300" : "bg-white"
          } rounded-r`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks?.length > 0 ? (
            filteredTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No {priority.toLowerCase()} priority tasks found for selected project
            </div>
          )}
        </div>
      ) : (
        view === "table" && (
          <div className="z-0 w-full">
            {filteredTasks?.length > 0 ? (
              <DataGrid
                rows={filteredTasks}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                No {priority.toLowerCase()} priority tasks to display in table view
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
