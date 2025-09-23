const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: itt igazából még minden is kell

async function registration() {
    let nameInput = document.querySelector('#nameInput')
    let emailaddInput = document.querySelector('#emailaddInput')
    let passwordInput = document.querySelector('#passwordInput')
    let passwordInputAgain = document.querySelector('#passwordInputAgain')

    if (nameInput.value == "" || emailaddInput.value == "" || passwordInput.value == "" || passwordInputAgain.value == "") {
        alertMessage("Nincs megadott adat!", 'danger')
        return
    }

    if (passwordInput.value != passwordInputAgain.value) {
        alertMessage("A két jelszó nem egyezik!", 'danger')
        return
    }
    
    if (!passwordRegExp.test(passwordInput.value)) {
        alertMessage("A megadott jelszó nem elég biztonságos!", 'danger')
        return
    }

    if (!emailRegExp.test(emailaddInput.value)) {
        alertMessage("Az email cím nem megfelelő!", 'danger')
        return
    }

    try {
        const res = await fetch(`${ServerURL}/users`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body:
                JSON.stringify(
                    {
                        name: nameInput.value,
                        email: emailaddInput.value,
                        password: passwordInput.value
                    }
                )
        });
        let alertStatus = res.status == 200 ? 'success' : 'danger';
        const data = await res.json();
        alertMessage(`${data.msg}`, alertStatus)

        if (res.status == 200) {
            nameInput.value == ""
            emailaddInput.value == ""
            passwordInput.value == ""
            passwordInputAgain.value == ""
        }
    } catch (error) {
        console.log("Hiba:", error)
    }
}   

async function login() {
    let emailaddInput = document.querySelector('#emailaddInput').value
    let passwordInput = document.querySelector('#passwordInput').value

    if (emailaddInput == "" || passwordInput == "") {
        alertMessage("Nincs megadott adat!", 'danger')
        return
    }

    let user = {}
    try {
        const res = await fetch(`${ServerURL}/users/login`, {
            method: "POST",
            headers: {'Content-Type':'application/json'},
            body:
                JSON.stringify(
                    {
                        email: emailaddInput,
                        password: passwordInput
                    }
                )
        })
        user = await res.json()
        
        if (user.id) {
            loggedUser = user
            console.log("halo")
        }

        if (!loggedUser) {
            alertMessage("Hibás bejelentkezési adatok!", 'danger')
            console.log("th")
            return
        }

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
        await render('home')
        alertMessage("Sikeres bejelentkezés!", 'success')

    } catch (error) {
        console.log("Hiba:", error)
    }

    location.reload()
}

async function logout() {
    sessionStorage.removeItem('loggedUser')
    getLoggedUser()
    render('login')
}

function getProfile() {
    let emailaddInput = document.querySelector('#emailaddInput').value
    let nameInput = document.querySelector('#nameInput').value
    let currentUser = JSON.parse(sessionStorage.getItem('loggedUser'))

    emailaddInput = currentUser.email
    nameInput = currentUser.name
}

// TODO: update profile ✔✔✔✔ | update password 

async function updateProfile() {
    let emailaddInput = document.querySelector('#emailaddInput').value
    let nameInput = document.querySelector('#nameInput').value

    if (nameInput == "" || emailaddInput == "") {
        alertMessage("Nem adtál meg minden adatot!", 'danger')
        return
    }

    if (!emailRegExp.test(emailaddInput)) {
        alertMessage("Nem megfelelő email cím", 'danger')
        return
    }

    try {
        const res = await fetch(`${ServerURL}/users/profile`, {
            method: "PATCH",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(
                {
                    id: loggedUser.id,
                    name: nameInput,
                    email: emailaddInput
                }
            )
        })

        let alertStatus = res.status == 200 ? 'success' : 'danger'
        const data = await res.json()

        if (res.status == 200) {
            sessionStorage.setItem('loggedUser', JSON.stringify({id: loggedUser.id, name: nameInput, email: emailaddInput, password: loggedUser.password}))
        }

        alertMessage(`${data.msg}`, alertStatus)
    } catch (error) {
        alertMessage(`Hiba történt módosítás során: ${error}`, 'danger')
    }
}

async function updateProfile() {
    // update profile ide
}