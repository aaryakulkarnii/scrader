"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";

type Project = {
  id: string;
  name: string;
  settings: any;
};

type ProjectContextType = {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  refreshProjects: () => Promise<void>;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const refreshProjects = async () => {
    try {
      const data = await fetchAPI("/projects");
      setProjects(data);
      if (data.length > 0 && !activeProject) {
        setActiveProject(data[0]);
      } else if (data.length === 0) {
        setActiveProject(null);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const createProject = async (name: string) => {
    await fetchAPI("/projects/", {
      method: "POST",
      body: JSON.stringify({ name, settings: {} }),
    });
    await refreshProjects();
  };

  const deleteProject = async (id: string) => {
    await fetchAPI(`/projects/${id}`, { method: "DELETE" });
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
    await refreshProjects();
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, activeProject, setActiveProject, refreshProjects, createProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
