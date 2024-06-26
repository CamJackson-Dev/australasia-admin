export const getHandleFromName = (name: string) => {
    let temp = name.toLowerCase().replaceAll(" ", "-").replaceAll(".", "");
    return temp;
};

export const reverseGetHandle = (handle: string) => {
    const lowercaseWords = ["and", "or", "of", "the", "at"];

    return handle
        .split("-") // Split the string by '-'
        .map((word, index) => {
            if (index === 0 || !lowercaseWords.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize if not in lowercaseWords or first word
            } else {
                return word; // Preserve lowercase for words in lowercaseWords
            }
        })
        .join(" "); // Join the words back together with spaces
};

// export const reverseGetHandle = (handle: string) => {
//     let temp = handle.replaceAll("-", " ").replaceAll(".", "");
//     let name = temp.replace(/\b\w/g, (match) => match.toUpperCase());
//     return name;
// };

// export const getHandleFromName = (name: string) => {
//     return (
//         typeof window !== "undefined" &&
//         name.toLowerCase().replaceAll(" ", "-").replaceAll(".", "")
//     );
// };

// export const reverseGetHandle = (handle: string) => {
//     // let temp = handle.replaceAll("-", " ").replaceAll(".", "");
//     // let name = temp.replace(/\b\w/g, (match) => match.toUpperCase());
//     return (
//         typeof window !== "undefined" &&
//         handle
//             .replaceAll("-", " ")
//             .replaceAll(".", "")
//             .replace(/\b\w/g, (match) => match.toUpperCase())
//     );
// };
