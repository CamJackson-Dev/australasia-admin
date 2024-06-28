import {https} from 'firebase-functions/v2'
import * as admin from 'firebase-admin'

// admin.initializeApp()

export const addAdmin = https.onCall({cors: true}, (req) => {
    // if (req.auth.token.admin !== true) {
    //     return {
    //         error: "Request not authorized. User must be a moderator to fulfill request."
    //     }
    // }
    const email = req.data.email;
    return grantAdminRole(email).then(() => {
        return {
            result: `"${email}" is now an admin.`
        }
    })
})

async function grantAdminRole(email: string): Promise<void> {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && (user.customClaims as any).admin === true){
        return
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
    })
}