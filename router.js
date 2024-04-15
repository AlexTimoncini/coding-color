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
            {url: 'shared/codemirror.min.js', type: 'module'},
            {url: 'shared/jscolor.min.js', type: 'module'},
            {url: 'shared/sidebar.js', type: false},
            {url: 'shared/conversion.js', type: false},
            {url: 'manual.js', type: 'module'}
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
            {url: 'shared/codemirror.min.js', type: 'module'},
            {url: 'shared/jscolor.min.js', type: 'module'},
            {url: 'shared/sidebar.js', type: false},
            {url: 'shared/conversion.js', type: false},
            {url: 'auto.js', type: 'module'}
        ]).then(()=>stopLoading())
});
router.get('/single', function(){
    buildPage('single.html').then(()=>stopLoading())
});

router.start();

async function buildPage(mainHTML, css, scriptList){
    //RUN
    startLoading()
    removeOldStyles()
    loadCss();
    if (!document.getElementById("loader"))await loader()
    if (!document.getElementById("navbar"))await navbar()
    if (!document.getElementById("footer"))await footer()
    await main()
    await scripts()

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
    async function scripts() {
        const existingScripts = document.querySelectorAll('script:not([data-default=true])');
        existingScripts.forEach(spt => spt.remove());
        if (scriptList) {
            for (const scripty of scriptList) {
                await loadScript(scripty)
            }
        }
        
    }
    async function loadScript(scripty) {
        return new Promise((resolve, reject) => {
            let newScript = document.createElement('script')
            newScript.src = "./js/" + scripty.url
            if (scripty.type) newScript.type = scripty.type
            newScript.onload = () => {
                resolve()
            }
            newScript.onerror = (error) => {
                reject(error)
            }
            document.body.append(newScript);
        })
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