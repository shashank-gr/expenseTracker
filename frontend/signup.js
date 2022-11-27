const toast = document.querySelector(".toast");

//creating toastmessage
const createToast = (msg, color) => {
  const div = document.createElement("div");
  div.innerHTML = msg;
  div.style.backgroundColor = color;
  toast.insertAdjacentElement("beforeend", div);
  setTimeout(() => {
    div.remove();
  }, 2000);
};

const resgisterUser = async (e) => {
  e.preventDefault();

  const name = document.querySelector("#userName");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  const data = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      data
    );
    createToast(response.data.msg, "green");
    name.value = "";
    email.value = "";
    password.value = "";
  } catch (error) {
    // console.log(error.response.data);
    console.log(error);
    if (error.response.status == 400) {
      createToast("user already exists", "orangered");
    }
  }
};
