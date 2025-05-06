const mongoose = require("mongoose");

const noticeBoardSchema = new mongoose.Schema(
    {
        noticeTitle: {
            type: String,

        },
        noticeDescription: {
            type: String,

            trim: true
        },
        noticeDate: {  // Renamed from "Date" to "noticeDate"
            type: Date,

        },
        time: {
            type: String
        },
        noticeImage: {  // Fixed capitalization
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("NoticeBoard", noticeBoardSchema);
