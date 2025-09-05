// A simple stub showing how to create reminders (not deployed automatically).
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp();

// Example: Cloud Function (HTTP) to accept a scheduled reminder
exports.createReminder = functions.https.onRequest(async (req, res) => {
    try {
        const { userId, eventId, time } = req.body
        // In production: validate, create Firestore doc, schedule via Cloud Tasks or Pub/Sub scheduler
        await admin.firestore().collection('reminders').add({ userId, eventId, time, createdAt: admin.firestore.FieldValue.serverTimestamp() })
        res.status(200).send({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: err.message })
    }
})
