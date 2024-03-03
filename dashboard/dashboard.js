const currentUser = JSON.parse(localStorage.getItem('users'))[Number(localStorage.getItem('currentUser'))],
      movementsContainer = document.querySelector('#movements'),
      lastLogin = document.querySelector('.lastLogin'),
      transferToField = document.querySelector('.form__input--to'),
      transferForm = document.querySelector('.form--transfer'),
      transferAmount = document.querySelector('.form__input--amount'),
      usernameRegex = /^[a-zA-Z0-9]{7,20}$/

let sortedArray = [], noOfFilters = 0, noOfSorts = 0, sortedMap = new Map(), movementValues = []

document.getElementById('userName').innerText = `${currentUser.firstName.slice(0,1).toUpperCase().concat(currentUser.firstName.slice(1))} ${currentUser.lastName.slice(0,1).toUpperCase().concat(currentUser.lastName.slice(1))}!`
if(currentUser.lastLoginSession[1] === 1) lastLogin.innerText = 'NA'
else lastLogin.innerText = `${formatDate(currentUser.lastLoginSession[0])}`


displayMovements(currentUser.movements)
getBalance()

function displayMovements(movements) {
    movementsContainer.innerHTML = ''
    sortedMap.clear()
    sortedArray = []
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
      movementValues.push(mov.amount)
      sortedMap.set(String(mov.amount), JSON.stringify(mov))
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
        if(Number(key)<0){
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
        })[0]
        let desc = window.prompt('Give additional description related to this transfer:')
        if(!desc) {
            desc = 'Default Description (A desc wasnot provided by the user'
        }
        console.log(currentUser.pin)
        const enteredPIN = Number(window.prompt("Enter your PIN to complete your transaction"))
        if(Number(enteredPIN) === Number(currentUser.pin)){
            transferedTo.movements.push({
                amount: Number(transferAmount.value),
                source: currentUser.username,
                timestamp: new Date(),
                desc: desc
            })
            currentUser.movements.push({
                amount: -Number(transferAmount.value),
                source: transferToField.value,
                timestamp: new Date(),
                desc: desc
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
    transferAmount.value = ''
    transferToField.value = ''
}

function updateUsers(users){
    localStorage.setItem('users', JSON.stringify(users))
}