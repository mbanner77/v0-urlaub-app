export type UserRole = "employee" | "manager" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  managerId: string | null
  totalVacationDays: number
  usedVacationDays: number
  avatar?: string
}

export interface VacationRequest {
  id: string
  userId: string
  userName: string
  userDepartment: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewComment?: string
}

export interface Department {
  id: string
  name: string
  managerId: string
}
