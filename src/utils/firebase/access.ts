import {https} from 'firebase-functions/v2'
import * as admin from 'firebase-admin'

admin.initializeApp()

const cors = require('cors')({origin: true})

exports.addAdmin = https.onCall({cors: true}, (req) => {
    if (req.auth.token.admin !== true) {
        return {
            error: "Request not authorized. User must be a moderator to fulfill request."
        }
    }
    const email = req.data.email;
    return grantAdminRole(email).then(() => {
        return {
            result: `Request fulfilled! ${email} is now a moderator.`
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