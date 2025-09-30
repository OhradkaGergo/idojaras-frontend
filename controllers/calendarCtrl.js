let calendarE = [];

async function getCalendar() {
    try {
        const res = await fetch(`${ServerURL}/weather/user/${loggedUser.id}`); 
        weather = await res.json();
        calendarE = [];

        weather.forEach(w => {
            calendarE.push(
                {title: 'Időjárás: ' + w.weatherType, start: w.date, backgroundColor: "#0275d8", borderColor: "#0275d8"},
                {title: 'Min. Hőmérséklet: ' + w.minTemp + ' °C', start: w.date, backgroundColor: "#0275d8", borderColor: "#0275d8"},
                {title: 'Max. Hőmérséklet: ' + w.maxTemp + ' °C', start: w.date, backgroundColor: "#0275d8", borderColor: "#0275d8"}
            );
        });
    } catch (err) {
        Alerts("Hiba történt az adatok lekérdezésekor!", 'danger');
    }
}

function initCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'hu',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: calendarE
    });
    calendar.render();
}