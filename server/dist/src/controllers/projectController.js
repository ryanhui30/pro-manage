"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.createProject = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma.project.findMany();
        res.json(projects);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving projects: ${error.message}` });
    }
});
exports.getProjects = getProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, startDate, endDate } = req.body;
    try {
        const newProject = yield prisma.project.create({
            data: {
                name,
                description,
                startDate,
                endDate,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating a project: ${error.message}` });
    }
});
exports.createProject = createProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        // First verify the project exists
        const existingProject = yield prisma.project.findUnique({
            where: { id: Number(projectId) }
        });
        if (!existingProject) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        // Then proceed with deletion
        yield prisma.$transaction([
            prisma.comment.deleteMany({
                where: { task: { projectId: Number(projectId) } }
            }),
            prisma.attachment.deleteMany({
                where: { task: { projectId: Number(projectId) } }
            }),
            prisma.taskAssignment.deleteMany({
                where: { task: { projectId: Number(projectId) } }
            }),
            prisma.task.deleteMany({
                where: { projectId: Number(projectId) }
            }),
            prisma.project.delete({
                where: { id: Number(projectId) }
            })
        ]);
        res.status(200).json({
            message: 'Project and all related data deleted successfully'
        });
    }
    catch (error) {
        console.error('Full error:', error);
        res.status(500).json({
            message: `Error deleting project: ${error.message}`,
            details: error
        });
    }
});
exports.deleteProject = deleteProject;
