// sign in section
document.getElementById("signInButton").addEventListener("click", () => {
  //   user name
  const userName = document.getElementById("userName");
  const name = userName.value;
  //   password
  const userPassword = document.getElementById("userPassword");
  const password = userPassword.value;

  const invalidUserName = document.getElementById("invalidUserName");
  const invalidPassword = document.getElementById("invalidPassword");

  if (name != "admin") {
    invalidUserName.innerText = "Invalid Username";
    invalidUserName.classList.add("redColor");
    setTimeout(() => {
      invalidUserName.innerText = "Username";
      invalidUserName.classList.remove("redColor");
    }, 2000);
  }
  if (password != "admin123") {
    invalidPassword.innerText = "Invalid Password";
    invalidPassword.classList.add("redColor");
    setTimeout(() => {
      invalidPassword.innerText = "Password";
      invalidPassword.classList.remove("redColor");
    }, 2000);
  }
  //   condition for hidden the section
  if (name === "admin" && password === "admin123") {
    document.getElementById("signInButton").innerText = "Access granted!";
    setTimeout(() => {
      window.location.assign("githubTracker.html");
    }, 2000);
  }
});

// main section
