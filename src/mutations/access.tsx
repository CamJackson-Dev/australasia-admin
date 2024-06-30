import { Access, Role } from "@/types/access";
import { EmailSender } from "@/utils/email";
import { firestore } from "@/utils/firebase/firebase";

const checkEmailExist = async (email: string) => {
    // console.log(email)
    const adminData = await firestore
        .collection("admin/access/admins")
        .where("email", "==", email)
        .where("status", "==", "accepted")
        .get()

    const userData = await firestore
        .collection("users")
        .where("email", "==", email)
        .get()

    if (adminData.empty && userData.empty) return false
    return true
}

const writeAdminDatabase = async (access: Access) => {
    const adminData = await firestore
        .collection("admin/access/admins")
        .add(access)

    return adminData
}

export const updateAdminDatabase = async (access: Partial<Access>) => {
    const adminData = await firestore
        .collection("admin/access/admins")
        .where("email", "==", access.email)
        .get()

    if (adminData.empty) throw new Error("User doesn't exist");
    const dataId = adminData.docs[0].id

    const updatedData = await firestore
        .collection("admin/access/admins")
        .doc(dataId)
        .update(access)

    return updatedData
}

export const sendAdminInvitation = async (role: Role, email: string) => {
    const emailExist = await checkEmailExist(email)

    if (emailExist){
        return false
    }

    await writeAdminDatabase({
        email,
        role,
        access: ["all"],
        status: "invited"
    })

    const base_url = typeof window != "undefined" && window.location.origin;
    const accept_link = base_url + "/invitation/" + btoa(`accept#${role}#${email}`)
    const reject_link = base_url + "/invitation/" + btoa(`reject#${role}#${email}`)

    const sender = new EmailSender()
    try{
        await sender.sentInvitation({
            to_email: email,
            accept_link: accept_link,
            reject_link: reject_link
        })
    }catch(e){
        throw new Error("Failed to send email")
    }
    console.log("Invitation email sent")
    return true
}