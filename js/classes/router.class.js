export class Router {
    constructor(root) {
        this.root = root;
        this.routes = {};
    }
    get(route, callback) {
        this.routes[this.root + route] = callback;
    }
    start() {
        window.addEventListener('popstate', this.handleURLChange.bind(this));
        window.addEventListener('load', this.handleURLChange.bind(this));

        if (window.location.hash) {
            const currentURL = window.location.href.split('#')[0];
            history.replaceState({}, document.title, currentURL);
        }
    }

    handleURLChange() {
        const currentPath = window.location.pathname;
        const currentRoute = this.root + (currentPath || '/');

        if (currentRoute in this.routes) {
            this.routes[currentRoute]();
        } else {
            console.log('Route not found, loading default route');
            const defaultRoute = this.root + '/';
            if (defaultRoute in this.routes) {
                this.routes[defaultRoute]();
            }
        }
    }

    navigateTo(route) {
        const newURL = this.root + route;
        history.pushState({}, document.title, newURL);
        this.handleURLChange();
    }
}
