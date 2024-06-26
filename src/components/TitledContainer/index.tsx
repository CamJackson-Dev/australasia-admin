interface TitledContainer {
    title: string;
    className?: string;
    children: React.ReactNode;
}

const TitledContainer = (props: TitledContainer) => {
    const { title, className, children } = props;

    return (
        <div
            className={` border-sky-200 border-2 rounded-md my-2 px-8 py-4 relative ${className}`}
        >
            <p className="absolute -top-[12px] left-4 text-sky-400 px-2 bg-[var(--background)] tracking-wide font-medium">
                {title}
            </p>
            {children}
        </div>
    );
};

export default TitledContainer;
