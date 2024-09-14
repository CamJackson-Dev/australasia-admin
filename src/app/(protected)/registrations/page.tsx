"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    approveAssociateRegistration,
    getPendingAssociates,
    rejectAssociateRegistration,
} from "@/mutations/associates";
import style from "../../admin.module.css";
// import RegistrationModal from "../modal";
import useToast from "@/hooks/useToast";
import CircularProgress from "@/components/ui/loading";
import { auth, functions } from "@/utils/firebase/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

const AssociateRegistration = () => {
    const notify = useToast();

    // useEffect(() => {
    //     const bla = async() => {
    //         // const res = await auth.currentUser.getIdTokenResult()
    //         // console.log(res)
    //     }
    //     bla()
    // }, [])

    // const tempAdd = async () => {
    //     // const res = await auth.currentUser.getIdTokenResult()
    //     // console.log(res)
    //     try{
    //         const addAdminFunction = httpsCallable(getFunctions(), "addAdmin")
    //         // console.log(addAdminFunction)
    //         const res = await addAdminFunction({email: "lord.pmp56@gmail.com", role: "owner"})
    //         console.log(res.data)

    //     }catch(e){
    //         console.log(e.message)
    //     }
    // }

    const { isLoading, data, refetch } = useQuery({
        queryKey: ["pendingData"],
        queryFn: () =>
            Promise.all([
                getPendingAssociates("photographer"),
                getPendingAssociates("writer"),
                getPendingAssociates("merchant"),
                getPendingAssociates("artist"),
            ]).then((snapshots) => {
                let temp = {};
                temp["photographer"] = snapshots[0].docs;
                temp["writer"] = snapshots[1].docs;
                temp["merchant"] = snapshots[2].docs;
                temp["artist"] = snapshots[3].docs;
                return temp as any;
            }),
    });

    const Tile = (props: { data: AssociateInfo }) => {
        const [operationPending, setOperationPending] = useState(false); //either accept or delete

        const deleteRegistration = async () => {
            setOperationPending(true);
            await rejectAssociateRegistration(props.data.userID);
            setOperationPending(false);
            refetch();
        };

        const approveRegistration = async () => {
            setOperationPending(true);
            await approveAssociateRegistration(props.data.userID);
            setOperationPending(false);
            notify("success", "Associate approved successfully!");
            refetch();
        };

        return (
            <div className={"flex gap-5 shadow-md p-5 my-5 cursor-pointer"}>
                <img
                    className={
                        "rounded-full h-36 w-36 object-cover object-center"
                    }
                    src={
                        props.data.avatar ??
                        "https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg"
                    }
                />
                <div className="w-4/5">
                    <div>
                        <h3 className="font-semibold text-lg">
                            {props.data.fullname}
                        </h3>
                        <p>{props.data.description}</p>
                    </div>
                    {!operationPending ? (
                        <div className={"my-5 gap-5 flex justify-between"}>
                            <button
                                onClick={approveRegistration}
                                className={
                                    "border-none py-3 px-5 rounded-md text-white font-semibold text-sm cursor-pointer bg-green-500"
                                }
                                color="success"
                            >
                                Accept
                            </button>
                            <button
                                onClick={deleteRegistration}
                                className={
                                    "border-none py-3 px-5 rounded-md text-white font-semibold text-sm cursor-pointer bg-red-500"
                                }
                                color="error"
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <div className={"my-5 gap-5 flex justify-between"}>
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
        <div className="p-8">
            <div className={style["photographer-container-temp"]}>
                <h2 className={"text-xl font-[500]"}>
                    Photographers Registration
                </h2>
                {/* <button onClick={tempAdd}>Click</button> */}
                <p style={{ marginTop: "20px" }}>
                    {data.photographer.length > 0
                        ? ""
                        : "No pending registrations"}
                </p>
                {data.photographer.map((photographer, index) => (
                    <Tile
                        key={`photographer-${index}`}
                        data={photographer.data()}
                    />
                ))}
            </div>
            <div className={style["writer-container"]}>
                <h2 className={"text-xl font-[500]"}>Writer Registration</h2>
                <p style={{ marginTop: "20px" }}>
                    {data.writer.length > 0 ? "" : "No pending registrations"}
                </p>
                {data.writer.map((writer, index) => (
                    <Tile key={`writer-${index}`} data={writer.data()} />
                ))}
            </div>
            <div className={style["merchant-container"]}>
                <h2 className={"text-xl font-[500]"}>Merchant Registration</h2>
                <p style={{ marginTop: "20px" }}>
                    {data.merchant.length > 0 ? "" : "No pending registrations"}
                </p>
                {data.merchant.map((merchant, index) => (
                    <Tile key={`merchant-${index}`} data={merchant.data()} />
                ))}
            </div>
            <div className={style["merchant-container"]}>
                <h2 className={"text-xl font-[500]"}>Artist Registration</h2>
                <p style={{ marginTop: "20px" }}>
                    {data.artist.length > 0 ? "" : "No pending registrations"}
                </p>
                {data?.artist?.map((artist, index) => (
                    <Tile key={`artist-${index}`} data={artist.data()} />
                ))}
            </div>
        </div>
    );
};

export default AssociateRegistration;
