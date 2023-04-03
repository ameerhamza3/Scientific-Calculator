var hasPointer = false;
var num = "";
var stack = [];
var infixStack_New = [];
var prevValue = "";
var display = "";
var tempStack = [];
var postfixString = "";
var postfixStack = [];
var exp = "";
var output = [];
var count = 0;

let history = [];

const constants = {
	pi: 3.1415,
	e: 2.7182
};
let variables = {};

function isOperator(x) {

	if (x == "-" || x == "+" || x == "*" || x == "/" || x == "^" || x == "(" || x == ')' || x == 'sin' || x == 'cos' || x == 'tan' || x == 'Sqrt') {
		return 1;
	}
	else return 0;
}
function isBracket(x) {
	if (x == "(" || x == ")") {
		return 1;
	}
	else return 0;
}

function isEquals(x) {
	if (x == "=") {
		return 1;
	}
	else return 0;
}

function isNumber(x) {
	if (x == "1" || x == "2" || x == "3" || x == "4" || x == "5" || x == "6" || x == "7" || x == "8" || x == "9" || x == "0") {
		return 1;
	}
	else return 0;
}

function IsMultiplyOrDivide(x) {
	if (x == "/" || x == "X") {
		return true;
	}
	else {
		return false;
	}
}
function isSingleOperandOperator(operator) {
	return ['sin', 'cos', 'tan', 'Sqrt'].indexOf(operator) !== -1;
}
function returnPrecedence(x) {
	switch (x) {
		case "+":
			return 1;
			break;
		case "-":
			return 1;
			break;
		case "*":
			return 2;
			break;
		case "/":
			return 2;
			break;
		case "^":
			return 3;
			break;

		case "sin":
		case "cos":
		case "tan":
		case "Sqrt":
			return 4;
			break;


	}
}
/*Evaluates two operators and returns the result*/
function evaluate(op1, op2, operator) {
	console.log("Op1,Op2,operator" + op1, op2, operator);
	switch (operator) {
		case "+":
			return parseFloat(op1) + parseFloat(op2);
			break;
		case "-":
			return parseFloat(op1) - parseFloat(op2);
			break;
		case "/":
			return parseFloat(op1) / parseFloat(op2);
			break;
		case "*":
			return parseFloat(op1) * parseFloat(op2);
			break;
			;
		case "^":
		
			let result = 1;
			for (let i = 0; i < parseFloat(op2); i++) {
				result *= parseFloat(op1);

			}
			return result;
			break;
		case "sin":
			return Math.sin(op2);
			break;
		case "cos":
			return Math.cos(op2);
			break;
		case "tan":
			return Math.tan(op2);
			break;
		case "Sqrt":
			return Math.sqrt(op2);
			break;
	}

}

function displayOutput() {
	$("#output-text").val("");
	if (exp.length <= 15) {
		$("#output-text").val(exp);
	}
	else {
		$("#output-text").val(exp.slice(exp.length - 15, exp.length));
	}
}
$('#output-text').on('keyup', function (e) {

	var value = $(this).val();

	const evaluatedExpression = value.replace(/[a-z]+/g, (match) => {
		if (match in constants) {
			return constants[match];
		} else if (match in variables) {
			return variables[match];
		} else {
			return match;
		}
	});

	exp = evaluatedExpression;
});

$(".flex-wrapper").on("click", function (e) {
	console.log(e.type);

	var idClicked = e.target.id;
	var value = $("#" + idClicked).attr("value");

	if (value == "=" || value == "AC" || value == "CE") {
		calc(value);
	}
	else {
		exp += value;
		displayOutput();
	}


});
function calc(value) {
	console.log(value);
	console.log(stack);
	prevValue = stack[stack.length - 1];
	/*Switching through different cases*/
	switch (value) {
		case "=":
			console.log(exp);
			var tempNum = "";
            var result = "";

			if (exp[exp.length - 1] == "." || exp.length == 0 || IsMultiplyOrDivide(exp[0])) {
				result = 0;
			}
			else {
				for (var i = 0; i < exp.length; i++) {
					var possible_op = exp[i];
					console.log(exp[i]);
			
					if ('s' == possible_op) {
						possible_op = "sin";
						console.log(possible_op);
						i += 2;
					}
					else if ('c' == possible_op) {
						possible_op = "cos";
						i += 2;
					}
					else if ('t' == possible_op) {
						possible_op = "tan";
						i += 2;
					}
					else if ('S' == possible_op) {
						possible_op = "Sqrt";
						i += 3;
					}


					if (!isOperator(possible_op)) { 
						tempNum = tempNum + possible_op;
					}
					else {
						infixStack_New.push(parseFloat(tempNum));
						console.log(possible_op);
						infixStack_New.push(possible_op);
						tempNum = "";
					}
				}


				infixStack_New.push(parseFloat(tempNum)); // last operand value

				let infixStack = infixStack_New.filter(value => !Number.isNaN(value));
				console.log("Infix Stack", infixStack);



				for (var i = 0; i < infixStack.length; i++) {
					if (!isOperator(infixStack[i]) && infixStack[i] !== '(' && infixStack[i] !== ')') {
						postfixStack.push(infixStack[i]);
					} else if (infixStack[i] === '(') {
						tempStack.push(infixStack[i]);
					} else if (infixStack[i] === ')') {
						while (tempStack[tempStack.length - 1] !== '(') {
							postfixStack.push(tempStack.pop());
						}
						tempStack.pop();
					} else {
						if (tempStack.length == 0 || returnPrecedence(infixStack[i]) > returnPrecedence(tempStack[tempStack.length - 1])) {
							tempStack.push(infixStack[i]);
						} else if (infixStack[i] === 'sin' || infixStack[i] === 'cos' || infixStack[i] === 'tan') {
							postfixStack.push(infixStack[i]);
						} else {
							while (tempStack.length > 0 && returnPrecedence(infixStack[i]) <= returnPrecedence(tempStack[tempStack.length - 1])) {
								postfixStack.push(tempStack.pop());
							}
							tempStack.push(infixStack[i]);
						}
					}
				}

				while (tempStack.length > 0) {
					postfixStack.push(tempStack.pop());
				}




				console.log("Postfix Stack", postfixStack);
				var evaluatingStack = [];

				for (var i = 0; i < postfixStack.length; i++) {
					if (!isOperator(postfixStack[i])) {
						evaluatingStack.push(parseFloat(postfixStack[i]));
					} else {
						var operator = postfixStack[i];
						var operand2 = evaluatingStack.pop();
						var operand1 = isSingleOperandOperator(operator) ? null : evaluatingStack.pop();
						var res = evaluate(operand1, operand2, operator);
						evaluatingStack.push(res);
					}
				}

				result = evaluatingStack.pop();
				result = (Math.round(result * 10000) / 10000); // 4 decimal places

				if (isNaN(result)) {
					alert(`Syntax Error!!!.`);
					return;
				}
				history.push(result);
				updateHistory();
			}
		
			$("#output-text1").val(result);
			if (isFinite(result)) {
				infixStack_New = [];
				stack = [];
				stack.push(result);
			}
			else {
				infixStack_New = [];
				stack = [];
			}

			break;
		case "AC":

			exp = "";
			postfixStack = []
			displayOutput();
			break;

		case "CE":
			exp = exp.substring(0, exp.length - 1);
			displayOutput();
			break;


		case ".":
			if (!hasPointer) {
				stack.push(value);
				displayOutput(stack);
				hasPointer = true;
			}
			break;

		default:

			stack.push(value);
			console.log(stack);
			//displayOutput(stack);
			break;
	}
}
function addVariable() {
	const variableNameInput = document.getElementById("variable-name");
	const variableValueInput = document.getElementById("variable-value");
	const variableName = variableNameInput.value;
	const variableValue = parseFloat(variableValueInput.value);

	if (variableName in constants) {
		alert(`"${variableName}" is a constant and cannot be used as a variable name.`);
		return;
	}
	if (variableName in variables) {
		alert(`Variable "${variableName}" already exists.`);
		return;
	}

	variables[variableName] = variableValue;
	console.log(variables);

	alert(`Variable "${variableName}" added with value ${variableValue}.`);
}
function updateHistory() {
	const historyList = document.getElementById("history-list");
	historyList.innerHTML = "";
	for (let i = 0; i < history.length; i++) {
		const item = document.createElement("li");
		item.textContent = history[i];
		item.addEventListener("click", function () {
			history.splice(i, 1);
			updateHistory();
		});
		historyList.appendChild(item);
	}
}
