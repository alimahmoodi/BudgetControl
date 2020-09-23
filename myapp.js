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
    const formatNumber = (num, type) => {
        let float, int, splitNum;
        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split(".");
        int = splitNum[0];
        float = splitNum[1];
        let intArr = [...int];
        let leng = intArr.length;
        for (let i = 0; i < int.length / 3; i++) {
            intArr.splice(leng - 3 * i, 0, ",");
        }

        intArr.pop();
        joinedTest = intArr.join("");
        joinedTest = joinedTest + "." + float;

        if (joinedTest == "0.00") {
            return "" + int;
        } else return (type === "incomes" ? "+" : "-") + " " + joinedTest;
    };
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
                    '<div id="%id%" class="item"><span class="income-title">%description%</span><span class="expenses-amount">%amount%</span><img src="./close-red.svg" alt="close" class="item-delete" /></div>';
            }
            html = html.replace("%id%", newItem.id);
            html = html.replace("%description%", newItem.descreption);
            html = html.replace("%amount%", formatNumber(newItem.amount, type));

            document.querySelector(element).insertAdjacentHTML("beforeend", html);

            document.querySelector(".enter-descreption").value = "";
            document.querySelector(".enter-value").value = "";
            document.querySelector(".enter-descreption").focus();
        },

        displayBudget: function (budget) {
            let type;
            if (budget.totalBudget < 0) type = "expenses";
            else type = "incomes";

            document.querySelector(".balance").innerHTML = formatNumber(budget.totalBudget, type);
            document.querySelector(".total-expenses").innerHTML = formatNumber(
                budget.totalExpenses,
                "expenses"
            );
            document.querySelector(".total-incomes").innerHTML = formatNumber(
                budget.totalIncomes,
                "incomes"
            );
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
        const item = e.target;
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
