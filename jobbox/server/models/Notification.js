const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['message', 'job_application'],
      required: true,
    },
    conversationId: {
      type: String,
    },
    jobId: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);