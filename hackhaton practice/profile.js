import {getDatabase, ref, push, get, onValue} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"
import {getAuth} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"

import { db } from "./config.js";
const auth = getAuth();
const database = getDatabase()
let userUid;

const context = document.querySelector(".div")
const listItem = document.querySelector(".listItem")
context.addEventListener("click", () => {
    listItem.classList.toggle("active")
})

auth.onAuthStateChanged(user => {
    if (user) {
      userUid = auth.currentUser.uid
      // User is signed in, you can now access the Firebase Realtime Database
      const userId = auth.currentUser.uid;
      const databaseRef = ref(database, "users/" + userId);

      // Example: Fetch data from the Firebase Realtime Database
      onValue(databaseRef, (snapshot)=> {
        console.log(snapshot.val());
        let username = document.getElementById("name")
        let name = document.querySelector(".name")
        username.innerHTML = snapshot.val().name;
        name.innerHTML = snapshot.val().name;
    })
    } else {
      // User is signed out, handle accordingly
      console.log('User is signed out.');
    }
  });

const title = document.getElementById("title");
const text = document.getElementById("text");
const addBtn = document.getElementById("add-blog");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const date = new Date();
const day = date.getDate();
const year = date.getFullYear();
const monthIndex = date.getMonth();
const monthName = months[monthIndex];

let blogDate = `${day}-${monthName}-${year}`
const sendBlogs = () => {
    const blogTitle = title.value;
    const blogText = text.value;
    let uniqueId = auth.currentUser.uid

    const databaseRef = ref(database, "users/" + uniqueId);
let userName;
    // Example: Fetch data from the Firebase Realtime Database
    onValue(databaseRef, (snapshot)=> {
      console.log(snapshot.val());
      userName = snapshot.val().name
  })

    if (blogTitle && blogText) {
        const blogRef = ref(db, "blogs/", uniqueId)
        push(blogRef, {
            title: blogTitle,
            text: blogText,
            timestamp: new Date().getTime(),
            date: blogDate,
            userId: uniqueId,
            name: userName,
        })
        title.value = ""
        text.value = ""
    }
   
    window.location.reload() 
 }
 addBtn.addEventListener("click", sendBlogs);

const dbRef = ref(db, "blogs/");
const snapshot = await get(dbRef);

const blogContainer = document.querySelector(".blogs");
blogContainer.innerHTML = ""; // Clear the container to remove previously displayed blogs
console.log(userUid);
snapshot.forEach((user) => {
  const blogUid = user.val().userId; // Get the UID associated with each blog
  console.log(blogUid);

  // Check if the blog belongs to the currently logged-in user
  if (blogUid === userUid) {
    const userBlogTitle = user.val().title;
    const userBlogText = user.val().text;
    const userBlogDate = user.val().date;
    const blogUserName = user.val().name;

    const addBlog = (title, blog, name, date) => {
      const blogDiv = document.createElement("div");
      blogDiv.className = "blogDiv";
      blogDiv.innerHTML = `<h1>${name}</h1> || ${date} <br> <strong>${title}:</strong> <br> ${blog}`;
      blogContainer.appendChild(blogDiv);
    };

    addBlog(userBlogTitle, userBlogText, blogUserName, userBlogDate);
  }
});
