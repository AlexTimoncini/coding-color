export class Tutorial {
    constructor(options) {
        this._steps = options.steps;
        this._sessionId = 'tutorial_'+options.identifier;
        this.step_index = parseInt(localStorage.getItem('step_index') || 0)
    }

    start() {
        //start session
        if(localStorage.getItem(this._sessionId) === null){
            localStorage.setItem(this._sessionId, true)
            localStorage.setItem('step_index', this.step_index)
        }
        console.log(localStorage.getItem(this._sessionId))
        //get HTML
        if(!localStorage.getItem(this._sessionId)){
            console.log('tutorial closed')
            return false;
        } else {
            fetch('/components/tutorial-overlay.html')
            .then(result => result.text())
            .then(text=>{

                document.querySelector('body').innerHTML += text
                document.querySelector('body').style.overflow = 'hidden'
                this.build()
            });
        }
    }

    build(){
        //replace index
        document.getElementById('step_index').innerHTML = this.step_index + 1

        //replace title
        document.getElementById('step_title').innerHTML = this._steps[this.step_index].title

        //replace message
        document.getElementById('step_msg').innerHTML = this._steps[this.step_index].msg

        //actions
        document.getElementById('tutorial_prev').addEventListener('click', ()=>{this.prev()});
        document.getElementById('tutorial_next').addEventListener('click', ()=>{this.next()});

        //spotlight
        document.querySelectorAll('.spotlight').forEach(el=>el.classList.remove('spotlight'))
        document.querySelector(this._steps[this.step_index].selector).classList.add('spotlight')

    }

    prev(){
        console.log('prev', localStorage.setItem('step_index', this.step_index))
        if(this.step_index > 0){
            this.step_index--;
            localStorage.setItem('step_index', this.step_index)
            this.build()
        }
    }

    next(){
        console.log('next', localStorage.setItem('step_index', this.step_index))
        if(this.step_index < this._steps.length - 1){
            this.step_index++;
            localStorage.setItem('step_index', this.step_index)
            this.build()
        }
    }
}


