const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

const historyList = document.getElementById("historyList");
let history = [];

let expression = "";

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (value === "C") {
            expression = "";
            display.value = "";
        } 
        else if (value === "=") {
            try {
                const result = evaluateExpression(expression);

                //  Save history
                const entry = `${expression} = ${result}`;
                if (result !== undefined) {
                    history.push(entry);
                }

                updateHistory();
                
                display.value = result;
                expression = result.toString();

            } catch {
                display.value = "Error";
                expression = "";
            }
        }
        else {
            const lastChar = expression.slice(-1);

            if ("+-*/".includes(value) && "+-*/".includes(lastChar)) {
                return; // prevent invalid input
            }

            expression += value;
            display.value = expression;
        }
    });
});


document.addEventListener("keydown", (e) => {
    const key = e.key;

    if ("0123456789+-*/.".includes(key)) {
        expression += key;
        display.value = expression;
    } 
    else if (key === "Enter") {
       const result = evaluateExpression(expression);

                //  Save history
                const entry = `${expression} = ${result}`;
                if (result !== undefined) {
                    history.push(entry);
                }

                updateHistory();

                display.value = result;
                expression = result.toString();9
    } 
    else if (key === "Backspace") {
        expression = expression.slice(0, -1);
        display.value = expression;
    } 
    else if (key === "Escape") {
        expression = "";
        display.value = "";
    }
});

function tokenize(expr) {
    return expr.match(/(\d+|\+|\-|\*|\/)/g);
}


function evaluateExpression(expr) {
    let tokens = tokenize(expr);

    //  Step 1: Handle * and /
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "*" || tokens[i] === "/") {
            let result;

            if (tokens[i] === "*") {
                result = Number(tokens[i - 1]) * Number(tokens[i + 1]);
            } else {
                result = Number(tokens[i - 1]) / Number(tokens[i + 1]);
            }

            tokens.splice(i - 1, 3, result.toString());
            i--; // adjust index
        }
    }

    // Step 2: Handle + and -
    let result = Number(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === "+") {
            result += Number(tokens[i + 1]);
        } else {
            result -= Number(tokens[i + 1]);
        }
    }

    return result;
}

function updateHistory() {
    historyList.innerHTML = "";

    history.slice().reverse().forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}