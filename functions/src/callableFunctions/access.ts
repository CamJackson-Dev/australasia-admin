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
    const role = req.data.role;
    return grantAdminRole(email, role).then(() => {
        return {
            result: `"${email}" is now an admin.`
        }
    })
})

async function grantAdminRole(email: string, role: string): Promise<void> {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && ((user.customClaims as any).role === "admin" || (user.customClaims as any).role === "owner")){
        return
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        role: role
    })
}