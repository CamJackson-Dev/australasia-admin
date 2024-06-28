const CircularProgress = ({width}: {width?: number}) => {
    return (
        <div style={{
            width: width? `${width}px`: '40px',
            height: width? `${width}px`: '40px'
        }} 
        className="w-10 h-10 rounded-[50%] border-4 border-slate-300 border-t-primary animate-spin"></div>
    );
};

export const CircularProgressRed = () => {
    return (
        <div className="w-10 h-10 rounded-[50%] border-4 border-slate-300 border-t-red-400 animate-spin"></div>
    );
};

export default CircularProgress;
