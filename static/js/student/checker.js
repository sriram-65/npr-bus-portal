let API_BASE = "https://npr-bus-backend.vercel.app"

let askdeatils = document.getElementById("ask-deatils")

let update = document.getElementById("update") 
let PhoneNumber = document.getElementById("phone-number") 
let ds = document.getElementById("ds") 
let busno = document.getElementById("bus-no") 
let gender = document.getElementById("gender") 
let year = document.getElementById("year")
let content_display = document.getElementById("content-display")
let load_student = document.querySelector(".load-student")
let eotp = document.getElementById("eotp")
let main = document.querySelector("main")

let sname = document.getElementById("sname")
let today = document.getElementById("today")


document.getElementById("logout").onclick = function(){
    document.getElementById("logout").disabled = true
    fetch(`${API_BASE}/api/logout` , {credentials:"include"}).then(res=>res.json()).then(data=>{
        if(data.Success==true){
            window.location.href = '/'
        }
        else{
            alert("Failed to Logout")
             document.getElementById("logout").disabled = false
        }
    })
}
function Check_Me(){
    return fetch(`${API_BASE}/api/auth/me` , {
        credentials:"include"
    }).then(res=>res.json())
}

update.onclick = function(){
    update.disabled = true
    update.innerText = "Creating Student..."
    Check_Me().then(data=>{
        if(data.Success===true){
            Update_Student_Deatils(data.data , PhoneNumber.value, ds.value , year.value , busno.value , gender.value).then(result=>{
                 if(result.Success===true){
                     askdeatils.style.display = 'none'
                     ALLCHECK()
                 }
                 else{
                    alert("Error on Submitting Student Deatils")
                 }
            })
        }
    })
    update.disabled = true
    update.innerText = "Update"
}



const loadingQuotes = [
  "Just a sec, making things ready...",
  "Hold tight, good stuff coming up!",
  "Loading the magic...",
  "Almost there, hang on...",
  "Checking connections, don’t worry!",
  "Setting things up for you...",
  "Bringing the OTP vibes...",
  "Just a few more moments...",
  "Good things take time, right?",
  "Almost done, stay cool!",
  "Your patience is appreciated 😎",
  "Loading… but not too slow, promise!",
  "Hang in there, almost ready!",
  "Making sure everything works smoothly...",
  "Setting the stage for you...",
  "Hold on, just a tiny bit longer...",
  "Almost finished, hang tight!",
  "Loading like a pro, please wait...",
  "Good vibes only while we load this...",
  "Your OTP is cooking, stay tuned!"
];


function SetUser(data){
    
    if(data.Uid){
        if(!localStorage.getItem("uid")){
            localStorage.setItem("uid" , JSON.stringify(data.Uid))
        }
        if(data.Updated==true){
           askdeatils.style.display = 'none'
           main.style.display  = 'block'
        }
        else{
           main.style.display  = 'none'
           askdeatils.style.display = 'block'
            
        }
    }
    
}

let random_one = loadingQuotes[Math.floor(Math.random()*loadingQuotes.length)]

function ALLCHECK(){
    content_display.innerText = random_one
   
    Check_Me().then(response=>{

         if(response.Success==false){
                eotp.disabled = true
        }
        else{
                eotp.disabled= false
        }
        SetUser(response.data)
        load_student.style.display = 'none'
        document.querySelector("footer").style.display = 'none'
        main.style.display = 'block'
        localStorage.setItem("busno" , response.data.Bus_No)
    if(response.data.Updated==true){
         CheckPlaceholder().then(data=>{
             if(data.Success==false && data.preError=='nf'){
        CreatePlaceHolder(response.data.Uid).then(result=>{
            if(result.Success==true){
                sname.innerText = result.data.name
                today.innerText = result.data.date
                eotp.disabled= false
            }
        })
    }
    
            if(data.data.Started==='f'){
                document.getElementById("closed").style.display  = 'block'
                document.getElementById("sinfo").style.display  = 'none'
            }
            
            if(data.Success==false){
                eotp.disabled= true
            }
   
    else{
            teacher.innerText = data.data.Attendanced_By?"Attendanced By" +" " + data.data.Attendanced_By:"----"
            if(data.data.otp_verfied==true){
                marker.innerText = "Present"
                eotp.style.display = 'none'
                document.getElementById("design").classList.add(
                    "alert",
                    "alert-success",
                    "d-inline-flex",
                    "w-75",
                    "mb-3"
                );

            }
            else{
                marker.innerText = "Absent"
                document.getElementById("design").classList.add(
                    "alert",
                    "alert-danger",
                    "d-inline-flex",
                    "w-75",
                    "mb-3"
                );
            }
            sname.innerText = data.data.name
            today.innerText = data.data.date
     }
   })
    }
     
   })
 
}

function Update_Student_Deatils(data , pn , dep , year , busno , gender){
    return fetch(`${API_BASE}/api/auth/update/${data.Uid}` , {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        } , 
        body:JSON.stringify({pn:pn , dep:dep , year:year , busno:busno , gender:gender })
    }).then(res=>res.json())
}

let teacher = document.getElementById("teacher")
let marker = document.getElementById("marker")

function CheckPlaceholder(){
    return fetch(`${API_BASE}/api/` , {
        credentials:"include"
    }).then(res=>res.json())
}

window.addEventListener("DOMContentLoaded" , ()=>{
   ALLCHECK()
  
})

function CreatePlaceHolder(uid){
   return fetch(`${API_BASE}/api/otp/generate/student/placeholder` , {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({uid:uid , date:Formatedate()})
   }).then(res=>res.json())
}


function Formatedate(){
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');  
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();                        
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
}
