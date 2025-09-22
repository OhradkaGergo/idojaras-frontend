function alertMessage(message, type) {
    // megkapja a messaget meg a bootstrap typeot
    // csinál elementet, abba belerakja a messaget meg a typeot
    // belerakja az 'alertPh'-ba (alertPlaceholder, csak rövidítve)
    // vár 3 msásodpercet, eltűnik

    let alertPh = document.querySelector('#alertPh')
    let alert = document.createElement('div')

    alert.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show')

    let alertBody = document.createElement('div')
    alertBody.innerHTML = message

    let alertClose = document.createElement('button')
    alertClose.classList.add('btn-close')
    alertClose.dataset.bsDismiss = "alert"

    alert.appendChild(alertBody)
    alert.appendChild(alertClose)
    alertPh.appendChild(alert)

    setTimeout(() => {
        alert.remove()
    }, 3000)
}