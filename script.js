const alnum = new Alfanumeric('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

onload = ()=>{
  const keys = document.querySelectorAll('.key');
  for(let key of keys){
    key.addEventListener('click', ()=>{calcKeyEvent(key)});
  }

  const icon_buttons = document.querySelectorAll('.icon-button');
  for(let icon_button of icon_buttons){

    handlerIconButtons(icon_button);
  }

  const change_mode_buttons = document.querySelectorAll('.button-select-mode');
  for(let change_mode_button of change_mode_buttons){
    change_mode_button.addEventListener('click', ()=>{
      const active           = document.querySelector('[data-active="true"]');
      const container_active = document.querySelector(active.dataset.to_container);

      const container = document.querySelector(change_mode_button.dataset.to_container);

      if(container_active != container && change_mode_button != active){
        container_active.style.display = 'none';
        container.style.display        = 'flex';

        active.dataset.active = 'false';
        change_mode_button.dataset.active="true";

        const label = change_mode_button.dataset.label;
        const section_label     = document.querySelector('#section-label');
        section_label.innerHTML = label;
        handlerURL(change_mode_button.dataset.url_reference);
      }
      
      const change_view_options = document.querySelector('#icon-button-show-hide');
      if(change_view_options.dataset.action == "hide"){
        handlerOptions();
      }
    })
  }

  const form_inputs = document.querySelectorAll('.input-form');
  for(let form_input of form_inputs){
    form_input.addEventListener('keydown', (event)=>{
      if(event.key == "Enter"){
        const name_function = form_input.dataset.name_function;
        if(name_function == 'calc'){
          submitCalc();
        } else if(name_function == 'converter'){
          submitConverter();
        } else if(name_function == 'key'){
          if(form_input.type == "text"){
            submitKey();
          } else {
            const input_text = document.querySelector('#old-values-generate-key');
            let submit = false;
            const value_number = parseInt(form_input.value);
            if(input_text.value.length >= value_number){
              submit = true;
            }
            if (submit) {
              submitKey();
            } else if (confirm("Deseja avançar sem indicar valores anteriores?")) {
              submitKey();
            }

          }
        }
      }
    })
    if(form_input.dataset.name_function == "key"){
      if(form_input.id == 'number'){
        form_input.addEventListener('input', ()=>{handlerInputKey(form_input, "number")});
      } else if(form_input.type == 'text' && form_input.id != "template-generate-key"){
        form_input.addEventListener('input', ()=>{handlerInputKey(form_input, "text")});
      }
    }
  }

  const real_input = document.querySelector('#real-input');
  real_input.addEventListener('input', handlerInput);

  const converter_input = document.querySelector('#input-converter-from');
  converter_input.addEventListener('input', ()=>{handlerInputConverter(converter_input);});

  const converter_selects = document.querySelectorAll('.select-converter');
  for(let converter_select of converter_selects){

    converter_select.addEventListener('change', ()=>{handlerBySelectConverter()});
  }

  const buttons_response_key = document.querySelectorAll('.response-generate-key');
  for(let button_response_key of buttons_response_key){
    if(button_response_key.classList.contains("new")){
      button_response_key.addEventListener('click', ()=>{changeGenerateKeyView("form")});
    } else if(button_response_key.classList.contains("retry")) {
      button_response_key.addEventListener('click', ()=>{submitKey()});
    }
  }

  const button_submit_key = document.querySelector('button.generate-key-form-item');
  button_submit_key.addEventListener('click', ()=>{submitKey()});

  const select_template_generate_key = document.querySelector('#select-type-generate-key');
  select_template_generate_key.addEventListener('change', ()=>{changeTemplate()});

  useUrlRequest();
}

function handlerIconButtons(icon_button){
  let parent = icon_button.parentElement;
  if(!parent.classList.contains('icon-button')){
    const button = document.createElement('button');
    button.classList.add('button-container-icon-button');
    
    button.appendChild(icon_button);
    parent.appendChild(button);
  }
  
  if(icon_button.id == 'icon-button-clear'){
    icon_button.addEventListener('click', clearInput);
  } else if(icon_button.id == 'icon-button-history'){
    icon_button.addEventListener('click', ()=>{handlerHistory('use')});
  } else if(icon_button.id == 'icon-button-history-close'){
    icon_button.addEventListener('click', ()=>{handlerHistory('close')});
  } else if(icon_button.id == 'icon-button-show-hide'){
    icon_button.addEventListener('click', ()=>{handlerOptions()});
    
    const options_bg = document.querySelector('.options-bg');
    options_bg.addEventListener('click', ()=>{handlerOptions()});
  } else if(icon_button.id == 'icon-button-change-value-base'){
    icon_button.addEventListener('click', ()=>{changeValueBase()});
  } else if(icon_button.id == 'icon-button-convert-value'){
    icon_button.addEventListener('click', ()=>{submitConverter()});
  }
}

function calcKeyEvent(key){
  if (key.id != 'submit') {
    const content = key.children[0];
    const value   = content.innerHTML;

    const real_input = document.querySelector('#real-input');
    const old_value  = real_input.value;
    if (old_value == 0) {
      real_input.value = value;
    } else {
      real_input.value += value;
    }

    handlerInput();
  } else {
    submitCalc();
  }
}

function clearInput(){
  const real_input = document.querySelector('#real-input');
  real_input.value = '0';

  handlerInput();
}

function submitCalc(){
  const real_input = document.querySelector('#real-input');
  const calc = real_input.value;

  const new_value  = alNum('calc', calc);
  if (new_value === false) {
    real_input.value = '0';
  } else {
    real_input.value = new_value;
  }
  real_input.blur();

  fillHistory(calc, new_value);
}

function handlerInput(){
  const acepted_values = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ,.*+/^-÷√!@#$%&"
  const real_input = document.querySelector('#real-input');
  let   value      = real_input.value;

  if (value == '' || value == '0') {
    real_input.value = '0';
    value = 0;
  }

  if(value.length > 1){
    if(value[0] == '0'){
      let new_val = value.split('');
      new_val.splice(0,1);
      value = new_val.join('');
      real_input.value = value;
    }

    let new_value = '';
    for(let caracter of value){
      if(caracter == ','){
        new_value += '.';
      } else if(acepted_values.indexOf(caracter) >= 0){
        new_value += caracter;
      }
    }
    real_input.value = new_value;
  }

  let pre_response = '0';
  if(value != '0'){
    pre_response      = (alNum('calc', value)).toString();
    if(pre_response == 'false'){
      pre_response = '...';
    }
  }
  const real_output = document.querySelector('#real-output');
  if(pre_response == 'NaN'){
    real_output.innerHTML = '...';
  } else {
    real_output.innerHTML = pre_response;
  }
}

function fillHistory(ask, answer){
  const history_item = document.createElement('span');
  history_item.classList.add('old-calcs-list');
  history_item.classList.add('visor');
  history_item.classList.add('content');
  history_item.dataset.ask    = ask;
  history_item.dataset.answer = answer;
  history_item.innerHTML = `${ask} = ${answer}`;

  history_item.addEventListener('click', ()=>{useHistory(history_item)});

  const history_container = document.querySelector('#old-calcs');
  history_container.appendChild(history_item);
}

function handlerHistory(action){
  const history_container = document.querySelector('#history');
  
  const history_list  = document.querySelector('#old-calcs');

  const visor_container   = history_container.parentElement;
  
  const input_container  = visor_container.children[1];
  const output_container = visor_container.children[2];

  const button_open  = document.querySelector('#container-button-history');
  const button_close = document.querySelector('#container-button-history-close');
  
  if(action == 'use'){
    input_container.style.display  = 'none';
    output_container.style.display = 'none';

    button_open.style.display  = 'none';
    button_close.style.display = 'block';

    history_container.style.flexDirection = 'column';
    history_container.style.height    = '100%';
    history_container.style.overflowY = 'auto';

    history_list.style.position = 'static';
  
  } else if (action == 'close') {

    input_container.style.display  = 'flex';
    output_container.style.display = 'block';

    button_open.style.display  = 'flex';
    button_close.style.display = 'none';
    
    history_container.style.flexDirection = 'row';
    history_container.style.height    = '';
    history_container.style.overflowY = '';
  
    history_list.style.position = 'absolute';

  } else {
    return false;
  }
}

function useHistory(history_item){
  const ask    = history_item.dataset.ask;

  const real_input = document.querySelector('#real-input');
  real_input.value = ask;
  history_item.remove();
  handlerInput();
}

function handlerOptions(){
  const icon_button = document.querySelector('#icon-button-show-hide');
  const options     = document.querySelector('.options');
  const background  = document.querySelector('.options-bg');
  const action      = icon_button.dataset.action;
  
  const container_options = options.parentElement;
  if (action == 'show') {
    options.style.height     = '70px';
    options.style.padding = '10px 0';
    container_options.style.boxShadow = '0px 0px 8px #0008';
    background.style = '';

    icon_button.style.transform = 'rotate(180deg)';

    icon_button.dataset.action = 'hide';
  } else if(action == 'hide'){
    options.style = '';
    container_options.style  = '';
    background.style.display = 'none';

    icon_button.style.transform = 'rotate(0deg)';

    icon_button.dataset.action  = 'show';
  }
}

// CONVERTER
function changeValueBase(){
  const select_from = document.querySelector('#select-converter-from');
  const select_to   = document.querySelector('#select-converter-to');

  const from_value = select_from.value;
  const to_value   = select_to.value;

  select_from.value = to_value;
  select_to.value   = from_value;
}
function submitConverter(){
  const input_from = document.querySelector('#input-converter-from');
  const input_to   = document.querySelector('#input-converter-to');

  const select_from = document.querySelector('#select-converter-from');
  const select_to   = document.querySelector('#select-converter-to');

  let real_value_from = input_from.value;
  if(select_from.value != 10){
    var base_from = 16;
    if(select_from.value == 36){
      base_from = true;
    }
    real_value_from = alNum('convert', [10, input_from.value, base_from]);
  }

  let response = real_value_from;
  if(select_to.value != 10){
    var base_to = 16;
    if(select_to.value == 36){
      base_to = true;
    }
    response = alNum('convert', [base_to, real_value_from]);
  }
  input_to.value = response;
}

function handlerInputConverter(input){
  let acepted_values = "";
  const select_from = document.querySelector('#select-converter-from');
  const base        = select_from.value;
  if(base == 10){
    acepted_values = "0123456789";
  } else if(base == 16){
    acepted_values = "0123456789ABCDEF";
  } else if(base == 36){
    acepted_values = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  const value   = (input.value).toUpperCase();
  let new_value = '';
  for(let caracter of value){
    if (acepted_values.indexOf(caracter) >= 0) {
      new_value += caracter;
    }
  }

  input.value = new_value;
}
function handlerBySelectConverter(){
  const select_from  = document.querySelector('#select-converter-from');
  const value_from = select_from.value;
  const select_to  = document.querySelector('#select-converter-to');
  const value_to   = select_to.value;

  if(value_from == value_to){
    select_from.value = select_to.dataset.prev_value;
    select_to.value   = select_from.dataset.prev_value;
  }

  select_from.dataset.prev_value = select_from.value;
  select_to.dataset.prev_value   = select_to.value;

  document.querySelector('#input-converter-from').value = '';
  document.querySelector('#input-converter-to').value = '';
}
// CONVERTER

// KEY (IDENTIFICADOR)
function submitKey(){
  const key_type_element       = document.querySelector('#base-generate-key');
  const key_length_element     = document.querySelector('#slots-generate-key');
  const key_old_values_element = document.querySelector('#old-values-generate-key');
  

  const key_type       = key_type_element.value;
  let   key_length     = key_length_element.value;
  const key_old_values = key_old_values_element.value;


  var base = key_type;
  if(base == 36){
    base = true;
  }


  let response = '';
  
  const select_template = document.querySelector('#select-type-generate-key');
  select_template_value = select_template.value;
  
  if(select_template_value == "2"){
    
    const by_template_element = document.querySelector('#template-generate-key');

    const by_template = by_template_element.value;

    let responses_arr       = [];
    let important_index_arr = [];
    let index = 0;
    let separator = false;
    for(let caracter of by_template){
      if(caracter == "#"){
        if(separator){
          separator = false;
          index++;
        }

        if(responses_arr[index] == undefined){
          responses_arr[index] = caracter;
        } else {
          responses_arr[index] += caracter;
        }

        if(important_index_arr.indexOf(index) < 0){
          important_index_arr.push(index);
        }
      } else {
        if(!separator){
          index++;
          responses_arr[index] = caracter;
        } else {
          responses_arr[index] += caracter;
        }
        separator = true; 
      }
    }

    important_index_arr.forEach(important_index=>{
      const key_length = responses_arr[important_index].length;

      if(key_old_values != '' && key_old_values != undefined && key_old_values != null) {
  
        const acepted_values_full = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let acepted_values = acepted_values_full.split('').splice(0, key_type).join("");
        
        let key_old_values_arr  = [key_old_values];
        if(key_old_values.indexOf(',') >= 0){
          key_old_values_arr  = key_old_values.split(',');
        }
        key_old_values_arr.forEach(element=>{
          for(let caracter of element){
            if(acepted_values.indexOf(caracter) < 0){
              return alert(`O valor "${caracter}", no identificador especificado "${element}", não está contido na base de contagem especificada.`);
              break;
            }
          }

          if(element.length != key_length){
            return alert(`O identificador especificado, "${element}", não está adequado à quantidade de 'casas" esepecificadas. Enquanto a quantidade de "casas" definida é ${key_length}, o identificador citado possui ${element.length} "casas".`);
          }
        }); 
        responses_arr[important_index] = alNum("KEY", [base, key_length, key_old_values_arr]);
      } else {
        responses_arr[important_index] = alNum("KEY", [base, key_length]);
      }
    })

    response = responses_arr.join('');
  
  } else if(key_old_values != '' && key_old_values != undefined && key_old_values != null) {
  
    const acepted_values_full = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let acepted_values = acepted_values_full.split('').splice(0, key_type).join("");
    
    let key_old_values_arr  = [key_old_values];
    if(key_old_values.indexOf(',') >= 0){
      key_old_values_arr  = key_old_values.split(',');
    }
    key_old_values_arr.forEach(element=>{
      for(let caracter of element){
        if(acepted_values.indexOf(caracter) < 0){
          return alert(`O valor "${caracter}", no identificador especificado "${element}", não está contido na base de contagem especificada.`);
          break;
        }
      }

      if(element.length != key_length){
        return alert(`O identificador especificado, "${element}", não está adequado à quantidade de 'casas" esepecificadas. Enquanto a quantidade de "casas" definida é ${key_length}, o identificador citado possui ${element.length} "casas".`);
      }
    }); 
    response = alNum("KEY", [base, key_length, key_old_values_arr]);
  } else {

    response = alNum("KEY", [base, key_length]);
  }
  const output_generate_key = document.querySelector('#output-generate-key');
  output_generate_key.value = response;
  changeGenerateKeyView("answer");
}

function handlerInputKey(form_input, type){
  const value = (form_input.value).toUpperCase();
  if(type == 'number' && value <= 0){
    form_input.value = 1;
  } else if(type == 'text'){
    const key_type_element    = document.querySelector('#base-generate-key');
    const acepted_values_full = ",0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const key_type     = parseInt(key_type_element.value);
    let acepted_values = acepted_values_full.split('').splice(0, key_type+1).join('');

    let new_value = '';
    for(let caracter of value){
      if(acepted_values.indexOf(caracter) >= 0){
        new_value += caracter;
      }
    }

    form_input.value = new_value;
  }
}

function changeGenerateKeyView(to) {
  const form_container     = document.querySelector('#container-form-generate-key');
  const response_container = document.querySelector('#container-response-generate-key');
  if (to == 'answer') {
    form_container.style.display     = 'none';
    response_container.style.display = 'flex';
  } else if (to == 'form') {
    const select_type      = document.querySelector('#base-generate-key');
    const input_length     = document.querySelector('#slots-generate-key');
    const input_old_values = document.querySelector('#old-values-generate-key');

    select_type.value      = 10;
    input_length.value     = 10;
    input_old_values.value = '';
    
    response_container.style.display = 'none';
    form_container.style.display     = 'flex';
  }
}

function changeTemplate(){
  const by_length   = document.querySelector('#slots-generate-key');
  const by_template = document.querySelector('#template-generate-key');
  const select_template = document.querySelector('#select-type-generate-key');

  const type = select_template.value;
  if(type == '1'){
    by_length.style.display   = "inline-block";
    by_template.style.display = "none";
  }else if(type == '2'){
    by_length.style.display   = "none";
    by_template.style.display = "inline-block";
  }
}
// KEY (IDENTIFICADOR)

// ------- RECURSIVAS ------- \\
function handlerLoadCover(action){
  if (action == "show") {} else if (action == "hide") {}
}

function handlerURL(url){
  let href = location.href;
  if(href.indexOf("?") >= 0){
    href_arr = href.split('?');
    href = href_arr[0];
  }

  if(url != ''){
    href += "?"+url;
  }
  history.replaceState("page_place", "PAGE", href);
}

function useUrlRequest(){
  let request = location.href;
  if(request.indexOf("?") >= 0){
    request = request.split("?")[1];
    switch(request){
      case "calc_alfanumeric":
        document.querySelector('[data-to_container=".container-calc"]').click();
        break;

      case "value_converter":
        document.querySelector('[data-to_container=".container-converter"]').click();
        break;

      case "generate_key":
        document.querySelector('[data-to_container=".container-generate-key"]').click();
        break;

      default:
        handlerURL("");
        break;
    }
  } else {
    // code...
  }


  const container_loading = document.querySelector('.container-load');
  if(container_loading){
    container_loading.remove();
  }
}