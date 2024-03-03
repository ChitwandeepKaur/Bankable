const currentUser = JSON.parse(localStorage.getItem('users'))[Number(localStorage.getItem('currentUser'))],
      usernameRegex = /^[a-zA-Z0-9]{7,20}$/,
      movementsContainer = document.querySelector('#movements'),
      lastLogin = document.querySelector('.lastLogin'),
      transferToField = document.querySelector('.form__input--to'),
      transferForm    = document.querySelector('.form--transfer'),
      transferAmount  = document.querySelector('.form__input--amount'),
      loanForm   = document.querySelector('.form--loan'),
      loanAmount = document.querySelector('.form__loan--amount'),
      deleteForm = document.querySelector('.form--close'),
      deleteUser = document.querySelector('.form__input--deleteUser'),
      confirmPin = document.querySelector('.form__input--pin'),
      LOGOUT_TIME = 5 * 60 * 1000;

let sortedArray = [], 
    noOfFilters = 0, 
    noOfSorts   = 0, 
    sortedMap   = new Map(), 
    movementValues = []

document.getElementById('userName').innerText = `${currentUser.firstName.slice(0,1).toUpperCase().concat(currentUser.firstName.slice(1))} ${currentUser.lastName.slice(0,1).toUpperCase().concat(currentUser.lastName.slice(1))}!`
if(currentUser.lastLoginSession[1] === 1) lastLogin.innerText = 'NA'
else lastLogin.innerText = `${formatDate(currentUser.lastLoginSession[0])}`

logoutTimer()
displayMovements(currentUser.movements)
getBalance()

function logoutTimer(){
    setTimeout(function(){
        window.alert('Your timed session is over. Logging you out now...')
        localStorage.removeItem('currentUser')
        window.location.href = '../index/index.html'
    }, LOGOUT_TIME);
}

function displayMovements(movements) {
    movementsContainer.innerHTML = ''
    sortedMap.clear()
    sortedArray    = []
    movementValues = []
    movements.forEach(function(mov, i){
      movementsContainer.insertAdjacentHTML('afterbegin', `
      <div class="movements">
      <div class="movements__row" onclick="toggleDesc(${i})">
      ${i+1} &nbsp; 
        <div class="movements__type movements__type--${mov.amount > 0 ? 'deposit' : 'withdrawal'}"> ${mov.amount > 0 ? 'deposit' : 'withdrawal'}</div>
        <span class="senderDesc">${mov.amount>0? 'Received from': 'Sent to'}: ${mov.source}</span>
        <div class="movements__value">&#8377 ${Math.abs(mov.amount)}</div>
      </div>
      <div class="details--${i} details">
        <div class="row">
            <div class="col-5">Additional Description:</div>
            <div class="col-7">${mov.desc}</div>
        </div>
        <div class="row">
            <div class="col-5">Time of Transaction:</div>
            <div class="col-7">${formatDate(mov.timestamp)}</div>
        </div>
      </div>
      `)
      sortedMap.set(String(mov.amount), JSON.stringify(mov))
      movementValues.push(mov.amount)
      sortedArray.push(mov)
    })
  }

function getBalance(){
    let balance = movementValues.reduce((acc, curr)=>acc + curr, 0)
    document.getElementById('userBalance').innerText = balance
    return balance
}

const signOutUser = function (){
    localStorage.removeItem('currentUser')
    if(window.confirm('Are you sure you want to log out?')) window.location.href = '../index/index.html'
}

function formatDate(timestamp) {
    return moment(timestamp).format('D MMM YYYY h:mmA');
}

function toggleDesc(i) {
    const targetDesc = document.querySelector(`.details--${i}`)
    if (targetDesc.style.display === 'none') targetDesc.style.display = 'block'
    else targetDesc.style.display = 'none'
}

function filterMovements() {
    noOfFilters++
    if(noOfFilters%2 === 1){
        displayMovements(currentUser.movements.filter(function(curr){
            return curr.amount>0
        }))
    } else {
        displayMovements(currentUser.movements.filter(function(curr){
            return curr.amount<0
        }))
    }
}

function sortMovements() {
    for(let key of sortedMap.keys()){
        if(Number(key) < 0){
            const newKey = String(Math.abs(Number(key)))
            sortedMap.set(newKey, sortedMap.get(key))
            sortedMap.delete(key)
        }
    }
    noOfSorts++
    if(noOfSorts%2 === 1){
        sortedMap = new Map([...sortedMap.entries()].sort((a, b) => a[0] - b[0]))
    } else {
        sortedMap = new Map([...sortedMap.entries()].sort((a, b) => b[0] - a[0]))
    }

    sortedArray = []

    for(let value of sortedMap.values()) sortedArray.push(JSON.parse(value))
    displayMovements(sortedArray)
}

function loansFilter(){
    if(document.getElementById('loansCheck').checked){
        sortedArray = currentUser.movements.filter(function(curr){
            return curr.source==='Loan'
        })
    
    displayMovements(sortedArray)
    }
    else displayMovements(currentUser.movements)
}

transferForm.addEventListener('submit', (e)=> {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users'))
    if(!transferAmount.value || !transferToField.value){
        window.alert('Complete the transfer form to proceed')
    }
    else if(!usernameRegex.test(transferToField.value)){
        window.alert(`Username should be between 7 and 20 charaters!
The username can have lower case and upper case characters and numbers.`)
    clearTransferForm()
    }
    else if (transferToField.value === currentUser.username){
        window.alert('You cannot transfer funds to yourself.')
        clearTransferForm()
    }
    else if (transferAmount.value > getBalance()){
        window.alert('Error: The transfer amount is more than the account balance')
        clearTransferForm()
    }
    else if(!users.filter((curr)=>{
        return curr.username === transferToField.value
    }).length){ window.alert('User doesnot exist')}
    else {
        const transferedTo = users.filter((curr)=>{
            return curr.username === transferToField.value
        })[0],
        transferedFrom = users.filter((curr)=>{
            return curr.username === currentUser.username
        })[0]

        let desc = window.prompt('Give additional description related to this transfer:')
        if(!desc) {
            desc = 'Default Description (A desc wasnot provided by the user'
        }

        const enteredPIN = Number(window.prompt("Enter your PIN to complete your transaction"))
        if(enteredPIN === Number(currentUser.pin)){
            transferedTo.movements.push({
                amount    : Number(transferAmount.value),
                source    : currentUser.username,
                timestamp : new Date(),
                desc      : desc
            })
            currentUser.movements.push({
                amount    : -Number(transferAmount.value),
                source    : transferToField.value,
                timestamp : new Date(),
                desc      : desc
            })
            transferedFrom.movements.push({
                amount    : -Number(transferAmount.value),
                source    : transferToField.value,
                timestamp : new Date(),
                desc      : desc
            })
            window.alert('Transaction Complete')
            displayMovements(currentUser.movements)
            getBalance()
            updateUsers(users)
        }
        else {
            window.alert('Wrong PIN entered')
        }
        clearTransferForm()
    }
})

function clearTransferForm(){
    transferAmount.value  = ''
    transferToField.value = ''
}

function updateUsers(users){
    localStorage.setItem('users', JSON.stringify(users))
}

loanForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const loan = loanAmount.value
    if(loan > getBalance()) window.alert('You cannot request loan amount more than you have in your account.')
    else {
        window.alert('Your loan will be approved soon...Please wait.')
        setTimeout(function(){
            const users = JSON.parse(localStorage.getItem('users')),
            loanRequestedFrom = users.filter((curr)=>{
                return curr.username === currentUser.username
            })[0]
                currentUser.movements.push({
                    amount    : Number(loan),
                    source    : 'Loan',
                    timestamp : new Date(),
                    desc      : 'Loan amount requested from bank'
                })
                loanRequestedFrom.movements.push({
                    amount    : Number(loan),
                    source    : 'Loan',
                    timestamp : new Date(),
                    desc      : 'Loan amount requested from bank'
                })
                displayMovements(currentUser.movements)
                getBalance()
                updateUsers(users)
                window.alert('Your Loan has been approved')
        }, 3000)
    }
    loanAmount.value = ''
})

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if(!deleteUser.value || !confirmPin.value){
        window.alert('Enter your username and PIN to delete your account')
        clearLoanForm()
    }
    else if(deleteUser.value !== currentUser.username){
        window.alert('Username invalid. You can only delete your own account!')
        clearLoanForm()
    }
    else if (Number(confirmPin.value) !== Number(currentUser.pin)) {
        window.alert('Wrong PIN entered')
        clearLoanForm()
    }
    else {
        if(window.confirm('Are you sure you want to delete your account?')){
            const newUsers = JSON.parse(localStorage.getItem('users')).filter((curr)=>{
                return curr.username !== currentUser.username
            })
            updateUsers(newUsers)
            localStorage.removeItem('currentUser')
            const newUsersMap = new Map(JSON.parse(localStorage.getItem('userpins')))
            newUsersMap.delete(currentUser.username)
            localStorage.setItem('userpins',JSON.stringify([...newUsersMap]))
            window.location.href = '../index/index.html'
        }
        clearLoanForm()
    }
})

function clearLoanForm(){
    deleteUser.value = ''
    confirmPin.value = ''
}