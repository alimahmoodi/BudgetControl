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
    let data = {
        descriptions: {
            incomes: [],
            expenses: [],
        },
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
    };
})();

const showInformations = (function () {
    return {
        getInput: function () {
            return {
                type: document.querySelector(".enter-type").value,
                description: document.querySelector(".enter-descreption").value,
                amount: document.querySelector(".enter-value").value,
            };
        },

        addToUI: function (newItem, type) {
            let html, element;
            if (type === "incomes") {
                element = ".income__list";
                html =
                    '<div id="%id%" class="item"><span class="income-title">%description%</span><span class="income-amount">%amount%</span></div>';
            }
            if (type === "expenses") {
                element = ".expences__list";
                html =
                    '<div id="%id%" class="item"><span class="income-title">%description%</span><span class="income-amount">%amount%</span></div>';
            }
            html = html.replace("%id%", newItem.id);
            html = html.replace("%description%", newItem.descreption);
            html = html.replace("%amount%", newItem.amount);
            document.querySelector(element).insertAdjacentHTML("beforeend", html);

            document.querySelector(".enter-type").value = "";
            document.querySelector(".enter-descreption").value = "";
            document.querySelector(".enter-value").value = "";
            document.querySelector(".enter-descreption").focus();
        },
    };
})();

const controlInformation = (function (showInformations, holdInformation) {
    const eventListener = () => {
        document.querySelector(".submit-input").addEventListener("click", addItem);
    };
    const addItem = () => {
        const getInpt = new showInformations.getInput();
        const type = getInpt.type;
        const description = getInpt.description;
        const amount = getInpt.amount;
        if (!isNaN(amount) && description !== "" && amount > 0) {
            const newItem = new holdInformation.addItem(type, description, amount);
            const addToUI = new showInformations.addToUI(newItem, type);
        }
    };

    return {
        init: function () {
            eventListener();
        },
    };
})(showInformations, holdInformation);

controlInformation.init();
