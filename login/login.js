const users     = new Array(),
      loginForm = document.getElementById('loginForm'),
      usersMap = new Map()

//Login Page Code
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = loginForm.elements
    const username = data[0].value,
          userPIN  = data[1].value
    if(usersMap.has(username) && usersMap.get(username) === userPIN) window.alert('Login successful')
    else if(usersMap.has(username) && usersMap.get(username) !== userPIN) window.alert('Password incorrect')
    else {
        if(window.confirm(`User doesn't exist. Redirect to Sign up page?`)) window.location.replace("/signUp.html")
    }
})

//use the reduce method to calculate the balnace of the account