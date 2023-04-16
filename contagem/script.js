class Alfanumeric{
  constructor(vpc){
    this.VPC = vpc;
    this.MAX_VAL   = this.VPC.length;
    this.convertValue = convertValue;
    this.auxCalc   = calcValue;
    this.calcValue = makeCalcOrder;
    this.randomValue  = randomValue;
  }
}

function calcValue(value1, type){
  const operators = ['√','/^', '^', '*', '÷', '/', '-', '+'];
  if (!value1 || value1 == '' || operators.indexOf(value1[value1.length-1]) >= 0) {
    return false;
  }
  const limiters = "{[()]}";
  let   value    = '';
  for(let caracter of value1){
    if(caracter != ' ' && limiters.indexOf(caracter) < 0){
      value += caracter;
    }
  }
  
  let between_value = '';
  let operators_arr = [];
  let values_arr    = [];
  let number        = false;
  for(let caracter of value){
    if (limiters.indexOf(caracter) < 0) {
      between_value += caracter;

      if(operators.indexOf(caracter) >= 0 && between_value.length > 1){
        operators_arr.push([caracter, values_arr.length-1]);
        number = false;
      
      } else {
        if(number){
          values_arr[values_arr.length-1] += caracter;
        } else {
          values_arr.push(`${caracter}`);
          number = true;
        }
      }
    }
  }

  operators_arr.sort((a,b)=>{
    if(operators.indexOf(a[1]) > operators.indexOf(b[1])){
      return -1;
    } else if(operators.indexOf(a[1]) < operators.indexOf(b[1])){
      return +1;
    } else {
      return 0;
    }
  })  
  values_arr[0] = this.convertValue(10, values_arr[0], type);
  operators_arr.forEach(info => {
    const operator = info[0];
    const to       = info[1];
    const join     = to + 1;

    let val  = values_arr[to];
    let val1 = (values_arr[join]).toString();
    val1 = this.convertValue(10, val1, type);

    const calc_val  = val;
    const calc_val1 = val1;

    let calc = 0;
    switch (operator) {
      case '+':
        calc = calc_val + calc_val1;
        break;
      case '-':
        calc = calc_val - calc_val1;
        break;
      case '*':
        calc = calc_val * calc_val1;
        break;
      case '/':
        calc = calc_val / calc_val1;
        break;
      case '÷':
        calc = calc_val / calc_val1;
        break;
      case '^':
        calc = calc_val ** calc_val1;
        break;
      case '√':
        calc = calc_val1 ** (1/calc_val);//o segundo valor da ordem (calc_val1) é o radicando, enquanto o primeiro (calc_val) é o índice.
        break;
      case '/^':
        calc = calc_val1 ** (1/calc_val);//o segundo valor da ordem (calc_val1) é o radicando, enquanto o primeiro (calc_val) é o índice.
        break;
    }

    values_arr[join] = calc;
  });

  const new_value = values_arr[values_arr.length-1];

  return new_value;
}

function randomValue(type, value1, value2, callback){
  if(!type || !value1 ||  value1 == ''){
    return false;
  } else if (type !== true && type != 16 && type != 10) {
    return false;
  }

  let count_base = 10;
  let convert    = false;
 
  if (type === true) {
    count_base = this.MAX_VAL;
    convert    = true
  } else if (type == 16) {
    count_base = 16;
    convert    = true
  }

  let min_random_val = 0;
  let base = 1;
  for (let i = 1; i <= value1; i++) {
    min_random_val += base;
    base = count_base**i;
  }
  const max_random_val = base-1;

  let response = '';
  let finish   = false;
  while(!finish){
    const random_val = Math.random()*max_random_val;
    response   = Math.round(random_val)+'';
    if(convert){
      response = this.convertValue(type, random_val);
    }

    if (Array.isArray(value2) && value2.length > 0) {
      if (value2.indexOf(response) < 0) {
        finish = true;
      }
    } else {
      finish = true;
    }

  }


  if(callback){
    return [response, callback()]
  } else {
    return [response, false]
  }
}

function convertValue(type, value1, value2){  
  if(type == 10){
    let X_VPC = "0123456789ABCDEF";
    if(value2 === true){// value2 == true --> retorna o valor decimal baseado no VPC da criação do objeto afanumeric, caso contrario, retorna o valor hexadecimal
      X_VPC = this.VPC;
    }
    let X_MAX_VAL = X_VPC.length;
  

    let decimal_value = 0;
    let decimal_base = 1;
    for(let i = value1.length-1; i > -1; i--) {
        const valor_real = X_VPC.indexOf(value1[i]) * decimal_base;
        decimal_value += valor_real;
        decimal_base = decimal_base*(X_MAX_VAL);
    }

    return decimal_value;
  } else if (type == 16 || type === true){
    let decimal_value   = value1;
    let X_VPC = "0123456789ABCDEF";
    if(type === true){// type == true --> retorna o valor decimal baseado no VPC da criação do objeto afanumeric, caso contrario, retorna o valor hexadecimal
      X_VPC = this.VPC;
    }
    let X_MAX_VAL = X_VPC.length;
    console.log(X_VPC, '-')

    let alfanum = '';
    if(decimal_value > (X_MAX_VAL-1)){

      let finish = false;
      let alfanum_base  = X_MAX_VAL;
      let base_position = 1;
      while(!finish){
        if(decimal_value / alfanum_base < 1){
          finish = true;
        } else {
          alfanum_base = alfanum_base * X_MAX_VAL;
          base_position++;
        }
      }
      
      finish = false;
      let response = '';
      while(!finish){
        const proportion = 1/X_MAX_VAL; //VALOR QUE REPRESENTA UM POR CENTO DE 36, AJUDA A ACHAR O INXEX DO VALOR BASEADO EM PORCENTAGEM
        const result = Math.floor((decimal_value / alfanum_base) / proportion);
        if(decimal_value < 36 && base_position == 1){
          finish = true;
        } else {
          decimal_value = decimal_value - (result*((X_MAX_VAL)**(base_position-1)));
          alfanum_base = alfanum_base / (X_MAX_VAL);
          base_position--;
        }

        response += X_VPC[result];
      }
      
      alfanum = response;
    } else {
      alfanum = X_VPC[decimal_value];
    }

    return alfanum;
  } else {
    return false;
  }
}

function makeCalcOrder(value1, type, callback){
  const limiters_open  = ['{','[','('];
  const limiters_close = ['}',']',')'];

  var question = '';
  let places_coordinates = {};
  let places_open = [];
  let count = 0;
  for(let caracter of value1.toString()){
    if(caracter != ' '){
      question += caracter;

      if(limiters_open.indexOf(caracter) >= 0){
        let place_level = places_open.length;
        const obj = {
          level: place_level,
          coordinates: [question.length-1]
        }
        if(places_open.length > 0){
          obj.parent = places_open[places_open.length-1];
        } else {
          obj.parent = -1;
        }
        places_coordinates[`${count}`] = obj;
        places_open.push(count);
        
      } else if (limiters_close.indexOf(caracter) >= 0){
        
        let obj = places_coordinates[`${places_open[places_open.length-1]}`];
        obj.coordinates.push(question.length-1);
        places_open.splice(places_open.length-1,1);
      }
    }
    count++;
  }
  const CALC = {
    level:-1,
    coordinates:[0, question.length-1],
    calc:question
  }
  places_coordinates['-1'] = CALC;

  const question_string = question;
  let key_order = [];
  for(let key in places_coordinates){
    const obj      = places_coordinates[key];
    const interval = obj.coordinates[1] - obj.coordinates[0];
    question = question_string.split('');
    const calc     = (question.splice(obj.coordinates[0], interval+1)).join('');
    obj.calc = calc;
    key_order.push([key, obj.level]);
  }

  key_order.sort((a,b)=>{
    if(a[1]>b[1]){
      return -1;
    } else if(a[1]>b[1]){
      return +1;
    } else {
      return 0;
    }
  })

  const max_level = key_order[0][1];
  
  for(let i = max_level; i >= -1;i--){
    key_order.forEach(key_arr=>{
      if(key_arr[1] == i){
        const key  = key_arr[0];
        const obj  = places_coordinates[`${key}`];
        let   calc = obj.calc;

        key_order.forEach(key_arr2=>{
          if(key_arr2[1] == i+1){
            if(obj.new_calc){
              calc = obj.new_calc;
            }
            const key2  = key_arr2[0];
            const obj2  = places_coordinates[`${key2}`];
            
            if(obj2.parent == key){
              let   calc2 = obj2.calc;
              let   value = obj2.value;
              
              let index = calc.indexOf(calc2);
              let size  = calc2.length;
              
              let calc_arr = calc.split('');
              const init   = (calc_arr.splice(0, index)).join('');
              const final  = (calc_arr.splice(size, (calc.length - size+1))).join('');
              let new_calc = init+value+final;
              obj.new_calc = new_calc;
            }
          }
        })
        if(obj.new_calc){
          obj.value = this.auxCalc(obj.new_calc, type);
        } else {
          obj.value = this.auxCalc(obj.calc, type);
        }
      }
    })
  }

  let response = places_coordinates["-1"].value;

  if(callback){
    return [response, callback()];
  } else {
    return [response, undefined];
  }
}

// __________________________________________________ \\
function alNum (METHOD_, VALUES_, RETURN_, CALLBACK_) {
  var   response;
  const alnum = new Alfanumeric('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  if(METHOD_.toLowerCase() == 'calc') {

    if (Array.isArray(VALUES_)) {
      if (VALUES_.length == 1) {
        response    = alnum.calcValue(VALUES_[0], true, CALLBACK_);
      } else if (VALUES_.length > 1){
        response    = alnum.calcValue(VALUES_[0], VALUES_[1], CALLBACK_);
      }
    } else {
      response    = alnum.calcValue(VALUES_, true, CALLBACK_);
    }

    if (response[0] !== false) {
      if (Array.isArray(VALUES_) && VALUES_.length == 1) {
        response[0] = alnum.convertValue(true, response[0]);
      } else if (Array.isArray(VALUES_) && VALUES_.length > 1) {
        response[0] = alnum.convertValue(VALUES_[1], response[0]);
      } else {
        response[0] = alnum.convertValue(true, response[0]);
      }
    }
  } else if (METHOD_.toLowerCase() == 'key') {
    response = alnum.randomValue(VALUES_[0], VALUES_[1], CALLBACK_);

    if(VALUES_.length != 2) {
      response = false;
    }
  } else if (METHOD_.toLowerCase() == 'convert') {

    if(VALUES_.length == 2){
      response = alnum.convertValue(VALUES_[0], VALUES_[1]);
    } else if(VALUES_.length > 2){
      response = alnum.convertValue(VALUES_[0], VALUES_[1], VALUES_[2]);
    } else {
      response = false;
    }
  }


  if(METHOD_.toLowerCase() != 'calc' && METHOD_.toLowerCase() != 'key' && METHOD_.toLowerCase() != 'convert'){

    return false;
  }
  if(!VALUES_ || VALUES_ == ''){

    return false;
  }

  if (RETURN_ === true || METHOD_.toLowerCase() == 'convert') {
    console.log(response)
    return response;
  } else {
    return response[0];
  }
}