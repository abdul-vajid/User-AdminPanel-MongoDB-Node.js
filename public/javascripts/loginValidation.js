const form = document.getElementById("logform");
const err = document.getElementById("err");

function showError(error) {
  console.log(error);
  err.innerHTML = `<div class="alert alert-warning alert-dismissible fade show py-1 pe-5" role="alert">
    ${error}
    <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

form.onsubmit = () => {
  const uname = document.getElementById("uname").value;
  const pword = document.getElementById("pword").value;

  if (uname === "" && pword === "") {
    showError("Make sure you have entered username and password");
    return false;
  } else if (uname === "" ){
    showError("Username is required");
    return false;
  } else if (pword ==="") {
    showError("Password is required");
    return false;
  } else if (uname.length < 4) {
    showError("Username is too small");
    return false;
  } else if (uname.length > 16) {
    showError("Username is too long");
    return false;
  } else if (pword.length < 4) {
    showError("Password is too small");
    return false;
  } else if (pword.length > 16) {
    showError("Password is too long");
    return false;
  }
};
