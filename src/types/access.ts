type AccessStatus = "accepted" | "invited" | "rejected"

type AcessRoles = "blogs" | "events" | "all"

export interface Access {
    uid: string
    email: string
    name: string
    status: AccessStatus
    roles: AcessRoles[]
}