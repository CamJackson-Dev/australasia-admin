import { firestore, storage } from "@/utils/firebase/firebase";
import firebase from "firebase/compat/app";

export const checkVerified = async (uid) => {
    const data = await firestore.collection("users").doc(uid).get();
    const verified = data?.data();
    const status = verified?.status;

    if (status && status == "verified") return true;
    return false;
};

export const getPendingAssociates = async (type) => {
    return firestore
        .collection(`associates`)
        .where("type", "==", type)
        .where("verified", "==", false)
        .get()
        .then((snapshot) => snapshot);
};

export const approveAssociateRegistration = async (uid: string) => {
    return firestore.collection(`associates`).doc(uid).update({
        verified: true,
    });
};

export const rejectAssociateRegistration = async (uid: string) => {
    return firestore.collection(`associates`).doc(uid).update({
        verified: false,
    });
};

// export const getAssociates = async (uid) => {
//     return firestore
//         .collection("users")
//         .doc(uid)
//         .get()
//         .then((snapshot) => {
//             let data = snapshot.data();
//             if (!data || data.type == "user") {
//                 return null;
//             }

//             if (data.status == "pending") {
//                 return firestore
//                     .collection(`registration/associates/${data.type}`)
//                     .doc(uid)
//                     .get()
//                     .then((snapshot) => snapshot);
//             } else {
//                 return firestore
//                     .collection(`users/${uid}/${data.type}`)
//                     .doc("details")
//                     .get()
//                     .then((snapshot) => snapshot);
//             }
//         });
// };

export const getIndividualProduct = async (pid) => {
    return firestore
        .collection("merchant_products")
        .doc(pid)
        .get()
        .then((res) => res);
};

export const deleteIndividualProduct = async (pid) => {
    return firestore
        .collection("merchant_products")
        .doc(pid)
        .delete()
        .then((res) => res);
};

export const getAllMerchantProducts = async () => {
    return firestore
        .collection("merchant_products")
        .get()
        .then((res) => res.docs);
};

export const getMerchantProducts = async (handle) => {
    return firestore
        .collection("merchant_products")
        .where("handle", "==", handle)
        .get()
        .then((res) => res.docs);
};

export const uploadMerchantImages = async (
    uid,
    handle,
    pid,
    productDetails,
    setUploading,
    callBack
) => {
    const images = productDetails.images;
    // console.log(images)
    let filteredProducts = images.filter((item) => typeof item != "string");

    let sortedProducts = filteredProducts.sort((a, b) => a.size - b.size);

    let imagesURL = images.filter((item) => typeof item == "string");

    if (sortedProducts.length == 0) {
        callBack(
            uid,
            handle,
            pid,
            { ...productDetails, images: imagesURL },
            setUploading
        );
        return;
    }

    sortedProducts.map((img, index) => {
        // console.log(index, storageRef)
        const storageRef = storage.ref();
        let uploadRef = storageRef
            .child(`associate/${uid}/merchant/${pid}/${img.name}`)
            .put(img);

        uploadRef.on(
            "state_changed",
            (snapshot) => {},
            (error) => console.log(error),
            () => {
                uploadRef.snapshot.ref.getDownloadURL().then((url) => {
                    // imagesURL = [...imagesURL, url];
                    imagesURL = [...imagesURL, url];
                    if (index == filteredProducts.length - 1) {
                        callBack(
                            uid,
                            handle,
                            pid,
                            { ...productDetails, images: imagesURL },
                            setUploading
                        );
                    }
                });
            }
        );
    });
};

export const uploadMerchantProducts = async (
    uid,
    handle,
    pid,
    productDetails,
    setUploading
) => {
    // console.log(uid, pid)

    return firestore
        .collection("merchant_products")
        .doc(pid)
        .set({
            uid: uid,
            pid: pid,
            handle: handle,
            ...productDetails,
        })
        .then((res) => {
            console.log("Completed");
            setUploading(false);
        });
};

// export const getAssociatesFromHandle = async (handle) => {
//     return firestore
//         .collection("users")
//         .where("handle", "==", handle)
//         .get()
//         .then((snapshot) => {
//             let docs = snapshot.docs[0] ?? null;

//             let data = docs ? docs.data() : null;
//             let uid = docs ? docs.id : null;

//             if (!data || data.type == "user") {
//                 return null;
//             }

//             if (data.status == "pending") {
//                 return firestore
//                     .collection(`registration/associates/${data.type}`)
//                     .doc(uid)
//                     .get()
//                     .then((snapshot) => snapshot);
//             } else {
//                 return firestore
//                     .collection(`users/${uid}/${data.type}`)
//                     .doc("details")
//                     .get()
//                     .then((snapshot) => snapshot);
//             }
//         });
// };

// export const getAssociatesFromUID = async (uid) => {
//     // console.log("id", uid)
//     return firestore
//         .collection("users")
//         .doc(uid)
//         .get()
//         .then((snapshot) => {
//             let data = snapshot.data() ?? null;
//             let uid = snapshot.id ?? null;

//             if (!data || data.type == "user") {
//                 return null;
//             }

//             if (data.status == "pending") {
//                 return firestore
//                     .collection(`registration/associates/${data.type}`)
//                     .doc(uid)
//                     .get()
//                     .then((snapshot) => snapshot);
//             } else {
//                 return firestore
//                     .collection(`users/${uid}/${data.type}`)
//                     .doc("details")
//                     .get()
//                     .then((snapshot) => snapshot);
//             }
//         });
// };

// export const getAssociateSnapshot = async (uid) => {
//     // console.log("id", uid)
//     return firestore
//         .collection("users")
//         .doc(uid)
//         .get()
//         .then((snapshot) => snapshot);
// };

// export const getAssociateSnapshotFromHandle = async (handle) => {
//     // console.log("id", uid)
//     return firestore
//         .collection("users")
//         .where("handle", "==", handle)
//         .get()
//         .then((snapshot) => snapshot);
// };

// export const isHandleAvailable = async (handle) => {
//     return firestore
//         .collection("users")
//         .where("handle", "==", handle)
//         .get()
//         .then((snapshot) => {
//             if (snapshot.empty) return true;
//             return false;
//         });
// };

export const getArtists = async () => {
    const snapshot = await firestore
        .collection("users")
        .where("type", "==", "artist")
        .where("status", "==", "verified")
        .get();

    const promises = snapshot.docs.map(async (snap) => {
        const uid = snap.id;
        const data = snap.data();

        const resData = await firestore
            .collection(`users/${uid}/${data.type}`)
            .doc("details")
            .get()
            .then((snapshot) => snapshot.data());

        return resData;
    });

    const artistData = await Promise.all(promises);
    // console.log("BBB", artistData)
    return artistData;
};

// export class Associate {
//     uid: string;
//     fullname: string;
//     email: string;
//     phone: string;
//     type: string;
//     description: string;
//     avatar: File | string;
//     banner: File | string;
//     logo: File | string;
//     logoUrl: string;
//     gallery: Array<{
//         name: string;
//         description: string;
//         price: number;
//         image: File | string;
//     }>;
//     social: object;
//     links: object;
//     handle: string;
//     country: string;
//     province: string;
//     city: string;
//     mob: string;

//     constructor({
//         uid,
//         fullname,
//         email,
//         phone,
//         type,
//         description,
//         avatar,
//         banner,
//         logo,
//         logoUrl,
//         gallery,
//         social,
//         links,
//         handle,
//         country,
//         province,
//         city,
//         mob,
//     }) {
//         this.uid = uid;
//         this.fullname = fullname;
//         this.email = email;
//         this.phone = phone;
//         this.type = type;
//         this.description = description;
//         this.avatar = avatar;
//         this.banner = banner;
//         this.logo = logo;
//         this.logoUrl = logoUrl;
//         this.gallery = gallery;
//         this.social = social;
//         this.links = links;
//         this.handle = handle;
//         this.country = country;
//         this.province = province;
//         this.city = city;
//         this.mob = mob;
//     }

//     uploadImages = (callBack) => {
//         let storageRef = storage.ref();
//         this.uploadAvatar(storageRef, () =>
//             this.uploadBanner(storageRef, () =>
//                 this.uploadLogo(storageRef, () =>
//                     this.uploadGallery(storageRef, callBack)
//                 )
//             )
//         );
//     };

//     isHandleAvailable = async () => {
//         return firestore
//             .collection("users")
//             .where("handle", "==", this.handle)
//             .get()
//             .then((snapshot) => {
//                 if (snapshot.empty) return true;
//                 return false;
//             });
//     };

//     uploadAvatar = (storageRef, callBack) => {
//         if (!this.avatar || typeof this.avatar == "string") {
//             callBack();
//         } else {
//             let avatarRef = storageRef
//                 .child(`associate/${this.uid}/avatar.jpg`)
//                 .put(this.avatar);
//             avatarRef.on(
//                 "state_changed",
//                 (snapshot) => {},
//                 (error) => console.log(error),
//                 () => {
//                     avatarRef.snapshot.ref.getDownloadURL().then((url) => {
//                         // images["avatar"] = url
//                         this.avatar = url;
//                         callBack();
//                     });
//                 }
//             );
//         }
//     };

//     uploadBanner = (storageRef, callBack) => {
//         if (!this.banner || typeof this.banner == "string") {
//             callBack();
//         } else {
//             let bannerRef = storageRef
//                 .child(`associate/${this.uid}/banner.jpg`)
//                 .put(this.banner);
//             bannerRef.on(
//                 "state_changed",
//                 (snapshot) => {},
//                 (error) => console.log(error),
//                 () => {
//                     bannerRef.snapshot.ref.getDownloadURL().then((url) => {
//                         // images["banner"] = url
//                         this.banner = url;
//                         callBack();
//                     });
//                 }
//             );
//         }
//     };

//     uploadLogo = (storageRef, callBack) => {
//         if (!this.logo || typeof this.logo == "string") {
//             callBack();
//         } else {
//             let logoRef = storageRef
//                 .child(`associate/${this.uid}/logo.jpg`)
//                 .put(this.logo);
//             logoRef.on(
//                 "state_changed",
//                 (snapshot) => {},
//                 (error) => console.log(error),
//                 () => {
//                     logoRef.snapshot.ref.getDownloadURL().then((url) => {
//                         // images["logo"] = url
//                         this.logo = url;
//                         callBack();
//                     });
//                 }
//             );
//         }
//     };

//     uploadGallery = (storageRef, callBack) => {
//         // console.log("All gallery", this.gallery)

//         let filteredGallery = this.gallery.filter(
//             (item) => typeof item.image != "string"
//         );
//         // console.log(filteredGallery)

//         let sortedGallery = filteredGallery.sort(
//             (a, b) => (a.image as File).size - (b.image as File).size
//         );
//         // console.log(sortedGallery)

//         let imagesURL = this.gallery.filter(
//             (item) => typeof item.image == "string"
//         );
//         // console.log(imagesURL)

//         if (sortedGallery.length == 0) {
//             callBack();
//             return;
//         }

//         sortedGallery.map((img, index) => {
//             // console.log(index, storageRef)
//             let uploadRef = storageRef
//                 .child(
//                     `associate/${this.uid}/gallery/${(img.image as File).name}`
//                 )
//                 .put(img.image);

//             uploadRef.on(
//                 "state_changed",
//                 (snapshot) => {},
//                 (error) => console.log(error),
//                 () => {
//                     uploadRef.snapshot.ref.getDownloadURL().then((url) => {
//                         // imagesURL = [...imagesURL, url];
//                         imagesURL = [
//                             ...imagesURL,
//                             {
//                                 name: img.name,
//                                 description: img.description,
//                                 price: img.price,
//                                 image: url,
//                             },
//                         ];
//                         if (index == filteredGallery.length - 1) {
//                             this.gallery = imagesURL;
//                             callBack();
//                         }
//                     });
//                 }
//             );
//         });

//         // maybe used later to maintain order of files uploaded

//         // let indexedGallery = {}
//         // this.gallery.map((image, index) => {
//         //     indexedGallery = {...indexedGallery, [index]: image}
//         // })

//         // let sortedGallery = Object.entries(indexedGallery)
//         //     .sort(([, file1], [, file2]) => file1.size - file2.size)
//         //     .reduce((obj, [key, value], index) => ({ ...obj, [index]: {order:key, file:value} }), {});
//     };

//     updateProfileType = () => {
//         firestore.collection("users").doc(this.uid).update({
//             type: this.type,
//             status: "pending",
//             handle: this.handle,
//         });
//     };

//     registerDetails = (callBack) => {
//         firestore
//             .collection(`registration/associates/${this.type}`)
//             .doc(this.uid)
//             .set({
//                 userID: this.uid,
//                 fullname: this.fullname,
//                 email: this.email,
//                 phone: this.phone,
//                 type: this.type,
//                 description: this.description,
//                 avatar: this.avatar,
//                 banner: this.banner,
//                 logo: this.logo,
//                 logoUrl: this.logoUrl,
//                 gallery: this.gallery,
//                 social: this.social,
//                 links: this.links,
//                 handle: this.handle,
//                 country: this.country,
//                 province: this.province,
//                 city: this.city,
//                 mob: this.mob,
//             })
//             .then((docRef) => {
//                 this.updateProfileType();
//                 callBack();
//                 console.log("Document written");
//             })
//             .catch(function (error) {
//                 console.error("Error adding document: ", error);
//             });
//     };

//     updateDetails = (callBack) => {
//         firestore
//             .collection(`users/${this.uid}/${this.type}`)
//             .doc("details")
//             .set({
//                 userID: this.uid,
//                 fullname: this.fullname,
//                 email: this.email,
//                 phone: this.phone,
//                 type: this.type,
//                 description: this.description,
//                 avatar: this.avatar,
//                 banner: this.banner,
//                 logo: this.logo,
//                 logoUrl: this.logoUrl,
//                 gallery: this.gallery,
//                 social: this.social,
//                 links: this.links,
//                 handle: this.handle,
//                 country: this.country,
//                 province: this.province,
//                 city: this.city,
//                 mob: this.mob,
//             })
//             .then((docRef) => {
//                 callBack();
//                 console.log("Document written");
//             })
//             .catch(function (error) {
//                 console.error("Error adding document: ", error);
//             });
//     };

//     approveRegistration = (callBack) => {
//         let batch = firestore.batch();

//         let delRef = firestore
//             .collection(`registration/associates/${this.type}`)
//             .doc(this.uid);
//         batch.delete(delRef);

//         let updateRef = firestore.collection(`users`).doc(this.uid);
//         batch.update(updateRef, {
//             status: "verified",
//             handle: this.handle,
//         });

//         let addRef = firestore
//             .collection(`users/${this.uid}/${this.type}`)
//             .doc("details");
//         batch.set(addRef, {
//             userID: this.uid,
//             fullname: this.fullname,
//             email: this.email,
//             phone: this.phone,
//             type: this.type,
//             description: this.description,
//             avatar: this.avatar,
//             banner: this.banner,
//             logo: this.logo,
//             logoUrl: this.logoUrl,
//             gallery: this.gallery,
//             social: this.social,
//             links: this.links,
//             handle: this.handle,
//             country: this.country,
//             province: this.province,
//             city: this.city,
//             mob: this.mob,
//         });

//         batch.commit().then(() => {
//             callBack();
//             // console.log("Added")
//         });
//     };

//     rejectRegistration = (callBack) => {
//         let batch = firestore.batch();

//         let delRef = firestore
//             .collection(`registration/associates/${this.type}`)
//             .doc(this.uid);
//         batch.delete(delRef);

//         let updateRef = firestore.collection(`users`).doc(this.uid);
//         batch.update(updateRef, {
//             type: "user",
//             status: firebase.firestore.FieldValue.delete(),
//         });

//         batch.commit().then(() => {
//             callBack();
//             // this.deleteStorage(callBack)
//             console.log("Deleted");
//         });
//     };

//     // deleteStorage = (callBack) => {
//     //     let storageRef = storage.ref();
//     //     let associateStorage = storageRef.bucket()

//     //     associateStorage.delete().then((res) => {
//     //         callBack()
//     //     }).catch(error => console.log(error))

//     // }
// }
