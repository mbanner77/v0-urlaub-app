"use client"

import type { User, VacationRequest, Department } from "./types"
import { create } from "zustand"

interface AppState {
  currentUser: User | null
  users: User[]
  vacationRequests: VacationRequest[]
  departments: Department[]
  setCurrentUser: (user: User | null) => void
  addVacationRequest: (request: Omit<VacationRequest, "id" | "createdAt">) => void
  updateVacationRequest: (id: string, updates: Partial<VacationRequest>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  addUser: (user: User) => void
  deleteUser: (id: string) => void
  addDepartment: (department: Department) => void
  updateDepartment: (id: string, updates: Partial<Department>) => void
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Max Mustermann",
    email: "max.mustermann@realcore.de",
    role: "employee",
    department: "Produktion",
    managerId: "3",
    totalVacationDays: 30,
    usedVacationDays: 8,
  },
  {
    id: "2",
    name: "Anna Schmidt",
    email: "anna.schmidt@realcore.de",
    role: "employee",
    department: "Produktion",
    managerId: "3",
    totalVacationDays: 30,
    usedVacationDays: 12,
  },
  {
    id: "3",
    name: "Thomas Weber",
    email: "thomas.weber@realcore.de",
    role: "manager",
    department: "Produktion",
    managerId: "5",
    totalVacationDays: 30,
    usedVacationDays: 5,
  },
  {
    id: "4",
    name: "Lisa Müller",
    email: "lisa.mueller@realcore.de",
    role: "employee",
    department: "Verwaltung",
    managerId: "5",
    totalVacationDays: 28,
    usedVacationDays: 10,
  },
  {
    id: "5",
    name: "Dr. Klaus Fischer",
    email: "klaus.fischer@realcore.de",
    role: "admin",
    department: "Geschäftsführung",
    managerId: null,
    totalVacationDays: 30,
    usedVacationDays: 3,
  },
]

const initialVacationRequests: VacationRequest[] = [
  {
    id: "v1",
    userId: "1",
    userName: "Max Mustermann",
    userDepartment: "Produktion",
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    days: 5,
    reason: "Winterurlaub",
    status: "pending",
    createdAt: "2026-01-10",
  },
  {
    id: "v2",
    userId: "2",
    userName: "Anna Schmidt",
    userDepartment: "Produktion",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    days: 5,
    reason: "Familienbesuch",
    status: "pending",
    createdAt: "2026-01-12",
  },
  {
    id: "v3",
    userId: "4",
    userName: "Lisa Müller",
    userDepartment: "Verwaltung",
    startDate: "2026-01-20",
    endDate: "2026-01-22",
    days: 3,
    reason: "Persönliche Angelegenheiten",
    status: "approved",
    createdAt: "2026-01-05",
    reviewedBy: "Dr. Klaus Fischer",
    reviewedAt: "2026-01-06",
  },
]

const initialDepartments: Department[] = [
  { id: "d1", name: "Produktion", managerId: "3" },
  { id: "d2", name: "Verwaltung", managerId: "5" },
  { id: "d3", name: "Geschäftsführung", managerId: "5" },
  { id: "d4", name: "Forschung & Entwicklung", managerId: "3" },
]

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  users: initialUsers,
  vacationRequests: initialVacationRequests,
  departments: initialDepartments,
  setCurrentUser: (user) => set({ currentUser: user }),
  addVacationRequest: (request) =>
    set((state) => ({
      vacationRequests: [
        ...state.vacationRequests,
        {
          ...request,
          id: `v${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ],
    })),
  updateVacationRequest: (id, updates) =>
    set((state) => ({
      vacationRequests: state.vacationRequests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      users:
        updates.status === "approved"
          ? state.users.map((u) => {
              const request = state.vacationRequests.find((r) => r.id === id)
              if (request && u.id === request.userId) {
                return {
                  ...u,
                  usedVacationDays: u.usedVacationDays + request.days,
                }
              }
              return u
            })
          : state.users,
    })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  addDepartment: (department) =>
    set((state) => ({
      departments: [...state.departments, department],
    })),
  updateDepartment: (id, updates) =>
    set((state) => ({
      departments: state.departments.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
}))
