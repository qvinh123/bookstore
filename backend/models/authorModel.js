const mongoose = require('mongoose')
const nonAccentVietnamese = require('../utils/nonAccent')

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên tác giả"],
        trim: true,
        unique: true
    },
    description: {
        type: String
    },
    slugName: {
        type: String,
    },
    avatar: {
        public_id: {
            type: String,
            default: "author/img_default"
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/quangvinhdlc/image/upload/v1646159098/author/img_default_yavu5l.webp"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

authorSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'authors'
})

authorSchema.pre("save", async function () {
    const author = this

    if (author.isModified("name")) {
        author.slugName = nonAccentVietnamese(author.name)
    }
})

const Author = mongoose.model("Author", authorSchema)
module.exports = Author