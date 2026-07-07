const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const total = document.getElementById("total");
const totalSpent=document.getElementById("totalSpent");
const transactionCount=document.getElementById("transactionCount");
const highestExpense=document.getElementById("highestExpense");
const averageExpense=document.getElementById("averageExpense");
const budgetInput=document.getElementById("budgetInput");
const saveBudget=document.getElementById("saveBudget");
const budgetDisplay=document.getElementById("budgetDisplay");
const remainingBudget=document.getElementById("remainingBudget");
const budgetWarning=document.getElementById("budgetWarning");
const categoryFilter=document.getElementById("categoryFilter");
const chartCanvas=document.getElementById("expenseChart");

let budget=Number(localStorage.getItem("budget"))||0;
let expenses = [];
let totalAmount = 0;
let editIndex = -1;
let expenseChart;

// Display one expense on the page
function displayExpense(expense, index) {

    const li = document.createElement("li");

    li.innerHTML = `
        <span>
            <strong>${expense.description}</strong><br>
            ${expense.category} | ${expense.date}
        </span>

        <div>
            <span>₹${expense.amount}</span>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        </div>
    `;

    const editBtn = li.querySelector(".editBtn");
    const deleteBtn = li.querySelector(".deleteBtn");

    editBtn.addEventListener("click", function() {

        description.value=expense.description;
        amount.value = expense.amount;
        category.value = expense.category;
        date.value = expense.date;

        editIndex=index;
        addBtn.textContent= "Update Expenses";

    });

    deleteBtn.addEventListener("click", function () {

        expenses.splice(index, 1);

        localStorage.setItem("expenses", JSON.stringify(expenses));

        loadExpenses();

    });

    expenseList.appendChild(li);
}
function updateDashboard(){
    let total=0;
    let highest=0;

    expenses.forEach(function(expense)
{
    total += expense.amount;
    if(expense.amount>highest)
    {
        highest= expense.amount;
    }
});

    const average=expenses.length>0? (total/expenses.length).toFixed(2):0;
    totalSpent.textContent=`${total}`;
    transactionCount.textContent=expenses.length;
    highestExpense.textContent=`${highest}`;
    averageExpense.textContent=`${average}`;
    budgetDisplay.textContent=`${budget}`;

    const remaining = budget - total;
    remainingBudget.textContent =`${remaining}`;

    if(remaining<0){
        budgetWarning.textContent=`Budget Exceeded by ${Math.abs(remaining)}`;
    }
    else{
        budgetWarning.textContent="";
    }
}

function updateChart(){
    const categoryTotals={};
    expenses.forEach(function(expense){
        if(categoryTotals[expense.category]){
            categoryTotals[expense.category] += Number(expense.amount);
        }
        else{
            categoryTotals[expense.category]=Number(expense.amount);
        }
    });
    const labels= Object.keys(categoryTotals);
    const data=Object.values(categoryTotals);
    if(expenseChart){
        expenseChart.destroy();
    }
    expenseChart=new Chart(chartCanvas,{
        type:"pie",
        data:{
            labels:labels,
            datasets:[{
                data:data
            }]
        }
    });
}

// Load all expenses from Local Storage
function loadExpenses() {

    expenseList.innerHTML = "";

    totalAmount = 0;

    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const selectedCategory=categoryFilter.value;

    expenses.forEach(function (expense, index) {
        if(selectedCategory ==="All" || expense.category===selectedCategory){
                displayExpense(expense,index);
                totalAmount += expense.amount;
            }
    });

    total.textContent = `Total: ₹${totalAmount}`;
    updateDashboard();
    updateChart();
}

// Add a new expense
addBtn.addEventListener("click", function () {

    if (
        description.value === "" ||
        amount.value === "" ||
        category.value === "" ||
        date.value === ""
    ) {
        alert("Please fill all fields!");
        return;
    }

    const expense = {
        description: description.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };

    if(editIndex === -1){
        expenses.push(expense);
    }
    else{
        expenses[editIndex]=expense;
        editIndex= -1;
        addBtn.textContent ="Add Expense";
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));

    loadExpenses();

    description.value = "";
    amount.value = "";
    category.value = "";
    date.value = "";
});

saveBudget.addEventListener("click", function(){
    if(budgetInput.value === ""){
        alert("Please enter a budget");
        return;
    }
    budget=Number(budgetInput.value);
    localStorage.setItem("budget",budget);

    budgetInput.value="";
    updateDashboard();
});

categoryFilter.addEventListener("change",function(){
    loadExpenses();
});

// Load saved expenses when page opens
loadExpenses();