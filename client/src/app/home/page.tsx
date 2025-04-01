"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
  useDeleteTaskMutation,
} from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import ModalNewTask from "@/components/ModalNewTask";
import { PlusSquare } from "lucide-react";

const PRIORITY_COLORS: Record<Priority, string> = {
  Backlog: "#4D96FF",
  Low: "#6BCB77",
  Medium: "#FFD93D",
  High: "#FF6B6B",
  Urgent: "#C68EFD",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Data fetching
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useGetTasksQuery({ projectId: selectedProjectId });

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();

  const [deleteTask] = useDeleteTaskMutation();

  // Task columns with priority color and delete button
  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: PRIORITY_COLORS[params.value as Priority] || '#000' }}>
          {params.value}
        </span>
      )
    },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => handleDeleteTask(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
    },
  ];

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(taskId).unwrap();
      alert("Task deleted successfully");
      refetchTasks();
    } catch {
      alert("Failed to delete task. Please try again.");
    }
  };

  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || projectsError || !tasks || !projects) return <div>Error fetching data</div>;

  // Data calculations
  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    Count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    Count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#FFFFFF",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <div className="flex justify-between items-center mb-4">
        <Header name="Dashboard" />
        <div className="flex items-center gap-4">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
                formatter={(value) => (
                  <span style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="Count" name="Task Count">
                {taskDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PRIORITY_COLORS[entry.name as Priority] || COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Projects Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="Count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={{
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">
              Your Tasks
            </h3>
            <button
              className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> Add Task
            </button>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>

      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
    </div>
  );
};

export default HomePage;
