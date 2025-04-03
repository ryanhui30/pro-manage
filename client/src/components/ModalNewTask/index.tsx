import Modal from "@/components/Modal";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
  projectId?: number; // Added this prop
};

const ModalNewTask = ({ isOpen, onClose, id = null, projectId }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!isFormValid()) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const formattedStartDate = startDate ? formatISO(new Date(startDate), {
        representation: "complete",
      }) : undefined;

      const formattedDueDate = dueDate ? formatISO(new Date(dueDate), {
        representation: "complete",
      }) : undefined;

      await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: parseInt(authorUserId),
        assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
        projectId: id !== null ? Number(id) : Number(projectId),
      }).unwrap();

      // Reset form
      setTitle("");
      setDescription("");
      setStatus(Status.ToDo);
      setPriority(Priority.Backlog);
      setTags("");
      setStartDate("");
      setDueDate("");
      setAuthorUserId("");
      setAssignedUserId("");
      onClose();
    } catch (error) {
      setError("Failed to create task. Please try again.");
      console.error("Create task error:", error);
    }
  };

  const isFormValid = () => {
    return title && authorUserId && (id !== null || projectId);
  };

  const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {error && <div className="text-red-500">{error}</div>}

        <input
          type="text"
          className={inputStyles}
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className={selectStyles}
              value={status}
              onChange={(e) => setStatus(Status[e.target.value as keyof typeof Status])}
            >
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              className={selectStyles}
              value={priority}
              onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
            >
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date *
            </label>
            <input
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date *
            </label>
            <input
              type="date"
              className={inputStyles}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author User ID *
          </label>
          <input
            type="text"
            className={inputStyles}
            value={authorUserId}
            onChange={(e) => setAuthorUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assigned User ID
          </label>
          <input
            type="text"
            className={inputStyles}
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
          />
        </div>

        {id === null && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project ID *
            </label>
            <input
              type="text"
              className={inputStyles}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required={id === null}
            />
          </div>
        )}

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
