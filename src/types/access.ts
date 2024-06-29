type AccessStatus = "accepted" | "invited" | "rejected"

type Privileges = "blogs" | "events" | "all"


export interface Access {
    uid: string
    email: string
    name: string
    role: "owner" | "admin"
    status: AccessStatus
    access: Privileges[]
}