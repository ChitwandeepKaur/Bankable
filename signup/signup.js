const signUpForm = document.getElementById('signupForm'),
      users      = JSON.parse(localStorage.getItem('users')) || new Array(),
      usersMap   = new Map(JSON.parse(localStorage.getItem('userpins'))) || new Map(),
      pinRegex   = /^\d{4}$/,
      usernameRegex = /^[a-zA-Z0-9]{7,20}$/

//Signup Page Code
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = signUpForm.elements
    data[3].value = Number(data[3].value)

    if(!usernameRegex.test(data[0].value))       window.alert(`Username should be between 7 and 20 charaters!
The username can have lower case and upper case characters and numbers.`)
    else if(!pinRegex.test(data[3].value))       window.alert('PIN should be a 4 digit number')
    else if(usersMap.has(String(data[0].value))) window.alert('Username already exists')
    else createNewUserName(data)
})

const createNewUserName = function (data){
    users.push({
        username  : data[0].value,
        firstName : data[1].value,
        lastName  : data[2].value,
        pin       : data[3].value,
        movements : [{
            amount    : 10000,
            source    : 'Bankable',
            timestamp : new Date(),
            desc      : 'This is a sign up bonus provided by the bank, welcoming you onboard.'

        }],
        lastLoginSession: [null, 0]
    })

    usersMap.set(data[0].value, data[3].value)
    localStorage.setItem('userpins',JSON.stringify([...usersMap]))
    localStorage.setItem('users', JSON.stringify(users))

    window.alert(`User Created Successfully. 
A Rs1000 has been added to your account as sign up bonus.
You will now be redirected to the Login Page`)

    window.location.href='../login/login.html'
}

function validatePassword() {
 
    const pass             = document.getElementById('pin').value,
          confirm_pass     = document.getElementById('confirmPin').value,
          wrong_pass_alert = document.getElementById('wrong_pass_alert'),
          submitBtn        =  document.getElementById('submitBtn')
    
    if(pass === '') {
        wrong_pass_alert.innerHTML = ''
        submitBtn.disabled         = false
        submitBtn.style.opacity    = 1
    }
    else if (pass !== confirm_pass) {
        wrong_pass_alert.style.color = 'red'
        wrong_pass_alert.innerHTML   = '☒ Use same password'
        submitBtn.disabled           = true
        submitBtn.style.opacity      = 0.4
    } else {
        wrong_pass_alert.style.color = 'green'
        wrong_pass_alert.innerHTML   = '✅ Password Matched'
        submitBtn.disabled           = false
        submitBtn.style.opacity      = 1
    }
}

function showPassword() {
    const confirmPin = document.getElementById("confirmPin"),
          pin        = document.getElementById("pin")

    if (confirmPin.type === "password" && pin.type === 'password') {
        confirmPin.type = "text"
        pin.type        = "text"
    } else {
      confirmPin.type = "password"
      pin.type        = "password"
    }
}