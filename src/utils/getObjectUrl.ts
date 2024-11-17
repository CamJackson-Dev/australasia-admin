export const getObjectUrl = (object: File | string) => {
    if (typeof object == "string") return object;
    return URL.createObjectURL(object);
};
