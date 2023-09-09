import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"


const db = getDatabase();
const auth = getAuth();
let name = document.querySelector(".name")

auth.onAuthStateChanged(user => {
    if (user) {
        // if (location.pathname !== '/profile.html') {
        // 	location.href = 'profile.html', "index.html";
        // }
        const userId = auth.currentUser.uid;
        const databaseRef = ref(db, "users/" + userId);

        onValue(databaseRef, (snapshot) => {
            console.log(snapshot.val());
            name.innerHTML = snapshot.val().name + " ||";
            name.addEventListener("click", () => {
                window.location.href = "./profile.html"
            })
        })
    } else {
        console.log('User is signed out.');
        //   if (location.pathname !== './index.html') {
        //     location.href = './index.html';
        //   }
    }
});

const loginBtn = document.getElementById('logout');
loginBtn.addEventListener('click', () => {
    window.location.href = "./login.html"
});

const time = new Date();
const hours = time.getHours();
const greet = document.querySelector(".greet");

if (hours >= 0 && hours < 6) {
    greet.innerHTML = `GOOD NIGHT <i class="fa-solid fa-bed"></i>`
}
else if (hours >= 6 && hours < 12) {
    greet.innerHTML = `GOOD MORNING <i class="fa-solid fa-mountain-sun"></i>`
}
else if (hours >= 12 && hours < 18) {
    greet.innerHTML = `GOOD NOON <i class="fa-solid fa-sun"></i>`
}
else if (hours >= 18 && hours < 23) {
    greet.innerHTML = `GOOD EVENING <i class="fa-solid fa-moon"></i>`
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
userArray.reverse();
userBlogArr.reverse();
userName.reverse();
userDate.reverse();
userUid.reverse();

const blogContainer = document.querySelector(".my-blog");
const addBlog = (title, blog, name, date, link) => {
    const blogDiv = document.createElement("div")
    blogDiv.className = "blogDiv"
    const blogDiv1 = document.createElement("div")
    blogDiv1.className = "userName"
    blogDiv1.innerHTML = `<h1>${name} <br><span> || ${date}</span></h1> `
    const blogDiv2 = document.createElement("div")
    blogDiv2.className = "blog"
    blogDiv2.innerHTML = `<strong id="st">${title}:</strong> <br> 
                          <p>${blog}</p> <br>
                          <a href="${link}"> know all fron this user <a>`

    blogDiv.appendChild(blogDiv1)
    blogDiv.appendChild(blogDiv2)
    blogContainer.appendChild(blogDiv)
}
for (let i = 0; i < userArray.length; i++) {
    addBlog(userArray[i], userBlogArr[i], userName[i], userDate[i], userUid[i]);
}