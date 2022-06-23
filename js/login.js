// ***************************************Constructor de usuarios nuevos**********************************

class User {
  constructor(user, mail, password) {
    this.user = user;
    this.mail = mail;
    this.password = password;
    this.logged = false;
  };
};

// ********************Funcion para cargar loggedUser en caso de borrado de memoria o abrir pagina por primera vez*********************

window.onload = load();
function load() {
  if (JSON.parse(localStorage.getItem("loggedUser"))) {
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser.logged == true) {
      document.getElementById("LogInUser").value = "";
      document.getElementById("LogInPass").value = "";
      logUserDiv.innerHTML = "";
      let welcomeUserDiv = document.getElementById("welcomeUser");
      let welcomeUser = document.createElement("div");
      welcomeUser.classList = "d-flex";
      welcomeUser.innerHTML = `
  <p class="welcomeTxt">
    Bienvenido ${loggedUser.user}
  </p>
  <a class="nav-link dropdown-toggle d-flex align-items-center welcomeUserDrop" href="#" id="dropdownMenuClickableInside"
  data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" role="button"
  data-bs-toggle="dropdown" aria-expanded="false">
  </a>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuClickableInside" >
    <li><a href="" onclick="logOut()" class="logOutTxt"> Cerrar Sesión </a></li>
  </ul>`;
      welcomeUserDiv.appendChild(welcomeUser);
    };
  } else {
    let loggedUser = { user: "loggedUser", mail: null, password: null, logged: false };
    let loggedUserString = JSON.stringify(loggedUser);
    localStorage.setItem("loggedUser", loggedUserString);
  };
};

// ***************************************Funciones para manejar login**********************************

//Funcion para iniciar sesion con usuario previamente gurdado en local storage
function logIn() {
  let logPassDiv = document.getElementById("logPassDiv");
  let logUserDiv = document.getElementById("logUserDiv");
  let passError = document.createElement("p");
  logUserDiv.innerHTML = "";
  logPassDiv.innerHTML = "";
  passError.innerHTML = `No existe ese usuario`;
  passError.classList = "errorTxt";
  logUserDiv.appendChild(passError);
  let loginUser = document.getElementById("LogInUser").value;
  let loginPass = document.getElementById("LogInPass").value;
  logUser = JSON.parse(localStorage.getItem(loginUser));
  let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (loggedUser.logged == true) {
    logUserDiv.innerHTML = "";
    passError.innerHTML = "Ya tiene una sesion iniciada";
    passError.classList = "errorTxt";
    logUserDiv.appendChild(passError);
  }
  else {
    if (logUser.user === loginUser && logUser.password === loginPass) {
      let loggedUserString = localStorage.getItem("loggedUser");
      let loggedUser = JSON.parse(loggedUserString);
      logUser.logged = true;
      loggedUser = logUser;
      let logUserString = JSON.stringify(logUser);
      loggedUserString = logUserString;
      localStorage.setItem("loggedUser", loggedUserString);
      Swal.fire({
        title: 'Felicitaciones',
        text: 'Ha iniciado sesión correctamente',
        icon: 'success',
        confirmButtonText: 'Entendido'
      });
      localStorage.setItem(logUser.user, logUserString);
      document.getElementById("LogInUser").value = "";
      document.getElementById("LogInPass").value = "";
      logUserDiv.innerHTML = "";
      let welcomeUserDiv = document.getElementById("welcomeUser");
      let welcomeUser = document.createElement("div");
      welcomeUser.classList = "d-flex";
      welcomeUser.innerHTML = `
    <p class="welcomeTxt">
    Bienvenido ${loggedUser.user}
  </p>
  <a class="nav-link dropdown-toggle d-flex align-items-center welcomeUserDrop" href="#" id="dropdownMenuClickableInside"
  data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" role="button"
  data-bs-toggle="dropdown" aria-expanded="false">
  </a>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuClickableInside" >
    <li><a href="" onclick="logOut()" class="logOutTxt"> Cerrar Sesión </a></li>
  </ul>`;
      welcomeUserDiv.appendChild(welcomeUser);
      showCart();

      document.getElementById('dropdownMenuClickableInside').click();
    }
    else if (logUser.user === loginUser && logUser.password != loginPass) {
      logPassDiv.innerHTML = "";
      logPassDiv = document.getElementById("logPassDiv");
      let passError = document.createElement("p");
      passError.classList = "errorTxt";
      passError.innerHTML = `Contraseña Incorrecta`;
      logPassDiv.appendChild(passError);
      logUserDiv.innerHTML = "";
    };
  };
};
//Funcion para finalizar sesion
function logOut() {
  let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  loggedUser.logged = false;
  localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
  let logUser = JSON.parse(localStorage.getItem(loggedUser.user));
  logUser.logged = false;
  localStorage.setItem(logUser.user, JSON.stringify(logUser));
  let welcomeUserDiv = document.getElementById("welcomeUser");
  welcomeUserDiv.innerHTML = ``;
}
//Funcion para generar usuario nuevo y guardarlo en el local storage
function newUser() {
  ;
  let user = document.getElementById("signUser").value;
  let mail = document.getElementById("signMail").value;
  let password = document.getElementById("signPass").value;
  let passwordCheck = document.getElementById("signPassCheck").value;
  let divUser = document.getElementById("divUser");
  let divPass = document.getElementById("divPass");
  let succesSignDiv = document.getElementById("succesSignIn");
  divPass.innerHTML = ``;
  divUser.innerHTML = ``;
  let test = localStorage.getItem(user);
  if (test) {
    let passError = document.createElement("p");
    passError.classList = "errorTxt";
    passError.innerHTML = `El usuario ya existe`;
    divUser.appendChild(passError);
  } else if (password.length >= 8 && password == passwordCheck) {
    let newUser = new User(user, mail, password);
    document.getElementById("signUser").value = "";
    document.getElementById("signMail").value = "";
    document.getElementById("signPass").value = "";
    document.getElementById("signPassCheck").value = "";
    let stringNewUser = JSON.stringify(newUser);
    localStorage.setItem(newUser.user, stringNewUser);
    let succesSign = document.createElement("p");
    succesSignDiv.innerHTML = "";
    succesSign.innerHTML = `Usuario Registrado Correctamente`;
    Swal.fire({
      title: 'Felicitaciones',
      text: 'Usuario creado exitosamente',
      icon: 'success',
      confirmButtonText: 'Entendido'
    });
    succesSignDiv.appendChild(succesSign);
  } else if (password.length < 8) {
    let passError = document.createElement("p");
    passError.innerHTML = `La contraseña debe contener al menos 8 caracteres`;
    divPass.appendChild(passError);
  } else {
    let passError = document.createElement("p");
    passError.innerHTML = `Las contraseñas no coinciden`;
    divPass.appendChild(passError);
  };
};
//Funciones para borrar mensajes
function closeSignIn() {
  let succesSignDiv = document.getElementById("succesSignIn");
  succesSignDiv.innerHTML = "";
  let divPass = document.getElementById("divPass");
  divPass.innerHTML = ``;
};
function closeLogIn() {
  let logPassDiv = document.getElementById("logPassDiv");
  logPassDiv.innerHTML = "";
  document.getElementById("LogInUser").value = null;
  document.getElementById("LogInPass").value = null;
};

// ***************************************Event listeners**********************************

// Event listener para activar funcion log in con un enter desde menu desplegable correspondiente
let enterLogIn = document.getElementById("enterLogIn");
enterLogIn.addEventListener("keypress", function (event) {
  event.key === "Enter" && logIn();
});
// Event listener para que funcione el boton de logIn
let logButton = document.getElementById("logButton");
logButton.addEventListener("click", function () {
  logIn();
});
closeLogIn = document.getElementsByClassName("closeLogIn");
closeLogIn[0].addEventListener("onblur", function () {
  closeLogIn();
});
// Event listener para activar funcion sign in con un enter desde menu desplegable correspondiente
let enterSignIn = document.getElementById("enterSignIn");
enterSignIn.addEventListener("keypress", function (event) {
  event.key === "Enter" && newUser();
});
// Event listener para que funcione el boton de signIn
let signButton = document.getElementById("signButton");
logButton.addEventListener("click", function () {
  newUser();
});
logButton.addEventListener("onblur", function () {
  closeSignIn();
});