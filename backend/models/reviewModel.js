const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            trim: true
        },
        images: [
            {
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
                }
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isUpdated: {
            type: Boolean,
            default: false
        }
    }
)

reviewSchema.pre(/^find/, function (next) {
    // ^find here is we use regex and can able to find,findOne ...etc
    this.populate({
        path: "user",
        select: "name avatar"
    })
    next()
});


const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
