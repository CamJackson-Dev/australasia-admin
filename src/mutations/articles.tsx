import firebase from "firebase/compat/app";
import { firestore, storage } from "@/utils/firebase/firebase";

export const getArticles = async (options?: Partial<Article>) => {
    const { id, title, verified, handle } = options || {};

    let query: firebase.firestore.Query = firestore.collection("articles");

    if (id) {
        query = query.where("id", "==", id);
    }
    if (handle) {
        query = query.where("handle", "==", handle);
    }
    if (title) {
        query = query.where("handle", "==", title);
    }
    if (verified) {
        query = query.where("verified", "==", verified);
    }

    return query.get();
};

export const deleteArticle = async (article: Article) => {
    const { id } = article;

    return firestore
        .collection(`articles`)
        .doc(id)
        .delete()
        .then(async () => {
            const storageRef = storage.ref(`articles/${id}`);
            await storageRef
                .listAll()
                .then((dir) => {
                    dir.items.forEach(
                        (fileRef) => fileRef.delete()
                        // deleteFile(storageRef.fullPath, fileRef.name)
                    );
                })
                .catch((error) => console.log(error));

            const bannerRef = storage.ref(`articles/${id}/banner`);
            await bannerRef
                .listAll()
                .then((dir) => {
                    dir.items.forEach(
                        (fileRef) => fileRef.delete()
                        // deleteFile(storageRef.fullPath, fileRef.name)
                    );
                })
                .catch((error) => console.log(error));
        });
};

export const getArticleAuthor = async (userId: string) => {
    // console.log(userId);
    return await firestore.collection(`associates`).doc(userId).get();
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

export const deleteArticleById = async (articleId: string) => {
    return firestore.collection(`articles`).doc(articleId).delete();
};

export const uploadArticleBanner = async (
    article: Article
): Promise<Article> => {
    const storageRef = storage.ref();
    const { banner, id } = article;

    if (!banner || typeof banner == "string") {
        return article;
    } else {
        const bannerRef = storageRef.child(`articles/${id}/banner/banner.jpg`);
        await bannerRef.put(banner);
        const url = await bannerRef.getDownloadURL();
        const newArticle = { ...article, banner: url };
        return newArticle;
    }
};

export const uploadArticle = async (article: Article) => {
    const { id } = article;

    return firestore
        .collection("articles")
        .doc(id)
        .set(article)
        .then((res) => {
            console.log("Completed");
        });
};
