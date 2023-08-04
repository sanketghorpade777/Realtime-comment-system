// DB Connection
async function connected(){

    const mongoose = require('mongoose')
const url = 'mongodb://localhost/comments'



      try{
            await mongoose.connect(url);
            console.log("Database Connected Successfully")
      }catch(error){
            console.log(error)
      }
}


module.exports = connected;