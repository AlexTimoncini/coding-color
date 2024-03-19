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