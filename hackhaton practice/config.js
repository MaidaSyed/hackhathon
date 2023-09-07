import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {getDatabase} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANfjrvRfQWBCFU_GTca135U6HeVBRa5Yc",
  authDomain: "hackathon-practice-9d880.firebaseapp.com",
  projectId: "hackathon-practice-9d880",
  storageBucket: "hackathon-practice-9d880.appspot.com",
  messagingSenderId: "380692710313",
  appId: "1:380692710313:web:83339fe0e0c104f7763ab8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  const db = getDatabase(app)

  export {db}