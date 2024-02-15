//ROUTER
import { Router } from './js/classes/router.class.js'
//let router = new Router('http://127.0.0.1:8000');
//let router = new Router('http://localhost:8000');
let router = new Router('https://coding-color.it');
//rotte
router.get('/', function(){buildPage('home.html', 'home.css')});
router.get('/tools', function(){buildPage('tools.html', 'tools.css')});
router.get('/manual', function(){buildPage('manual.html')});
router.get('/automatic', function(){buildPage('auto.html', 'auto.css', 'auto.js')});
router.get('/single', function(){buildPage('single.html')});
router.start();

async function buildPage(mainHTML, css, src){
    disableScroll()
    if (document.getElementById("loader")) {
        document.getElementById("loader").classList.remove("hidden")
    }

    function removeOldStyles() {
        const existingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-default=true])');
        existingStyles.forEach(style => style.remove());
    }

    function loadCss(){
        if(css){
            let link = document.createElement('link');
            link.rel = "stylesheet";
            link.href = "./assets/css/"+css;
            document.head.append(link);
        }
        return Promise.resolve();
    }

    async function loader() {
        const resp = await fetch("./components/loader.html");
        const html = await resp.text();
        document.getElementById("app").insertAdjacentHTML("beforebegin", html);
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

    if (!document.getElementById("loader")) {
        await loader();
    }

    if (!document.getElementById("navbar")) {
        await navbar();
    }

    if (!document.getElementById("footer")) {
        await footer();
    }

    await main();
    removeOldStyles()
    loadCss();
    if(src) script();
    
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        enableScroll()
    }, 1000);
}