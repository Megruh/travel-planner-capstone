//planning page//
const tripsList = document.querySelector('#trips-list')
const message = document.querySelector("#message")
const homeBtn = document.getElementById('home-button')
const documentBtn = document.getElementById('document-button')

const refreshFutureTrips = () => {
    while(tripsList.hasChildNodes()){
        tripsList.firstChild.remove()
    }
    getFutureTrips()
}


const addCity = (event) => {
    event.preventDefault()
    const inputField = document.querySelector("input")
    axios.post('/future-trips', {trip_name: inputField.value})
    .then(res => {
        refreshFutureTrips()

        inputField.value = '' 
    })
    
}

const getFutureTrips = () => {
    axios.get('/future-trips')
    .then(res => {
        for (let i = 0; i < res.data.length; i++) {
            const city = document.createElement('li')
            city.dataset.tripId = res.data[i].future_trip_id
            const cityName = document.createElement('span')
            if (res.data[i].is_checked){
                cityName.classList.add('checked')
            }
            cityName.textContent = res.data[i].trip_name
            city.appendChild(cityName)
            
            cityName.addEventListener('click', crossOffCity)
            
            const deleteBtn = document.createElement("button")
            const x = deleteBtn.textContent
            
            deleteBtn.addEventListener('click', deleteFutureTrip)
            
            city.appendChild(deleteBtn)
            
            const select = document.querySelector('ul')
            select.appendChild(city)

        }
    })
}

document.querySelector('form').addEventListener("submit", addCity)

window.onload = getFutureTrips

const revealMessage = () => {
    message.classList.remove('hide')

    setTimeout(() => {
        message.classList.add('hide')
    }, 1000)
}

const deleteFutureTrip = (event) => {
    axios.delete('/future-trips', {data: {future_trip_id: event.target.parentNode.dataset.tripId}})
    .then(res => {
        refreshFutureTrips()
        message.textContent = `${event.target.parentNode.firstChild.textContent} deleted!`
        revealMessage()
    })
}


const crossOffCity = (event) => {
    event.target.classList.toggle('checked')
    const body = {id: event.target.parentNode.dataset.tripId, is_checked: event.target.classList.contains('checked')}
    axios.put('/future-trips', body)
    if (event.target.classList.contains("checked")){
        message.textContent = `${event.target.textContent} visited!`
    } else {
        message.textContent = `${event.target.textContent} added back!`
    }
    revealMessage()
}

homeBtn.addEventListener('click', () => {
    window.location.href = '/home'
})

documentBtn.addEventListener('click', () => {
    window.location.href = '/document'
})