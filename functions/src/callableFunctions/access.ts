import {https} from 'firebase-functions/v2'
import * as admin from 'firebase-admin'

export const addAdmin = https.onCall({cors: true}, async (req) => {
    // if (req.auth.token.admin !== true) {
    //     return {
    //         error: "Request not authorized. User must be a moderator to fulfill request."
    //     }
    // }
    const email = req.data.email;
    const role = req.data.role;

    try {
        await grantAdminRole(email, role);
        return { result: `"${email}" is now an ${role}.` }
    } catch (error) {
        return { error: `Failed to grant admin role: ${error.message}` };
    }
})

async function grantAdminRole(email: string, role: string): Promise<void> {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role });
    } catch (error) {
        throw new Error(`Unable to set custom claims: ${error.message}`);
    }
    // const user = await admin.auth().getUserByEmail(email);
    // if (user.customClaims && ((user.customClaims as any).role === "admin" || (user.customClaims as any).role === "owner")){
    //     return
    // }
    // return await admin.auth().setCustomUserClaims(user.uid, {
    //     role: role
    // })
}