import {Calculator} from './classes/coding-color.class.js';
/* DOM */
//Convert button
document.getElementById('calculate_btn').addEventListener('click', extract)

//Sidebar default values
intiOptions()
function intiOptions(){
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
        //Opacity toggle
        if(options.op || options.op === 0){
            document.getElementById('ab_op').checked = true
            document.querySelectorAll('#opacity .no-events').forEach(el=>el.classList.remove('no-events'))
        }
        //Opacity value
        document.getElementById('op').value = (options.op || options.op === 0) ? options.op : 1
        //Opacity from value toggle
        document.getElementById('op_from_var').checked = options.op_from_var
        //Opacity bg
        document.getElementById('bg').jscolor.fromString(options.bg)
        jscolor.install()
        //get opacity from variables flag
        document.getElementById('op_from_var').checked =  options.op_from_var
    }
}

 /* END DOM */

function extract(){
    const editor = document.querySelector('.CodeMirror').CodeMirror
    setDefaultOptions()
    //From
    let fromData = getFrom()
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
function setDefaultOptions(){
    const options = {
        from: ['hex', 'rgb', 'rgba'],
        to: false,
        op: false,
        bg: '#fff',
        op_from_var: false
    }
    
    //From
    let fromData = getFrom()
    if(fromData.response){
        options.from = fromData.data
    }
    
    //To
    let toData = getTo()
    if(toData.response){
        options.to = toData.data
    }

    //Opacity
    const toggleOp = document.getElementById('ab_op')
    if(toggleOp.checked) {

        //Value
        let opacityData = getOpacity()
        if (opacityData.response) {
            options.op = opacityData.data
        }

        //get opacity from variables flag
        options.op_from_var = document.getElementById('op_from_var').checked
    }

    //Background
    let backgroundData = getBackground()
    if (backgroundData.response) {
        options.bg = backgroundData.data
    }

    localStorage.setItem('manual_options', JSON.stringify(options))
}
function colorList(colors){
    const editor = document.querySelector('.CodeMirror').CodeMirror,
          wrapper = document.querySelector('.color-list-wrapper')
    wrapper.appendChild(document.createElement("div"))
    wrapper.querySelector('div').classList.add('color-list')
    colors.forEach((col, index)=>{
        colors[index].id = 'color-'+index
        let html = `
            <div class="color-row" id="color-${index}">
                <p class="color-main"><span id="color-${index}-new">${col.color}</span> &lharu; <span class="color-original">${col.original}</span></p>
                <div class="color-info"></div>
                <div class="open-color-btn"><img src="/assets/images/shared/edit-color.png" alt="edit color icon"></div>
            </div>`
        wrapper.querySelector('.color-list').insertAdjacentHTML('beforeend', html)
        document.querySelector('#color-'+index+' .open-color-btn').addEventListener('click', ()=>{
            editColor(col)
        })
    })
    localStorage.setItem('manual_colors', JSON.stringify(colors))
    let actions = `
        <div class="row mx-auto justify-center mt-4 g-4">
            <button class="conversion-btn-sec m-0" id="reset_btn">BACK</button>
            <button class="conversion-btn-pri m-0" id="build_btn">BUILD</button>
        </div>`
    wrapper.insertAdjacentHTML('beforeend', actions)
    document.getElementById('reset_btn').addEventListener('click', resetConversion)
    document.getElementById('build_btn').addEventListener('click', build)
    if(!document.querySelector('.editor-wrapper').classList.contains('hidden')){
        document.querySelector('.editor-wrapper').classList.add('hidden')
    }
    if(wrapper.classList.contains('hidden')){
        wrapper.classList.remove('hidden')
    }
    disableSidebar()
}
function build(){
    let optionsJSON = localStorage.getItem('manual_options')
    const editor = document.querySelector('.CodeMirror').CodeMirror

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

        setMarkedEvents()
        enableSidebar()
    }
}
function editColor(data){
    /*DOM SETTINGS*/
    closeEditColor()
    let options = JSON.parse(localStorage.getItem('manual_options')),
        html = `
        <div class="blue-overlay">
            <div class="color-editor">
                <div class="close-button"></div>
                <div class="parameters result">
                    <div id="editorResult" data-new="${data.color}">
                        <p>${data.original}</p>
                        <div class="center-fix">
                            <div class="color-square" style="background-color:${data.original}"></div> 
                            &rharu; 
                            <div id="converted_color_sqr" class="color-square" style="background-color:${data.color}"></div> 
                        </div>
                        <p id="converted_color_txt">${data.color}</p>
                    </div>
                </div>
                <div class="parameters" id="to_single">
                    <p>
                        <span class="h3">Final format</span>
                        <span class="relative">
                            <span class="info-btn">i</span>
                            <span class="info-text">If no format is selected the conversion won't change the color format</span>
                        </span>
                    </p>
                    <input type="radio" class="ghost" name="format_out_single" id="rgb_out_single" value="rgb" ${options.to === 'rgb' ? 'checked' : ''}>
                    <label class="btn-primary" for="rgb_out_single">RGB</label>
                    <input type="radio" class="ghost" name="format_out_single" id="rgba_out_single" value="rgba" ${options.to === 'rgba' ? 'checked' : ''}>
                    <label class="btn-primary" for="rgba_out_single">RGBA</label>
                    <input type="radio" class="ghost" name="format_out_single" id="hex_out_single" value="hex" ${options.to === 'hex' ? 'checked' : ''}>
                    <label class="btn-primary" for="hex_out_single">HEX</label>
                </div>
                <div class="parameters" id="opacity_single">
                    <h3>Opacity general options</h3>
                    <div class="parameter toggle-wrapper parameter-wide">
                        <label for="ab_op_single">Absorb Opacity 
                            <span class="relative">
                                <span class="info-btn">i</span>
                                <span class="info-text">This value will never overwrite rgba alpha value, it will only works for rgb and hex</span>
                            </span>
                        </label>
                        <input type="checkbox" class="toggle" name="ab_op_single" id="ab_op_single" ${options.op || options.op === 0 ? 'checked' : ''}>
                    </div>
                    <div class="parameter parameter-wide no-events">
                        <label for="op_single">Default value</label>
                        <input type="text" name="op_single" id="op_single" value="${options.op || options.op === 0 ? options.op : 1}" maxlength="4" class="input-primary input-number">
                    </div>
                    <div class="parameter parameter-wide no-events">
                        <label for="bg_single">Default color</label>
                        <input type="text" name="bg_single" id="bg_single" class="input-primary" data-jscolor="{value: '${options.bg}'}">
                    </div>
                </div>
                <div class="text-center">
                    <button class="conversion-btn-pri">SAVE</button>
                </div>
            </div>
        </div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', html)
    if(options.op || options.op === 0){
        document.getElementById('ab_op_single').checked = true
        document.querySelectorAll('#opacity_single .no-events').forEach(el=>el.classList.remove('no-events'))
    }
    /* CONVERTER */
    //first we save an editable copy of our options
    let specific_options = localStorage.getItem('manual_single_options')
    if(!specific_options){
        let specific_options = options
        localStorage.setItem('manual_single_options', JSON.stringify(options))
    }
    //then we set all of ours events
    //TO FORMAT
    document.querySelectorAll('#to_single input[type="radio"]').forEach(input => {
        //deselect + convert
        document.querySelector('label[for="' + input.id + '"]').addEventListener('click', (e) => {
            let value = input.value
            if (input.checked) {
                e.preventDefault()
                input.checked = false
                value = false
            }
            singleColorConversion(data, 'to', value)
        })
    })
    //OP
    //toggle no-events on opacity + convert
    document.getElementById('ab_op_single').addEventListener('change', () => {
        document.querySelectorAll("#opacity_single .parameter:not(:first-of-type)").forEach(el => {
            if(document.getElementById('ab_op_single').checked){
                el.classList.remove("no-events")
            } else {
                el.classList.add("no-events")
            }
        })

        if(document.getElementById('ab_op_single').checked){
            singleColorConversion(data, 'op', parseFloat(document.getElementById('op_single').value))
        } else {
            singleColorConversion(data, 'op', false)
        }
    })

    //validate opacity value + convert
    document.getElementById('op_single').addEventListener('input', (e)=>{
        const inputElement = e.target,
            lastChIndex = inputElement.value.length - 1
        if(inputElement.value[lastChIndex] === ','){
            inputElement.value = inputElement.value.substring(0, lastChIndex) + '.'
        }
        let inputValue = inputElement.value
        if (!/^[\d.]*$/.test(inputValue)) {
            inputElement.value = inputValue.replace(/[^0-9.]/g, '')
        }
        if(parseFloat(inputElement.value) > 1){
            inputElement.value = 1
        }
        if(!isNaN(parseFloat(inputElement.value) && parseFloat(inputElement.value) < 1)){
            singleColorConversion(data, 'op', parseFloat(inputElement.value))
        }
    })

    //BG
    jscolor.install()
    document.getElementById('bg_single').addEventListener('input', function(){
        singleColorConversion(data, 'bg', this.value)
    })
    
    document.querySelector('.blue-overlay .close-button').addEventListener('click', closeEditColor)
    document.querySelector('.blue-overlay .conversion-btn-pri').addEventListener('click', ()=>saveColor(data.id))
}
function singleColorConversion(color, option, value){
    /* 1. Prendiamo le opzioni del colore
    *  2. Settiamo le opzioni con quella da aggiornare
    *  3. Convertiamo il colore
    *  4. Settiamo il colore convertito
    * */
    let general_options = JSON.parse(localStorage.getItem('manual_single_options'))   
    general_options[option] = value
    localStorage.setItem('manual_single_options', JSON.stringify(general_options))

    let MiniCalculator = new Calculator(general_options.from, general_options.to, [color.original], general_options.op, general_options.bg),
        result = MiniCalculator.calc()[0]
    document.getElementById('editorResult').dataset.new = result.css
    document.getElementById('converted_color_txt').innerText = result.css
    document.getElementById('converted_color_sqr').style.backgroundColor = result.css
}
function closeEditColor(){
    let colorEditors = document.querySelectorAll('.blue-overlay')
    if(colorEditors.length){
        colorEditors.forEach(el => {
            el.remove()
        })
    }
}
function saveColor(id){
    const rowColor = document.getElementById(id+'-new'),
        newColor = document.getElementById('editorResult').dataset.new
    rowColor.innerText = newColor

    let colors = JSON.parse(localStorage.getItem('manual_colors'))
    console.log(colors)
    colors.forEach((col, i) => {
        if (col.id === id){
            colors[i].color = newColor
            localStorage.setItem('manual_colors', JSON.stringify(colors))
        }
    })
    closeEditColor()
}
function resetConversion(){
    const editor = document.querySelector('.CodeMirror').CodeMirror,
          wrapper = document.querySelector('.color-list-wrapper')
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