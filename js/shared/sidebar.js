initSidebar()

function initSidebar(){
    let sidebar = document.querySelector('.sidebar'),
        filters = document.querySelector('.sidebar .filter-column')
    let chill = false
    document.querySelector('.sidebar-toggle').addEventListener('click', function(){
        //chill to prevent multiple clicks
        if (!chill) {
            chill = true
            toggleSidebar()
            setTimeout(function () {
                chill = false
            }, 300)
        }
    
    })
}

function toggleSidebar(){
    let sidebar = document.querySelector('.sidebar'),
        filters = document.querySelector('.sidebar .filter-column')
    sidebar.classList.toggle('minimize')
    if(filters.classList.contains('hidden')){
        setTimeout(()=>filters.classList.remove('hidden'),300)
    } else {
        filters.classList.add('hidden')
    }
}

function disableSidebar(){
    let sidebar = document.querySelector('.sidebar'),
    filters = document.querySelector('.sidebar .filter-column')
.querySelector('.sidebar')
    if(!sidebar.classList.contains('minimize')){
        sidebar.classList.add('minimize')
    }
    if(!filters.classList.contains('hidden')){
        filters.classList.add('hidden')
    }
    sidebar.classList.add('no-events')
}

function enableSidebar(){
    let sidebar = document.querySelector('.sidebar')
    if(sidebar.classList.contains('no-events')){
        sidebar.classList.remove('no-events')
    }
}