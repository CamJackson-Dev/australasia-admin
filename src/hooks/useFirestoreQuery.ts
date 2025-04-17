import { useQuery } from "react-query";
import {
    getFirestore,
    collection,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase/firebase";

interface UseFirestoreQueryOptions {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
}

export const useFirestoreQuery = <T = DocumentData>(
    collectionPath: string,
    options: UseFirestoreQueryOptions = {}
) => {
    const fetchData = async (): Promise<QuerySnapshot<DocumentData>> => {
        const collectionRef = collection(firestore, collectionPath);
        const snapshot = await getDocs(collectionRef);
        return snapshot;
    };

    return useQuery<QuerySnapshot<DocumentData>>({
        queryKey: ["firestore", collectionPath],
        queryFn: fetchData,
        enabled: options.enabled ?? true,
        staleTime: options.staleTime ?? 1000 * 60 * 5, // 5 minutes
        cacheTime: options.cacheTime ?? 1000 * 60 * 30, // 30 minutes
    });
};
