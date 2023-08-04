const express = require('express')

const app = express()

const port = process.env.PORT || 3000

app.use(express.static('public'))


const db = require('./db')
db()


//Routes
const Comment  = require('./models/comment')
app.use(express.json())

app.post('/api/comments', (req,res) => {

      const comment = new Comment({
            username : req.body.username,
            comment : req.body.comment,
      })

      comment.save().then(response => {
            res.send(response)
         

      })
})


// get data from DB and Show
app.get('/api/comments',(req,res) => {
  Comment.find().then(function(comment){
      res.send(comment)
  })
})







 const server = app.listen(port , () => {
    console.log(`Listening on Port ${port}`)
})
let io = require('socket.io')(server)

io.on('connection', (socket)=> {
      console.log(`New Connection: ${socket.id}`)

      //retrive socket data
      socket.on('comment',(data)=>{
     
       data.time = Date()
       socket.broadcast.emit('comment', data)
      })


      //typing username show
      socket.on('typing' , (data)=> {
            socket.broadcast.emit('typing', data)
      })
})