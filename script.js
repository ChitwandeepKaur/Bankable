const signUpForm = document.getElementById('signupForm'),
      users     = new Array(),
      loginForm = document.getElementById('loginForm'),
      usersMap = new Map()

//Signup Page Code
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = signUpForm.elements
    users.push({
        username: data[0].value,
        firstName: data[1].value,
        lastName: data[2].value,
        pin: data[3].value,
    })
    usersMap.set(data[0].value, data[3].value)
    //add age
    window.alert(`User Created Successfully.
You will now be redirected to the Login Page`)

//change this window alert to some dialog box or something

    changeUserView('signup', 'login')
})

//Login Page Code
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = loginForm.elements
    const username = data[0].value,
          userPIN  = data[1].value
    if(usersMap.has(username) && usersMap.get(username) === userPIN) window.alert('Login successful')
    else if(usersMap.has(username) && usersMap.get(username) !== userPIN) window.alert('Password incorrect')
    else window.alert(`User doesn't exist`)
})


function changeUserView(currentPageName, newDisplayPageName){
    document.getElementsByClassName(currentPageName)[0].classList.add('d-none')
    document.getElementsByClassName(newDisplayPageName)[0].classList.remove('d-none')
}