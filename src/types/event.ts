import { DateRange } from "react-day-picker";

export interface EventDescription {
    description: string | null;
    image: File | string;
    index?: number;
}

export interface ContactDetails {
    type: "email" | "phone";
    value: string;
}

export interface EventDetails {
    eventId?: string;
    eventType?: "admin" | "user";
    verified?: boolean;
    handle?: string;
    userId?: string;
    title: string;
    description: EventDescription[];
    eventTimeline: DateRange;
    promotionTimeline: DateRange;
    banner: File | string;
    cost: string;
    eventUrl: string;
    testEvent: boolean;
    private?: boolean;

    country: string;
    territory: string;
    city: string;
    lat: string;
    lng: string;
    address: string;

    speakerImage?: File | string;
    speakerNote?: string;
    tags?: string[];
    contact?: ContactDetails[];
    bookingUrl?: string;
}

type DateRangeGET = {
    from:
        | {
              seconds: number;
              nanoseconds: number;
          }
        | undefined;
    to:
        | {
              seconds: number;
              nanoseconds: number;
          }
        | undefined;
};

export type EventDetailsGET = Omit<
    EventDetails,
    "eventTimeline" | "promotionTimeline"
> & {
    eventTimeline: DateRangeGET;
    promotionTimeline: DateRangeGET;
};
