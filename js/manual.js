import {Calculator} from './classes/coding-color.class.js';
/* DOM */
//Convert button
document.getElementById('calculate_btn').addEventListener('click', ()=>{extract()})

//Editor init
const editor = CodeMirror.fromTextArea(document.getElementById('colorsCss'), {
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
})

//Copy editor btn
document.querySelector('.copy-icon').addEventListener('click', copyToClipboardCss)

//Sidebar default values
let optionsJSON = localStorage.getItem('manual_options')
if(optionsJSON){
    let options = JSON.parse(optionsJSON)

    //from
    options.from.forEach(f=>{
        document.querySelector('#from [value="'+f+'"]').checked = true
    })

    //to
    if(options.to){
        document.querySelector('#to [value="'+options.to+'"]').checked = true
    }

    //Opacity value
    document.getElementById('op').value = options.op

    //Opacity bg
    document.getElementById('bg').value = options.bg

    //get opacity from variables flag
    document.getElementById('op_from_var').checked =  options.op_from_var
}

 /* END DOM */
function extract(){
    setDefaultOptions()
    //From
    let fromData = getFrom();
    if(!fromData.response){
        alert('Please select at least one extracting format!', 'alert', '#from label')
        return
    }
    let from = fromData.data

    //css
    let cssEditor = editor.getValue()
    if(!cssEditor.length){
        alert('There\'s nothing to convert!', 'alert', '.CodeMirror')
        editor.focus()
        return
    }
    
    let css = cssEditor.split('\n'),
        calculator = new Calculator(from, false, css),
        colors = calculator.detectedColors
        console.log(css, colors)
    if(colors.length)
        colorList(colors)
    else
        alert('No colors detected, try adjusting the filters', 'alert')
}

//functions
function setDefaultOptions(){
    const options = {
        from: ['hex', 'rgb', 'rgba'],
        to: false,
        op: 1,
        bg: '#fff',
        op_from_var: false
    }
    
    //From
    let fromData = getFrom();
    if(fromData.response){
        options.from = fromData.data;
    }
    
    //To
    let toData = getTo();
    if(toData.response){
        options.to = toData.data;
    }

    //Opacity
    const toggleOp = document.getElementById('ab_op');
    if(toggleOp.checked) {

        //Value
        let opacityData = getOpacity();
        if (opacityData.response) {
            options.op = opacityData.data;
        }

        //Background
        let backgroundData = getBackground();
        if (backgroundData.response) {
            options.bg = backgroundData.data;
        }

        //get opacity from variables flag
        options.op_from_var = document.getElementById('op_from_var').checked
    }

    localStorage.setItem('manual_options', JSON.stringify(options))
}
function colorList(colors){
    localStorage.setItem('manual_colors', JSON.stringify(colors))
    const wrapper = document.querySelector('.color-list')
    colors.forEach(col=>{
        let html = `
            <div class="color-row">
                <p class="color-main">${col.color} - <span class="color-original">${col.original}</span></p>
                <div class="color-info">
                    
                </div>
            </div>
        `
        wrapper.insertAdjacentHTML('beforeend', html)
    })
    if(!document.querySelector('.editor-wrapper').classList.contains('hidden')){
        document.querySelector('.editor-wrapper').classList.add('hidden')
    }
    if(wrapper.classList.contains('hidden')){
        wrapper.classList.remove('hidden')
    }
}
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
        data: format ? format : ''
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
function copyToClipboardCss(){
    let css = editor.getValue()
    if(css.length > 0){
        let copyText = css
        if(!css.startsWith('--Thank you for using Coding-Color.it--\n')) {
            copyText = '--Thank you for using Coding-Color.it--\n'+css
        }
        navigator.clipboard.writeText(copyText);
        alert('Editor test has been copied to clipboard', 'success');
    } else {
        alert('There\'s nothing to copy!', 'alert');
    }
}
function copyToClipboardColor(text){
    navigator.clipboard.writeText(text);
    alert('Color ' + text + ' has been copied to clipboard', 'success');
}