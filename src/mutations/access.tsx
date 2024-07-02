import { Access, Role } from "@/types/access";
import { EmailSender } from "@/utils/email";
import { auth, firestore } from "@/utils/firebase/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getAllAdmins = async () => {
    const adminData = await firestore.collection("admin/access/admins").get();

    return adminData;
};

const checkEmailExist = async (email: string) => {
    // console.log(email)
    const adminData = await firestore
        .collection("admin/access/admins")
        .where("email", "==", email)
        .get();

    const userData = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();

    if (adminData.empty && userData.empty) return false;
    return true;
};

const writeAdminDatabase = async (access: Access) => {
    const adminData = await firestore
        .collection("admin/access/admins")
        .add(access);

    return adminData;
};

export const updateAdminDatabase = async (access: Partial<Access>) => {
    const adminData = await firestore
        .collection("admin/access/admins")
        .where("email", "==", access.email)
        .get();

    if (adminData.empty) throw new Error("User doesn't exist");
    const dataId = adminData.docs[0].id;
    console.log("data id", dataId);

    const updatedData = await firestore
        .collection("admin/access/admins")
        .doc(dataId)
        .update(access);

    return updatedData;
};

export const sendAdminInvitation = async (role: Role, email: string) => {
    const emailExist = await checkEmailExist(email);

    if (emailExist) {
        return false;
    }

    await writeAdminDatabase({
        email,
        role,
        access: ["all"],
        status: "invited",
    });

    const base_url = typeof window != "undefined" && window.location.origin;
    const accept_link =
        base_url + "/invitation/" + btoa(`accept#${role}#${email}`);
    const reject_link =
        base_url + "/invitation/" + btoa(`reject#${role}#${email}`);

    const sender = new EmailSender();
    try {
        await sender.sentInvitation({
            to_email: email,
            accept_link: accept_link,
            reject_link: reject_link,
        });
    } catch (e) {
        throw new Error("Failed to send email");
    }
    console.log("Invitation email sent");
    return true;
};

export const deleteAdmin = async (email: string) => {
    try {
        const res = await auth.currentUser.getIdTokenResult();
        const role = res.claims.role;

        if (!role || role != "owner") {
            throw new Error("Action not allowed!");
        }

        //delete from database
        const doc = await firestore
            .collection("admin/access/admins")
            .where("email", "==", email)
            .get();
        if (doc.empty) return;

        //delete the user account with cloud function
        const docId = doc.docs[0].id;
        const userId = (doc.docs[0].data() as Access).uid;
        await firestore.collection("admin/access/admins").doc(docId).delete();

        const deleteAdminCloudFunction = httpsCallable(
            getFunctions(),
            "deleteAdmin"
        );
        await deleteAdminCloudFunction({ uid: userId });
        console.log("Admin deleted successfully");

        return true;
    } catch (e) {
        throw new Error(e.message);
    }
};

export const checkInvitationExist = async (email: string) => {
    const userData = await firestore
        .collection("admin/access/admins")
        .where("email", "==", email)
        .get();

    const data = userData.docs[0].data() as Access;
    const res = {
        exists: !userData.empty,
        status: data.status,
    };

    return res;
};

export const rejectAdminInvitation = async (email: string) => {
    try {
        const doc = await firestore
            .collection("admin/access/admins")
            .where("email", "==", email)
            .get();

        if (doc.empty) return true;

        const docId = doc.docs[0].id;
        await firestore.collection("admin/access/admins").doc(docId).delete();
        return true;
    } catch (e) {
        throw new Error(e.message);
    }
};
