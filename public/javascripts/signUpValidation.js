const form = document.getElementById("form");
const errMsg = document.getElementById("errMsg");

var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function showError(error) {
  console.log(error);
  errMsg.innerHTML = `<div class="alert alert-warning alert-dismissible fade show py-1 pe-5" role="alert">
    ${error}
    <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

form.onsubmit = () => {
  const name = document.getElementById("name").value;
  const place = document.getElementById("place").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;
  const usname = document.getElementById("usname").value;
  const pword1 = document.getElementById("pword1").value;
  const pword2 = document.getElementById("pword2").value;

  if (
    name === "" ||
    place === "" ||
    age === "" ||
    email === "" ||
    usname === "" ||
    pword1 === "" ||
    pword2 === ""
  ) {
    showError("Make sure you have entered all fields");
    return false;
  } else if (!email.match(mailformat)) {
    showError("You have entered an invalid email address");
    return false;
  } else if (age > 99) {
    showError("Action Restricted :  Age should be below 100");
    return false;
  } else if (pword1.length < 5) {
    showError(
      "Make sure your password contains atleast 5 charecters or numbers"
    );
    return false;
  } else if (pword1.length > 16) {
    showError(
      "Your password is too long make sure it is less than 16 charecters or numbers"
    );
    return false;
  } else if (pword1 !== pword2) {
    showError("Password doesn't match");
    return false;
  } else if (age < 16) {
    showError("Age should be 16 or above");
    return false;
  }
};
