import {Calculator} from './classes/coding-color.class.js';
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