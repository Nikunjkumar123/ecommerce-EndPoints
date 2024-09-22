const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDb = (URL)=>{
    mongoose.connect(URL).
    then(()=>{
        console.log("connected to mongodb")
    }).
    catch(()=>{
        console.log("error in mongo connection");
    })
}

module.exports = connectDb;