const Author = "Ohradka Gergő"
const Title = "Időjárás előrejelzés"
const Company = "Türr István Technikum"

const ServerURL = "http://localhost:3000"

let author = document.querySelector('#Author')
let title = document.querySelector('#Title')
let company = document.querySelector('#Company')

author.innerHTML = Author
title.innerHTML = Title
company.innerHTML = Company

let main = document.querySelector('main')


let theme = 'light'

let lightmodeBtn = document.querySelector('#lightmodeBtn')
let darkmodeBtn = document.querySelector('#darkmodeBtn')

lightmodeBtn.addEventListener('click', () => {
    setTheme('light')
    saveTheme('light')
})

darkmodeBtn.addEventListener('click', () => {
    setTheme('dark')
    saveTheme('dark')
})

function themeButton(theme) {
    if (theme == 'light') {
        lightmodeBtn.classList.add('hide')
        darkmodeBtn.classList.remove('hide')
    } else {
        darkmodeBtn.classList.add('hide')
        lightmodeBtn.classList.remove('hide')
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme)
    themeButton(theme)
}

function saveTheme(theme) {
    localStorage.setItem('SCTheme', theme)
}

function loadTheme() {
    if (localStorage.getItem('SCTheme')) {
        theme = localStorage.getItem('SCTheme')
    }
    setTheme(theme)
}

loadTheme()


async function render(view) {
    main.innerHTML = await (await fetch(`views/${view}.html`)).text()
    // TODO: render

    switch (view) {
        case "home":
            setDate()
            await getWeather()
            renderWeather()
            break;
        default:
            break;
    }
}

let beforeMenu = document.querySelector('#beforeMenu')
let afterMenu = document.querySelector('#afterMenu')

let loggedUser = null

async function getLoggedUser() {
    if (sessionStorage.getItem('loggedUser')) {
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        beforeMenu.classList.add('hide')
        afterMenu.classList.remove('hide')
        await render('home')
    } else {
        loggedUser = null
        beforeMenu.classList.remove('hide')
        afterMenu.classList.add('hide')
        await render('login')
    }
}

getLoggedUser()


async function loadComponent(page) {
    main.innerHTML = await (await fetch(`views/${page}.html`)).text()
    if (page == 'profile') {
        getProfile()
    }
}