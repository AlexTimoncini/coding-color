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

document.getElementById('ab_op').addEventListener('change', ()=>{
    document.querySelectorAll("#opacity .parameter:not(:first-of-type)").forEach(el=> el.classList.toggle("no-events"))
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