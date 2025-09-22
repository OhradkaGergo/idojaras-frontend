const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registration() {
    let nameInput = document.querySelector('#nameInput').value
    let emailaddInput = document.querySelector('#emailaddInput').value
    let passwordInput = document.querySelector('#passwordInput').value
    let passwordInputAgain = document.querySelector('#passwordInputAgain').value

    if (nameInput == "" || emailaddInput == "" || passwordInput == "" || passwordInputAgain == "") {
        alertMessage("Nincs megadott adat!", 'danger')
        return
    }

    if (passwordInput != passwordInputAgain) {
        alertMessage("A két jelszó nem egyezik!", 'danger')
        return
    }
    
    if (!passwordRegExp.test(passwordInput)) {
        alertMessage("A megadott jelszó nem elég biztonságos!", 'danger')
        return
    }

    if (!emailRegExp.test(emailaddInput)) {
        alertMessage("Az email cím nem megfelelő!", 'danger')
        return
    }
}

async function login() {
    let emailaddInput = document.querySelector('#emailaddInput').value
    let passwordInput = document.querySelector('#passwordInput').value

    if (emailaddInput == "" || passwordInput == "") {
        alertMessage("Nincs megadott adat!", 'danger')
        return
    }
}

async function logout() {
    
}
