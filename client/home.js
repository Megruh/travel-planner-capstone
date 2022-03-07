//axios requests
//home page//

const planBtn = document.getElementById('plan-trip-btn')

const documentBtn = document.getElementById('document-trip-btn')

planBtn.addEventListener('click', () => {
    window.location.href = '/planner'
})

documentBtn.addEventListener('click', () => {
    window.location.href = '/document'
})

