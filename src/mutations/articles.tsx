import firebase from "firebase/compat/app";
import { firestore } from "@/utils/firebase/firebase";

export const getArticles = async (options?: Partial<Article>) => {
    const { id, title, verified } = options || {};

    let query: firebase.firestore.Query = firestore.collection("articles");

    if (id) {
        query = query.where("id", "==", id);
    }
    if (title) {
        query = query.where("handle", "==", title);
    }
    if (verified) {
        query = query.where("verified", "==", verified);
    }

    return query.get();
};

export const updateArticleVerification = async (
    articleId: string,
    verified: boolean
) => {
    return firestore
        .collection(`articles`)
        .doc(articleId)
        .update({ verified: verified });
};
