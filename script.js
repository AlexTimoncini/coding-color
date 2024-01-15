import {Calculator} from './coding-color.class.js';

const form = document.querySelector('form')

//add event handler on btn click
const btn = document.getElementById('calculate_btn')
btn.addEventListener('click', ()=>{calculate()})


function calculate(){
    //from
    const fromData = getFrom();
    let from;
    if(fromData.response){
        from = fromData.data;
    } else {
        alert(fromData.data)
        return
    }
    
    //to
    const toData = getTo();
    let to;
    if(toData.response){
        to = toData.data;
    } else {
        alert(toData.data)
        return
    }

    //absorb opacity
    const absorbBgData = getAbsorbBg();
    let absorbBg;
    if(absorbBgData.response){
        absorbBg = absorbBgData.data;
    } else if(absorbBgData.response === false){
        alert(absorbBgData.data)
        return
    }

    //css
    const textarea = document.getElementById('colorsCss');
    let css = textarea.value;
    //class construct
    const calculator = new Calculator(from, to, css, absorbBg);


    convertCss(calculator.calc());
}


//functions

function getFrom(){
    let checkboxes = document.getElementById('from').querySelectorAll('input[type=checkbox]');
    let format = [];
    checkboxes.forEach((checkbox)=>{
        if(checkbox.checked){
            format.push(checkbox.value);
        }
    })
    return {
        response: format.length ? true : false,
        data: format ? format : 'Initial format not chosen'
    }
}

function getTo(){
    let radios = document.getElementsByName('format_out');
    let format = false;
    radios.forEach((radio)=>{
        if(radio.checked){
            format = radio.value
        }
    })
    return {
        response: format ? true : false,
        data: format ? format : 'Converting format not chosen'
    }
}

function getAbsorbBg(){
    const checkbox = document.getElementById('absorb_op');
    if(checkbox.checked){
        const input = document.getElementById('bg')
        //validate input
        const regex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
        const validation = regex.test(input.value);

        return { 
            response: validation ? true : false,
            data: validation ? input.value : 'Background value is not in hex format'
        }
    }
    return false;
}

function alert(msg){
    console.log(msg);
}

function convertCss(colorsData){

}