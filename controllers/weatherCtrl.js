// TODO: normális season check egy function-el setDate-ből

let weather = []

function setDate() {
    let today = new Date().toISOString().split('T')[0]
    let dateInput = document.querySelector('#dateInput')
    dateInput.setAttribute('min', today)
}

async function addWeather() {
    let date = document.querySelector('#dateInput').value
    let minTemp = document.querySelector('#minTemp').value
    let maxTemp = document.querySelector('#maxTemp').value
    let idojarasSelect = document.querySelector('#idojarasSelect')
    let idojarasSelectValue = idojarasSelect.options[idojarasSelect.selectedIndex].value

    if (date == "" || minTemp == "" || maxTemp == "" || idojarasSelectValue == "Választás...") {
        alertMessage("Nem adtál meg minden adatot!", 'danger')
        return
    }

    if (Number(minTemp) >= Number(maxTemp)) {
        alertMessage("Nem lehet a min. hőmérséklet nagyobb vagy egyenlő, mint a max.!", 'danger')
        return
    }

    let idx = weather.findIndex(w => w.date == date && w.uId == loggedUser.id)
    //console.log(idx) itt valami boszorkányság történik
    if (idx == -1) {
        try {
            let res = await fetch(`${ServerURL}/weather`, {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    uId: loggedUser.id,
                    date: date,
                    minTemp: minTemp,
                    maxTemp: maxTemp,
                    weatherType: idojarasSelectValue
                })
            });

            let data = await res.json()

            if (res.status == 200) {
                alertMessage(`${data.msg}`, 'success')
                await getWeather()
                renderWeather()
            } else {
                alertMessage(`${data.msg}`, 'danger')
            }

        } catch (error) {
            console.log(error)
            alertMessage("Hiba történt az adatok mentése során!", 'danger')
        }

    } else {
        try {
            let res = await fetch(`${ServerURL}/weather/${weather[idx].id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    uId: loggedUser.id,
                    date: date,
                    minTemp: minTemp,
                    maxTemp: maxTemp,
                    weatherType: idojarasSelectValue
                })
            });

            let data = await res.json()

            if (res.status == 200) {
                alertMessage(`${data.msg}`, 'success')
                await getWeather()
                renderWeather()
            } else {
                alertMessage(`${data.msg}`, 'danger')
            }

        } catch (error) {
            console.log(error)
            alertMessage("Hiba történt az adatok frissítése során!", 'danger')
        }
    }
}

async function getWeather() {
    try {
        let res = await fetch(`${ServerURL}/weather/user/${loggedUser.id}`)
        weather = await res.json()
        weather = weather.sort((a, b) => b['date'].localeCompare(a['date']))
        //console.log(weather) nem tudom miért nem kapja meg
    } catch (error) {
        console.log(error)
        alertMessage("Hiba történt az adatok lekérdezése során!", 'danger')
    }
}

function renderWeather() {
    let tableBody = document.querySelector('tbody')
    tableBody.innerHTML = ""

    weather.forEach((w, index) => {
        let tr = document.createElement('tr')

        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let td4 = document.createElement('td')
        let td5 = document.createElement('td')

        td1.innerHTML = (index + 1) + '.'
        td2.innerHTML = w.date
        td3.innerHTML = w.minTemp + '°C'
        td4.innerHTML = w.maxTemp + '°C'
        td5.innerHTML = w.weatherType

        td3.classList.add('text-end')
        td4.classList.add('text-end')

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)

        tableBody.appendChild(tr)
    });
}