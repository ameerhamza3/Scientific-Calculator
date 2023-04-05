let infixStack_ = [];
let tempStack = [];
let postfixStack = [];
let history = [];
let inputExpression = "";
let tempExpression = "";
const constants = {
  pi: 3.1415,
  e: 2.7182,
};
let numericalOperands= {};

const isOperator = (x) => ("-+*/^()sincostanSqrt".includes(x) ? 1 : 0);

const isSingleOperandOperator = (operator) =>
  ["sin", "cos", "tan", "Sqrt"].indexOf(operator) !== -1;

const returnPrecedence = (x) => {
  switch (x) {
    case "+":
      return 1;
    case "-":
      return 1;
    case "*":
      return 2;
    case "/":
      return 2;
    case "^":
      return 3;
    case "sin":
    case "cos":
    case "tan":
    case "Sqrt":
      return 4;
  }
};

const evaluate = (operand1, operand2, operator) => {
  console.log("operand1,operand2,operator" + operand1, operand2, operator);
  switch (operator) {
    case "+":
      return parseFloat(operand1) + parseFloat(operand2);
    case "-":
      return parseFloat(operand1) - parseFloat(operand2);
    case "/":
      return parseFloat(operand1) / parseFloat(operand2);
    case "*":
      return parseFloat(operand1) * parseFloat(operand2);
    case "^":
      let result = 1;
      for (let i = 0; i < parseFloat(operand2); i++) {
        result *= parseFloat(operand1);
      }
      return result;
    case "sin":
      return Math.sin(operand2);
    case "cos":
      return Math.cos(operand2);
    case "tan":
      return Math.tan(operand2);
    case "Sqrt":
      return Math.sqrt(operand2);
  }
};
const displayOutput = () => {
  $("#output-text").val("");
  if (inputExpression.length <= 30) {
    $("#output-text").val(inputExpression);
  } else {
    $("#output-text").val(
      inputExpression.slice(inputExpression.length - 15, inputExpression.length)
    );
  }
};

  const clearAll = (x) => {
  inputExpression = "";
  postfixStack = [];
  displayOutput();
}
  const clearLastChar= (x) => {
  inputExpression = inputExpression.substring(0, inputExpression.length - 1);
  displayOutput();
}

$("#output-text").on("keyup", function (e) {
  var value = $(this).val();

  const evaluatedInputExpression = value.replace(/[a-z]+/g, (match) => {
    if (match in constants) {
      return constants[match];
    } else if (match in numericalOperands) {
      return numericalOperands[match];
    } else {
      return match;
    }
  });

  inputExpression = evaluatedInputExpression;
});

$(".flex-wrapper").on("click", function (e) {
  console.log(e.type);

  var idClicked = e.target.id;
  var value = $("#" + idClicked).attr("value");

  if (value == "=" || value == "AC" || value == "CE") {
    calculate(value);
  } else {
    inputExpression += value;
    displayOutput();
  }
});

const calculate = (value) => {
  switch (value) {
    case "=":
      evaluateExpression();
      break;
    case "AC":
      clearAll();
      break;
    case "CE":
      clearLastChar();
      break;
  }
};

const evaluateExpression = () => {
  var result = "";

  if (
    inputExpression[inputExpression.length - 1] == "." ||
    inputExpression.length == 0
  ) {
    result = 0;
  } else {
    var infixStack = parseInfix();
    var postfixStack = convertToPostfix(infixStack);
    result = evaluatePostfix(postfixStack);

    result = Math.round(result * 10000) / 10000;

    if (isNaN(result)) {
      alert(`Syntax Error!!!.`);
      return;
    }
    history.push(result);
    updateHistory();
  }

  $("#output-text1").val(result);
  if (isFinite(result)) {
    infixStack_ = [];
    stack = [];
    stack.push(result);
  } else {
    infixStack_ = [];
    stack = [];
  }
};

const parseInfix = () => {
  var infixStack_ = [];
  for (var i = 0; i < inputExpression.length; i++) {
    var possible_op = inputExpression[i];
    console.log(inputExpression[i]);

    if ("s" == possible_op) {
      possible_op = "sin";
      console.log(possible_op);
      i += 2;
    } else if ("c" == possible_op) {
      possible_op = "cos";
      i += 2;
    } else if ("t" == possible_op) {
      possible_op = "tan";
      i += 2;
    } else if ("S" == possible_op) {
      possible_op = "Sqrt";
      i += 3;
    }

    if (!isOperator(possible_op)) {
      tempExpression = tempExpression + possible_op;
    } else {
      infixStack_.push(parseFloat(tempExpression));
      console.log(possible_op);
      infixStack_.push(possible_op);
      tempExpression = "";
    }
  }
  infixStack_.push(parseFloat(tempExpression));
  return infixStack_.filter((value) => !Number.isNaN(value));
};

const convertToPostfix = (infixStack) => {
  var postfixStack = [];
  var tempStack = [];

  for (var i = 0; i < infixStack.length; i++) {
    if (
      !isOperator(infixStack[i]) &&
      infixStack[i] !== "(" &&
      infixStack[i] !== ")"
    ) {
      postfixStack.push(infixStack[i]);
    } else if (infixStack[i] === "(") {
      tempStack.push(infixStack[i]);
    } else if (infixStack[i] === ")") {
      while (tempStack[tempStack.length - 1] !== "(") {
        postfixStack.push(tempStack.pop());
      }
      tempStack.pop();
    } else {
      if (
        tempStack.length == 0 ||
        returnPrecedence(infixStack[i]) >
          returnPrecedence(tempStack[tempStack.length - 1])
      ) {
        tempStack.push(infixStack[i]);
      } else if (
        infixStack[i] === "sin" ||
        infixStack[i] === "cos" ||
        infixStack[i] === "tan"
      ) {
        postfixStack.push(infixStack[i]);
      } else {
        while (
          tempStack.length > 0 &&
          returnPrecedence(infixStack[i]) <=
            returnPrecedence(tempStack[tempStack.length - 1])
        ) {
          postfixStack.push(tempStack.pop());
        }
        tempStack.push(infixStack[i]);
        tempStack.push(infixStack[i]);
      }
    }
  }

  while (tempStack.length > 0) {
    postfixStack.push(tempStack.pop());
  }
  return postfixStack;
};
const evaluatePostfix = (postfixStack) => {
  var evaluatingStack = [];

  for (var i = 0; i < postfixStack.length; i++) {
    if (!isOperator(postfixStack[i])) {
      evaluatingStack.push(parseFloat(postfixStack[i]));
    } else {
      var operator = postfixStack[i];
      var operand2 = evaluatingStack.pop();
      var operand1 = isSingleOperandOperator(operator)
        ? null
        : evaluatingStack.pop();
      var res = evaluate(operand1, operand2, operator);
      evaluatingStack.push(res);
    }
  }

  return evaluatingStack.pop();
};

const addvariable= () => {
  const variableNameInput = document.getElementById("variable-name");
  const variableValueInput = document.getElementById("variable-value");
  const variableName = variableNameInput.value;
  const variableValue = parseFloat(variableValueInput.value);

  if (variableName in constants) {
    alert(
      `"${variableName}" is a constant and cannot be used as a variablename.`
    );
    return;
  }
  if (variableName in numericalOperands) {
    alert(`variable"${variableName}" already exists.`);
    return;
  }

  numericalOperands[variableName] = variableValue;
  console.log(numericalOperands);

  alert(`variable"${variableName}" added with value ${variableValue}.`);
};

const updateHistory = () => {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";
  for (let i = 0; i < history.length; i++) {
    const item = document.createElement("li");
    item.textContent = history[i];
    item.addEventListener("click", () => {
      history.splice(i, 1);
      updateHistory();
    });
    historyList.appendChild(item);
  }
};
