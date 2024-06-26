import CircularProgress from "@/components/ui/loading";

export default function Loading() {
    return (
        <div className={"w-full h-[90vh] flex items-center justify-center"}>
            <CircularProgress />
        </div>
    );
}
