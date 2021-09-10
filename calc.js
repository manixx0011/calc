<script>
var lendig = 16; 
var levelpush = 12;
var digh = 8;
var maxval = 4294967296;
var digithex = "" + "0123456789ABCDEF";
var stack = new array(levelpush);
var selectang = "deg";

var value = 0;	
var threadlevel = 0;
var flag = true;
var decimal = 0;
var fixed = 0;
var expMode = false;
var base = 10;

function update(){
	if(base == 10)
	{
		var display = format(value);
		if (expMode)
		{
			if (expval<0){
				display += " " + expval;
			}

			else{
				display += " +" + expval;
			}
		}

		if (display.indexOf(".")<0 && display != "Error "){
			if (flag || decimal>0){
				display += '.';
			}

			else{
			}
		}
		
		document.resbox.result.value = display;
	}

	else{
		value = value % maxval;

		if (value<0){
			value = value + maxval;
		}

		var display = format(value);

		if (flag){
			display += ".";
		}

		document.resbox.result.value = display;
	}	
}

function format(val)
 {
	if (base == 10)
	{
	 	var valStr = "" + value;
	 	if (valStr.indexOf("N")>=0 || (value == 2*value && value == 1+value))
		{
			return "Error ";
		}
		var i = valStr.indexOf("e")
		if (value > 1000000000000 && i < 0)
		{
		     value = value.toExponential(12);
			 valStr = "" + value;
			 i = valStr.indexOf("e");
		}
		if (i>=0)
		{
			var expStr = valStr.substring(i+1,valStr.length);
			if (i>11) i=11;
			valStr = valStr.substring(0,i);
			if (valStr.indexOf(".")<0) valStr += ".";
	 		valStr += " " + expStr;
	 	}
	 	else
	 	{
	 		var valNeg = false;
	 		if (value < 0)
	 		{ value = -value; valNeg = true; }
	
	 		var valInt = Math.floor(value);
	 		var valFrac = value - valInt;
	 		var prec = lendig - (""+valInt).length - 1;
	 		if (! flag && fixed>0)
			{
				prec = fixed;
			}
			   var mult = " 1000000000000000000".substring(1,prec+2);
			var frac = Math.floor(valFrac * mult + 0.5);

			valInt = Math.floor(Math.floor(value * mult + .5) / mult);
	
			if (valNeg)
			{
			    value = -value;
				valStr = "-" + valInt;
			}

			else
				valStr = "" + valInt;
				
			var fracStr = "00000000000000"+frac;

			fracStr = fracStr.substring(fracStr.length-prec, fracStr.length);
			i = fracStr.length-1;
			if (flag || fixed==0)
			{
				while (i>=0 && fracStr.charAt(i)=="0")
					--i;
				fracStr = fracStr.substring(0,i+1);
			}
			if (i>=0) valStr += "." + fracStr;
		}
		return valStr;
	}

	else{
			var s = "";

		if (val<0 || val>maxval)

			return "Error";

		if (val==0)

			return "0";

		if (base<2)

		{

			while (val && s.length < 20)

			{

				var x = val % 16;

				var d = digithex.charAt(x);

				val = (val-x)/16 | 0;

				var y = val % 16;

				var e = digithex.charAt(y);

				val = (val-y)/16 | 0;

				s = "%" + e + d + s;

			}

			s = '"' + s + '"';

			return unescape(s);

		}

		while (val && s.length < 20)

		{

			var x = val % base;

			var d = digithex.charAt(x);

			val = (val-x)/base | 0;

			s = "" + d + s;

		}

		return s;
		}
}

function digit(n){
	if(base == 10){
		if (flag){
			value = 0;
			digits = 0;
			flag = false;
		}

		if (n==0 && digits == 0)
		{
			update();
			if(document.resbox.result.value.substr(0,2) != "0.")
			    return;
		}

		if (expMode){
			if (expval<0){
				n = -n;
			}

			if (digits < 3){
				expval = expval * 10 + n;
				++digits;
				update();
			}

			return;
		}

		if (value<0){
			n = -n;
		}

		if (digits < lendig-1)
		{
			++digits;
			if (decimal>0)
			{
				decimal = decimal * 10;
				if (value !=0)
				{
				    value = value + (n/decimal);
				}
				else
				{
				    var str = document.resbox.result.value;
					str += n;
		            value = parseFloat(str);
				}
				++fixed;
			}

			else{
				value = value * 10 + n;
			}
		}
		update();
	}

	else{
		if (flag){
			value = 0;
			digits = 0;
		}

		if (n>=base){
			return;
		}

		flag = false;

		if (value<0){
			n = -n;
		}

		if (digits < digh){
			value = value * base + n;
			++digits;
		}

		update();
	}
	document.emcalc.equalssign.focus();
}

function PhysicConstant(constantnum)
{
    var num= constantnum;
	   
	document.resbox.result.value = num;	
	value = num/1;
	update();	

	document.resbox.result.focus();	
}

function change(sd)
{
	var df = document.resbox.result.value;

	if (sd == "CP")
	{
		 if (df.indexOf(".") == df.length -1)
		 {
		   df = df.substring(0,df.length-1);
		 }
	   
	     clipboardData.setData('text',df); 
	}
	else if (sd == "PST")
	{
	   var str = clipboardData.getData('text'); 
	   value = str/1;
 	   update();
	}	
	else if (sd == "+/-")
	{
		 document.resbox.result.value = df * (-1);	 
	}
	else if(sd == "BKS")
	{
		 if(df.length>=1)
		 {
		     if (base == 10)
			 {
			     if (decimal > 0) 
				 {
				    decimal = decimal/10;
					fixed -= 1;
				 }
			 }
			 var res2 = df.substring(0,df.length-1);
			 if (df.indexOf(".") == df.length -1)
			   res2 = df.substring(0,df.length-2);
			 document.resbox.result.value = res2;
			 
			 if (base == 10)
				value = res2/1;
			 else
				value = value/base;
		 
			 update();
	 	}
	 }
	document.emcalc.equalssign.focus();	 
}

function angleConvert(e){
	if (e == "deg"){
		if (selectang == "rad"){
			value = (180 / Math.PI) * value;
		}

		else if (selectang == "grad"){
			value = (180 / 200) * value;
		}

		selectang = "deg";
	}

	else if (e == "rad"){
		if (selectang == "deg"){
			value = (Math.PI / 180) * value;
		}

		else if (selectang == "grad"){
			value = (Math.PI / 200) * value;
		}

		selectang = "rad";
	}

	else if (e == "grad"){
		if (selectang == "deg"){
			value = (200 / 180) * value;
		}

		else if (selectang == "rad"){
			value = (200 / Math.PI) * value;
		}

		selectang = "grad";
	}

	equals();
}

function emKeypress(evt){
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
	var key = String.fromCharCode(keyCode);
	var charCode = (evt.which)? evt.which : evt.charCode;

	if (charCode > 0) charCode = 1;
	else if (charCode != 0 && charCode != 1) charCode = 2;
	
	if (key >= "0" && key <= "9" && key < base){
		intkey = parseInt(key);
		digit(intkey);
	}

	else if((key == "a" || key == "A") && 10 < base){
		digit(10);
	}

	else if((key == "b" || key == "B") && 11 < base){
		digit(11);
	}

	else if((key == "c" || key == "C") && 12 < base){
		digit(12);
	}

	else if((key == "d" || key == "D") && 13 < base){
		digit(13);
	}

	else if((key == "e" || key == "E") && 14 < base){
		digit(14);
	}

	else if((key == "f" || key == "F") && 15 < base){
		digit(15);
	}

	else if(key == "." && charCode > 0){
		period();
	}

	else if ((keyCode == "13" && charCode > 0) || key == "="){
	    equals();
	}
	
	else if ((key == "+" || key == "-" || key == "*") && charCode > 0)
	{
		emoper(key);
	}
	
	else if (key == "/" && charCode == 2)
	{
		emoper("/");
	}
	
	else if(key == "i"){
		emoper("+");
	}
	else if(key == "k"){
		emoper("-");
	}
	else if(key == "j"){
		emoper("*");
	}
	else if(key == "l"){
		emoper("/");
	}
	else if(key== "(" && charCode > 0){
		openp();
	}

	else if(key == ")" && charCode > 0){
		closep();
	}

	else if(key == "S"){
		emoper("-");
	}
	else if(key == "A"){
		emoper("+");
	}
	else if(key == "Z"){
		emoper("/");
	}
	else if(key == "X"){
		emoper("*");
	}
	else if(key == "r"){
		emfunc("1/x");
	}

	else if(key == "q"){
		clearAll();
	}

	else if(key == "!" && charCode > 0){
		emfunc("n!");
	}

	else if(key == "n"){
		emfunc("ln");
	}

	else if(key == "N"){
		emfunc("etox");
	}

	else if(key == "m"){
		sign();
	}

	else if(key == "%" && charCode > 0){
		emoper('%');
	}

	else if(key == "&" && charCode > 0){
		emoper('and');
	}

	else if(key == "|" && charCode > 0){
		emoper('or');
	}

	else if(key == "^" && charCode > 0){
		emoper('xor');
	}

	else if(key == "~" && charCode > 0){
		emfunc('not');
	}

	else if(key == "<" && charCode > 0){
		openp();
	}

	else if(key == ">" && charCode > 0){
		closep();
	}
	
	else if (key == "_" && charCode > 0)
	{
		if(base==10){sign()}; 
	}
	else if (key == "\\" && charCode > 0)
	{
		emoper("/"); 
	}
	else{
		return false;
	}
}


function emKeydown(evt){
    var keyCode = (evt.which) ? evt.which : evt.keyCode;
	if (keyCode == "27"){
		clearAll();
	}
	else if (keyCode == "13")
	{
	    ;
	
	}
	else if (evt.ctrlKey && keyCode == "67")
	{
		change("CP");
	}
	else if (evt.ctrlKey && keyCode == "86")
	{
		change("PST");
	}	
}

function checkbase(e){
	if(e >= base){
		return false;
	}

	else{
		return true;
	}
}

function calcBase(e)
{
	if(e == 10)
	{
		base=10;
		equals();
		document.resbox.radiobase[1].checked = true;
		document.resbox.trigmeth[0].disabled = false;
		document.resbox.trigmeth[1].disabled = false;
		document.resbox.trigmeth[2].disabled = false;

		document.emcalc.digit2.disabled = false;
		document.emcalc.digit3.disabled = false;
		document.emcalc.digit4.disabled = false;
		document.emcalc.digit5.disabled = false;
		document.emcalc.digit6.disabled = false;
		document.emcalc.digit7.disabled = false;
		document.emcalc.digit8.disabled = false;
		document.emcalc.digit9.disabled = false;
		document.emcalc.digit1.className = "calcbtn";
		document.emcalc.digit2.className = "calcbtn";
		document.emcalc.digit3.className = "calcbtn";
		document.emcalc.digit4.className = "calcbtn";
		document.emcalc.digit5.className = "calcbtn";
		document.emcalc.digit6.className = "calcbtn";
		document.emcalc.digit7.className = "calcbtn";
		document.emcalc.digit8.className = "calcbtn";
		document.emcalc.digit9.className = "calcbtn";
		
		document.btnabcdef.hexA.disabled = true;
		document.btnabcdef.hexB.disabled = true;
		document.btnabcdef.hexC.disabled = true;
		document.btnabcdef.hexD.disabled = true;
		document.btnabcdef.hexE.disabled = true;
		document.btnabcdef.hexF.disabled = true;
		document.btnabcdef.hexA.className = "disabledbtn";
		document.btnabcdef.hexB.className = "disabledbtn";
		document.btnabcdef.hexC.className = "disabledbtn";
		document.btnabcdef.hexD.className = "disabledbtn";
		document.btnabcdef.hexE.className = "disabledbtn";
		document.btnabcdef.hexF.className = "disabledbtn";

		document.extrabtn.funcPi.disabled = false;
		document.emcalc.funcSin.disabled = false;
		document.emcalc.funcCos.disabled = false;
		document.emcalc.funcCot.disabled = false;	
		document.emcalc.funcTan.disabled = false;
		document.extrabtn.funcG.disabled = false;
		document.extrabtn.funcR.disabled = false;
		document.extrabtn.funcAtm.disabled = false;
		document.emcalc.digitPeriod.disabled = false;
		document.emcalc.digitPlusMinus.disabled = false;
		
		document.emcalc.funcSin.className = "calcbtncoral";
		document.emcalc.funcCos.className = "calcbtncoral";
		document.emcalc.funcTan.className = "calcbtncoral";
		document.emcalc.funcCot.className = "calcbtncoral";
		document.extrabtn.funcPi.className = "calcbtn";
		document.extrabtn.funcR.className = "calcbtn";
		document.extrabtn.funcG.className = "calcbtn";
		document.extrabtn.funcAtm.className = "calcbtn";
		document.emcalc.digitPeriod.className = "calcbtn";
		document.emcalc.digitPlusMinus.className = "calcbtncoral";		
	}
	else{
		if(e == 16){
			base=16;
			equals();
			document.resbox.radiobase[0].checked = true;

			document.btnabcdef.hexA.disabled = false;
			document.btnabcdef.hexB.disabled = false;
			document.btnabcdef.hexC.disabled = false;
			document.btnabcdef.hexD.disabled = false;
			document.btnabcdef.hexE.disabled = false;
			document.btnabcdef.hexF.disabled = false;
			
			document.btnabcdef.hexA.className = "calcbtn";
			document.btnabcdef.hexB.className = "calcbtn";
			document.btnabcdef.hexC.className = "calcbtn";
			document.btnabcdef.hexD.className = "calcbtn";
			document.btnabcdef.hexE.className = "calcbtn";
			document.btnabcdef.hexF.className = "calcbtn";
			
			document.emcalc.digit2.disabled = false;
			document.emcalc.digit3.disabled = false;
			document.emcalc.digit4.disabled = false;
			document.emcalc.digit5.disabled = false;
			document.emcalc.digit6.disabled = false;
			document.emcalc.digit7.disabled = false;
			document.emcalc.digit8.disabled = false;
			document.emcalc.digit9.disabled = false;

			document.emcalc.digit2.className = "calcbtn";
			document.emcalc.digit3.className = "calcbtn";
			document.emcalc.digit4.className = "calcbtn";
			document.emcalc.digit5.className = "calcbtn";
			document.emcalc.digit6.className = "calcbtn";
			document.emcalc.digit7.className = "calcbtn";
			document.emcalc.digit8.className = "calcbtn";
			document.emcalc.digit9.className = "calcbtn";			
		}

		else if(e == 8){
			base=8;
			equals();
			document.resbox.radiobase[2].checked = true;

			document.emcalc.digit2.disabled = false;
			document.emcalc.digit3.disabled = false;
			document.emcalc.digit4.disabled = false;
			document.emcalc.digit5.disabled = false;
			document.emcalc.digit6.disabled = false;
			document.emcalc.digit7.disabled = false;
			
			document.emcalc.digit2.className = "calcbtn";
			document.emcalc.digit3.className = "calcbtn";
			document.emcalc.digit4.className = "calcbtn";
			document.emcalc.digit5.className = "calcbtn";
			document.emcalc.digit6.className = "calcbtn";
			document.emcalc.digit7.className = "calcbtn";
			
			document.btnabcdef.hexA.disabled = true;
			document.btnabcdef.hexB.disabled= true;
			document.btnabcdef.hexC.disabled= true;
			document.btnabcdef.hexD.disabled= true;
			document.btnabcdef.hexE.disabled= true;
			document.btnabcdef.hexF.disabled= true;
			
			document.btnabcdef.hexA.className = "disabledbtn";
			document.btnabcdef.hexB.className = "disabledbtn";
			document.btnabcdef.hexC.className = "disabledbtn";
			document.btnabcdef.hexD.className = "disabledbtn";
			document.btnabcdef.hexE.className = "disabledbtn";
			document.btnabcdef.hexF.className = "disabledbtn";
			
			document.emcalc.digit8.disabled = true;
			document.emcalc.digit9.disabled = true;
			
			document.emcalc.digit8.className = "disabledbtn";
			document.emcalc.digit9.className = "disabledbtn";
			
		}

		else if(e == 2){
			base=2;
			equals();
			document.resbox.radiobase[3].checked = true;

			document.emcalc.digit2.disabled = true;
			document.emcalc.digit3.disabled = true;
			document.emcalc.digit4.disabled = true;
			document.emcalc.digit5.disabled = true;
			document.emcalc.digit6.disabled = true;
			document.emcalc.digit7.disabled = true;
			document.emcalc.digit8.disabled = true;
			document.emcalc.digit9.disabled = true;
			
			document.emcalc.digit2.className = "disabledbtn";
			document.emcalc.digit3.className = "disabledbtn";
			document.emcalc.digit4.className = "disabledbtn";
			document.emcalc.digit5.className = "disabledbtn";
			document.emcalc.digit6.className = "disabledbtn";
			document.emcalc.digit7.className = "disabledbtn";
			document.emcalc.digit8.className = "disabledbtn";
			document.emcalc.digit9.className = "disabledbtn";
			
			document.btnabcdef.hexA.disabled = true;
			document.btnabcdef.hexB.disabled= true;
			document.btnabcdef.hexC.disabled= true;
			document.btnabcdef.hexD.disabled= true;
			document.btnabcdef.hexE.disabled= true;
			document.btnabcdef.hexF.disabled= true;
			
			document.btnabcdef.hexA.className = "disabledbtn";
			document.btnabcdef.hexB.className = "disabledbtn";
			document.btnabcdef.hexC.className = "disabledbtn";
			document.btnabcdef.hexD.className = "disabledbtn";
			document.btnabcdef.hexE.className = "disabledbtn";
			document.btnabcdef.hexF.className = "disabledbtn";
			
			document.emcalc.digit8.disabled = true;
			document.emcalc.digit9.disabled = true;
			
			document.emcalc.digit8.className = "disabledbtn";
			document.emcalc.digit9.className = "disabledbtn";		
		}
		document.resbox.trigmeth[0].disabled = true;
		document.resbox.trigmeth[1].disabled = true;
		document.resbox.trigmeth[2].disabled = true;

		document.extrabtn.funcPi.disabled = true;
		document.emcalc.funcSin.disabled = true;
		document.emcalc.funcCos.disabled = true;
		document.emcalc.funcTan.disabled = true;
		document.extrabtn.funcG.disabled = true;
		document.extrabtn.funcR.disabled = true;
		document.extrabtn.funcAtm.disabled = true;
		document.emcalc.funcCot.disabled = true;
		
		document.extrabtn.funcPi.className = "disabledbtn";
		document.emcalc.funcSin.className = "disabledbtn";
		document.emcalc.funcCos.className = "disabledbtn";
		document.emcalc.funcCot.className = "disabledbtn";	
		document.emcalc.funcTan.className = "disabledbtn";
		document.extrabtn.funcG.className = "disabledbtn";
		document.extrabtn.funcR.className = "disabledbtn";
		document.extrabtn.funcAtm.className = "disabledbtn";			

		document.emcalc.digitPeriod.disabled = true;
		document.emcalc.digitPlusMinus.disabled = true;			

		document.emcalc.digitPeriod.className = "disabledbtn";
		document.emcalc.digitPlusMinus.className = "disabledbtn";
	}
}


function pageonload(){
 	var display = format(value);
	display = " " + display;
	display = display.substring(display.length-lendig-1,display.length);
	document.resbox.result.value = display;
	document.resbox.radiobase[1].checked = true;
	document.resbox.trigmeth[0].checked = true;
	func("memclearall");
	calcBase(10);
	document.resbox.result.focus();	
}


function stackPushTier(){
	this.value = 0;
	this.op = "";
}

function array(length){
	this[0] = 0;
	for (i=0; i<length; ++i){
		this[i] = 0;
		this[i] = new stackPushTier();
	}

	this.length = length;
}


function push(value,op,prec){
	if (threadlevel==levelpush){
		return false;
	}

	for (i=threadlevel;i>0; --i){
		stack[i].value = stack[i-1].value;
		stack[i].op = stack[i-1].op;
		stack[i].prec = stack[i-1].prec;
	}

	stack[0].value = value;
	stack[0].op = op;
	stack[0].prec = prec;
	++threadlevel;
	return true;
}


function pop(){
	if (threadlevel==0){
		return false;
	}

	for (i=0;i<threadlevel; ++i){
		stack[i].value = stack[i+1].value;
		stack[i].op = stack[i+1].op;
		stack[i].prec = stack[i+1].prec;
	}

	--threadlevel;
	return true;
}

function clearAll(){
	threadlevel = 0;
	clear();
}


function clear(){
	expMode = false;
	value = 0;
	enter();
	update();
	document.resbox.result.value = "";
}


function evalx()
{
    var str = "";
	if (threadlevel==0){
		return false;
	}

	op = stack[0].op;
	sval = stack[0].value;
	
	var valuepre = value;

	if (op == "+"){
 		value = sval + value;
	}

	else if (op == '-'){
		value = sval - value;
	}

	else if (op == '*'){
		value = sval * value;
	}

	else if (op == '/'){
		value = sval / value;
	}

	else if (op == '%'){
		value = sval % value;
	}

	else if (op == 'pow')
	{
		value = Math.pow(sval,value);
	}
	
	else if (op == 'xNd'){
		value = Math.pow(sval,1/value);
		op = "^1/";
	}
	
	else if (op == 'xaddtoy'){
		var res = 0;
		for (var i = sval; i <= value; i++)
		{
		     res += i;
		}
		value = res;
		op = "...";
	}

	else if(op == "and"){
		value = sval & value;
	}

	else if(op == "or"){
		value = sval | value;
	}

	else if(op == "xor"){
		value = sval ^ value;
	}

	else if(op == "lsh"){
		value = sval << value;
	}

	else if(op == "rsh"){
		value = sval >> value;
	}

	pop();
	if (op=='(')
		return false;
	
    str += sval;
    str += " "; 
	str += op;
	str += " ";
	str += valuepre;
    str += " = "; 
	str += value;	
	var obj = document.getElementById("output");
	var x = obj.innerHTML;

    x += "<LI>";
    x += str;
	x += "<br>";
	obj.innerHTML = x;
 
	return true;
}


function openp(){
	enter();
	if (!push(0,'(',0)){
		value = "NAN (";
	}

	update();
	
	var obj = document.getElementById("output");
	var x = obj.innerHTML;

    x += "<LI>";
    x += document.resbox.result.value;
	x += "<LI>(";
	x += "<br>";
	obj.innerHTML = x;
}


function closep(){
	enter();
	while (evalx())
		;
		
	var obj = document.getElementById("output");
	var x = obj.innerHTML;

    x += "<LI>";
    x += ")";
	x += "<br>";
	obj.innerHTML = x;

	update();
	equals();
}


function emoper(oper)
{
	enter();

	if(base == 10){
		if (oper=='+' || oper=='-'){
			prec = 1;
		}

		else if (oper=='*' || oper=='/' || oper=='%')
		{
			prec = 2;
		}

		else if (oper=="pow"){
			prec = 3;
		}

		else if (oper=="or" || oper=='xor'){
			prec = 4;
		}

		else if (oper=="and"){
			prec = 5;
		}

		else if(oper=="lsh" || oper=="rsh"){
			prec = 6;
		}
		
		else if (oper=="xNd"){
			prec = 7;
		}
		
		else if (oper=="xaddtoy"){
			prec = 8;
		}
		
		if (threadlevel>0 && prec <= stack[0].prec){
			evalx();
		}

		if (!push(value,oper,prec)){
			value = "NAN emoper";
		}

		update();

	}

	else{
		if (oper=='+' || oper=='-'){
			prec = 1;
		}

		else if (oper=='*' || oper=='/' || oper=='%'){ 
			prec = 2;
		}

		else if(oper=='pow'){
			prec = 3;
		}

		else if (oper=="or" || oper=='xor'){
			prec = 4; 
		}

		else if (oper=="and"){
			prec = 5; 
		}

		else if(oper=="lsh" || oper=="rsh"){ 
			prec = 6;
		}
		
		else if (oper=="xNd"){
			prec = 7;
		}
		
		else if (oper=="xaddtit"){
			prec = 8;
		}

		else{
			value = "NAN EL";
		}

		if (threadlevel>0 && prec <= stack[0].prec){
			evalx();
		}

		if (!push(value,oper,prec)){
			value = "NAN PU";
		}

		update();
	}
}

function refreshresult()
{
    var v = document.resbox.result.value;
	v = 1 * v;
	value = v;
	if (value != 0)
	{
	    update();
	}
}

function enter()
{
	if(base == 10){
			if (expMode){
				value = value * Math.exp(expval * Math.LN10);
			}

			flag = true;
			expMode = false;
			decimal = 0;
			fixed = 0;
	}

	else{
		flag = true;
	}
}


function equals(){
	enter();
	while (threadlevel>0){
		evalx();
	}
	update();
}




function sign(){
	if(base == 10)
	{
		if (expMode){
				expval = -expval;
		}
		
		else{
			value = -1 * value;
		}

		update();
	}
	document.resbox.result.focus();
}


function period(){
	if(base == 10)
	{
		var val = document.resbox.result.value;
		if (Math.ceil(val) == val && decimal == 0)
		{
				decimal = 1;		
		}
		else if (flag){
				value = 0;
				digits = 1;
		}

		flag = false;

		update();
	}
	document.resbox.result.focus();
}

function emfunc(f)
{
    var flag = 0;
	var str = "";
	
	enter();
	if (f=="1/x"){
		str += "1/";
		str += value;
		value = 1/value;
	}
	
	else if(f=="memclearall"){
		document.memform.meminput1.value = "";
		document.memform.meminput2.value = "";
		document.memform.meminput3.value = "";
		document.getElementById('output').innerHTML="";
		flag = 1;
	}
	
	else if (f=="n!")
	{
	    str += value;
		str += "!";
		value = Math.floor(value);
		oldFactValue = value;

		if (value<0 || value>200){
			value = "NAN 2";
		}

		else{
			var n = 1;
			var i;
			for (i=1;i<=value;++i){
				n *= i;
			}
		}

		value = n;
	}

	else if(f=="memplus1"){
		document.memform.meminput1.value = value;
		flag = 1;
	}

	else if(f=="memrecall1"){
		value = parseFloat(document.memform.meminput1.value);
		flag = 1;
	}

	else if(f=="memclear1"){
		document.memform.meminput1.value = "";
		flag = 1;
	}

	else if(f=="memplus2"){
		document.memform.meminput2.value = value;
		flag = 1;
	}

	else if(f=="memrecall2"){
		value = parseFloat(document.memform.meminput2.value);
		flag = 1;
	}

	else if(f=="memclear2"){
		document.memform.meminput2.value = "";
		flag = 1;
	}

	else if(f=="memplus3"){
		document.memform.meminput3.value = value;
		flag = 1;
	}

	else if(f=="memrecall3"){
		value = parseFloat(document.memform.meminput3.value);
		flag = 1;
	}

	else if(f=="memclear3"){
		document.memform.meminput3.value = "";
		flag = 1;
	}

	else if(f=="sin"){
		str += "Sin(";
		str += value;
		str += ")"
		if(document.resbox.trigmeth[0].checked){
			value = Math.sin(value * Math.PI / 180);
		}

		else if(document.resbox.trigmeth[1].checked){
			value = Math.sin(value);
		}

		else if(document.resbox.trigmeth[2].checked){
			value = Math.sin(value * Math.PI / 200);
		}
	}

	else if (f=="cos"){
		str += "Cos(";
		str += value;
		str += ")"		
		if(document.resbox.trigmeth[0].checked){
			value = Math.cos(value * Math.PI / 180);
		}

		else if(document.resbox.trigmeth[1].checked){
			value = Math.cos(value);
		}

		else if(document.resbox.trigmeth[2].checked){
			value = Math.cos(value * Math.PI / 200);
		}
	}

	else if (f=="tan"){
		str += "Tan(";
		str += value;
		str += ")"		
		if(document.resbox.trigmeth[0].checked){
			value = Math.tan(value * Math.PI / 180);
		}

		else if(document.resbox.trigmeth[1].checked){
			value = Math.tan(value);
		}
		
		else if(document.resbox.trigmeth[2].checked){
			value = Math.tan(value * Math.PI / 200);
		}
	}
	
	else if (f=="cot"){
		str += "Cot(";
		str += value;
		str += ")"		
		if(document.resbox.trigmeth[0].checked){
			value = Math.tan(value * Math.PI / 180);
			value = 1/value;
		}

		else if(document.resbox.trigmeth[1].checked){
			value = Math.tan(value);
			value = 1/value;
		}

		else if(document.resbox.trigmeth[2].checked){
			value = Math.tan(value * Math.PI / 200);
			value = 1/value;
		}
	}

	else if (f=="log"){
		str += "Log(";
		str += value;
		str += ")"		
		value = Math.log(value)/Math.LN10;
	}

	else if (f=="log2"){
		str += "Log2(";
		str += value;
		str += ")"		
		value = Math.log(value)/Math.LN2;
	}

	else if (f=="ln"){
		str += "Ln(";
		str += value;
		str += ")"		
		value = Math.log(value);
	}

	else if (f=="sqrt"){
		str += "Sqrt(";
		str += value;
		str += ")"		
		value = Math.sqrt(value);
	}

	else if (f=="pi"){
		value = Math.PI;
		flag = 1;
		}
		
	else if (f=="G"){
		value = 0.000000000066684627;
		flag = 1;
	}
	
	else if (f=="atm"){
		value = 101325;
		flag = 1;
	}
	
	else if (f=="R"){
		value = 602200000000000000000000;
		flag = 1;
	}

	else if(f=="10tox"){
		str += "10^";
		str += value;
		value = Math.exp(value * Math.LN10);
	}

	else if(f=="etox"){
		str += "e^";
		str += value;
		value = Math.exp(value);
	}

	else if(f=="2tox"){
		str += "2^";
		str += value;
		value = Math.exp(value * Math.LN2);
	}

	else if(f=="xsq"){
		str += value;
		str += "^2";
		value = value*value;
	}
	
	else if(f=="x3"){
		str += value;
		str += "^3";
		value = value*value*value;
	}
	
	else if(f=="x3d"){
		str += value;
		str += "^(1/3)";
		value = Math.pow(value,1/3);
	}

	else if(f=="not"){
		str += "~";
		str += value;
		value = ~ value;
	}
	
	else if(f=="ceil"){
		str += "Ceil(";
		str += value;
		str += ")";
		value = Math.ceil(value);
	}
	else if(f=="flr"){
		str += "Floor(";
		str += value;
		str += ")";
		value = Math.floor(value);
	}
	else if(f=="int"){
		str += "Int(";
		str += value;
		str += ")";		
		value = Math.round(value);
	}

	update();
	if (flag == 0)
	{
	    str += " = ";
		str += value;
		
		var obj = document.getElementById("output");
		var x = obj.innerHTML;

		x += "<LI>";
		x += str;
		x += "<br>";
		obj.innerHTML = x;		
	}
}
</script>


<!DOCTYPE 
<head>

<STYLE type=text/css>
bl{color: rgb(208, 255, 0); font-style:italic; font-weight:bold}
rd{color: rgb(221, 26, 156); font-style:italic}
gr{color: rgb(0, 102, 128);}
.desc {	FONT-SIZE: 14px; color:black; }
.convertinputcontent170
{
    width: 170px;
	border: 1px solid #000000;
	background-color: #FFFFEE;	
}
.outputbox {
BORDER-RIGHT: #000000 1px solid; BORDER-TOP: #000000 1px solid; FONT-WEIGHT: bold; BORDER-LEFT: #000000 1px solid; BORDER-BOTTOM: #000000 1px solid; BACKGROUND-COLOR: #ffffff
}
.inputbox {
BORDER-RIGHT: #000000 1px solid; BORDER-TOP: #000000 1px solid; FONT-WEIGHT: bold; BORDER-LEFT: #000000 1px solid; BORDER-BOTTOM: #000000 1px solid; BACKGROUND-COLOR: #ffffff
}
.mini {
BACKGROUND-COLOR: #ffffff
}
.calcplatform {
BACKGROUND-COLOR: #ffffff

}
.calcbtn
{
WIDTH: 48px; HEIGHT: 28px;
font-weight:bold; color:blue; font-size:16px;background:#bbbbbb;
}
.calcbtnred
{
WIDTH: 48px;HEIGHT: 28px;
font-weight:bold; color:red; font-size:16px;background:#bbbbbb;
}
.calcbtncoral
{
WIDTH: 48px;HEIGHT: 28px;
font-weight:bold; color:#ff0707; font-size:16px;background:#bbbbbb;
}
.calcbtnyellow
{
WIDTH: 40px;HEIGHT: 28px;
font-weight:bold; color:green; font-size:16px;background:#bbbbbb;
}
.disabledbtn
{
WIDTH: 48px;HEIGHT: 28px;
font-weight:bold; color:gray; font-size:16px;background:#dddddd;
}
.calcbtnequal {
WIDTH: 98px; COLOR: #000000; HEIGHT: 28px; BACKGROUND-COLOR: #ffffff
}
.calcbtnequalright {
WIDTH: 78px; COLOR: #000000; HEIGHT: 28px; BACKGROUND-COLOR: #ffffff
}
.calcresult {
FONT-SIZE: 15px; COLOR: #000000; FONT-STYLE: normal; BACKGROUND-COLOR: #9FA4FF; font-wieght: 800
}
</STYLE>
</head>

<BODY onkeypress=emKeypress(event) onkeydown=emKeydown(event) onload=pageonload()>
<div id="header">

<script language="Javascript">
function document.oncontextmenu(){event.returnValue=false;}
function window.onhelp(){return false}
function document.onkeydown()
{
	if ((window.event.altKey)&&
	((window.event.keyCode==37)||
	(window.event.keyCode==39)))
	{
		event.returnValue=false;
	}
	if (
		(event.keyCode==8) ||
		(event.ctrlKey && event.keyCode==82)
	   )
	{
		event.keyCode=0;
		event.returnValue=false;
	}
	if (event.keyCode==122){event.keyCode=0;event.returnValue=false;}
	if (event.ctrlKey && event.keyCode==78) event.returnValue=false;
	if (event.shiftKey && event.keyCode==121)event.returnValue=false;
	if (window.event.srcElement.tagName == "A" && window.event.shiftKey)
	window.event.returnValue = false;
	if ((window.event.altKey)&&(window.event.keyCode==115))
	{
		window.showModelessDialog("about:blank","","dialogWidth:1px;dialogheight:1px");
		return false;
	}
}
</script>
