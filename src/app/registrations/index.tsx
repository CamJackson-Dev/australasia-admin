import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Associate, getPendingAssociates } from "@/mutations/associates";
import style from "../admin.module.css";
import RegistrationModal from "../modal";
import useToast from "@/hooks/useToast";
import CircularProgress from "@/components/ui/loading";

const AssociateRegistration = () => {
    const notify = useToast();
    const [change, setChange] = useState(0);
    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = (data: any) => {
        setModalData(data);
        setOpen(true);
    };

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

    const Tile = (props) => {
        const [operationPending, setOperationPending] = useState(false); //either accept or delete

        const deleteRegistration = () => {
            setOperationPending(true);
            let profileRef = new Associate({
                type: props.data.type,
                fullname: props.data.fullname,
                email: props.data.email,
                phone: props.data.phone,
                description: props.data.description,
                avatar: props.data.avatar,
                banner: props.data.banner,
                logo: props.data.logo,
                logoUrl: props.data.logoUrl,
                gallery: props.data.gallery,
                uid: props.data.userID,
                social: props.data.social,
                links: props.data.links,
                handle: props.data.handle,

                country: props.data.country,
                province: props.data.province,
                city: props.data.city,
                mob: props.data.mob,
            });
            // console.log(profileRef)
            profileRef.rejectRegistration(() => {
                setOperationPending(false);
                notify("error", "Registration deleted");
                refetch();
                setChange(change + 1);
            });
        };

        const approveRegistration = () => {
            setOperationPending(true);
            let profileRef = new Associate({
                type: props.data.type,
                fullname: props.data.fullname,
                email: props.data.email,
                phone: props.data.phone,
                description: props.data.description,
                avatar: props.data.avatar,
                banner: props.data.banner,
                logo: props.data.logo,
                logoUrl: props.data.logoUrl,
                gallery: props.data.gallery,
                uid: props.data.userID,
                social: props.data.social,
                links: props.data.links,
                handle: props.data.handle,

                country: props.data.country,
                province: props.data.province,
                city: props.data.city,
                mob: props.data.mob,
            });
            // console.log(profileRef)
            profileRef.approveRegistration(() => {
                setOperationPending(false);
                notify("success", "Registration verified successfully");
                refetch();
                setChange(change + 1);
            });
        };

        return (
            <div className={style["dash-tile"]}>
                <img
                    className={style["dash-avatar"]}
                    src={
                        props.data.avatar ??
                        "https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg"
                    }
                />
                <div>
                    <div onClick={() => handleOpen(props.data)}>
                        <h3>{props.data.fullname}</h3>
                        <p>{props.data.description}</p>
                    </div>
                    {!operationPending ? (
                        <div className={style["dash-buttons"]}>
                            <button
                                onClick={approveRegistration}
                                className={style["dash-accept"]}
                                color="success"
                            >
                                Accept
                            </button>
                            <button
                                onClick={deleteRegistration}
                                className={style["dash-reject"]}
                                color="error"
                            >
                                Reject
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
            <div className={"circular-progress-container"}>
                <CircularProgress />
            </div>
        );

    return (
        <div className="ml-10" style={{ marginTop: "10px" }}>
            <div style={{ fontFamily: "Poppins" }}>
                <div className={style["photographer-container-temp"]}>
                    <h2 className={"text-xl font-[500]"}>
                        Photographers Registration
                    </h2>
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
                    <h2 className={"text-xl font-[500]"}>
                        Writer Registration
                    </h2>
                    <p style={{ marginTop: "20px" }}>
                        {data.writer.length > 0
                            ? ""
                            : "No pending registrations"}
                    </p>
                    {data.writer.map((writer, index) => (
                        <Tile key={`writer-${index}`} data={writer.data()} />
                    ))}
                </div>
                <div className={style["merchant-container"]}>
                    <h2 className={"text-xl font-[500]"}>
                        Merchant Registration
                    </h2>
                    <p style={{ marginTop: "20px" }}>
                        {data.writer.length > 0
                            ? ""
                            : "No pending registrations"}
                    </p>
                    {data.merchant.map((merchant, index) => (
                        <Tile
                            key={`merchant-${index}`}
                            data={merchant.data()}
                        />
                    ))}
                </div>
                <div className={style["merchant-container"]}>
                    <h2 className={"text-xl font-[500]"}>
                        Artist Registration
                    </h2>
                    <p style={{ marginTop: "20px" }}>
                        {data.writer.length > 0
                            ? ""
                            : "No pending registrations"}
                    </p>
                    {data?.artist?.map((artist, index) => (
                        <Tile key={`artist-${index}`} data={artist.data()} />
                    ))}
                </div>
            </div>

            <RegistrationModal
                open={open}
                handleClose={handleClose}
                data={modalData}
            />
        </div>
    );
};

export default AssociateRegistration;
