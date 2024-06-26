import { auth, firestore } from "@/utils/firebase";

export const sendFeedback = async (feedback: any) => {
    return firestore
        .collection("admin/support/feedback")
        .doc()
        .set(feedback)
        .then((snapshot) => snapshot);
};

export const sendContact = async (contact: any) => {
    return firestore
        .collection("admin/support/contact")
        .doc()
        .set(contact)
        .then((snapshot) => snapshot);
};

export const sendRating = async (rating: any) => {
    return firestore
        .collection("admin/support/rating")
        .doc()
        .set(rating)
        .then((snapshot) => snapshot);
};

export const getFeedback = async () => {
    return firestore
        .collection("admin/support/feedback")
        .orderBy("timeStamp", "desc")
        .get()
        .then((snapshot) => snapshot);
};

export const getContacts = async () => {
    return firestore
        .collection("admin/support/contact")
        .orderBy("timeStamp", "desc")
        .get()
        .then((snapshot) => snapshot);
};

export const deleteFeedback = async (id: any) => {
    return firestore
        .collection("admin/support/feedback")
        .doc(id)
        .delete()
        .then((snapshot) => snapshot);
};

export const deleteContact = async (id: any) => {
    return firestore
        .collection("admin/support/contact")
        .doc(id)
        .delete()
        .then((snapshot) => snapshot);
};
