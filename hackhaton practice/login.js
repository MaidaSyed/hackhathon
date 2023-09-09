import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"
// import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// const database = getDatabase();

const auth = getAuth();

const loader = document.querySelector(".lds-spinner");
const body = document.querySelector(".spinner-overlay");
function showLoader() {
    loader.style.display = "flex"
    body.style.display = "flex"
}
function hideLoader() {
    loader.style.display = "none"
    body.style.display = "none"
}
hideLoader()

const login = () => {
    let email = document.getElementById("email")
    let password = document.getElementById("password")
    showLoader()
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((resolve) => {
            hideLoader()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Successfully Login',
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(function () {
                window.location.href = "./profile.html"
            }, 1500)

        }).catch((error) => {
            if ((!email.value ||
                !password.value)) {
                Swal.fire('Please fill out  all fields');
            } else {
                const errorMessage = error.message;
                hideLoader();
                let errorText = errorMessage;
                switch (errorMessage) {
                    case 'Firebase: Error (auth/wrong-password).':
                        errorText = 'Wrong password';
                        break;
                    case 'Firebase: Error (auth/user-not-found).':
                        errorText = 'This email has no account';
                        break;
                    default:
                        errorText = 'Something went wrong';
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorText,
                });
            }
        })
}
let login_btn = document.getElementById("login-btn")
login_btn.addEventListener("click", login)




