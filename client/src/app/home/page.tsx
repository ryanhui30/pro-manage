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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  // All hooks called at the top
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useGetTasksQuery({ projectId: 1 }); // Changed to number
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [deleteTask] = useDeleteTaskMutation();

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

  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => handleDeleteTask(params.row.id as number)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
    },
  ];

  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

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
        barGrid: "#303030",
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
      <Header name="Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="Count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
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
          <ModalNewTask
            isOpen={isModalNewTaskOpen}
            onClose={() => setIsModalNewTaskOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
