import {Calculator} from './classes/coding-color.class.js';

//Convert button
document.getElementById('calculate_btn').addEventListener('click', convert) 
function convert(){
    //From
    let fromData = getFrom()
    if(!fromData.response){
        alert('Please select the initial format!', 'alert', '#from label')
        return
    }
    let from = fromData.data
    
    //To
    let toData = getTo(),
        to = toData.data

    //Opacity
    const toggleOp = document.getElementById('ab_op');
    let background = false
    let opacity = false
    if(toggleOp.checked) {

        //Value
        let opacityData = getOpacity()
        if (!opacityData.response) {
            alert('Opacity must be a number between 0 and 1!', 'alert', '#op')
            return
        }
        opacity = opacityData.data

        //Background
        let backgroundData = getBackground()
        if (!backgroundData.response) {
            alert('The background isn\'t a valid color!', 'alert', '#bg')
            return
        }
        background = backgroundData.data
    }

    //Css
    let cssEditor = editor.getValue()
    if(!cssEditor.length){
        alert('There\'s nothing to convert!', 'alert', '.CodeMirror')
        editor.focus()
        return
    }
    let css = cssEditor.split('\n'),
        calculator = new Calculator(from, to, css, opacity, background),
        matrix = calculator.calc(),
        newCss = matrix.map((line)=>{return line.css}).join('\n'),
        colors = calculator.parsedColors,
        shift = 0
    editor.setValue(newCss);
    colors.forEach((col, i)=>{
        editor.markText(
            {line: col.line, ch: col.start},
            {line: col.line ,ch: col.start + col.color.length},
            { 
                className: "marked",
                attributes: {"data-original": col.original}
            }
        )
        if(colors[i+1] && colors[i+1].line === col.line){
            shift += (col.color.length - (col.end - col.start))
            colors[i+1].start += shift
            colors[i+1].end += shift
        } else {
            shift = 0
        }
    })
    if(colors.length > 1)
        alert(colors.length+' colors have been successfully converted', 'success')
    else if (colors.length > 0)
        alert('Color '+colors[0].original+' has been successfully converted', 'success')
    else
        alert('No colors detected, try adjusting the filters', 'alert')

    setMarkedEvents()
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
        data: format.length ? format : ''
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
        data: format ? format : false
    }
}
function getOpacity(){
    let value = parseFloat(parseFloat(document.getElementById('op').value).toFixed(2))
    let validation = value >= 0 && value <= 1
    return { 
        response: validation,
        data: validation ? value : ''
    }
}
function getBackground(){
    const input = document.getElementById('bg')
    //validate input
    const regex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
    const validation = regex.test(input.value);
    return {
        response: validation,
        data: validation ? input.value : ''
    }
}
