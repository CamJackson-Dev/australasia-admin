import React, { Fragment, useContext, useEffect, useState } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import {
  getEvents,
  uploadEventBanner,
  uploadEventDetails,
  uploadEventImages,
  uploadSpeakerImage,
} from "../../../src/utils/admin/custom-events";
import { CustomProgressBar } from "../../../src/components/progressBar/progressBar";
import useToast from "../../../src/hook/useToast";
import { getUuid } from "../../../src/utils/getUuid";
import { getHandleFromName } from "../../../src/utils/getHandle";
import { Switch } from "@mui/material";
import {
  ContainerMapsCity,
  MapsCity,
} from "../../../src/components/mapsCity/mapsCity";
import TitledContainer from "../../../src/components/titledContainer";
import { useQuery } from "react-query";
import { AuthContext } from "../../../src/config/auth";
import { useRouter } from "next/router";
import AddressInput from "@components/admin/addressInput";
import TagsInput from "@components/admin/tagsInput";
import AdminLayout from "@components/layout/adminLayout";
import { addDays } from "date-fns";
import { DatePickerWithRange } from "@components/ui/date-picker";
import { EventDescription, EventDetails } from "@views/events/CreateEvent";

const CustomEvents = () => {
  const notify = useToast();
  const router = useRouter();

  // const locationState = Boolean(router.query.isEdit);
  const { userInfo } = useContext(AuthContext);
  const [details, setDetails] = useState<EventDetails>({
    eventType: "user",
    verified: false,
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

  const [previousHandle, setPreviousHandle] = useState("");
  const eventUrl =
    typeof window !== "undefined" && window.location.pathname.split("/").at(-1);
  const isEdit = Boolean(router.query.isEdit);

  useEffect(() => {
    if (!router.query?.userEvent) {
      // console.log("admin");
      setDetails({
        ...details,
        eventType: "admin",
        verified: true,
      });
    } else {
      setDetails({
        ...details,
        userId: userInfo?.details?.id,
      });
    }
  }, []);

  const { data: editEventData } = useQuery(
    [`edit-event-${eventUrl}`],
    async () => {
      if (Boolean(router.query.isEdit)) {
        const res = (
          await getEvents({
            eventUrl: eventUrl,
            testEvent: false,
          })
        ).docs[0];
        const data = res.data();

        const schemaData = {
          ...data,
          // startDate: data.startDate.toDate(),
          // endDate: data.endDate.toDate(),
          // actualStartDate: data.actualStartDate.toDate(),
          // actualEndDate: data.actualEndDate.toDate(),
          handle: isEdit ? data.handle : getHandleFromName(data.title),
        } as EventDetails;

        setDetails(schemaData);
        setPreviousHandle(schemaData.handle);
        return schemaData;
      }
      return null;
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

    if (id == "title" && !isEdit) {
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

  const onDateChange = (date: Date, key: string) => {
    setDetails({
      ...details,
      [key]: date,
      // startDate: date,
      // endDate: date,
      // actualStartDate: date,
      // actualEndDate: date,
    });
  };

  // const [location, setLocation] = useState({
  //     lat: details.lat || -33.83165994942635,
  //     lng: details.lng || 151.21737966437746,
  // });

  const setLatLng = ({ lat, lng }) => {
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
        <CustomProgressBar width={80} />
      </div>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={updateDetails}>
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-12 mb-6">
          <div className="w-[95%] items-center justify-center">
            <h1 className="text-2xl font-semibold mb-4 text-center">
              {isEdit ? `Event: ${details.title}` : "Create Event"}
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
                        onClick={() => deleteDescriptrion(index)}
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
                      onChange={(e) => changeDescription(e, index)}
                    />
                    <label>
                      {desc.image ? (
                        <img
                          className="w-52 h-52 object-cover"
                          src={convertFileToURL(desc.image)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-md bg-[var(--inputField)] w-52 h-52">
                          <DriveFolderUploadIcon fontSize="medium" />
                          <p className="text-sm">Upload image</p>
                        </div>
                      )}
                      <input
                        // required
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => uploadImages(e, index)}
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
                    <DriveFolderUploadIcon fontSize="medium" />
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
                <i className="text-[#aaa] font-normal ml-2">(eg: /world-cup)</i>
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
              <h1 className="font-semibold text-lg">Is this a test event: </h1>
              <Switch
                checked={details.testEvent}
                id="testEvent"
                onChange={(e, checked) =>
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
                <h1 className="font-semibold text-lg">Promotion Timeline: </h1>
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
                <h1 className="font-semibold text-lg">Event Timeline: </h1>
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
                <ContainerMapsCity>
                  <MapsCity
                    writeable={true}
                    height={350}
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
                    zoom={7}
                    changeLatLng={setLatLng}
                  />
                  {/* <MapsCity lat={38.2} lng={40} /> */}
                </ContainerMapsCity>
              </div>
              <AddressInput
                city={details.city}
                country={details.country}
                territory={details.territory}
                onLocationChange={changeLocation}
                // onCountryChange={(country) =>
                //     chnageLocation("country", country)
                // }
                // onTerritoryChange={(territory) =>
                //     chnageLocation("territory", territory)
                // }
                // onCityChange={(city) =>
                //     chnageLocation("city", city)
                // }
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
                        src={convertFileToURL(details.speakerImage)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-md bg-slate-300 w-52 h-52">
                        <DriveFolderUploadIcon fontSize="medium" />
                        <p className="text-sm">Upload speaker image</p>
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
            <TitledContainer title="Event Tags" className="py-6 px-6 mt-6">
              <TagsInput tags={details.tags} updateTags={updateTags} />
              {/* {TagsInput()} */}
            </TitledContainer>

            <div className="w-full mt-4 flex justify-end">
              <button
                type="submit"
                className=" bg-sky-400 text-white p-2 px-4 rounded-lg"
              >
                {!isEdit ? "Create Event" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CustomEvents;
