// TODO: normális season check egy function-el setDate-ből

let minTemps = []
let maxTemps = []
let weather = []

function setDate() {
    let today = new Date().toISOString().split('T')[0]
    let dateInput = document.querySelector('#dateInput')
    dateInput.setAttribute('min', today)
}

async function addWeather() {
    let date = document.querySelector('#dateInput')
    let minTemp = document.querySelector('#minTemp')
    let maxTemp = document.querySelector('#maxTemp')
    let idojarasSelect = document.querySelector('#idojarasSelect')
    let idojarasSelectValue = idojarasSelect.options[idojarasSelect.selectedIndex].value

    
    if (date.value == "" || minTemp.value == "" || maxTemp.value == "" || idojarasSelectValue == "Választás...") {
        alertMessage("Nem adtál meg minden adatot!", 'danger')
        return
    }

    if (minTemp.value >= maxTemp.value) {
        alertMessage("Nem lehet a min. hőmrséklet nagyobb, mint a max.!", 'danger')
        return
    }
    
    let idx = weather.findIndex(weatherSingle => weatherSingle.date == date && weatherSingle.uId == loggedUser.id)
    console.log(idx)
    if (idx == -1) {
        try {
            let res = await fetch(`${ServerURL}/weather`, {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body:
                    JSON.stringify(
                        {
                            uId: loggedUser.id,
                            date: date.value,
                            minTemp: minTemp.value,
                            maxTemp: maxTemp.value,
                            weather: idojarasSelectValue
                        }
                    )
            })

            let data = await res.json()

            if (res.status == 200) {
                alertMessage(`${data.msg}`, 'success')
                //await getWeather()
                //renderWeather()
            } else {
                alertMessage(`${data.msg}`, 'danger')
            }
        } catch (error) {
            console.log(error)
            alertMessage("Hiba történt az adatfelvétel során!", 'danger')
        }        
    }
}

async function getWeather() {
    try {
        let res = await fetch(`${ServerURL}/weather/user/${loggedUser.id}`)
        weather = await res.json()
        weather = weather.sort((a,b) => {return b['date'].localeCompare(a['date'])})
        console.log(weather)
    } catch (error) {
        console.log(error)
        alertMessage("Hiba történt az adatlekérdezés közben!", 'danger')
    }
}


/*
async function renderWeather() {
    
}
*/

