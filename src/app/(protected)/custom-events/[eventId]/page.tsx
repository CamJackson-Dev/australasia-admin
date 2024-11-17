"use client";

import React, { Fragment, useContext, useEffect, useState } from "react";
import {
    getEvents,
    uploadEventBanner,
    uploadEventDetails,
    uploadEventImages,
    uploadSpeakerImage,
} from "@/mutations/events";

import CustomGoogleMap from "@/components/map";
import TitledContainer from "@/components/TitledContainer";
import { useQuery } from "react-query";
// import { AuthContext } from "../../../src/config/auth";
import { useRouter } from "next/navigation";
import AddressInput from "@/components/AddressInput";
import TagsInput from "@/components/TagsInput";
import { addDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import useToast from "@/hooks/useToast";
import { EventDescription, EventDetails } from "@/types/event";
import { getHandleFromName } from "@/utils/getHandle";
import { getUuid } from "@/utils/uuid";
import CircularProgress from "@/components/ui/loading";
import { MonitorUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { eventTags } from "@/data/eventTags";

const CustomEvents = () => {
    const notify = useToast();
    const router = useRouter();

    // const locationState = Boolean(router.query.isEdit);
    // const { userInfo } = useContext(AuthContext);
    const [details, setDetails] = useState<EventDetails>({
        eventType: "admin",
        verified: true,
        title: "",
        description: [
            {
                image: "",
                description: "",
            },
        ],
        eventTimeline: {
            from: new Date(),
            to: addDays(new Date(), 5),
        },
        promotionTimeline: {
            from: new Date(),
            to: addDays(new Date(), 5),
        },
        banner: "",
        cost: "",
        eventUrl: "",
        testEvent: false,

        country: "AU",
        territory: "",
        city: "",
        lat: "",
        lng: "",
        address: "",
        tags: [],
    });

    const [uploading, setUploading] = useState(false);

    const eventUrl =
        typeof window !== "undefined" &&
        window.location.pathname.split("/").at(-1);

    // useEffect(() => {
    //   if (!router.query?.userEvent) {
    //     // console.log("admin");
    //     setDetails({
    //       ...details,
    //       eventType: "admin",
    //       verified: true,
    //     });
    //   } else {
    //     setDetails({
    //       ...details,
    //       userId: userInfo?.details?.id,
    //     });
    //   }
    // }, []);

    const { data: editEventData } = useQuery(
        [`edit-event-${eventUrl}`],
        async () => {
            const res = (
                await getEvents({
                    eventUrl: eventUrl,
                    testEvent: false,
                })
            ).docs[0];
            const data = res.data() as EventDetails;

            setDetails(data);
            return data as EventDetails;
        },
        {
            refetchOnWindowFocus: false,
        }
    );

    const addDescription = () => {
        setDetails({
            ...details,
            description: [
                ...details.description,
                {
                    image: "",
                    description: "",
                },
            ],
        });
    };

    const deleteDescriptrion = (index: number) => {
        const newDesc = details.description.filter(
            (_, descIndex) => descIndex != index
        );
        setDetails({
            ...details,
            description: newDesc,
        });
    };

    const changeValue = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;

        if (id == "title") {
            setDetails({
                ...details,
                title: value,
                handle: getHandleFromName(value),
            });
            return;
        }

        setDetails({
            ...details,
            [id]: value,
        });
    };

    const changeLocation = (loc: { [key: string]: string }) => {
        setDetails({
            ...details,
            ...loc,
        });
    };

    const changeDescription = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => {
        e.preventDefault();
        const { value } = e.currentTarget;
        const newDesc = details.description.map((val, i) => {
            let returnValue = { ...val };

            if (i == index) {
                returnValue.description = value;
            }

            return returnValue;
        });

        setDetails({
            ...details,
            description: newDesc,
        });
    };

    const changeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) return;

        setDetails({
            ...details,
            banner: file,
        });
    };

    const changeSpeakerImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) return;

        setDetails({
            ...details,
            speakerImage: file,
        });
    };

    const setLatLng = (lat: number, lng: number) => {
        setDetails({
            ...details,
            lat: lat.toString(),
            lng: lng.toString(),
        });
    };

    const updateTags = (tags: string[]) => {
        setDetails({
            ...details,
            tags: tags,
        });
    };

    const convertFileToURL = (file: string | File) => {
        if (!file) return;

        if (typeof file == "string") return file;
        return URL.createObjectURL(file);
    };

    const uploadImages = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const file = e.target.files[0];

        if (file) {
            const newDesc = details.description.map((val, i) => {
                let returnValue = { ...val };

                if (i == index) {
                    returnValue.image = file;
                }

                return returnValue;
            });
            setDetails({
                ...details,
                description: newDesc,
            });
        }
    };

    const callBack = async (
        eventDetails: EventDetails,
        description: EventDescription[]
    ) => {
        await uploadEventDetails(
            {
                ...eventDetails,
                eventId: getUuid(10),
            },
            description
        );
        setUploading(false);
        notify("success", "Event saved successfully!");
    };

    const updateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);

        // console.log(uid, pid);
        await uploadSpeakerImage(
            details,
            async (details) =>
                await uploadEventBanner(details, async (details) =>
                    uploadEventImages(details, (details, description) =>
                        callBack(details, description)
                    )
                )
        );
    };

    if (uploading) {
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <form onSubmit={updateDetails}>
            <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-12 mb-6 py-8 px-4">
                <div className="w-[95%] items-center justify-center">
                    <h1 className="text-2xl font-semibold mb-4 text-center">
                        {`Event: ${details.title}`}
                    </h1>

                    <div className="w-full flex flex-col items-start my-2">
                        <h1 className="font-semibold text-lg">Title: </h1>
                        <input
                            required
                            placeholder="Title"
                            className="w-full border-2 p-2 rounded-md outline-none bg-[var(--inputField)]"
                            id="title"
                            value={details.title}
                            onChange={changeValue}
                            type="text"
                        />
                    </div>
                    <div className="w-full flex flex-col items-start my-2">
                        <h1 className="font-semibold text-lg">Cost: </h1>
                        <input
                            required
                            placeholder="Cost"
                            className="w-full border-2 p-2 rounded-md outline-none bg-[var(--inputField)]"
                            id="cost"
                            value={details.cost}
                            onChange={changeValue}
                            type="text"
                        />
                    </div>
                    {/* -27.47805517663105, 153.01842218084366 */}
                    {/* ----- Description ------- */}
                    <div className="w-full flex flex-col items-start my-4">
                        <h1 className="font-semibold text-lg">Description: </h1>
                        {details.description.map((desc, index) => (
                            <div key={`desc-${index}`} className="w-full my-2">
                                <div className="flex items-center justify-between">
                                    <p className="mb-3 font-semibold underline">
                                        Paragraph - {index + 1}
                                    </p>
                                    {index != 0 && (
                                        <p
                                            onClick={() =>
                                                deleteDescriptrion(index)
                                            }
                                            className="mb-3 font-semibold cursor-pointer text-red-500 hover:underline"
                                        >
                                            Delete
                                        </p>
                                    )}
                                </div>
                                <div className="w-full flex items-center justify-between gap-6 ">
                                    <textarea
                                        key={`desc-area-${index}`}
                                        required
                                        placeholder={`Write description here`}
                                        className="w-full h-52 border-2 p-2 rounded-md outline-none bg-[var(--inputField)]"
                                        id="description"
                                        value={desc.description ?? ""}
                                        onChange={(e) =>
                                            changeDescription(e, index)
                                        }
                                    />
                                    <label>
                                        {desc.image ? (
                                            <img
                                                className="w-52 h-52 object-cover"
                                                src={convertFileToURL(
                                                    desc.image
                                                )}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center rounded-md bg-[var(--inputField)] w-52 h-52">
                                                <MonitorUp />
                                                <p className="text-sm">
                                                    Upload image
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            // required
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={(e) =>
                                                uploadImages(e, index)
                                            }
                                            accept="image/png, image/gif, image/jpeg"
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDescription}
                            className="w-full bg-sky-400 hover:bg-sky-500 p-2 my-4 rounded-md text-white font-semibold"
                        >
                            + Add another paragraph
                        </button>
                    </div>
                    {/* ----- Description ------- */}

                    <div className="w-full flex flex-col items-start my-2">
                        <h1 className="font-semibold text-lg">Banner: </h1>
                        <label className="w-full">
                            {details.banner ? (
                                <img
                                    className="w-full h-60 object-cover object-center rounded-md"
                                    src={convertFileToURL(details.banner)}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-md border-2 border-slate-800 border-dashed bg-[var(--inputField)] w-full h-60">
                                    <MonitorUp />
                                    <p className="text-base">Upload banner</p>
                                </div>
                            )}
                            <input
                                // required
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => changeBanner(e)}
                                accept="image/png, image/gif, image/jpeg"
                            />
                        </label>
                    </div>

                    <div className="w-full flex flex-col items-start my-2">
                        <h1 className="font-semibold text-lg">
                            Event Url:{" "}
                            <i className="text-[#aaa] font-normal ml-2">
                                (eg: /world-cup)
                            </i>
                        </h1>
                        <input
                            required
                            className="w-full border-2 p-2 rounded-md outline-none bg-[var(--inputField)]"
                            id="eventUrl"
                            value={details.eventUrl}
                            onChange={changeValue}
                            type="text"
                        />
                    </div>

                    <div className="w-full flex flex-row  items-center my-2">
                        <h1 className="font-semibold text-lg">
                            Is this a test event:{" "}
                        </h1>
                        <Switch
                            checked={details.testEvent}
                            id="testEvent"
                            onCheckedChange={(checked) =>
                                setDetails({
                                    ...details,
                                    testEvent: checked,
                                })
                            }
                        />
                        <p className="font-semibold">
                            {" "}
                            ( {details.testEvent ? "Yes" : "No"} ){" "}
                        </p>
                    </div>

                    <TitledContainer
                        title="Event Timing"
                        className="my-6 grid grid-cols-1 xl:grid-cols-2"
                    >
                        <div className="w-full flex gap-4 items-center mt-3 my-2">
                            <h1 className="font-semibold text-lg">
                                Promotion Timeline:{" "}
                            </h1>
                            <DatePickerWithRange
                                onChange={(range) =>
                                    setDetails((prev) => ({
                                        ...prev,
                                        promotionTimeline: range,
                                    }))
                                }
                                dateRange={details.promotionTimeline}
                            />
                        </div>

                        <div className="w-full flex gap-4 items-start mt-3 my-2">
                            <h1 className="font-semibold text-lg">
                                Event Timeline:{" "}
                            </h1>
                            <DatePickerWithRange
                                onChange={(range) =>
                                    setDetails((prev) => ({
                                        ...prev,
                                        promotionTimeline: range,
                                    }))
                                }
                                dateRange={details.eventTimeline}
                            />
                        </div>
                    </TitledContainer>

                    <TitledContainer
                        title="Event Location"
                        className="my-6 pt-6 flex flex-col gap-4"
                    >
                        <div>
                            <CustomGoogleMap
                                draggable={true}
                                changeLatLng={setLatLng}
                                lat={
                                    isNaN(parseFloat(details.lat))
                                        ? -33.868
                                        : parseFloat(details.lat)
                                }
                                lng={
                                    isNaN(parseFloat(details.lng))
                                        ? 151.209
                                        : parseFloat(details.lng)
                                }
                                zoom={12}
                                showSearch={true}
                            />
                        </div>
                        <AddressInput
                            city={details.city}
                            country={details.country}
                            territory={details.territory}
                            onLocationChange={changeLocation}
                        />
                        <div className="w-full flex flex-col items-start my-2">
                            <h1 className="font-semibold text-lg">Address: </h1>
                            <input
                                required
                                placeholder="Address"
                                className="w-full border-2 p-2 rounded-md outline-none bg-[var(--inputField)]"
                                id="address"
                                value={details.address}
                                onChange={changeValue}
                                type="text"
                            />
                        </div>
                    </TitledContainer>

                    <TitledContainer
                        title="Speaker Note (optional)"
                        className="py-6 px-6"
                    >
                        <div className="w-full my-2">
                            <div className="w-full flex items-center justify-between gap-6 ">
                                <textarea
                                    placeholder={`Write speaker note here`}
                                    className="w-full h-52 border-2 p-2 rounded-md outline-none bg-[var(--inputField)]"
                                    id="speakerNote"
                                    value={details.speakerNote ?? ""}
                                    onChange={changeValue}
                                />
                                <label>
                                    {details.speakerImage ? (
                                        <img
                                            className="w-52 h-52 object-cover rounded-md"
                                            src={convertFileToURL(
                                                details.speakerImage
                                            )}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-md bg-slate-300 w-52 h-52">
                                            <MonitorUp />
                                            <p className="text-sm">
                                                Upload speaker image
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        // required
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => changeSpeakerImage(e)}
                                        accept="image/png, image/gif, image/jpeg"
                                    />
                                </label>
                            </div>
                        </div>
                    </TitledContainer>
                    <TitledContainer
                        title="Event Tags"
                        className="py-6 px-6 mt-6"
                    >
                        <TagsInput
                            tags={details.tags}
                            options={eventTags}
                            updateTags={updateTags}
                        />
                        {/* {TagsInput()} */}
                    </TitledContainer>

                    <div className="w-full mt-4 flex justify-end">
                        <button
                            type="submit"
                            className=" bg-sky-400 text-white p-2 px-4 rounded-lg"
                        >
                            {"Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CustomEvents;
