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

const login = async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const data = { email, password };
  try {
    const response = await axios.post("http://localhost:3000/user/login", data);
    createToast(response.data.msg, "green");
  } catch (error) {
    console.log(error);
    if (error.response.status == 404) {
      createToast(error.response.data.msg, "orangered");
    } else if (error.response.status == 401) {
      createToast(error.response.data.msg, "orangered");
    }
  }
};
