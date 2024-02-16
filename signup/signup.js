const signUpForm = document.getElementById('signupForm'),
      users     = new Array(),
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
    window.location.href='./index.html'
})