import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

export const deleteUserAccount = onCall({ cors: true }, async (request) => {
    const userId = request.data?.userId;

    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The request does not have valid authentication credentials."
        );
    }

    if (request.auth.uid !== userId) {
        throw new HttpsError(
            "permission-denied",
            "You can only delete your own account."
        );
    }

    if (!userId) {
        throw new HttpsError(
            "invalid-argument",
            "Missing userId in request data."
        );
    }

    const db = getFirestore();
    const auth = getAuth();
    const bucket = getStorage().bucket();

    try {
        // 3) Gather Firestore references
        const userDocRef = db.collection("users").doc(userId);
        const businessDocRef = db.collection("business").doc(userId);
        const associatesDocRef = db.collection("associates").doc(userId);

        // We’ll query other collections that reference this user
        const customEventsRef = db.collection("custom_events");
        const merchantProductsRef = db.collection("merchant_products");
        const ambassadorsRef = db.collection("ambassadors");
        const articlesRef = db.collection("articles");

        // 4) Perform queries to find user-linked documents
        const [customEventsSnap, merchantProductsSnap, ambassadorsSnap] =
            await Promise.all([
                customEventsRef.where("userId", "==", userId).get(),
                merchantProductsRef.where("uid", "==", userId).get(),
                ambassadorsRef.where("userId", "==", userId).get(),
                articlesRef.where("userId", "==", userId).get(),
            ]);

        const batch = db.batch();
        batch.delete(userDocRef);
        batch.delete(businessDocRef);
        batch.delete(associatesDocRef);

        customEventsSnap.forEach((doc) => batch.delete(doc.ref));
        merchantProductsSnap.forEach((doc) => batch.delete(doc.ref));
        ambassadorsSnap.forEach((doc) => batch.delete(doc.ref));

        await batch.commit();

        await bucket.deleteFiles({ prefix: `associate/${userId}` });
        await bucket.deleteFiles({ prefix: `users/${userId}` });

        await auth.deleteUser(userId);

        logger.info(
            `Successfully deleted user ${userId} and all related data.`
        );

        return {
            success: true,
            message: `User ${userId} and all their data have been deleted.`,
        };
    } catch (error) {
        logger.error(`Error while deleting user ${userId}:`, error);
        throw new HttpsError(
            "internal",
            `Error while deleting user ${userId}: ${error.message}`
        );
    }
});
