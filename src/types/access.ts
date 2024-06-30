type AccessStatus = "accepted" | "invited" | "rejected"

type Privileges = "blogs" | "events" | "all"

export type Role = "admin" | "owner"

export interface Access {
    uid?: string
    email: string
    name?: string
    role: Role
    status: AccessStatus
    access: Privileges[]
}