const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    }).catch(err => {
        console.error(err.message)
        process.exit(1)
    })
}
module.exports = connectDB