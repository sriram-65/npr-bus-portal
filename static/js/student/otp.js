let API_BASE = "https://npr-bus-backend.vercel.app"

let eotp = document.getElementById("submit-otp")
let otpInput = document.getElementById("oinp")
let teacher = document.getElementById("teacher")
let marker = document.getElementById("marker")


function Verfiy_OTP(){
    return fetch(`${API_BASE}/api/otp/verfiy/${localStorage.getItem("busno")}/` , {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({student_uid:JSON.parse(localStorage.getItem("uid")) , user_otp:otpInput.value , date:formate_date()})
    }).then(res=>res.json())
    
}




function formate_date(){
        const today = new Date();

        const day = String(today.getDate()).padStart(2, '0');     
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const year = today.getFullYear();                       

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate
}


eotp.onclick = function(){
   

   Send_Otp_code()
}


function Send_Otp_code(){
    eotp.innerText = 'Processing...'
    eotp.disabled = true
    Verfiy_OTP().then(data=>{
        if(data.Success===true){
              let myModalEl = document.getElementById('otpModal');
              eotp.innerText = 'Success ✅✅'
              eotp.disabled = false
              setTimeout(()=>{
                bootstrap.Modal.getInstance(myModalEl).hide();
              } , 1300)

              SetStudentStatus()
        }
        else{
            eotp.innerText = 'Submit OTP'
            eotp.disabled = false
            alert("Otp is Invalid")
        }
    })
}


otpInput.addEventListener("keydown" , (e)=>{
    if(e.key==='Enter'){
      Send_Otp_code()
    }
})


function SetStudentStatus(){
    FetchStudentsStatus().then(data=>{
        if(data.data.otp_verfied===true){
           marker.innerText = "Present"
                document.getElementById("otpModalLabel").style.display = 'none'
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
                eotp.style.display = 'block'
                document.getElementById("design").classList.add(
                    "alert",
                    "alert-danger",
                    "d-inline-flex",
                    "w-75",
                    "mb-3"
                );
        }
         teacher.innerText  = data.data.Attendanced_By?`Attendanced By  ${data.data.Attendanced_By}`:"Not Yet"
    })
}

function FetchStudentsStatus(){
    return fetch(`${API_BASE}/api/` , {
        credentials:"include"
    }).then(res=>res.json())
}

