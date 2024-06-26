import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";

export function DatePicker(props: { date?: Date }) {
    const [date, setDate] = React.useState<Date>(props.date);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

interface IDatePickerRange {
    className?: string;
    dateRange: DateRange;
    onChange: (range: DateRange) => void;
}

export function DatePickerWithRange(props: IDatePickerRange) {
    const { className, dateRange, onChange } = props;
    const [date, setDate] = React.useState<DateRange | undefined>(dateRange);

    const changeDate = (dateRange: DateRange) => {
        onChange(dateRange);
        setDate(dateRange);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={changeDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function DateTimePickerWithRange(props: IDatePickerRange) {
    const { className, dateRange: date, onChange } = props;

    const changeDate = (dateRange: DateRange) => {
        onChange(dateRange);
    };

    const setFromDate = (val: Date) => {
        const newDate = { ...date, from: val };
        changeDate(newDate);
    };

    const setToDate = (val: Date) => {
        const newDate = { ...date, to: val };
        changeDate(newDate);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full h-16 sm:h-10 lg:w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(
                                        date.from,
                                        "LLL dd, y \n '('hh:mm a"
                                    )}{" "}
                                    - {format(date.to, "hh:mm a')' LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={changeDate}
                        numberOfMonths={2}
                    />
                    <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-t border-border">
                        <TimePicker
                            setDate={setFromDate}
                            date={date?.from ?? new Date()}
                        />
                        <p className="text-sm font-bold"> : </p>
                        <TimePicker
                            setDate={setToDate}
                            date={date?.to ?? new Date()}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
