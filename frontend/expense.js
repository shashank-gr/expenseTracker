const form = document.querySelector("#form");
const ul = document.querySelector(".list");
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

const onClick = async (e) => {
  if (e.target.classList == "btn btn-danger float-end") {
    // console.log(e.target.parentElement);
    const id = e.target.parentElement.querySelector(".user-id").value;
    try {
      const respone = await axios.delete(
        `http://localhost:3000/expense/deleteExpense/${id}`
      );

      if (respone.status == 200) {
        e.target.parentElement.remove();
        console.log(respone.data.msg);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 500) {
        console.log(error.response.data.msg);
      }
    }
  }
};
const displayExpense = ({ id, amount, description, category }) => {
  const li = document.createElement("li");
  const btnDel = document.createElement("button");
  const btnEdit = document.createElement("button");
  const input = document.createElement("input");
  input.className = "user-id";
  input.type = "hidden";
  input.value = id;
  btnDel.className = "btn btn-danger float-end";
  btnEdit.className = "btn btn-light float-end";
  btnEdit.textContent = "Edit";
  btnDel.textContent = "Delete";

  li.classList = "list-group-item";
  li.appendChild(
    document.createTextNode(`${amount} ${description} ${category}`)
  );
  li.insertAdjacentElement("beforeend", btnDel);
  li.insertAdjacentElement("beforeend", btnEdit);
  li.insertAdjacentElement("beforeend", input);
  ul.insertAdjacentElement("beforeend", li);
};
const onSubmit = async (e) => {
  e.preventDefault();

  const expenseAmount = document.querySelector("#amount");
  const expenseDetails = document.querySelector("#details");
  const expenseCategory = document.querySelector("#category");
  const data = {
    amount: expenseAmount.value,
    description: expenseDetails.value,
    category: expenseCategory.value,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/expense/addexpense",
      data
    );
    console.log(response.data);
    displayExpense(response.data.expense);
  } catch (error) {
    console.log(error);
    if (error.response.status == 500) {
      console.log(error.response.data.msg);
    }
  }
};

const fetchAllExpenses = async () => {
  try {
    // const headers = { authorization: localStorage.getItem("token") };
    const response = await axios.get(
      "http://localhost:3000/expense/getExpense"
    );
    console.log(response);
    response.data.expenses.forEach((expense) => {
      displayExpense(expense);
    });
    console.log(response.data.msg);
  } catch (error) {
    console.log(error);
    if (error.response.status == 500) {
      console.log(error.response.data.msg);
    }
  }
};
form.addEventListener("submit", onSubmit);
document.addEventListener("DOMContentLoaded", fetchAllExpenses);
ul.addEventListener("click", onClick);
