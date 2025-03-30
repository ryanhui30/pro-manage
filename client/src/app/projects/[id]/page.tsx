"use client";

import React, { useState } from 'react';
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from '../BoardView';
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from '@/components/ModalNewTask';
import { useParams } from 'next/navigation';

const Project = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

    if (!id) return <div>Project not found</div>;

    return (
        <div>
            <ModalNewTask
                isOpen={isModalNewTaskOpen}
                onClose={() => setIsModalNewTaskOpen(false)}
                id={id}
            />
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "Board" && (
                <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "List" && (
                <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "Table" && (
                <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
        </div>
    );
}

export default Project;
