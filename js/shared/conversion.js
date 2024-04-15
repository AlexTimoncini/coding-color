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

//as now we can select no final format (so it won't be changed) we have to make those radios button unselectable
document.querySelectorAll('#to input[type="radio"]').forEach(btn => {
    let id = btn.id;
    document.querySelector('label[for="' + id + '"]').addEventListener('click', (e) => {
        if (btn.checked) {
            e.preventDefault()
            btn.checked = false
        }
    })
})

//validate opacity value
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

//Editor init
const editor = CodeMirror.fromTextArea(document.getElementById('colorsCss'), {
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
})

//Copy editor btn
document.querySelector('.copy-icon').addEventListener('click', copyToClipboardCss)

//marked colors click and hover
function setMarkedEvents(){
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
                            <p>&rharu;</p>
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

function copyToClipboardColor(text){
    navigator.clipboard.writeText(text);
    alert('Color ' + text + ' has been copied to clipboard', 'success');
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