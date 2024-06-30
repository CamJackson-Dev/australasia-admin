import { updateAdminDatabase } from '@/mutations/access';
import { auth, firestore } from './firebase';
import { Access, Role } from '@/types/access';
import { getFunctions, httpsCallable} from "firebase/functions"

export const adminLogin = async ({email, password}: {email: string, password: string}) => {
    try {
        const adminData = await firestore 
            .collection("/admin/access/admins")
            .where("email", "==", email)
            .get()

        if (adminData.empty) { 
            throw new Error("Incorrect credentials")
        }

        const cred = await auth
          .signInWithEmailAndPassword(email, password)
        return cred
    }catch(e){
        throw new Error("Incorrect credentials")
    }
    // console.log(cred)
      
};

interface ISignUp {
    email: string
    password: string
    name: string
    role: Role
}

export const adminSignUp = async ({email, password, name, role}: ISignUp) => {
    try {
        const cred = await auth
          .createUserWithEmailAndPassword(email, password)
        
        const user = auth.currentUser
        const res = await user!!.updateProfile({
            displayName: name //update fullname
        })

        //update admin data in firestore
        await updateAdminDatabase({
            uid: auth.currentUser.uid,
            name: name,
            status: "accepted",
            email: email
        })

        //add role metadata to user claims
        const addAdminCloudFunction = httpsCallable(getFunctions(), "addAdmin")
        await addAdminCloudFunction({email: email, role: role})
        console.log("Admin created successfully")
        
        return true

    }catch(e){
        console.log(e.message)
        throw new Error("Error creating profile. Try again!")
    }
      
};

export const logout = async () => {
    return await auth.signOut()
}