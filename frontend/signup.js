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
    console.log(response.data.msg);
    name.value = "";
    email.value = "";
    password.value = "";
  } catch (error) {
    console.log(error);
  }
};
