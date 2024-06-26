import { useCallback, useEffect, useState } from "react";
import CircularProgress from "../ui/loading";

import {
    GoogleMap,
    Marker,
    OverlayView,
    useJsApiLoader,
} from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import TopLink from "../TopLink";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

interface Coordinates {
    lat: number;
    lng: number;
}

interface CustomMapProps {
    changeLatLng: (lat: number, lng: number) => void;
    lat: number;
    lng: number;
    zoom: number;
    draggable: boolean;
    height?: number;
    showSearch?: boolean;
    // keyword?: string;
    data?: MarkerProps[];
}

interface MarkerProps {
    title: string;
    image: string;
    url: string;
    lat: number;
    lng: number;
}

const CustomGoogleMap = (props: CustomMapProps) => {
    const { changeLatLng, lat, lng, height } = props;
    const [keyword, setKeyword] = useState("");
    const [center, setCenter] = useState<Coordinates>({
        lat: lat,
        lng: lng,
    });
    const [marker, setMarker] = useState<Coordinates>({
        lat: lat,
        lng: lng,
    });

    // console.log(marker);

    const [libraries] = useState<("places" | "drawing" | "geometry")[]>([
        "places",
    ]);
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
        libraries,
    });

    const containerStyle = {
        width: "100%",
        height: height ? `${height}px` : "70vh",
    };

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        map.setZoom(props.zoom);
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    const markerChange = (e: google.maps.MapMouseEvent) => {
        let lat = e.latLng?.lat() ?? center.lat;
        let lng = e.latLng?.lng() ?? center.lng;
        setMarker({
            lat: lat,
            lng: lng,
        });
        changeLatLng(lat, lng);
    };

    useEffect(() => {
        if (!keyword) return;

        const getData = async () => {
            const res = await getGeocode({ address: keyword });
            const { lat, lng } = getLatLng(res[0]);
            setMarker({ lat, lng });
            setCenter({ lat, lng });
            changeLatLng(lat, lng);
        };

        if (map) {
            getData();
        }
    }, [keyword, map]);

    const CustomMarker = ({ title, image, url }) => {
        return (
            <TopLink to={url}>
                <Tooltip>
                    <TooltipTrigger>
                        <img
                            alt={title}
                            className="h-5 w-5 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:h-6 hover:w-6 duration-200 rounded-full border-2"
                            src={image}
                        />
                    </TooltipTrigger>
                    <TooltipContent>{title}</TooltipContent>
                </Tooltip>
            </TopLink>
        );
    };

    return isLoaded ? (
        <div className="relative">
            <Input
                className="absolute shadow-md border-2 z-[50] left-1/2 -translate-x-1/2 top-2 w-1/2 bg-[rgba(0,0,0,.7)] h-12 mb-4 placeholder:italic placeholder:text-white"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search for location"
            />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={props.zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {props.data != undefined ? (
                    props.data.map((item, index) => (
                        <OverlayView
                            key={`${item.title}-${index}`}
                            position={{
                                lat: item.lat,
                                lng: item.lng,
                            }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <CustomMarker
                                image={item.image}
                                title={item.title}
                                url={item.url}
                            />
                        </OverlayView>
                    ))
                ) : (
                    <Marker
                        key={Math.random()}
                        draggable={props.draggable}
                        onDragEnd={markerChange}
                        position={marker}
                    />
                )}
            </GoogleMap>
        </div>
    ) : (
        <>
            <CircularProgress />
        </>
    );
};

export default CustomGoogleMap;