import {
    deleteEventByHandle,
    getEvents,
    updateUserEventVerification,
} from "../../../src/utils/admin/custom-events";
import { CircularProgress, Switch } from "@mui/material";
import { useQuery } from "react-query";
import TopLink from "../../../src/components/top-link/topLink";
import { Box, Modal, Tab, Tabs } from "@material-ui/core";
import { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "../../../src/hook/useToast";
import { useNavigate } from "@hook/useNavigate";
import Link from "next/link";
import AdminLayout from "@components/layout/adminLayout";
import { EventDetailsGET } from "@utils/isEventHappening";
import { convert } from "html-to-text";

const style = (width: number) => {
    return {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: width,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: "10px",
        p: 3,
    };
};

const CustomEvents = () => {
    const notify = useToast();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState<EventDetailsGET | null>(
        null
    );

    const {
        data: events,
        isLoading: eventsLoading,
        refetch,
    } = useQuery(["events"], async () => {
        const res = await getEvents({
            eventType: "admin",
        });
        return res.docs.map((doc) => doc.data() as EventDetailsGET);
    });

    const { data: testEvents, isLoading: testEventsLoading } = useQuery(
        ["test-events"],
        async () => {
            const res = await getEvents({
                testEvent: true,
            });
            return res.docs.map((doc) => doc.data() as EventDetailsGET);
        }
    );

    const {
        data: userEvents,
        isLoading: userEventsLoading,
        refetch: refetchUserEvents,
    } = useQuery(["user-events"], async () => {
        const res = await getEvents({
            eventType: "user",
            testEvent: false,
        });
        return res.docs.map((doc) => doc.data() as EventDetailsGET);
    });

    if (eventsLoading || testEventsLoading || userEventsLoading || deleting)
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <CircularProgress />
            </div>
        );

    const convertFileToURL = (obj: File | string) => {
        if (typeof obj == "string") return obj;
        return URL.createObjectURL(obj);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const EventTile = (props: { data: EventDetailsGET }) => {
        const event = props.data;
        return (
            <div
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                className="relative flex items-center p-2 gap-4 rounded-md"
            >
                <div
                    onClick={() => handleDeleteOpen(event)}
                    className="flex items-center absolute gap-1 top-2 right-2 bg-[#fa6565] cursor-pointer text-white p-1 rounded-md"
                >
                    <DeleteIcon fontSize="small" />
                </div>
                <img
                    className="w-48 h-48 object-cover bg-slate-400 rounded-md"
                    src={convertFileToURL(event.banner)}
                />
                <div className="flex flex-col">
                    <Link
                        as={`/events/${event.eventUrl}`}
                        href={{
                            pathname: `/events/${event.eventUrl}`,
                            query: { isAdmin: true },
                        }}
                    >
                        <p className="text-lg font-semibold hover:underline">
                            {event.title}
                        </p>
                    </Link>
                    <p className="text-sm mb-4 italic">
                        Location: {event.address}
                    </p>
                    <p>{event.description[0].description}</p>
                </div>
            </div>
        );
    };

    const handleDeleteOpen = (event: EventDetailsGET) => {
        setDeleteEvent(event);
        setOpenDelete(true);
    };

    const handleDelete = async () => {
        if (!deleteEvent) return;

        window.scrollTo(0, 0);
        setDeleting(true);
        await deleteEventByHandle(deleteEvent.handle);
        await refetch();
        setDeleting(false);
        setOpenDelete(false);
        notify("success", "Event deleted successfully!");
    };

    const UserEventTile = (props: { data: EventDetailsGET }) => {
        const event = props.data;
        const [updating, setUpdating] = useState(false);

        const description = convert(event.description[0].description);

        const unverify = async () => {
            setUpdating(true);
            await updateUserEventVerification(event.handle, false);
            await refetchUserEvents();
            setUpdating(false);
        };

        const verify = async () => {
            setUpdating(true);
            await updateUserEventVerification(event.handle, true);
            await refetchUserEvents();
            setUpdating(false);
        };

        return (
            <div
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                className="flex items-center p-2 gap-4 rounded-md"
            >
                <img
                    className="w-48 h-48 object-cover bg-slate-400 rounded-md"
                    src={convertFileToURL(event.banner)}
                />
                <div className="flex flex-col w-full">
                    <Link
                        replace={false}
                        as={`/events/${event.eventUrl}`}
                        href={{
                            pathname: `${event.eventUrl}`,
                            query: { isAdmin: true },
                        }}
                    >
                        <p className="text-lg font-semibold hover:underline">
                            {event.title}
                        </p>
                    </Link>
                    <p className="text-sm mb-4 italic">
                        Location: {event.address}
                    </p>
                    <p>{description}</p>
                    <div className="mt-4 w-full">
                        {updating ? (
                            <div className="flex justify-end w-full items-center gap-4 pr-4">
                                <CircularProgress size={40} />
                            </div>
                        ) : event.verified ? (
                            <div className="flex justify-end w-full items-center gap-4 pr-4">
                                <div className="flex items-center gap-2 ">
                                    <VerifiedIcon
                                        color="success"
                                        fontSize="small"
                                    />
                                    <p className=" text-green-600">Verified</p>
                                </div>
                                <p
                                    className=" text-red-500 hover:underline cursor-pointer"
                                    onClick={unverify}
                                >
                                    Unverify
                                </p>
                            </div>
                        ) : (
                            <div className="flex justify-end w-full items-center gap-4 pr-4">
                                <button
                                    className=" bg-green-500 text-white p-2 px-4 rounded-md"
                                    onClick={verify}
                                    type="button"
                                >
                                    Verify Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="mx-10 mb-10">
                <div className="flex items-center justify-between mb-8">
                    {/* <p className="text-2xl font-semibold">Events</p> */}
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Admin Events" />
                        <Tab label="User Events" />
                    </Tabs>
                    <TopLink
                        to="/admin/custom-events/create"
                        className="bg-sky-400 text-white p-2 px-4 rounded-md font-[500]"
                    >
                        + New Event
                    </TopLink>
                </div>

                {tabValue == 0 ? (
                    <div className="my-4 flex flex-col gap-4">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <EventTile key={event.eventId} data={event} />
                            ))
                        ) : (
                            <div className="grid h-[60vh] place-content-center">
                                <p className="text-xl font-semibold">
                                    No admin events
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="my-4 flex flex-col gap-4">
                        {/* <p className="text-2xl font-semibold">User Events</p> */}
                        {userEvents.length > 0 ? (
                            userEvents.map((event) => (
                                <UserEventTile
                                    key={event.eventId}
                                    data={event}
                                />
                            ))
                        ) : (
                            <div className="grid h-[60vh] place-content-center">
                                <p className="text-xl font-semibold">
                                    No user events
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <Modal
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="w-full md:w-[500px] p-4 rounded-lg bg-slate-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {deleting ? (
                            <Box sx={style(90)}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box sx={style(400)}>
                                <p className="font-semibold text-lg">
                                    Delete this event?
                                </p>
                                <div className=" bg-slate-200 p-2 rounded-md my-4">
                                    <p className="font-semibold">
                                        {deleteEvent?.title}
                                    </p>

                                    <p className="italic">
                                        {deleteEvent?.address}
                                    </p>
                                    <p className="mt-2 text-slate-700 text-sm">
                                        {new Date(
                                            deleteEvent?.eventTimeline.from
                                                .seconds * 1000
                                        ).toDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => setOpenDelete(false)}
                                        className=" bg-slate-600 p-2 px-4 text-sm text-white rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className=" bg-red-500 p-2 px-4 text-sm text-white rounded-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Box>
                        )}
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default CustomEvents;
