let API_BASE = "https://npr-bus-backend.vercel.app/"

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
            apiKey: "AIzaSyDORsW3tjyHwlN-Seof-10w22e9j9MqgSY",
            authDomain: "fir-c24bc.firebaseapp.com",
            projectId: "fir-c24bc",
            storageBucket: "fir-c24bc.firebasestorage.app",
            messagingSenderId: "528128097185",
            appId: "1:528128097185:web:88b630a207940792dca9e0"
        };
    
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

let cwg = document.getElementById("cwg")

cwg.onclick = async function(){

       cwg.innerText = "Processing..."
       cwg.disabled = true
        const provider = new GoogleAuthProvider()

         try { 
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();

            const res = await fetch(`${API_BASE}/api/auth/google`, {
                method: "POST",
                credentials:"include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });
            const data = await res.json();
            
            if(data.Success===true){
                SetCookie(data.role).then(result=>{
                    if(result.Success==true){
                     if(data.new==true){
                        
                        localStorage.setItem("new" , "yes-new")
                     }
                    else{
                        localStorage.setItem("new" , "already Updated")
                    }

                    setTimeout(()=>{
                        window.location.href = `/${data.role}`
                        } , 1000)
                    }
                    else{
                        alert("Failed to login")
                    }
                }).catch(e=>{
                      alert("Unexpected Error...")
                      cwg.innerText = "Continue With Google"
                      cwg.disabled = false
                })
               
            }
            else{
                console.log(data)
            }
          
        } catch (e) {
             cwg.innerText = "Continue With Google"
             cwg.disabled = false
            // console.error("Google login error:", e);
            alert("Google login failed. Please try again.");
        }
}

function SetCookie(role){
    return fetch("/set-cookie" , {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({role:role})
    }).then(res=>res.json())
}

function Check_Session(){
    return fetch(`${API_BASE}/api/auth/me` , {
        credentials:"include"
    }).then(res=>res.json())
}


window.addEventListener("DOMContentLoaded" , ()=>{
    Check_Session().then(data=>{
        if(data.Success===true){
            window.location.href = `/${data.data.Role}`
        }
    })
})