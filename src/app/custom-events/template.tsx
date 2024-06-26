import { useQuery } from "react-query";
import { getEvents } from "../../../src/utils/admin/custom-events";
import { CustomProgressBar } from "../../../src/components/progressBar/progressBar";
import EventIcon from "@mui/icons-material/Event";
import {
    ContainerMapsCity,
    LocationCity,
    MapsCity,
} from "../../../src/components/mapsCity/mapsCity";
import { Typography } from "@material-ui/core";
import { ShareSocialModal } from "../../../src/components/share-social-modal/shareSocialModal";
import React, { Fragment, useEffect, useMemo } from "react";
import { EventDetailsGET, isEventHappening } from "@utils/isEventHappening";
import Link from "next/link";
import Head from "next/head";
import { EventDescription, EventDetails } from "@views/events/CreateEvent";
import { useRouter } from "next/router";
import * as DOMPurify from "dompurify";
import { capitalize } from "@utils/capitalize";
import {
    AtSign,
    BookMarked,
    NotebookPen,
    Phone,
    PhoneCall,
} from "lucide-react";

const EventTemplate = () => {
    const router = useRouter();
    const eventUrl =
        typeof window !== "undefined" &&
        window.location.pathname.split("/").at(-1);

    const isAdmin = Boolean(router.query.isAdmin);

    const { data: details, isLoading } = useQuery(
        [`event-${eventUrl}`],
        async () => {
            const res = await getEvents({
                eventUrl,
                testEvent: false,
                verified: isAdmin ? undefined : true,
            });
            const data = res.docs[0]?.data();

            // console.log(data, "data");
            return data as EventDetailsGET;
        }
    );
    // useEffect(() => {
    //     // Scroll to the top of the page when the component is mounted
    //     window.scrollTo(0, 0);
    // }, []);

    const getEventDuration = () => {
        if (!details) return;
        const { from, to } = details?.eventTimeline;

        const startDate = new Date(from.seconds * 1000);
        const endDate = new Date(to.seconds * 1000);

        const diffDays = endDate.getDate() - startDate.getDate();
        return diffDays;
    };

    const bannerUrl =
        "https://www.creativefabrica.com/wp-content/uploads/2023/05/08/Background-Graphics-69189184-1.png";

    const convertFileToURL = (img: File | string) => {
        if (!img) return;
        if (typeof img == "string") return img;
        return URL.createObjectURL(img);
    };

    const DescriptionTile = (props: { tileDetails: EventDescription }) => {
        const { tileDetails } = props;
        const isEvenIndex = props.tileDetails.index % 2 === 0;

        return (
            <div
                className={`w-4/5 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 py-8 my-8 ${
                    isEvenIndex ? "lg:flex-row-reverse" : "" // Reverse order for even indices
                }`}
            >
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(tileDetails.description),
                    }}
                    className="w-full lg:w-3/5 [&>p>a]:text-sky-500 [&>p>a]:underline [&>ol]:list-decimal [&>ol]:list-inside [&>ul]:list-decimal [&>ul]:list-inside [&>h1]:text-4xl [&>h2]:text-3xl [&>h3]:text-2xl [&>h4]:text-xl"
                >
                    {/* {tileDetails.description} */}
                </div>
                <img
                    className="lg:w-[360px] h-[240px] md:h-[360px] object-cover z-10"
                    src={convertFileToURL(tileDetails.image)}
                />
            </div>
        );
    };

    if (isLoading)
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <CustomProgressBar width={80} />
            </div>
        );

    if (!isEventHappening(details))
        return (
            <Fragment>
                <Head>
                    <title>{`Not found - Event`}</title>
                </Head>
                <div className="w-full h-screen flex flex-col items-center justify-center text-[var(--subHeader)]">
                    <h2 className="text-3xl font-semibold">404</h2>
                    <p className="text-xl font-semibold">
                        Oops! Event not found.
                    </p>
                </div>
            </Fragment>
        );

    const actualStartDate = new Date(details.eventTimeline.from.seconds * 1000);
    const actualEndDate = new Date(details.eventTimeline.to.seconds * 1000);

    // Format start time
    const formattedStartTime = formatTime(actualStartDate);
    const formattedEndTime = formatTime(actualEndDate);

    function formatTime(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours > 12 ? hours - 12 : hours}:${
            minutes < 10 ? "0" : ""
        }${minutes} ${hours >= 12 ? "PM" : "AM"}`;
    }

    return (
        <Fragment>
            <Head>
                <title>{`${details.title} - Australasia`}</title>
                <meta
                    name="description"
                    content={details.description[0].description}
                />
                <meta
                    name="keywords"
                    content={`Australasia, Events in australia, hosting, visit australasia, ${
                        details.title
                    }, ${details.tags.join(", ")}`}
                />
            </Head>
            <form>
                <div className="font-[Poppins] overflow-hidden">
                    <div
                        style={{
                            backgroundImage: `url('${
                                details.banner &&
                                typeof details.banner === "string"
                                    ? details.banner
                                    : bannerUrl
                            }')`,
                        }}
                        className={`relative w-full h-screen bg-cover flex items-center gap-8`}
                    >
                        <div className="w-full h-full absolute top-0 left-0 bg-[#01090ecc]"></div>
                        <div className="absolute z-10 w-96 h-4/6 ml-16 border-[16px] border-[#1175ab26]"></div>

                        <div className="absolute hidden lg:block -top-10 -right-10 z-10 w-40 h-40 ml-16 border-[16px] rounded-full border-[#1175ab26]"></div>
                        <div className="absolute hidden lg:block top-8 right-8 z-10 w-44 h-44 ml-16 border-[16px] rounded-full border-[#1175ab26]"></div>
                        <div className="absolute hidden lg:block top-32 -right-16 z-10 w-56 h-56 ml-16 border-[16px] rounded-full border-[#1175ab26]"></div>

                        <div className="w-4/5 md:w-2/3 xl:w-1/2 relative z-10 ml-10 md:ml-24 flex flex-col justify-center gap-8">
                            <div>
                                {/* <h1 style={{ textShadow: "0 0 4px #000" }} className="w-full text-6xl font-semibold text-white tracking-wide">{details.title}</h1> */}
                                <h1 className="w-full text-3xl md:text-6xl font-semibold text-white tracking-wide">
                                    {details.title}
                                </h1>
                                <div className="flex items-center gap-2 text-white mt-4">
                                    <EventIcon color="inherit" />
                                    <p className="text-sm md:text-lg">Date: </p>
                                    <p className="text-sm md:text-lg">
                                        {new Date(
                                            details.eventTimeline.from.seconds *
                                                1000
                                        ).toDateString()}
                                    </p>
                                    {getEventDuration() > 0 && (
                                        <p className="text-sm md:text-lg">
                                            -{" "}
                                            {new Date(
                                                details.eventTimeline.to
                                                    .seconds * 1000
                                            ).toDateString()}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm md:text-lg text-white mt-4">
                                    Times: {formattedStartTime} -{" "}
                                    {formattedEndTime}
                                </p>
                                <p className="text-sm md:text-lg text-white mt-4">
                                    Where: {details.address}
                                </p>
                                <p className="text-sm md:text-lg text-white mt-4">
                                    Cost: {details.cost}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    className="w-max"
                                    // smooth
                                    href="#contact"
                                    scroll={true}
                                >
                                    <button
                                        className=" border-sky-400 border-[3px] w-max px-4 md:px-8 py-2 md:py-3 rounded-md tracking-wide text-white md:font-semibold text-sm duration-200 hover:bg-sky-400"
                                        type="button"
                                    >
                                        CONTACT
                                    </button>
                                </Link>
                                {details.bookingUrl && (
                                    <Link
                                        className="w-max"
                                        // smooth
                                        href={details.bookingUrl}
                                        scroll={true}
                                    >
                                        <button
                                            className=" border-sky-400 border-[3px] w-max px-4 md:px-8 py-2 md:py-3 rounded-md tracking-wide text-white md:font-semibold text-sm duration-200 hover:bg-sky-400"
                                            type="button"
                                        >
                                            BOOK NOW
                                        </button>
                                    </Link>
                                )}
                                <ShareSocialModal
                                    color="white"
                                    containerClass=" border-sky-400 border-[3px] w-max px-4 md:px-6 py-[6px] md:py-[10px] rounded-md text-white md:font-semibold text-sm cursor-pointer duration-200 hover:bg-sky-400"
                                    pageUrl={document.location.href}
                                    pageTitle={details.title}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        id="event-description"
                        className="w-full flex flex-col items-center"
                    >
                        {details.speakerNote && (
                            <div className="w-4/5 flex flex-col items-center justify-between gap-10 py-8 my-8">
                                <h1 className="text-3xl font-[500]">
                                    Message from the speaker
                                </h1>
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-20">
                                    <img
                                        className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] object-cover rounded-full"
                                        src={convertFileToURL(
                                            details.speakerImage
                                        )}
                                    />
                                    <p className="w-full lg:w-2/3 text-base xl:text-lg text-center lg:text-start">
                                        {details.speakerNote}
                                    </p>
                                </div>

                                <div className="h-[1px] w-full bg-slate-400 mt-4"></div>
                            </div>
                        )}

                        {details.description.map((desc, index) => (
                            <DescriptionTile
                                tileDetails={{ ...desc, index }} // Include index property in tileDetails
                                key={`desc-${index}`}
                            />
                        ))}
                        <div className="w-4/5 flex items-center pb-8 justify-center">
                            {/* <p className="text-sm mr-4">Keywords:</p> */}
                            {details.tags.map((tag) => (
                                <p
                                    key={`tag-${tag}`}
                                    className="p-1 px-2 text-[12px] bg-[var(--inputField)] rounded-2xl mr-2"
                                >
                                    {tag}
                                </p>
                            ))}
                        </div>
                    </div>

                    {(details.contact || details.bookingUrl) && (
                        <div
                            id="contact"
                            className="w-full flex justify-center bg-[var(--inputField)] py-12"
                        >
                            <div className="w-4/5">
                                <p className="text-2xl font-[500] text-center mb-8 ">
                                    Contact us at:
                                </p>
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-around">
                                    {details.contact
                                        ?.filter(
                                            (info) => info.value.length > 0
                                        )
                                        .map((info) => (
                                            <div className="flex flex-col justify-center items-center">
                                                <div className="p-4 bg-primary rounded-full text-white mb-4">
                                                    {info.type == "phone" ? (
                                                        <PhoneCall
                                                            size={"32px"}
                                                        />
                                                    ) : (
                                                        <AtSign size={"32px"} />
                                                    )}
                                                </div>
                                                <p className="text-xl font-[500]">
                                                    {capitalize(info.type)}
                                                </p>
                                                <p>{info.value}</p>
                                            </div>
                                        ))}
                                    {details.bookingUrl && (
                                        <div className="flex items-center justify-center ">
                                            <Link
                                                href={details.bookingUrl}
                                                target="_blank"
                                            >
                                                <div className="flex flex-col justify-center items-center">
                                                    <div className="p-4 bg-primary rounded-full text-white mb-4">
                                                        <NotebookPen
                                                            size={"32px"}
                                                        />
                                                    </div>
                                                    <p className="text-xl font-[500]">
                                                        Register at:
                                                    </p>
                                                    <p>{details.bookingUrl}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <ContainerMapsCity>
                        <MapsCity
                            lat={details.lat}
                            lng={details.lng}
                            zoom={16}
                        />
                        <LocationCity>
                            <Typography variant="body1">{`${
                                details.address ?? ""
                            }`}</Typography>
                        </LocationCity>
                    </ContainerMapsCity>
                </div>
            </form>
        </Fragment>
    );
};

export default EventTemplate;
