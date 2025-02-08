// import { eventTags } from "@/data/eventTags";
import { useRef, useState } from "react";

interface TagsInputInterface {
    tags: string[];
    options: string[];
    updateTags: (tags: string[]) => void;
}

const TagsInput = (props: TagsInputInterface) => {
    const { tags, updateTags, options } = props;
    const textRef = useRef<HTMLInputElement>(null);
    const [tagText, setTagText] = useState("");

    const filteredTags = options.filter((tag) =>
        tag.toLowerCase().includes(tagText.toLowerCase())
    );

    const focusText = () => {
        textRef.current?.focus();
    };

    const addTag = (tag: string) => {
        updateTags([...tags, tag]);
        setTagText("");
        focusText();
    };

    const popTag = () => {
        // setDetails({
        //     ...details,
        //     tags: details.tags.slice(0, details.tags.length - 1),
        // });
        updateTags([...tags.slice(0, tags.length - 1)]);
        focusText();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            e.preventDefault();
            addTag(tagText);
        } else if (e.code === "Backspace") {
            if (tagText.length === 0) {
                popTag();
            }
        }
        return;
    };

    return (
        <div className="relative w-full border-2 p-2 rounded-md outline-none bg-[var(--inputField)] flex flex-wrap items-center gap-y-2">
            {tags?.map((tag) => (
                <p
                    key={`tag-${tag}`}
                    className="p-1 px-2 text-[12px] bg-[var(--background)] rounded-2xl mr-2"
                >
                    {tag}
                </p>
            ))}
            <input
                key={"tag-input-field"}
                ref={textRef}
                type="text"
                className="w-full flex-1 rounded-md outline-none bg-[var(--inputField)]"
                value={tagText}
                onKeyDown={handleKeyPress}
                onChange={(e) => setTagText(e.target.value)}
            />
            {tagText && filteredTags.length > 0 && (
                <div className="absolute top-[110%] left-0 w-full bg-[var(--inputField)] rounded-md py-2 z-10">
                    {filteredTags
                        .filter((tag) => !tags.includes(tag))
                        .slice(0, 6)
                        .map((tag) => (
                            <div
                                key={tag}
                                className="hover:bg-[var(--background)] px-2 p-2 cursor-pointer"
                                onClick={() => addTag(tag)}
                            >
                                {tag}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default TagsInput;
