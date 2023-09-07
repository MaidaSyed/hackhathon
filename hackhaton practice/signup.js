import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"
import {getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"

const auth = getAuth();

const database = getDatabase()

const signup = () => {
    let username = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password")
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((response) => {
            alert("successfully Signup", response)
            let uniqueId = auth.currentUser.uid
            console.log(uniqueId);
            let userReference = ref(database, "users/" + uniqueId)
            let userObj = {
                name: username.value,
                email: email.value,
                password: password.value

            }
            set(userReference, userObj).then((response)=>{
                alert("Succesfully added data in database", response) 
                window.location.href = "./profile.html"           
            })
        }).catch((reject) => {
            alert(reject)
        })

}
let btn = document.getElementById("signup-btn")
btn.addEventListener("click", signup)