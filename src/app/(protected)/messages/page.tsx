"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { deleteContact, getContacts } from "@/mutations/messages";
import style from "../../admin.module.css";
import CircularProgress from "@/components/ui/loading";

const AllContacts = () => {
    const { isLoading, data } = useQuery({
        queryKey: ["pendingContacts"],
        queryFn: () =>
            Promise.resolve(getContacts()).then((snapshot) => {
                let temp = [];
                temp = snapshot.docs;
                return temp;
            }),
    });

    const Tile = (props: any) => {
        const [operationPending, setOperationPending] = useState(false); //either accept or delete

        const operation = () => {
            setOperationPending(true);
            deleteContact(props.id).then(() => {
                setOperationPending(false);
            });
        };

        return (
            <div className={style["dash-tile"]}>
                <div style={{ width: "100%" }}>
                    <div className={style["feedback-tile-top"]}>
                        <div className={style["feedback-tile-top top-info"]}>
                            <h3>{props.data.name}</h3>
                            <p>({props.data.email})</p>
                        </div>
                        <p>
                            {new Date(
                                props.data.timeStamp.seconds * 1000
                            ).toDateString()}
                        </p>
                    </div>
                    <p className={"mt-3 text-start font-semibold"}>
                        Message: {props.data.message}
                    </p>
                    {!operationPending ? (
                        <div className={style["dash-buttons"]}>
                            <button
                                onClick={operation}
                                className={style["dash-accept"]}
                                color="success"
                            >
                                Done
                            </button>
                            <button
                                onClick={operation}
                                className={style["dash-reject"]}
                                color="error"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className={style["dash-buttons"]}>
                            <CircularProgress />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading)
        return (
            <div className={"w-full h-[90vh] flex items-center justify-center"}>
                <CircularProgress />
            </div>
        );

    return (
        <div style={{ marginTop: "10px", minHeight: "50vh" }}>
            <div
                className={`w-full my-8 flex flex-col items-center text-center gap-3`}
            >
                <h2 className={"text-xl font-semibold"}>Messages:</h2>
                <p>{data && data.length > 0 ? "" : "No messages"}</p>
                <div className={"w-4/5"}>
                    {data &&
                        data.map((message, index) => (
                            <Tile
                                key={index}
                                id={message.id}
                                data={message.data()}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default AllContacts;
