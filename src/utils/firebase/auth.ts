import firebase from 'firebase/compat/app'
import { auth } from './firebase';

export const adminLogin = async ({email, password}: {email: string, password: string}) => {
    try {
        const cred = await auth
          .signInWithEmailAndPassword(email, password)
        return cred
    }catch(e){
        throw new Error("Incorrect credentials")
    }
    // console.log(cred)
      
};