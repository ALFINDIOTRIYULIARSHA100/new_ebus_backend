const admin = require("firebase-admin");

exports.sendNotification = async (
    token,
    title,
    body
) => {
    if (!token) return;
    try {
        await admin.messaging().send({
            token,
            notification: {
                title,
                body
            }
        });
        console.log("FCM terkirim");
    }
    catch(err){
        console.log(err);
    }
};