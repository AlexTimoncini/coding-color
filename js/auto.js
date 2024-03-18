import {Calculator} from './classes/coding-color.class.js';
//textarea
const editor = CodeMirror.fromTextArea(document.getElementById('colorsCss'), {
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
});

//Convert css button
document.getElementById('calculate_btn').addEventListener('click', ()=>{convert()})

//toggle no-events on opacity
document.getElementById('ab_op').addEventListener('change', ()=>{
    document.querySelectorAll("#opacity .parameter:not(:first-of-type)").forEach(el=> el.classList.toggle("no-events"))
})

document.getElementById('op').addEventListener('input', (e)=>{
    const inputElement = e.target;
    const lastChIndex = inputElement.value.length - 1
    if(inputElement.value[lastChIndex] === ','){
        inputElement.value = inputElement.value.substring(0, lastChIndex) + '.'
    }
    const inputValue = inputElement.value;
    if (!/^[\d.]*$/.test(inputValue)) {
        inputElement.value = inputValue.replace(/[^0-9.]/g, '');
    }
})

document.querySelector('.copy-icon').addEventListener('click', copyToClipboardCss)

/* END DOM */

function convert(){
    //From
    let fromData = getFrom();
    let from;
    if(fromData.response){
        from = fromData.data;
    } else {
        alert('Please select the initial format!', 'alert', '#from label')
        return
    }
    
    //To
    let toData = getTo();
    let to;
    if(toData.response){
        to = toData.data;
    } else {
        alert('Please select the final format!', 'alert', '#to label')
        return
    }

    //Opacity
    const toggleOp = document.getElementById('ab_op');
    let background = false;
    let opacity = false;
    if(toggleOp.checked) {

        //Value
        let opacityData = getOpacity();
        if (opacityData.response) {
            opacity = opacityData.data;
        } else {
            alert('Opacity must be a number between 0 and 1!', 'alert', '#op')
            return
        }

        //Background
        let backgroundData = getBackground();
        if (backgroundData.response) {
            background = backgroundData.data;
        } else {
            alert('The background isn\'t a valid color!', 'alert', '#bg')
            return
        }

    }

    //css
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
        colors = calculator.colors,
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

    /* MARKED COLORS CLICK AND HOVER */
    document.querySelectorAll('.CodeMirror .marked').forEach(el => {
        el.addEventListener("click", function () {
            copyToClipboardColor(el.innerText.trim())
        })

        el.addEventListener("mouseover", function () {
            let oldColor = el.dataset.original,
                convertedColor = el.innerText,
                html = `
                    <div class="info-text rected">
                        <div class="color-squares">
                            <div class="color-square" style="background-color:${oldColor}"></div>
                            <p>&rightarrow;</p>
                            <div class="color-square" style="background-color:${convertedColor}"></div>
                        </div>
                        <div class="color-strings">
                            <p class="color-string">${oldColor}&nbsp;&nbsp;</p>
                            <p class="color-string">&nbsp;&nbsp;${convertedColor}</p>
                        </div>    
                    </div>`   
            const rect = el.getBoundingClientRect()
            document.body.insertAdjacentHTML("afterbegin", html);
            const infoText = document.querySelector('.info-text.rected')
            infoText.style.cssText = `
                opacity: 1;
                display: block;
                width: auto;
                top: ${rect.top + window.scrollY - 7}px;
                left: ${rect.left + window.scrollX + (rect.width / 2)}px;`
        })

        el.addEventListener("mouseout", function () {
            document.querySelector('.info-text.rected').remove()
        })
    })
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