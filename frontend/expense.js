const form = document.querySelector("#form");
const ul = document.querySelector(".list");
const ulOthers = document.querySelector(".list-others");
const goPremium = document.querySelector("#go-premium");
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
let order;

const displayOtherUserExpenses = ({ amount, description, category }) => {
  const li = document.createElement("li");
  li.classList = "list-group-item";
  li.appendChild(
    document.createTextNode(`${amount} ${description} ${category}`)
  );
  ulOthers.insertAdjacentElement("beforeend", li);
};

const getAllUsersExpenses = async (e) => {
  try {
    document.querySelector("#get-all-expenses").classList =
      "btn btn-success disabled";
    const response = await axios.get(
      "http://localhost:3000/premiumUser/getAllExpenses"
    );
    console.log(response.data.expenses);
    const expenses = response.data.expenses;
    console.log(response.data.msg);
    expenses.forEach((expense) => {
      displayOtherUserExpenses(expense);
    });
    ulOthers.insertAdjacentHTML(
      "afterend",
      `<button id="close-all-expenses" class="btn btn-danger">close Expenses</button>`
    );
    document
      .querySelector("#close-all-expenses")
      .addEventListener("click", () => {
        document.querySelector(".list-others").innerHTML = "";
        document.querySelector("#close-all-expenses").remove();
        document.querySelector("#get-all-expenses").classList =
          "btn btn-success";
      });
  } catch (error) {
    console.log(err);
    if (error.response.status == 500) {
      console.log(error.response.data.msg);
    }
  }
};
const premiumFeature = () => {
  goPremium.remove();
  document.querySelector("body").style.backgroundColor = "#222";
  const getAllExpenses = `<button id="get-all-expenses" class="btn btn-success">All Users Expenses</button>`;
  ul.insertAdjacentHTML("afterend", getAllExpenses);
  const btnGetAllExpenses = document.querySelector("#get-all-expenses");
  btnGetAllExpenses.addEventListener("click", getAllUsersExpenses);
};
const verifySignature = async (
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
) => {
  try {
    const data = { razorpay_payment_id, razorpay_order_id, razorpay_signature };
    const respone = await axios.post(
      "http://localhost:3000/razorPay/verifySignature",
      data
    );
    console.log(respone.data.msg);
    document.getElementById("rzp-button1").remove();
    premiumFeature();
  } catch (error) {
    console.log(error);
    if (error.response.status == 400) {
      console.log(error.response.data.msg);
    }
  }
};
const onPay = (e) => {
  var options = {
    key: "rzp_test_LoUvvQ4sZ9FkMo", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Shashanka Inc.",
    description: "Get Premium expense tracker features",
    // image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
      verifySignature(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
    theme: {
      color: "#0a58ca",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });

  rzp1.open();
};

const onGoPremium = async (e) => {
  try {
    const response = await axios.post("http://localhost:3000/razorPay/order");
    order = response.data.order;
    console.log(order);
    goPremium.remove();
    const btnHTML = `<button id="rzp-button1" class="btn btn-success">pay</button>`;
    ul.insertAdjacentHTML("afterend", btnHTML);
    document.getElementById("rzp-button1").addEventListener("click", onPay);
  } catch (error) {
    console.log(error);
  }
};
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
    // console.log(response);//all the expenses
    const premium = await axios.get(
      "http://localhost:3000/premiumUser/isPremium"
    );
    if (premium.data.isPremium) {
      premiumFeature();
    }
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
goPremium.addEventListener("click", onGoPremium);
