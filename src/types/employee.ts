export interface EmployeeIdentification {
  fullName: string
  cpf: string
  birthDate: string
  rgIssueDate: string | null
}

export interface EmployeeAddress {
  postalCode: string
  street: string
  addressNumber: string
  addressComplement: string | null
  district: string | null
  city: string | null
  state: string
}

export interface EmployeePersonalInfo {
  sex: string
  raceColor: string
  maritalStatus: string
  educationLevel: string
  birthplace: string
  nationality: string
}

export interface EmployeeContact {
  mobilePhone: string | null
  email: string | null
}

export interface EmployeeParents {
  motherName: string
  fatherName: string | null
}

export interface EmployeeApplicationDraft
  extends EmployeeIdentification,
    EmployeeAddress,
    EmployeePersonalInfo,
    EmployeeContact,
    EmployeeParents {
  privacyAccepted: boolean
}

export interface EmployeeApplication extends EmployeeApplicationDraft {
  id: string
  protocolNumber: string
  status: import('./status').ApplicationStatus
  submittedAt: string | null
  assignedTo: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
}
