/* DOM */

//textarea
const editor = CodeMirror.fromTextArea(document.getElementById('colorsCss'), {
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
});

//Convert button
document.getElementById('calculate_btn').addEventListener('click', ()=>{convert()})

//toggle no-events on opacity
document.getElementById('ab_op').addEventListener('change', ()=>{
    document.querySelectorAll("#opacity .parameter:not(:first-of-type)").forEach(el=> el.classList.toggle("no-events"))
})

//validate opaciti value
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