// TODO: normális season check egy function-el

let weather = []
let selectedWeather = null

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
    if (idx == -1) {
        try {
            let res = await fetch(`${ServerURL}/weather`, {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    userId: loggedUser.id,
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
                    userId: loggedUser.id,
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
        let td6 = document.createElement('td')

        let editBtn = document.createElement('button');
        let deleteBtn = document.createElement('button');

        editBtn.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
        deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');

        td1.innerHTML = (index + 1) + '.'
        td2.innerHTML = w.date
        td3.innerHTML = w.minTemp + '°C'
        td4.innerHTML = w.maxTemp + '°C'
        td5.innerHTML = w.weatherType

        editBtn.innerHTML = '<i class="bi bi-gear-wide-connected"></i>';
        deleteBtn.innerHTML = '<i class="bi bi-x-circle"></i>';

        editBtn.setAttribute('onClick', `editW(${index})`);
        deleteBtn.setAttribute('onClick', `deleteW(${index})`);

        td6.appendChild(editBtn);
        td6.appendChild(deleteBtn);

        td3.classList.add('text-center')
        td4.classList.add('text-center')
        td6.classList.add('text-end')

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)

        tableBody.appendChild(tr)
    });
}

function editW(index) {
    let date = document.querySelector('#dateInput')
    let minTemp = document.querySelector('#minTemp')
    let maxTemp = document.querySelector('#maxTemp')
    let idojarasSelect = document.querySelector('#idojarasSelect')

    modeToggle(true)

    date.value = weather[index].date
    minTemp.value = weather[index].minTemp
    maxTemp.value = weather[index].maxTemp
    idojarasSelect.value = weather[index].weatherType

    selectedWeather = weather[index]
}


function modeToggle(mode) {
    let addBtn = document.querySelector('#addBtn')
    let updateBtn = document.querySelector('#updateBtn')
    let deleteBtns = document.querySelector('#deleteBtn')
    let cancelBtn = document.querySelector('#cancelBtn')

    if (mode) {
        addBtn.classList.add('hide')
        updateBtn.classList.remove('hide')
        deleteBtns.classList.remove('hide')
        cancelBtn.classList.remove('hide')
    } else {
        addBtn.classList.remove('hide')
        updateBtn.classList.add('hide')
        deleteBtns.classList.add('hide')
        cancelBtn.classList.add('hide')
    }
}

function cancel() {
    modeToggle(false)

    let date = document.querySelector('#dateInput')
    let minTemp = document.querySelector('#minTemp')
    let maxTemp = document.querySelector('#maxTemp')
    let idojarasSelect = document.querySelector('#idojarasSelect')
    let idojarasSelectValue = idojarasSelect.options[idojarasSelect.selectedIndex].value

    date.value = null
    minTemp.value = null
    maxTemp.value = null
    idojarasSelect.value = "Választás..."
}

async function updateWeather() {
    let date = document.querySelector('#dateInput').value
    let minTemp = document.querySelector('#minTemp').value
    let maxTemp = document.querySelector('#maxTemp').value
    let idojarasSelect = document.querySelector('#idojarasSelect')
    let idojarasSelectValue = idojarasSelect.options[idojarasSelect.selectedIndex].value

    if (selectedWeather.date == date) {
        try {
            let res = await fetch(`${ServerURL}/weather/${selectedWeather.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    userId: loggedUser.id,
                    date: date,
                    minTemp: minTemp,
                    maxTemp: maxTemp,
                    weatherType: idojarasSelectValue
                })
            })

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
    } else {
        let idx = weather.findIndex(w => w.date == date && w.uId == loggedUser.id)
        
        if (idx == -1) {
            try {
                let res = await fetch(`${ServerURL}/weather`, {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        userId: loggedUser.id,
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
        }
    }
}

async function deleteW(index) {
    if (confirm("Biztosan törölni akarod az időjárás adatot?")) {
        try {
            let res = await fetch(`${ServerURL}/weather/${weather[index].id}`, {
                method: "DELETE",
                headers: {'Content-Type':'application/json'}
            })

            let data = await res.json()

            if (res.status == 200) {
                alertMessage(`${data.msg}`, 'success')
                await getWeather()
                cancel()
                renderWeather()
            } else {
                alertMessage(`${data.msg}`, 'danger')
            }
        } catch (error) {
            Alerts("Hiba történt az időjárás adat törlése során!", 'danger')
        }
    }
}

async function deleteWeather() {
    let idx = weather.findIndex(w => w.id == selectedWeather.id)
    await deleteW(idx)
}