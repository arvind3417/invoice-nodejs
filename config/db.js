const mongoose = require("mongoose")
const dbconfig = require("./dbconfig")

const connectDB = async() => {
    try {
        const connection = await mongoose.connect(dbconfig.database,{
            // userNewurlParser:true,
            // useUnifiedTopology:true,
            // useFindAndModify: false
        })
        console.log(`Connected : ${connection.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
        
    }
}
module.exports = connectDB;