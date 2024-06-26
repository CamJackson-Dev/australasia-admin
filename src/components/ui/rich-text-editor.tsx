import dynamic from "next/dynamic";
import { useEffect } from "react";
import 'react-quill/dist/quill.snow.css'

const DynamicQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IRichTextEditor {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    containerClassName?: string;
}

const RichTextEditor = (props: IRichTextEditor) => {
    const { value, onChange, className, containerClassName } = props;

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (typeof document === "undefined") return;
    }, []);

    const modules = {
        toolbar: [
            // [{ font: ["Poppins", "Roboto"] }],
            [{ header: [1, 2, 3, 4, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            // ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            // [{ script: "sub" }, { script: "super" }],
            // [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["link"],
        ],
    };

    return (
        <div className={containerClassName}>
            <DynamicQuill
                modules={modules}
                theme="snow"
                className={className}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default RichTextEditor;
