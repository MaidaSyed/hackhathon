import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const database = getDatabase();

const auth = getAuth();

const login = () => {
    let email = document.getElementById("email")
    let password = document.getElementById("password")
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((resolve) => {
            alert("successfully Login", resolve)
            window.location.href = "./profile.html"
            let uniqueId = auth.currentUser.uid
            console.log(uniqueId);
            let userReference = ref(database, "users/" + uniqueId)

            onValue(userReference, (snapshot)=> {
                console.log(snapshot.val());
                // let username = document.getElementById("userName")
                // username.innerHTML = snapshot.val().name;
            })
        }).catch((reject) => {
            alert(reject)
        })
}
let login_btn = document.getElementById("login-btn")
login_btn.addEventListener("click", login)



  
 