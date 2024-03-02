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
        console.log(localStorage.getItem(this._sessionId))
        //get HTML
        if(!localStorage.getItem('tutorial')){
            console.log('tutorial closed')
            return false;
        } else {
            console.log('tutorial opened')
            fetch('/components/tutorial-overlay.html')
            .then(result => result.text())
            .then(text=> document.querySelector('body').innerHTML += text);

            document.querySelector('body').style.overflow = 'hidden'
        }

        console.log(this._steps)
    }

}


