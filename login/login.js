const users     = JSON.parse(localStorage.getItem('users')),
      loginForm = document.getElementById('loginForm'),
      usersMap  = new Map(JSON.parse(localStorage.getItem('userpins')))

//Login Page Code
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data     = loginForm.elements,
          username = data[0].value,
          userPIN  = data[1].value
    if(usersMap.has(username) && usersMap.get(username) === userPIN){
        for(const user of users){
            if(user.username === username){
                currentUser = String(users.indexOf(user))
                user.lastLoginSession[1]++
                if(user.lastLoginSession[1] !== 1) user.lastLoginSession[0] = new Date()
                localStorage.setItem('users', JSON.stringify(users))
            }
        }
        localStorage.setItem('currentUser', currentUser)
        window.alert('Login successful. You will be logged out automatically after 5 mins')
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