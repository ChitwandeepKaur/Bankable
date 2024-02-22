const users     = JSON.parse(localStorage.getItem('users')),
      loginForm = document.getElementById('loginForm'),
      usersMap  = new Map(JSON.parse(localStorage.getItem('userpins')))

//Login Page Code
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = loginForm.elements
    const username = data[0].value,
          userPIN  = data[1].value
    if(usersMap.has(username) && usersMap.get(username) === userPIN){
        window.alert('Login successful')
        window.location.href = '../dashboard/dashboard.html'
    }
    else if(usersMap.has(username) && usersMap.get(username) !== userPIN) window.alert('Password incorrect')
    else {
        if(window.confirm(`User doesn't exist. Redirect to Sign up page?`)) window.location.replace("../signup/signUp.html")
    }
})

function showPassword() {
    const pin = document.getElementById("pin")

    if (pin.type === 'password') pin.type = "text"
    else pin.type = "password"
}
//use the reduce method to calculate the balnace of the account
//change window alerts to dialog boxes.