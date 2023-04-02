var hasPointer=false;
var num = "";
var stack = [];
var infixStack_New=[];
var prevValue="";
var display = ""; 
var tempStack=[];
var postfixString="";
var postfixStack=[];
var exp = "";
var output = [];
var count = 0;

let history = [];

const constants = {
    pi: 3.1415,
    e: 2.7182
  };
  let variables = {};

function isOperator(x){
	
  if(x=="-"||x=="+"||x=="*"||x=="/" || x=="^" || x=="(" || x==')' || x=='sin' || x=='cos' || x=='tan'|| x=='Sqrt'){
    return 1;
  }
  else return 0;
}
function isBracket(x){
	if(x=="("||x==")" ){
	  return 1;
	}
	else return 0;
  }

function isEquals(x){
  if(x=="="){
    return 1;
  }
  else return 0;
}

function isNumber(x){
  if(x=="1"||x=="2"||x=="3"||x=="4"||x=="5"||x=="6"||x=="7"||x=="8"||x=="9"||x=="0"){
    return 1;
  }
  else return 0;
}

function IsMultiplyOrDivide(x){
	if(x=="/"||x=="X" ){
		return true;
	}
	else{
		return false;
	}
}

function returnPrecedence(x){
  switch(x){
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
	
  }
}
/*Evaluates two operators and returns the result*/
function evaluate(op1,op2,operator){
	console.log("Op1,Op2,operator"+op1,op2,operator);   
  switch(operator){
    case "+":
      return parseFloat(op1)+parseFloat(op2);
      break;
    case "-":
      return parseFloat(op1)-parseFloat(op2);
      break;
    case "/":
      return parseFloat(op1)/parseFloat(op2);
      break;
    case "*":
      return  parseFloat(op1)*parseFloat(op2);
	  break;
	  ;
	 case "^":
	//	return Math.pow(parseFloat(op1),parseFloat(op2));\
	let result=1;
	for(let i=0;i<parseFloat(op2);i++){
      result*=parseFloat(op1);

	}
		return result;
      break;
	  case "sin":
		return Math.sign(op2);
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

/*The display function, it needs to be specially handled as the text box is not able to display numbers larger than 15 digits*/
function displayOutput(){
	$("#output-text").val("");
		if(exp.length<=15){
			$("#output-text").val(exp);
		}
		else{
			$("#output-text").val(exp.slice(exp.length-15,exp.length));
		}
}
		$('#output-text').on('keyup', function(e) {
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
	
	
/*The main logic for handling the clicks on the calculator*/
$(".flex-wrapper").on("click",function(e) {
	console.log(e.type);
	
		var idClicked = e.target.id;
		var value = $("#" + idClicked).attr("value");
	
	if(value=="=" || value=="AC"|| value=="CE" ){
			calc(value);
	}
	else{
		exp+=value;
		displayOutput();
	}

	
});

function calc(value){
	console.log(value);
	console.log(stack);
	prevValue=stack[stack.length-1];
	/*Switching through different cases*/
	switch(value ){
		case "=": case e.key === "Enter":
			console.log(exp);
			var tempNum="";
			
			var result="";
			/*Handling invalid cases such as 
			1. If the end of the input is an operator or a decimal point
			2. If the input length is zero, which is caused by direct clicking of the equals button
			3. To eliminate case such as / or * being prefix for a number in calculation and allow numbers such as +3 and -3
			*/
			if(exp[stack.length-1]=="."||exp.length==0||IsMultiplyOrDivide(exp[0])){
				result=0;
			}
			else{
				/*With the input received, generating the infix stack, as the input from humans are always infix*/
				for(var i=0;i<exp.length;i++){
					var possible_op = exp[i];
				//	var possible_op_square=exp[i+1];
					if ('s'==possible_op){
						possible_op = "Sin";
						i+=2;
					}
					else if('c'==possible_op){
                         possible_op="cos";
						 i+=2;
					}
					else if('t'==possible_op){
						possible_op="tan";
						i+=2;
					}
					else if('S'==possible_op){
						possible_op="Sqrt";
						i+=3;
					}
                  else
					
					console.log(possible_op);
					if(!isOperator(possible_op)) { // && !isBracket(stack[i]))   // to handle multiple values // remove ||i==0
						tempNum=tempNum+possible_op;
					}
					else {
					//	infixStack.push(tempNum1);
					infixStack_New.push(parseFloat(tempNum));
					infixStack_New.push(possible_op);
						tempNum="";
						//tempNum1="";

					}
				}
			
				
				infixStack_New.push(parseFloat(tempNum)); // last operand value
				//tempNum1.split("");
			//	infixStack.push(tempNum1);
			let infixStack= infixStack_New.filter( value => !Number.isNaN(value) );
				console.log("Infix Stack",infixStack);
				
				/*Generating a postfix stack from the infix stack*/
				for(var i=0;i<infixStack.length;i++){
					if(!isOperator(infixStack[i])){
						postfixStack.push(infixStack[i]);
					}
					else if (infixStack[i] === '(') {
						tempStack.push(infixStack[i]);
					}
					else if (infixStack[i] === ')') {
						while (tempStack[tempStack.length-1] !== '(') {
							postfixStack.push(tempStack.pop());
						}
						tempStack.pop(); // remove opening parenthesis from temp stack
					}
					else{
						if(tempStack.length==0||(returnPrecedence(infixStack[i])>returnPrecedence(tempStack[tempStack.length-1]))){
							tempStack.push(infixStack[i]);
						}
						else {
							while(tempStack.length > 0 && returnPrecedence(infixStack[i])<=returnPrecedence(tempStack[tempStack.length-1])){ 
								postfixStack.push(tempStack.pop());
							}
							tempStack.push(infixStack[i]);
						}
						/*else{
							if((returnPrecedence(infixStack[i])<=returnPrecedence(tempStack[tempStack.length-1]))){ 
								do{
									postfixStack.push(tempStack.pop());
								}while(returnPrecedence(infixStack[i])<=returnPrecedence(tempStack[tempStack.length-1]))
									tempStack.push(infixStack[i]);
							}	
						}*/
					}
				}
				/*var lenTempStack=tempStack.length;
				for(var i=0;i<lenTempStack;i++){
					postfixStack.push(tempStack.pop());
				}*/
				while(tempStack.length>0){ 
					postfixStack.push(tempStack.pop());
				}
				console.log("Postfix Stack",postfixStack);
				var evaluatingStack=[];
				
				/*Evaluating the infix stack and generating the output*/
				for(var i=0;i<postfixStack.length;i++){
					if(!isOperator(postfixStack[i])){
						evaluatingStack.push(postfixStack[i]);
					}
					else{
						var operand2=evaluatingStack.pop();
						var operand1=evaluatingStack.pop();
						var res=evaluate(operand1,operand2,postfixStack[i]);
						evaluatingStack.push(res);
					}
				}
				result=evaluatingStack.pop()
				result=(Math.round(result * 10000) / 10000); // 4 decimal places 
				//console.log(result);
				//output[count] = infixStack + " " +result;
			//	const newdiv = document.createElement('div')
			//	newdiv.classList.add('history')
				/*newdiv.append(infixStack + "=" +result)
				side.append(newdiv)
				count++;
				postfixStack=[];*/
				history.push(result);
				updateHistory();
			}
			/*Handling the divide by zero, i,e the infinite case*/
			$("#output-text1").val(result);
			if(isFinite(result)){
				infixStack_New=[];
				stack=[];
				stack.push(result);
			}
			else{
				infixStack_New=[];
				stack=[];
			}
			
	break;
		case "AC":
		//	stack=[];
			exp = "";
		displayOutput();
			break;

		case "CE":
			exp=exp.substring(0,exp.length-1);
			displayOutput();
			break;

		/*case "+": case "-": case "X": case "/":
			if(!isOperator(prevValue)){
				stack.push(value);
				displayOutput(stack);
				hasPointer=false;
			}
			break;*/

		case ".":
			if(!hasPointer){
				stack.push(value);
				displayOutput(stack);
				hasPointer=true;
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
	  item.addEventListener("click", function() {
		history.splice(i, 1);
		updateHistory();
	  });
	  historyList.appendChild(item);
	}
  }
  