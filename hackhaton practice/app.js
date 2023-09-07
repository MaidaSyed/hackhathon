import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"
import {getAuth} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"


const db = getDatabase();
const auth = getAuth();

auth.onAuthStateChanged(user => {
    if (user) {
      const userId = auth.currentUser.uid;
      const databaseRef = ref(db, "users/" + userId);

      onValue(databaseRef, (snapshot)=> {
        console.log(snapshot.val());
        let name = document.querySelector(".name")
        name.innerHTML = snapshot.val().name;
    })
    } else {
      console.log('User is signed out.');
    }
  });

const context = document.querySelector(".div")
const listItem = document.querySelector(".listItem")
context.addEventListener("click", () => {
    listItem.classList.toggle("active")
})

const time = new Date();
const hours = time.getHours();
const greet = document.querySelector(".greet");

if (hours >= 0 && hours < 6) {
    greet.innerHTML = `GOOD NIGHT`
}
else if (hours >= 6 && hours < 12) {
    greet.innerHTML = `GOOD MORNING`
}
else if (hours >= 12 && hours < 18) {
    greet.innerHTML = `GOOD NOON`
}
else if (hours >= 18 && hours < 23) {
    greet.innerHTML = `GOOD EVENING`
}

const dbRef = ref(db, "blogs/")
const snapshot = await get(dbRef);
let userArray = []
let userBlogArr = []
let userDate = []
let userName = []
let userUid = []
let userBlogText;
let userBlogTitle;
let userBlogDate;
let blogUserName;
let userUidLink;
snapshot.forEach((user) => {
    userBlogTitle = user.val().title
    userBlogText = user.val().text
    userBlogDate = user.val().date
    blogUserName = user.val().name
    userUidLink = user.val().userId
    // console.log(userData);
    // let userKey = user.key
    // console.log(userKey);
    // userData.address = userKey
    userArray.push(userBlogTitle)
    userBlogArr.push(userBlogText)
    userName.push(blogUserName)
    userDate.push(userBlogDate)
    userUid.push(userUidLink)
})

const blogContainer = document.querySelector(".my-blog");
const addBlog = (title, blog, name, date, link) => {
    const blogDiv = document.createElement("div")
    blogDiv.className = "blogDiv"
    blogDiv.innerHTML = `<h1>${name}</h1>
                        || ${date} <br> 
                        <strong>${title}:</strong> <br> 
                        ${blog} <br>
                        <a href="${link}"> know all fron this user <a>`
    blogContainer.appendChild(blogDiv)
}
for (let i = 0; i < userArray.length; i++) {
    addBlog(userArray[i], userBlogArr[i], userName[i], userDate[i], userUid[i]);
}