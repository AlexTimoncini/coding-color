import {Calculator} from './classes/coding-color.class.js';
/* DOM */
//textarea
let editor = CodeMirror.fromTextArea(document.getElementById('colorsCss'), {
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
});
//filter ref
const textarea = document.getElementById('colorsCss')
const output = document.getElementById('output')
const btn = document.getElementById('calculate_btn')
btn.addEventListener('click', ()=>{convert()})

/* END DOM */

function convert(){
    //from
    let fromData = getFrom();
    let from;
    if(fromData.response){
        from = fromData.data;
    } else {
        alert(fromData.data)
        return
    }
    
    //to
    let toData = getTo();
    let to;
    if(toData.response){
        to = toData.data;
    } else {
        alert(toData.data)
        return
    }

    //opacity
    let opacityData = getOpacity();
    let opacity;
    if(opacityData.response){
        opacity = opacityData.data;
    } else {
        alert(opacityData.data)
        return
    }

    //background
    let backgroundData = getBackground();
    let background = false;
    if(backgroundData){
        if(backgroundData.response){
            background = backgroundData.data;
        } else {
            alert(backgroundData.data)
            return
        }
    }

    //css
    let css = editor.getValue();

    if(css.length){
        //class color converter builder
        let calculator = new Calculator(from, to, css, opacity, background);
        convertCss(calculator.calc(), css);
    } else {
        editor.focus()
    }

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

function getOpacity(){
    let value = parseFloat(parseFloat(document.getElementById('op').value).toFixed(1));
    let validation = value >= 0 || value <= 1
    return { 
        response: validation,
        data: validation ? value : 'Opacity Value isn\'t in the right format'
    }
}

function getBackground(){
    const toggle = document.getElementById('ab_op');
    if(toggle.checked){
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

function convertCss(colorsData, oldCss){
    let newCss = oldCss,
        colorsToConvert = colorsData.filter(c=>c.converted),
        shift = 0
    newCss.replace(/\n/g, '<br>')
    for(let i = 0; i< colorsToConvert.length; i++) {
        let col = colorsToConvert[i]
        let stringConversion = replaceSubstring(newCss, col.start, col.end, col.color)
        newCss = stringConversion.cssConverted
        if (i < colorsToConvert.length - 1) {
            shift += stringConversion.shift
            colorsToConvert[i + 1].start += shift
            colorsToConvert[i + 1].end += shift
        }
        console.log(shift)
    }
    editor.getDoc().setValue(newCss);
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

