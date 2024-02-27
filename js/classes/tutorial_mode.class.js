export class Tutorial {
    constructor(options) {
        this._steps = options.steps;
        this._sessionId = 'tutorial_'+options.identifier;
    }

    start() {
        //start session
        if(localStorage.getItem(this._sessionId) === null){
            localStorage.setItem(this._sessionId, true)
        }

        //get HTML
        if(!localStorage.getItem('tutorial')){
            return false;
        } else {
            fetch('components/tutorial-overlay.html')
            .then(result => result.text())
            .then(text=> document.querySelector('body').innerHTML += text);

            document.querySelector('body').style.overflow = 'hidden'
        }

        console.log(this._steps)
    }

}


