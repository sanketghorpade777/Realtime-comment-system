
let username  
let socket = io()
do{
   username = prompt('Please ! Enter Your Name')
}while(!username)

const textarea = document.querySelector('#textarea')
const submit_Btn = document.querySelector('#submit_btn')
const comment_box = document.querySelector('#comment_box')



submit_Btn.addEventListener('click',(e)=> {
  e.preventDefault()
  let comment = textarea.value


  if(!comment){
    return
  }

  postComment(comment)

})


function postComment(comment){
    //1. append to dom
    let data = {
        username : username,
        comment : comment,
    }
  appendDom(data)
 textarea.value = ''

   broadcastcomment(data)

  syncwithDB(data)
}


function appendDom(data){
   
    let comment_div = document.createElement('div')
    comment_div.classList.add('comment','border-2','p-5','rounded')
 let comment_sec = `

    <strong>${data.username}</strong>
    <p>${data.comment}</p>
    <div class="mt-5 flex">
    <span class="material-symbols-outlined"> timer </span><small>${moment(data.time).format('LT')}</small>
    </div>
 
  
`
comment_div.innerHTML = comment_sec

  comment_box.prepend(comment_div)
 
  
}



//2. broadcast


function broadcastcomment(data){
  //socket
 socket.emit('comment',data)

}
 socket.on('comment', (data) => {
  
  appendDom(data)
 })

// typeing data show
let timerID = null
function Debounce(func, timer){
  if(timerID){
    clearTimeout(timerID)
  }
  timerID = setTimeout(()=>{
    func()
  },timer)
}

 socket.on('typing',(data) => {
  let typing_sec = document.querySelector('.typing_sec')
  typing_sec.innerText = `${data.username} Is Typing`

   Debounce(function(){
     typing_sec.innerText = ''

   },1000)

 })



textarea.addEventListener('keyup', (e) => {
  
  socket.emit('typing', {username})
})  




 
    //3. sync with mongo DB
     // API Calling
    function syncwithDB(data){
     const headers = {
      'Content-Type': 'application/json'
     }
     fetch('/api/comments', {method: 'Post', body: JSON.stringify(data), headers})
     .then(response => response.json())
     .then(result => {
      console.log(result)
     })

    }



    // 4. show comments
    function fetchComments(){
      fetch('/api/comments')
      .then(res => res.json())
      .then(result => {
         result.forEach(comment => {
          comment.time = comment.createdAt
          appendDom(comment)
         });

    
      })
    }

    window.onload =  fetchComments()