import {Calculator} from './coding-color.class.js';

const form = document.querySelector('form')
const textarea = document.getElementById('colorsCss')
const output = document.getElementById('output')
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

    //class construct
    const calculator = new Calculator(from, to, textarea.value, absorbBg);
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
        response: !!format.length,
        data: format.length ? format : 'Initial format not chosen'
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
        response: !!format,
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
            response: validation,
            data: validation ? input.value : 'Background value is not in hex format'
        }
    }
    return false;
}

function alert(msg){
    console.log(msg);
}

function convertCss(colorsData){
    let outputCss = textarea.value
    let colorsToConvert = colorsData.filter(c=>c.converted)
    let shift = 0
    outputCss.replace(/\n/g, '<br>')
    for(let i = 0; i< colorsToConvert.length; i++) {
        let col = colorsToConvert[i]
        let stringConversion = replaceSubstring(outputCss, col.start, col.end, col.color)
        outputCss = stringConversion.cssConverted
        if (i < colorsToConvert.length - 1) {
            shift += stringConversion.shift
            colorsToConvert[i + 1].start += shift
            colorsToConvert[i + 1].end += shift
        }
        console.log(shift)
    }
    textarea.classList.add('hidden')
    output.classList.remove('hidden')
    output.innerHTML = outputCss
}

function replaceSubstring(originalString, start, end, replacement) {
    let htmlReplacement = ' <span class="marked" title="'+replacement+'">'+replacement+'</span>'
    let positionShift = htmlReplacement.length - (end - start)
    let prefix = originalString.substring(0, start)
    let suffix = originalString.substring(end)
    return {
            cssConverted: prefix + htmlReplacement + suffix,
            shift: positionShift
        }
}