export const objectKeys = <Obj extends Object>(obj: Obj): (keyof Obj)[] => {
    return Object.keys(obj) as (keyof Obj)[];
};

export const objectValues = <Obj extends object>(
    obj: Obj
): Obj[keyof Obj][] => {
    return Object.values(obj);
};

export const objectEntries = <Obj extends object>(
    obj: Obj
): Array<[keyof Obj, Obj[keyof Obj]]> => {
    return Object.entries(obj) as Array<[keyof Obj, Obj[keyof Obj]]>;
};
