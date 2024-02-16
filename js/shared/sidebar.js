//sidebar hide/show
let chill = false;
document.querySelector(".sidebar-toggle").addEventListener("click", function(){
    //chill to prevent multiple clicks
    if (!chill) {
        chill = true;
        let sidebar = this.parentElement
        sidebar.classList.toggle("minimize")

        let filters = this.nextElementSibling
        if(filters.classList.contains("hidden")){
            setTimeout(()=>filters.classList.remove('hidden'),300)
        } else {
            filters.classList.add('hidden')
        }

        setTimeout(function () {
            chill = false;
        }, 300);
    }

})