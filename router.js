//ROUTER
import { Router } from './js/classes/router.class.js'
let url = window.location.href
if(url[url.length - 1] === "/"){
    url = url.substring(0, url.length - 1)
}
let router = new Router(url);
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
    if(css)loadCss()
    navbar()
    main()
    footer()
    if(src)script()
}