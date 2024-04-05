//ROUTER
import { Router } from './js/classes/router.class.js'
//let router = new Router('http://127.0.0.1:8000');
//let router = new Router('http://localhost:8000');
let router = new Router('https://coding-color.it');
//rotte
router.get('/', function(){
    buildPage('home.html',
        ['home.css']).then(()=>stopLoading())
});
router.get('/tools', function(){
    buildPage('tools.html',
        ['tools.css']).then(()=>stopLoading())
});
router.get('/manual', function(){
    buildPage('manual.html',
        [
            'shared/codemirror.min.css',
            'shared/sidebar.css',
            'shared/toggle.css',
            'shared/conversion.css',
            'manual.css'
        ],
        [
            'shared/codemirror.min.js',
            'shared/jscolor.min.js',
            'shared/sidebar.js',
            'shared/conversion.js',
            'manual.js'
        ]).then(()=>stopLoading())
});
router.get('/automatic', function(){
    buildPage('auto.html',
        [
            'shared/codemirror.min.css',
            'shared/sidebar.css',
            'shared/toggle.css',
            'shared/conversion.css',
            'auto.css'
        ],
        [
            'shared/codemirror.min.js',
            'shared/jscolor.min.js',
            'shared/sidebar.js',
            'shared/conversion.js',
            'auto.js'
        ]).then(()=>stopLoading())
});
router.get('/single', function(){
    buildPage('single.html').then(()=>stopLoading())
});

router.start();

async function buildPage(mainHTML, css, src){
    //RUN
    startLoading()
    removeOldStyles()
    loadCss();
    if (!document.getElementById("loader"))await loader()
    if (!document.getElementById("navbar"))await navbar()
    if (!document.getElementById("footer"))await footer()
    await main()
    await script()

    //Functions
    function removeOldStyles() {
        const existingStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-default=true])');
        existingStyles.forEach(style => style.remove());
    }
    function loadCss(){
        if(css){
            css.forEach((url)=>{
                let link = document.createElement('link');
                link.rel = "stylesheet";
                link.href = "./assets/css/"+url;
                document.head.append(link);
            })
        }
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
    async function script() {
        const existingScripts = document.querySelectorAll('script:not([data-default=true])');
        existingScripts.forEach(spt => spt.remove());
        if (src) {
            for (const url of src) {
                await loadScript(url);
            }
        }
    }
    async function loadScript(url) {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = "./js/" + url;
            script.type = "module";
            script.onload = resolve;
            script.onerror = reject;
            document.body.append(script);
        });
    }
}

//loader
function startLoading(){
    disableScroll()
    if (document.getElementById("loader")) {
        document.getElementById("loader").classList.remove("hidden")
    }
}

function stopLoading(){
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        enableScroll()
    }, 500);
}