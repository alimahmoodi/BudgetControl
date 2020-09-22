const holdInformation = (function () {
    const Incomes = function (id, descreption, amount) {
        this.id = id;
        this.descreption = descreption;
        this.amount = amount;
    };

    const Expenses = function (id, descreption, amount) {
        this.id = id;
        this.descreption = descreption;
        this.amount = amount;
    };
    const calculateTotal = function (type) {
        let sum = 0;
        data.descriptions[type].forEach((current) => {
            sum += current.amount;
        });
        data.total[type] = sum;
    };

    let data = {
        descriptions: {
            incomes: [],
            expenses: [],
        },
        total: {
            incomes: 0,
            expenses: 0,
        },
        budget: 0,
    };

    return {
        addItem: function (type, description, amount) {
            let newItem, id;
            if (data.descriptions[type].length > 0) {
                id = data.descriptions[type][data.descriptions[type].length - 1].id + 1;
                console.log(id);
            } else id = 0;

            if (type === "incomes") {
                newItem = new Incomes(id, description, amount);
            }
            if (type === "expenses") {
                newItem = new Expenses(id, description, amount);
            }

            data.descriptions[type].push(newItem);
            return newItem;
        },
        deleteItem: function (type, id) {
            const index = data.descriptions[type].findIndex((item) => item.id === parseInt(id));

            console.log(index);
            // console.log(data);
            data.descriptions[type].splice(index, 1);
        },
        calculateBudget: function () {
            calculateTotal("incomes");
            calculateTotal("expenses");
            data.budget = data.total.incomes - data.total.expenses;
        },
        getBudget: function () {
            return {
                totalBudget: data.budget,
                totalIncomes: data.total.incomes,
                totalExpenses: data.total.expenses,
            };
        },
    };
})();

const showInformations = (function () {
    return {
        getInput: function () {
            return {
                type: document.querySelector(".enter-type").value,
                description: document.querySelector(".enter-descreption").value,
                amount: parseFloat(document.querySelector(".enter-value").value),
            };
        },

        addToUI: function (newItem, type) {
            let html, element;
            if (type === "incomes") {
                element = ".income__list";
                html =
                    '<div id="%id%" class="item"><span class="income-title">%description%</span><span class="income-amount">%amount%</span><img src="./close-red.svg" alt="close" class="item-delete" /></div>';
            }
            if (type === "expenses") {
                element = ".expenses__list";
                html =
                    '<div id="%id%" class="item"><span class="income-title">%description%</span><span class="income-amount">%amount%</span><img src="./close-red.svg" alt="close" class="item-delete" /></div>';
            }
            html = html.replace("%id%", newItem.id);
            html = html.replace("%description%", newItem.descreption);
            html = html.replace("%amount%", newItem.amount);

            document.querySelector(element).insertAdjacentHTML("beforeend", html);

            document.querySelector(".enter-descreption").value = "";
            document.querySelector(".enter-value").value = "";
            document.querySelector(".enter-descreption").focus();
        },

        displayBudget: function (budget) {
            document.querySelector(".balance").innerHTML = budget.totalBudget;
            document.querySelector(".total-expenses").innerHTML = budget.totalExpenses;
            document.querySelector(".total-incomes").innerHTML = budget.totalIncomes;
        },
    };
})();

const controlInformation = (function (showInformations, holdInformation) {
    const eventListener = () => {
        document.querySelector(".submit-input").addEventListener("click", addItem);
        document.querySelector(".income__list").addEventListener("click", deleteItem);
        document.querySelector(".expenses__list").addEventListener("click", deleteItem);
    };
    const updateBudget = function () {
        holdInformation.calculateBudget();
        const budgets = holdInformation.getBudget();
        showInformations.displayBudget(budgets);
    };
    const addItem = () => {
        const getInpt = new showInformations.getInput();
        const type = getInpt.type;
        const description = getInpt.description;
        const amount = getInpt.amount;
        if (!isNaN(amount) && description !== "" && amount > 0) {
            const newItem = new holdInformation.addItem(type, description, amount);
            const addToUI = new showInformations.addToUI(newItem, type);
            updateBudget();
        }
    };

    const deleteItem = (e) => {
        console.log(e);
        const item = e.target;
        // console.log(e.target.parentNode.parentNode.classList[0], e.target.parentNode.id);
        const type = e.target.parentNode.parentNode.classList[0];
        const id = e.target.parentNode.id;
        if (item.classList[0] === "item-delete") {
            holdInformation.deleteItem(type, id);
            item.parentElement.remove();
            updateBudget();
        }
    };

    return {
        init: function () {
            eventListener();
            showInformations.displayBudget({
                totalBudget: 0,
                totalExpenses: 0,
                totalIncomes: 0,
            });
        },
    };
})(showInformations, holdInformation);

controlInformation.init();
