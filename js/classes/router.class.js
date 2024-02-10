export class Router {
    constructor(root) {
        this.root = root;
        this.routes = {};
    }
    get(route, callback) {
        this.routes[this.root + route] = callback;
    }
    start() {
        let currentPage = window.location.href;
        if (currentPage in this.routes) {
            this.routes[currentPage]();
        } 
    }
}