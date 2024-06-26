
import { EventDescription, EventDetails } from "@/types/event";
import { firestore, storage } from "@/utils/firebase";
import { getHandleFromName, reverseGetHandle } from "@/utils/getHandle";
import firebase from "firebase/compat/app";

type CityType = {
    country: "AU" | "NZ" | "PNG";
    territory: string;
    city: string;
};

interface EventGetOptions {
    handle?: string;
    eventType?: "user" | "admin";
    eventUrl?: string;
    testEvent?: boolean;
    verified?: boolean;
    city?: CityType;
}

export const getEvents = async (options?: EventGetOptions) => {
    const { handle, eventType, eventUrl, testEvent, verified, city } =
        options || {};

    let query: firebase.firestore.Query = firestore.collection("custom_events");

    if (eventUrl) {
        query = query.where("eventUrl", "==", eventUrl);
    }
    if (handle) {
        query = query.where("handle", "==", handle);
    }
    if (testEvent !== undefined) {
        query = query.where("testEvent", "==", testEvent);
    }
    if (verified !== undefined) {
        query = query.where("verified", "==", verified);
    }
    if (eventType) {
        query = query.where("eventType", "==", eventType);
    }

    if (city) {
        query = query
            .where("country", "==", reverseGetHandle(city.country))
            .where("territory", "==", reverseGetHandle(city.territory))
            .where("city", "==", reverseGetHandle(city.city));
    }

    return query.get();
};

export const getEventByUserId = async (userId: string) => {
    return firestore
        .collection(`custom_events`)
        .where("userId", "==", userId)
        .where("testEvent", "==", false)
        .get()
        .then((snapshot) => snapshot);
};

export const deleteEventByHandle = async (handle: string) => {
    const deleteFile = (pathToFile: string, fileName: string) => {
        const ref = storage.ref(pathToFile);
        const childRef = ref.child(fileName);
        childRef.delete();
    };

    return firestore
        .collection(`custom_events`)
        .doc(handle)
        .delete()
        .then(async () => {
            const storageRef = storage.ref(`custom-events/${handle}`);
            await storageRef
                .listAll()
                .then((dir) => {
                    dir.items.forEach(
                        (fileRef) => fileRef.delete()
                        // deleteFile(storageRef.fullPath, fileRef.name)
                    );
                })
                .catch((error) => console.log(error));

            const bannerRef = storage.ref(`custom-events/${handle}/banner`);
            await bannerRef
                .listAll()
                .then((dir) => {
                    dir.items.forEach(
                        (fileRef) => fileRef.delete()
                        // deleteFile(storageRef.fullPath, fileRef.name)
                    );
                })
                .catch((error) => console.log(error));

            const speakerRef = storage.ref(
                `custom-events/${handle}/speakerImage`
            );
            await speakerRef
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

export const updateUserEventVerification = async (
    handle: string,
    verified: boolean
) => {
    return firestore
        .collection(`custom_events`)
        .doc(handle)
        .update({ verified: verified });
};

export const uploadEventImages = async (
    eventDetails: EventDetails,
    callBack: (
        eventDetails: EventDetails,
        description: EventDescription[]
    ) => void
) => {
    const { title, eventId } = eventDetails;
    const eventHandle = getHandleFromName(title);

    // const images = objectValues(eventDetails.images)
    const images = eventDetails.description.map((desc) => desc.image);

    // let filteredProducts = images.filter(
    //     (item): item is File => typeof item != "string"
    // );
    let filteredProducts = eventDetails.description.filter(
        (item) => item.image instanceof File
    );

    let sortedProducts = filteredProducts.sort(
        (a, b) => (a.image as File).size - (b.image as File).size
    );
    console.log(sortedProducts, "sorted");

    const newDescriptions = [...eventDetails.description];
    if (sortedProducts.length == 0) {
        callBack(eventDetails, newDescriptions);
        // return
    }

    sortedProducts.map(async (details, index) => {
        // console.log(index, storageRef)
        const storageRef = storage.ref();
        let uploadRef = storageRef
            .child(
                `custom-events/${eventHandle}/${(details.image as File).name}`
            )
            .put(details.image as File);

        uploadRef.on(
            "state_changed",
            (snapshot) => {},
            (error) => console.log(error),
            async () => {
                await uploadRef.snapshot.ref.getDownloadURL().then((url) => {
                    newDescriptions[details.index].image = url;
                    if (index == filteredProducts.length - 1) {
                        callBack(eventDetails, newDescriptions);
                        // return
                    }
                });
            }
        );
    });
};

export const uploadEventBanner = async (
    eventDetails: EventDetails,
    callBack: (eventDetails: EventDetails) => void
) => {
    const storageRef = storage.ref();
    const { banner, handle } = eventDetails;

    let newEventDetails = { ...eventDetails };
    if (!banner || typeof banner == "string") {
        callBack(eventDetails);
    } else {
        let bannerRef = storageRef
            .child(`custom-events/${handle}/banner/banner.jpg`)
            .put(banner);
        bannerRef.on(
            "state_changed",
            (snapshot) => {},
            (error) => console.log(error),
            () => {
                bannerRef.snapshot.ref.getDownloadURL().then((url) => {
                    newEventDetails = { ...newEventDetails, banner: url };
                    callBack(newEventDetails);
                });
            }
        );
    }
};

export const uploadSpeakerImage = async (
    eventDetails: EventDetails,
    callBack: (eventDetails: EventDetails) => void
) => {
    const storageRef = storage.ref();
    const { speakerImage, handle } = eventDetails;

    let newEventDetails = { ...eventDetails };
    if (!speakerImage || typeof speakerImage == "string") {
        callBack(eventDetails);
    } else {
        let speakerImageRef = storageRef
            .child(`custom-events/${handle}/speakerImage/speakerImage.jpg`)
            .put(speakerImage);
        speakerImageRef.on(
            "state_changed",
            (snapshot) => {},
            (error) => console.log(error),
            () => {
                speakerImageRef.snapshot.ref.getDownloadURL().then((url) => {
                    newEventDetails = { ...newEventDetails, speakerImage: url };
                    callBack(newEventDetails);
                });
            }
        );
    }
};

export const uploadEventDetails = async (
    eventDetails: EventDetails,
    description: EventDescription[]
) => {
    // console.log(uid, pid)
    const { title, eventId, handle } = eventDetails;
    // const eventHandle = getHandleFromName(title);

    return firestore
        .collection("custom_events")
        .doc(handle)
        .set({
            ...eventDetails,
            description: description,
        })
        .then((res) => {
            console.log("Completed");
        });
};
