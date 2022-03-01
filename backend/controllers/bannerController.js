const catchAsyncError = require("../middlewares/catchAsyncError")

const cloudinary = require("cloudinary")

const Banner = require("../models/bannerModel")

// route :  GET api/banners
// desc  :  get all banners
// access:  public
exports.getBanners = catchAsyncError(async (req, res, next) => {
    const banners = await Banner.find({}).populate("product", "slugName").sort("-createdAt").limit(5)

    res.status(200).json({
        success: true,
        banners
    })
})

// route :  GET api/products/banners/:productId
// desc  :  get product of banner detail
// access:  public
exports.getBannerDetails = catchAsyncError(async (req, res, next) => {
    const { productId } = req.params
    const banner = await Banner.findOne({ product: productId })

    if (banner) {
        res.status(200).json({
            success: true,
            banner: banner.url
        })
    } else {
        res.status(200).json({
            success: true,
            banner: ""
        })
    }
})

// route :  POST api/product/banner/upload
// desc  :  add and update banner
// access:  private
exports.uploadBanner = catchAsyncError(async (req, res, next) => {
    const { banner, productId } = req.body

    const bannerExist = await Banner.findOne({ product: productId })

    if (!banner) {
        return next(new ErrorHandler("Vui lòng chọn hình ảnh", 400))
    }

    if (!bannerExist) {
        const result = await cloudinary.v2.uploader.upload(banner, {
            folder: "banners",
            crop: "scale",
            responsive: true,
            width: 'auto',
        })

        await Banner.create({
            product: productId,
            public_id: result.public_id,
            url: result.secure_url
        })

        res.status(200).json({
            success: true,
            message: "Upload thành công"
        })
    } else {
        await cloudinary.v2.uploader.destroy(bannerExist.public_id)

        const result = await cloudinary.v2.uploader.upload(banner, {
            folder: "banners",
            crop: "scale",
        })

        await Banner.findOneAndUpdate(
            { product: productId },
            {
                public_id: result.public_id,
                url: result.secure_url
            },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công"
        })
    }


})
