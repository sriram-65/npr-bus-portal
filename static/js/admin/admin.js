let API_BASE = "https://npr-bus-backend.vercel.app"
let sotp = document.getElementById("sotp")

function Formatedate(){
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');  
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();                        
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate
}
 

let sname = document.getElementById("sname")
let today = document.getElementById("today")

function Check_Me(){
    return fetch(`${API_BASE}/api/auth/me` , {
        credentials:"include"
    }).then(res=>res.json())
}


function Create_Session(date){
    Check_Me().then(data=>{
        if(data.Success==true){
              window.location.href = `${API_BASE}/api/admin/session/create/${data.data.Uid}/${date}`
        }
        else{
            alert(`Falied to Create Session for ${date}`)
        }
    })
}

sotp.onclick = function(){
    sotp.disabled = true
    Check_Me().then(res=>{
      check_session(Formatedate()).then(data=>{
        if(data.Success==true){
           Swal.fire({
            icon: "error",
            title: "Session was Already Started",
            text: `Started By : ${data.data.Admin_Name}`,
            footer: res.data._Email === data.data.Admin_Email
                ? `<a href=${API_BASE}/api/admin/session/create/${data.data.Admin_uid}/${Formatedate()}>View Your Session</a>`
                : `<a href=${API_BASE}/api/admin/view-students/${data.data.busno}/${Formatedate()}>View Students</a>`
            });
           sotp.disabled = false

        }
        else{
          Create_Session(Formatedate())  
        }
    })
    })
   
}


function ALLCHECK(){
    Check_Me().then(data=>{
        if(data.Success==true){
            sname.innerText = data.data._Name
            today.innerText = Formatedate()
        }
    })
}

function check_session(date){
   return fetch(`${API_BASE}/api/admin/check-session/${date}`).then(res=>res.json())
}
window.addEventListener("DOMContentLoaded" , ()=>{
    ALLCHECK()
    
}) 




