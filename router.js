//ROUTER
import { Router } from './js/classes/router.class.js'
//let router = new Router('http://127.0.0.1:8000');
//let router = new Router('http://localhost:8000');
let router = new Router('https://coding-color.it');
//rotte
router.get('/', function(){buildPage('home.html', 'home.css')});
router.get('/manual', function(){buildPage('manual.html')});
router.get('/automatic', function(){buildPage('auto.html', 'main.css', 'auto.js')});
router.get('/single', function(){buildPage('single.html')});
router.start();

function buildPage(mainHTML, css, src){
    function loadCss(){
        let link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = "./assets/css/"+css;
        document.head.append(link);
    }

    async function navbar() {
        const resp = await fetch("./components/navbar.html");
        const html = await resp.text();
        document.getElementById("app").insertAdjacentHTML("beforebegin", html);
    }

    async function main() {
        const resp = await fetch("./views/"+mainHTML);
        const html = await resp.text();
        document.getElementById("app").innerHTML = ''
        document.getElementById("app").insertAdjacentHTML("afterbegin", html);
    }

    async function footer() {
        const resp = await fetch("./components/footer.html");
        const html = await resp.text();
        document.getElementById("app").insertAdjacentHTML("afterend", html);
    }

    function script(){
        let script = document.createElement('script');
        script.src = "./js/"+src;
        script.type = "module";
        document.body.append(script);
    }

    if (!document.getElementById("navbar")) {
        navbar();
    }

    if (!document.getElementById("footer")) {
        footer();
    }

    if (css) loadCss();
    main();
    if (src) script();
}