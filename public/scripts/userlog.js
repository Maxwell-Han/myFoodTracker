console.log('hello from userlog.js')

const currMonth = document.querySelector('.current-month')
currMonth.textContent = moment.months()[parseInt(currMonth.textContent)]
const currDate = document.querySelector('.current-day')
const currYear = document.querySelector('.current-year')

const prevDateLink = document.querySelector('.prev-day')
const nextDayLink = document.querySelector('.next-day')

var prevDate = null
var nextDate = null
var prevDateObj = {}
var nextDateObj = {}
//fix code here so that it uses the date passed in from server
let prevPlaceHolderDate = moment()
let nextPlaceHolderDate = moment()

let ajaxDateObj = moment()

function setDates() {
  //use moment methods below
  [ajaxDateObj, prevPlaceHolderDate, nextPlaceHolderDate].forEach((dateObj) => {
    dateObj.date(currDate.textContent)
    //is this setting a string for month?
    dateObj.month(currMonth.textContent)
    dateObj.year(currYear.textContent)
    console.log('today is ', dateObj)
  })
  //probably need to copy the today object below
  prevDate = prevPlaceHolderDate.subtract(1, 'days')
  nextDate = nextPlaceHolderDate.add(1, 'days')

  console.log(prevPlaceHolderDate, nextPlaceHolderDate, prevDate, nextDate)

  prevDateObj.month = prevDate.month()
  prevDateObj.date = prevDate.date()
  prevDateObj.year = prevDate.year()

  nextDateObj.month = nextDate.month()
  nextDateObj.date = nextDate.date()
  nextDateObj.year = nextDate.year()

}
document.addEventListener("DOMContentLoaded", setDates)
document.addEventListener("DOMContentLoaded", setLinks)

function setLinks(){
  prevDateLink.href = `${prefix}?day=${prevDateObj.date}&month=${prevDateObj.month}&year=${prevDateObj.year}`
  nextDayLink.href = `${prefix}?day=${nextDateObj.date}&month=${nextDateObj.month}&year=${nextDateObj.year}`
}

var prefix = null
if(window.location.pathname.includes('goto')){
  prefix = ''
}else{
  prefix = 'log/goto'
}

const date = {
  today: new Date(),
  prevDate: function(){
    var prev = new Date()
    prev.setDate(prev.getDate() - 1)
    return prev
  },
  nextDate: function(){
    var nextDay = new Date()
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay
  }
}

const favorite = document.getElementById('favorite')
const setFavoriteHandler = () => {
  favorite.addEventListener('click', (e) => {
    console.log('the current target is ', e.currentTarget)
    console.log('the classNames are ', e.currentTarget.className)
    let targ  = e.currentTarget
    let classNames = favorite.className.split(' ')
    if(classNames.includes('false')) {
      targ.className = 'material-icons true'
      targ.textContent = 'favorite_filled'
    } else {
      targ.className = 'material-icons false'
      targ.textContent = 'favorite_border'
    }
  })
}
document.addEventListener('DOMContentLoaded', function() {
  setFavoriteHandler()
})



const ajaxPost = document.querySelector('.ajax-post')

function checkAjaxAndMomentDates(){
  let momentDate = moment()

  if(momentDate.date() === ajaxDateObj.date() &&
      momentDate.month() === ajaxDateObj.month() &&
      momentDate.year() === ajaxDateObj.year()){
        return true
      }
  return false
}

ajaxPost.addEventListener('click', function(){
  console.log('clicked the ajax post')
  const fav = document.getElementById('favorite')
  const favClass = fav.className.split(' ')
  let favBool = null
  if(favClass[favClass.length - 1] === 'false') {
    favBool = false
  } else {
    favBool = true
  }
  //grab form data
  let data = {
    name: document.querySelector('.new-entry-name').value,
    carb: parseInt(document.querySelector('.new-entry-carb').value),
    fat: parseInt(document.querySelector('.new-entry-fat').value),
    protein: parseInt(document.querySelector('.new-entry-protein').value),
    favorite: favBool
  }
  console.log('the value of checkAjaxAndMomentDates is ', checkAjaxAndMomentDates())
  if(!checkAjaxAndMomentDates()){
    console.log('hello from the if statement')
    data.dateObj = ajaxDateObj
  }
  console.log(data)
  ajaxPostRequest(data)
  //add new entry to list
})

function ajaxPostRequest(data) {
  var url = `/${location.href.split('/').slice(-2)[0]}/log`
  if(location.href.includes('goto')) {
    let urlArray = location.href.split('/').slice(-3)
    url = `/${urlArray[0]}/${urlArray[1]}/${urlArray[2]}`
  }
  var httpRequest = new XMLHttpRequest()
  if(!httpRequest) {
    console.log('unable to make request')
    return false
  }
  httpRequest.onreadystatechange = function(){
    //add new entry to page if post is successful and make success message appear
    if(httpRequest.readyState ===XMLHttpRequest.DONE) {
      if(httpRequest.status === 200) {
        console.log('the response text is ', httpRequest.responseText)
        location.reload()
      } else {
        console.log('there was a problem with the request')
        console.log(httpRequest.responseText)
      }
    }
  }

  httpRequest.open('POST', url, true)
  httpRequest.setRequestHeader('Content-Type', 'application/json')
  httpRequest.send(JSON.stringify(data))
}

//function to add new data to screen

const deleteIcons = document.querySelectorAll('.delete')
for(let i = 0; i < deleteIcons.length; i++) {
  deleteIcons[i].addEventListener('click', deleteHandler)
}

function deleteHandler(e){
  let entryId = e.currentTarget.parentElement.id
  let url = `/${document.querySelector('.username').textContent}/api/delete/${entryId}`

  var httpRequest = new XMLHttpRequest()
  if(!httpRequest) {
    console.log('unable to make request')
    return false
  }
  httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
      if(httpRequest.status === 200) {
        console.log('the response text is ', httpRequest.responseText)
        window.location.reload()
      } else {
        console.log('there was a problem with the request')
      }
    }
  }

  httpRequest.open('DELETE', url, true)
  // httpRequest.setRequestHeader('Content-Type', 'application/json')
  httpRequest.send()
}
//Calculate each macro and render to screen
document.addEventListener("DOMContentLoaded", function(){
  renderMacroSums()
  calculateCalorieConsumed()
}, false)

document.addEventListener('DOMContentLoaded', function() {
  calculateMacroGoal()
  calculateRemainingCalories()
})

function calculateRemainingCalories() {
  let consumed = parseInt(document.querySelector('#cal-consumed').textContent)
  let target = parseInt(document.querySelector('#cal-target').textContent)
  let remaining = target - consumed
  document.querySelector('#cal-remaining').textContent = remaining
}

function calculateMacroGoal() {
  let carbs = parseInt(document.querySelector('.carb-goal').textContent) * 4
  let fat = parseInt(document.querySelector('.fat-goal').textContent) * 9
  let protein = parseInt(document.querySelector('.protein-goal').textContent) * 4

  let calories = carbs + fat + protein
  document.querySelector('#cal-target').textContent = calories
}

function calculateCalorieConsumed() {
  const macroObj = calculateMacros()
  console.log(macroObj)
  let carbSum = macroObj['carbSum'] * 4
  let fatSum = macroObj['fatSum'] * 9
  let proteinSum = macroObj['proteinSum'] * 4
  document.querySelector('#cal-consumed').textContent = carbSum + fatSum + proteinSum
}

function renderMacroSums(){
  const sums = calculateMacros()
  const currentCarbs = document.querySelector('.today-carb')
  currentCarbs.textContent = sums.carbSum
  const currentFats = document.querySelector('.today-fat')
  currentFats.textContent = sums.fatSum
  const currentProtein = document.querySelector('.today-protein')
  currentProtein.textContent = sums.proteinSum
}

function calculateMacros(){
  const carbs = mapMacroValues(document.querySelectorAll('.entry-carb'))
  const fats = mapMacroValues(document.querySelectorAll('.entry-fat'))
  const protein = mapMacroValues(document.querySelectorAll('.entry-protein'))
  if(!carbs) return
  return {
    carbSum: carbs,
    fatSum: fats,
    proteinSum: protein
  }
}

function mapMacroValues(nodelist){
  var elements = [... nodelist]
  let values = elements.map( node => {
    return parseInt(node.textContent)
  })
  return values.reduce( (accum, val) => {
    return accum + val
  })
}

//Calculate remaining macros for the day
document.addEventListener("DOMContentLoaded", getRemainingMacros)
function getRemainingMacros(){
  const consumedTotals = calculateMacros()
  const carbGoal = parseInt(document.querySelector('.carb-goal').textContent)
  const fatGoal = parseInt(document.querySelector('.fat-goal').textContent)
  const proteinGoal = parseInt(document.querySelector('.protein-goal').textContent)

  document.querySelector('.carbs-remaining').textContent = carbGoal - consumedTotals.carbSum
  document.querySelector('.fats-remaining').textContent = fatGoal - consumedTotals.fatSum
  document.querySelector('.protein-remaining').textContent = proteinGoal - consumedTotals.proteinSum
}

// function ajaxDeleteRequest() {
//   // set parent's id value, create url to delete api route with that id
//   // /:username/log/api/delete?id=xxxxxxxx
//   var parent =
// }

const addFavButton = document.querySelector('.add-fav-button')
const closeFavButton = document.querySelector('.close-fav')
const favContainer = document.querySelector('.fav-container')

function favButtonHandler() {
  addFavButton.addEventListener('click', () => {
    addFavButton.style.display = 'none'

    favContainer.style.display = "inline-block"
  })
}

function addCloseFavHandler() {
  closeFavButton.addEventListener('click', () => {
    addFavButton.style.display = "inline-block"
    favContainer.style.display = "none"
  })
}

document.addEventListener("DOMContentLoaded", () => {
    favButtonHandler()
    addCloseFavHandler()
})

/*
The user favorites should be added as part of the GET request and
rendered in using EJS
The favorite button should trigger the display of the favorites menu
and hide itself at the same time
*/

let lastFav = null
function favItemSelection() {
  const favorites = document.querySelectorAll('.fav-item')
  favorites.forEach( fav => {
    fav.addEventListener('click', (e) => {
      let currentClassNames = fav.className
      if(lastFav){
        lastFav.className = 'fav-item'
      }
      lastFav = fav
      if(currentClassNames.includes('fav-active')) {
        console.log('updating new entry with favorite details')
        setFavEntry(fav)
      }
      e.currentTarget.className += ' fav-active'
      console.log('triggered the event listener')
    })
  })
}

const setFavEntry = (favorite) => {
  let favSpans = favorite.querySelectorAll('span')
  let name = favSpans[0].textContent
  let carb = favSpans[1].textContent
  let fat = favSpans[2].textContent
  let protein = favSpans[3].textContent

  document.querySelector('.new-entry-name').value = name
  document.querySelector('.new-entry-carb').value = carb
  document.querySelector('.new-entry-fat').value = fat
  document.querySelector('.new-entry-protein').value = protein
}

document.addEventListener("DOMContentLoaded", favItemSelection)
