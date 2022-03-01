const dotenv = require('dotenv')
const Product = require("../models/productModel")
const connectDB = require("../config/db")
const data = require("../data/data.json")
const data1 = require("../data/categories.json")
const data2 = require("../data/authors.json")
const data3 = require("../data/collectionBook.json")
const data4 = require("../data/object.json")
const Categories = require('../models/categoryModel')
const Author = require('../models/authorModel')
// const Object = require('../models/objectModel')
const CollectionBook = require('../models/collectionBookModel')

dotenv.config({ path: "backend/config/config.env" })
connectDB()

const seedProducts = async () => {
    try {
        await Product.deleteMany()
        console.log("Products are deleted")

        await Product.insertMany(data)
        console.log("All products are added")

        // await Categories.insertMany(data1)
        // await Author.insertMany(data2)
        // await Object.insertMany(data4)
        // await CollectionBook.insertMany(data3)

        process.exit()
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}
seedProducts()