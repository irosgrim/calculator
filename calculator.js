class Calculator {
  constructor() {
    this.history = [];
    this.input = [];
  }
  opPrecedence (operator) {
    //PEMDAS
    return {
      "*": 4,
      "/": 3,
      "+": 2,
      "-": 1,
    }[operator] || 0;
  }

  toPostfix () {
    const queue = [];
    const stack = [];
    for (const op of this.input) {
      if (!isNaN(op)) {
        queue.push(op);
      } else {
        while (stack.length > 0 && this.opPrecedence (stack[stack.length - 1]) >= this.opPrecedence(op)) {
          queue.push(stack.pop())
        }
        stack.push(op);
      }
    }
    while (stack.length > 0) {
      queue.push(stack.pop());
    }
    return queue;
  }

  evaluatePostfix (postfix) {
    const stack = [];
    let prevOperator = "";
    for (const op of postfix) {
      if (!isNaN(op)) {
        stack.push(op);
      } else {
        const b = stack.pop();
        const a = stack.pop();

        switch (op) {
          case "*":
            stack.push(a * b);
            prevOperator = op;
            break;
          case "/":
            stack.push(a / b);
            prevOperator = op;
            break;
          case "+":
            stack.push(a + b);
            prevOperator = op;
            break;
          case "-":
            stack.push(a - b);
            prevOperator = op;
            break;
        }
      }
    }
    return stack[0];
  }

  result () {
    const postfix = this.toPostfix();
    const res = this.evaluatePostfix(postfix);

    console.log("Evaluating: ", this.input);
    console.log("Postfix: ", postfix);
    console.log("Result: ", res);
    this.input = [res];
    return res;

  }
};

const createExpression = (str, op) => {
  const OPERATORS = "*/+-%.";
  if(OPERATORS.includes(op) && OPERATORS.includes(str[str.length-1])) {
    return str.substring(0, str.length - 1) + op;
  }
  return str += op;
}

document.addEventListener("DOMContentLoaded", () => {
  const keyboard = document.getElementById("keyboard");
  const expressionDisplay = document.getElementById("expression");
  const display = document.getElementById("display");
  const calculator = new Calculator();

  let temp = "";
  keyboard.addEventListener("click", (e) => {
    const btnValue = e.target.dataset.calcBtn;
    if (btnValue && !"c=%".includes(btnValue)) {
      temp = createExpression(temp, btnValue);
      calculator.input = (temp.match(/\d+(\.\d+)?|[+\-*/%^]/g) || []).map(v => !isNaN(v) ? Number(v): v);
      expressionDisplay.innerText = temp;
    } else {
      switch (btnValue) {
        case "%":
          if (calculator.input.length >= 2) {
            const [first, op, number] = calculator.input.slice(calculator.input.length - 3, calculator.input.length);
            calculator.input[calculator.input.length - 1] = first * number/100;
          }
          if (calculator.input.length === 1) {
            calculator.input[0] = calculator.input[0]/100;
          }
          temp = calculator.input.join("");
          expressionDisplay.innerText = temp;
          display.innerText = calculator.result().toLocaleString();
          break;
          case "=":
            const fontSizes = [
                {start: 0, end: 10, fontSize: "1.8rem"},
                {start: 10, end: 15, fontSize: "1.2rem"},
                {start: 20, end: 30, fontSize: "0.8rem"},
              ];

            let length = calculator.result().toLocaleString().length;
            display.style.fontSize = fontSizes.filter(item => (item.start <= length && item.end > length))[0].fontSize;
            display.innerText = calculator.result().toLocaleString();
            temp = calculator.input.join("");
            expressionDisplay.innerText = "";
          break;
        case "c":
          calculator.history.push(temp);
          temp = "";
          calculator.input = [];
          expressionDisplay.innerText = temp;
          display.innerText = 0;
          break;
      }
    }
  })
})