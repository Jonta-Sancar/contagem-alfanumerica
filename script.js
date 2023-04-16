const alnum = new Alfanumeric('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

onload = ()=>{
  const keys = document.querySelectorAll('.key');
  for(let key of keys){
    key.addEventListener('click', ()=>{calcKeyEvent(key)});
  }

  const icon_buttons = document.querySelectorAll('.icon-button');
  for(let icon_button of icon_buttons){
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
          //
        }
      }
    })
  }

  const real_input = document.querySelector('#real-input');
  real_input.addEventListener('input', handlerInput);

  const converter_input = document.querySelector('#input-converter-from');
  converter_input.addEventListener('input', ()=>{handlerInputConverter(converter_input);});

  const converter_selects = document.querySelectorAll('.select-converter');
  for(let converter_select of converter_selects){

    converter_select.addEventListener('change', ()=>{handlerBySelectConverter()});
  }

  useUrlRequest();
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

// ------- RECURSIVAS ------- \\
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