import {Calculator} from './classes/coding-color.class.js';
/* DOM */
//toggle no-events on opacity
document.getElementById('ab_op').addEventListener('change', () => {
    document.querySelectorAll("#opacity .parameter:not(:first-of-type)").forEach(el => {
        if(document.getElementById('ab_op').checked){
            el.classList.remove("no-events")
        } else {
            el.classList.add("no-events")
        }
    })
})

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
    localStorage.setItem('manual_originalCss', cssEditor)
    if(!cssEditor.length){
        alert('There\'s nothing to convert!', 'alert', '.CodeMirror')
        editor.focus()
        return
    }

    let options = JSON.parse(localStorage.getItem('manual_options')),
        css = cssEditor.split('\n'),
        calculator = new Calculator(options.from, options.to, css, options.op, options.bg)

    calculator.calc()
    let colors = calculator.parsedColors

    if(colors.length > 1) {
        alert(colors.length+' colors have been successfully extracted', 'success')
        colorList(colors)
    } else if (colors.length > 0) {
        alert('Color '+colors[0].original+' has been successfully extracted', 'success')
        colorList(colors)
    } else {
        alert('No colors detected, try adjusting the filters', 'alert')
    }
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
    disableSidebar()
    localStorage.setItem('manual_colors', JSON.stringify(colors))
    const wrapper = document.querySelector('.color-list-wrapper')
    wrapper.appendChild(document.createElement("div"))
    wrapper.querySelector('div').classList.add('color-list')
    colors.forEach(col=>{
        let html = `
            <div class="color-row">
                <p class="color-main">${col.color} - <span class="color-original">${col.original}</span></p>
                <div class="color-info">
                    
                </div>
                <div class="open-color-btn"><img src="/assets/images/shared/edit-color.png" alt="edit color icon"></div>
            </div>`
        wrapper.querySelector('.color-list').insertAdjacentHTML('beforeend', html)
    })
    let actions = `
        <div class="row mx-auto justify-center mt-4 g-4">
            <button class="conversion-btn-sec m-0" id="reset_btn">BACK</button>
            <button class="conversion-btn-pri m-0" id="build_btn">BUILD</button>
        </div>`
    wrapper.insertAdjacentHTML('beforeend', actions)
    document.getElementById('reset_btn').addEventListener('click',()=>resetConversion())
    document.getElementById('build_btn').addEventListener('click',()=>build())
    if(!document.querySelector('.editor-wrapper').classList.contains('hidden')){
        document.querySelector('.editor-wrapper').classList.add('hidden')
    }
    if(wrapper.classList.contains('hidden')){
        wrapper.classList.remove('hidden')
    }
}
function build(){
    let optionsJSON = localStorage.getItem('manual_options')
    if(optionsJSON){
        let options = JSON.parse(optionsJSON),
            css = localStorage.getItem('manual_originalCss').split('\n'),
            colors = JSON.parse(localStorage.getItem('manual_colors')),
            calculator = new Calculator(options.from, options.to, css, options.op, options.bg),
            matrix = calculator.convertCss(colors),
            newCss = matrix.map((line)=>{return line.css}).join('\n'),
            shift = 0

        resetConversion()
        editor.setValue(newCss)
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
            alert('No colors detected converted')
    
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
            enableSidebar()
        })
    }
}
function resetConversion(){
    const wrapper = document.querySelector('.color-list-wrapper')
    wrapper.innerHTML = ''
    if(document.querySelector('.editor-wrapper').classList.contains('hidden')){
        document.querySelector('.editor-wrapper').classList.remove('hidden')
    }
    if(!wrapper.classList.contains('hidden')){
        wrapper.classList.add('hidden')
    }
    editor.focus()
    let old_value = localStorage.getItem('manual_originalCss')
    editor.setValue(old_value)
    enableSidebar()
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