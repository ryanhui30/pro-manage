import Header from '@/components/Header';
import { Clock, Grid3x3, List, PlusSquare, Table, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ModalNewProject from "./ModalNewProject";
import { useDeleteProjectMutation, useGetProjectsQuery } from '@/state/api';
import { useParams, usePathname, useRouter } from 'next/navigation';

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  selectedProjectId?: number | null;
};

const ProjectHeader = ({ activeTab, setActiveTab, selectedProjectId }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [deleteProject] = useDeleteProjectMutation();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const getProjectIdFromUrl = () => {
    if (!pathname) return null;
    const parts = pathname.split('/');
    const projectIndex = parts.findIndex(part => part === 'projects') + 1;
    return projectIndex > 0 && parts.length > projectIndex ? Number(parts[projectIndex]) : null;
  };

  const projectId = selectedProjectId || getProjectIdFromUrl() || (params?.projectId ? Number(params.projectId) : null);

  const { data: projects = [], isLoading: isProjectLoading } = useGetProjectsQuery(
    undefined, // No parameters needed for list query
    { skip: !projectId }
  );

  const project = projects.find(p => p.id === projectId);

  const handleDeleteProject = async () => {
    if (!projectId) {
      alert('No project selected to delete');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this project and all its related data? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteProject(projectId).unwrap();
      alert('Project deleted successfully');
      window.location.href = '/';
    } catch (error) {
      alert(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Delete project error:', error);
    }
  };

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name={
            <nav className="flex items-center" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <span className="text-xl font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Projects Board
                  </span>
                </li>
                {projectId && (
                  <li>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-1 text-xl font-medium text-gray-700 dark:text-gray-400 md:ml-2">
                        {isProjectLoading ? "..." : project?.name}
                      </span>
                    </div>
                  </li>
                )}
              </ol>
            </nav>
          }
          buttonComponent={
            <div className="flex items-center gap-2">
              <button
                className="flex items-center mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={() => setIsModalNewProjectOpen(true)}
              >
                <PlusSquare className="mr-2 h-5 w-5" /> Add Project
              </button>

              {projectId && (
                <button
                  className="flex items-center rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                  onClick={handleDeleteProject}
                  disabled={!projectId}
                >
                  <Trash2 className="mr-2 h-5 w-5" /> Delete Project
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Rest of your component remains the same */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

// TabButton component remains the same
type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
