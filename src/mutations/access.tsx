import { firestore } from "@/utils/firebase/firebase";

const checkEmailExist = async (email: string) => {
    // console.log(email)
    const adminData = await firestore
        .collection("admin/access/admins")
        .where("email", "==", email)
        .get()

    const userData = await firestore
        .collection("users")
        .where("email", "==", email)
        .get()

    if (adminData.empty && userData.empty) return false
    return true
}

export const sendAdminInvitation = async (email: string) => {
    const emailExist = await checkEmailExist(email)

    if (emailExist){
        return false
    }
    console.log("Email sent")
    return true
}