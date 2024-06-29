"use client";

import React, { useState } from "react";
import { useQuery } from "react-query";
import { deleteFeedback, getFeedback } from "@/mutations/messages";
import style from "../../admin.module.css";
import CircularProgress from "@/components/ui/loading";

const AllFeedback = () => {
    const { isLoading, data } = useQuery({
        queryKey: ["pendingFeedback"],
        queryFn: () =>
            Promise.resolve(getFeedback()).then((snapshot) => {
                let temp = [];
                temp = snapshot.docs;
                return temp;
            }),
    });

    const Tile = (props: any) => {
        const [operationPending, setOperationPending] = useState(false); //either accept or delete
        const operation = () => {
            setOperationPending(true);
            deleteFeedback(props.id).then(() => {
                setOperationPending(false);
            });
        };

        return (
            <div className={style["dash-tile"]}>
                <div style={{ width: "100%" }}>
                    <div className={style["feedback-tile-top"]}>
                        <div
                            className={`${style["feedback-tile-top"]} ${style["top-info"]}`}
                        >
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
                        Feedback: {props.data.feedback}
                    </p>

                    {!operationPending ? (
                        <div className={style["dash-buttons"]}>
                            <p
                                style={{
                                    marginTop: "10px",
                                    textAlign: "left",
                                }}
                            >
                                Page Url:{" "}
                                <a
                                    className="text-sky-500"
                                    href={props.data.pageURL}
                                >
                                    {props.data.pageURL}
                                </a>
                            </p>
                            <div className={"flex gap-4"}>
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
        <div className={"w-full"} style={{ minHeight: "50vh" }}>
            <div
                className={`w-full my-8 flex flex-col items-center text-center gap-3`}
            >
                <h2 className={"text-xl font-semibold"}>Feedback:</h2>
                <p>{data && data.length > 0 ? "" : "No feedbacks"}</p>
                <div className={style["w-4/5"]}>
                    {data &&
                        data.map((feedback: any, index: number) => (
                            <Tile
                                key={`feedback-${index}`}
                                id={feedback.id}
                                data={feedback.data()}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default AllFeedback;
