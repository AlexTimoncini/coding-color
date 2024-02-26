function buildTutorial(options){
    document.querySelector('body').appendChild('<div class="overlay-tutorial"></div>')
    options.step.forEach(step=>console.log(step))
}