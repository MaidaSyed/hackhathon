import { getDatabase, ref, push, get, onValue, update, remove, } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"

import { db } from "./config.js";
const auth = getAuth();
const database = getDatabase()
let userUid;

auth.onAuthStateChanged(user => {
  if (user) {
    userUid = auth.currentUser.uid
    // User is signed in, you can now access the Firebase Realtime Database
    const userId = auth.currentUser.uid;
    const databaseRef = ref(database, "users/" + userId);

    // Example: Fetch data from the Firebase Realtime Database
    onValue(databaseRef, (snapshot) => {
      console.log(snapshot.val());
      let username = document.getElementById("name")
      let name = document.querySelector(".name")
      username.innerHTML = `${snapshot.val().name}`;
      name.innerHTML = snapshot.val().name + " ||";
    })
  } else {
    // User is signed out, handle accordingly
    console.log('User is signed out.');
  }
});

// NAME EDIT FROM PROFILE
const editName = () => {
  const userId = auth.currentUser.uid
  const editBox = document.querySelector(".editName");
  const editBtn = document.getElementById("editName-btn");
  const nameInp = document.getElementById("editedName");
  editBox.classList.add("active")

  const editNameinFirebase = () => {
    const userNameRef = ref(database, "users/" + userId)
    update(userNameRef, {
      name: nameInp.value
    });
  }
  editBtn.addEventListener("click", () => {
    editNameinFirebase()
    editBox.classList.remove("active")
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "none"
  })
}
const edit = document.querySelector(".fa-pen-to-square")
edit.addEventListener("click", () => {
  editName()
  const overlay = document.querySelector(".overlay")
  overlay.style.display = "block"
})
// ======================


const btnPass = document.getElementById("updatePass");

const updatePass = () => {
  const userAuth = auth.currentUser;
  const oldPassInput = document.getElementById('old-pass').value; // Replace with the actual ID of your old password input element
  const newPassInput = document.getElementById('new-pass').value; // Replace with the actual ID of your new password input element

  // Create a credential with the user's email and password
  const credential = firebase.auth.EmailAuthProvider.credential(
    userAuth.email, // Assuming you're using email/password authentication
    oldPassInput
  );

  // Reauthenticate the user
  userAuth.reauthenticateWithCredential(credential)
    .then(() => {
      // Password successfully reauthenticated
      // Now update the password
      userAuth.updatePassword(newPassInput)
        .then(() => {
          console.log("Password updated successfully");
          // Clear input fields
          document.getElementById('old-pass').value = "";
          document.getElementById('new-pass').value = "";
        })
        .catch((error) => {
          console.error("Error updating password:", error);
        });
    })
    .catch((error) => {
      console.error("Reauthentication failed:", error);
    });
};



btnPass.addEventListener("click", updatePass)


const cancel = document.querySelectorAll(".cancel-name");
cancel.forEach(btn => {
  btn.addEventListener("click", () => {
    let delBox = document.querySelector(".editName");
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "none"

    delBox.classList.remove("active")
  })
})

const signoutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("User signout");
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
  window.location.href = "./index.html"
};
const logout = document.getElementById("logout")
logout.addEventListener("click", signoutUser)

const title = document.getElementById("title");
const text = document.getElementById("text");
const addBtn = document.getElementById("add-blog");

const months = [
  "Jan", "Feb", "March", "April", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
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
  onValue(databaseRef, (snapshot) => {
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
let userKey;
const blogContainer = document.querySelector(".blogs");
blogContainer.innerHTML = ""; // Clear the container to remove previously displayed blogs
snapshot.forEach((user) => {
  const blogUid = user.val().userId; // Get the UID associated with each blog
  userKey = user.key
  // console.log(userKey);

  // Check if the blog belongs to the currently logged-in user
  if (blogUid === userUid) {
    const userBlogTitle = user.val().title;
    const userBlogText = user.val().text;
    const userBlogDate = user.val().date;
    const blogUserName = user.val().name;

    const addBlog = (title, blog, name, date) => {
      const blogDiv = document.createElement("div")
      blogDiv.className = "blogDiv"
      const blogDiv1 = document.createElement("div")
      blogDiv1.className = "userName"
      blogDiv1.innerHTML = `<h1>${name} <span> || ${date}</span></h1>`
      const blogDiv2 = document.createElement("div")
      blogDiv2.className = "blog"
      blogDiv2.innerHTML = `<strong id="st">${title}:</strong> <br> 
                            <p>${blog}</p> <br>
                            <button class="edit">EDIT</button> 
                            <button class="delete">DELETE</button> `
      blogDiv.appendChild(blogDiv1)
      blogDiv.appendChild(blogDiv2)
      blogContainer.appendChild(blogDiv)
    };
    addBlog(userBlogTitle, userBlogText, blogUserName, userBlogDate);



  }



});

let editBtn = document.querySelectorAll(".edit");
let delBtn = document.querySelectorAll(".delete");
const UpdateBLogs = () => {
  let blogBox = document.querySelector(".updateBlogs");
  let blogBoxTitle = document.getElementById("updateTitle");
  let blogBoxBLog = document.getElementById("updateBlog");
  const editBlogBtn = document.getElementById("edit-btn");
  blogBox.classList.add("active");


  const updateBlogInFirebase = () => {
    // Get the current blog's unique ID (replace this with your logic)
    const uniqueId = userKey;
    console.log(uniqueId);

    // Create a reference to the blog you want to update
    const blogRef = ref(database, "blogs/" + userKey);

    // Update the blog's title and text
    update(blogRef, {
      title: blogBoxTitle.value,
      text: blogBoxBLog.value,
    });

    // Clear the input fields
    document.getElementById("updateTitle").value = "";
    document.getElementById("updateBlog").value = "";

    // Close the update box or perform any other desired actions
    blogBox.classList.remove("active");
    window.location.reload()
  };

  editBlogBtn.addEventListener("click", updateBlogInFirebase);
};
// Replace "editBtn" with the actual element ID you're using to trigger this function.
editBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    UpdateBLogs()
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "flex"
  });
})

const deleteBlogs = () => {
  let delBox = document.querySelector(".deleteBlogs");
  const delBlogBtn = document.getElementById("del-btn");

  delBox.classList.add("active")

  const delBlogs = () => {
    const uniqueId = userKey;

    // Create a reference to the blog you want to update
    const blogRef = ref(database, "blogs/" + uniqueId);

    // Update the blog's title and text
    remove(blogRef)
      .then(function () {
        console.log("Data deleted successfully!");
        delBox.classList.remove("active")
        window.location.reload()
      })
      .catch(function (error) {
        console.error("Error deleting data: ", error);
      });

  }
  delBlogBtn.addEventListener("click", delBlogs)
  delBox.classList.remove("active");
  window.location.reload()
}
delBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    deleteBlogs()
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "flex"
  })
})



const cancelEdit = document.querySelectorAll(".cancel-blog");
const cancelDel = document.querySelectorAll(".Del-del");

cancelEdit.forEach(btn => {
  btn.addEventListener("click", () => {
    let blogBox = document.querySelector(".updateBlogs");
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "none"

    blogBox.classList.remove("active")
  })
})
cancelDel.forEach(btn => {
  btn.addEventListener("click", () => {
    let delBox = document.querySelector(".deleteBlogs");
    const overlay = document.querySelector(".overlay")
    overlay.style.display = "none"

    delBox.classList.remove("active")
  })
})
