import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"
import {getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'

const auth = getAuth();
const database = getDatabase();
// const Swal = require('sweetalert2');

const loader = document.querySelector(".lds-spinner");
const body = document.querySelector(".spinner-overlay");

function showLoader() {
    loader.style.display= "flex"
    body.style.display= "flex"
}
function hideLoader() {
    loader.style.display= "none"
    body.style.display= "none"
}
hideLoader()
const signup = () => {
    let username = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password")
    
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((response) => {

            let uniqueId = auth.currentUser.uid
            let userReference = ref(database, "users/" + uniqueId)

            let userObj = {
                name: username.value,
                email: email.value,
                password: password.value

            }
            showLoader()
            async function createUserAndRedirect() {
                try {
                    await set(userReference, userObj); // Wait for data to be set
            
                    hideLoader();
            
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'User has been created',
                        showConfirmButton: false,
                        timer: 1500,
                    });
            
                    // Wait for 1 second before redirecting
                    await new Promise(resolve => setTimeout(resolve, 500));
            
                    location.href = 'profile.html';
                    
                }catch (error) {
                    hideLoader();
                    console.error("Error adding user data:", error);
                    // Handle error here if needed
                }
            }
            
            // Call the function to start the process
            createUserAndRedirect();
               
                   
        }).catch((error) => {
            if ((!username.value ||
                !email.value ||
                !password.value)) {
                Swal.fire('Please fill out  all fields');
            } else{
			const errorMessage = error.message;
			hideLoader();
			let errorText = errorMessage;
			switch (errorMessage) {
				case 'Firebase: Error (auth/invalid-email).':
					errorText = 'Invalid Email';
					break;
				case 'Firebase: Error (auth/email-already-in-use).':
					errorText = 'This email is already in use. Try different';
					break;
				default:
					errorText = 'Something went wrong';
			}
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorText,
			});
        }})
    }
let btn = document.getElementById("signup-btn")
btn.addEventListener("click", signup)