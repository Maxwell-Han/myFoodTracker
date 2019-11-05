
let ajaxDateObj = moment()
let prevDateObj = {}
let nextDateObj = {}

function setDates() {
  let currMonth = document.querySelector('.current-month')
  currMonth.textContent = moment.months()[parseInt(currMonth.textContent)]
  let currDate = document.querySelector('.current-day')
  let currYear = document.querySelector('.current-year')
  let prevPlaceHolderDate = moment()
  let nextPlaceHolderDate = moment()
  let prevDate = null
  let nextDate = null
  //use moment methods below
  let dateArray = [ajaxDateObj, prevPlaceHolderDate, nextPlaceHolderDate]
  dateArray.forEach((dateObj) => {
    dateObj.date(currDate.textContent)
    dateObj.month(currMonth.textContent)
    dateObj.year(currYear.textContent)
  })
  //set final values for prev and next date using moment methods
  prevDate = prevPlaceHolderDate.subtract(1, 'days')
  nextDate = nextPlaceHolderDate.add(1, 'days')

  //set final values of prev and next date Objects
  prevDateObj.month = prevDate.month()
  prevDateObj.date = prevDate.date()
  prevDateObj.year = prevDate.year()

  nextDateObj.month = nextDate.month()
  nextDateObj.date = nextDate.date()
  nextDateObj.year = nextDate.year()
}

//set nav prev and next links to corresponding href
function setLinks(){
  let prevDateLink = document.querySelector('.prev-day')
  let nextDayLink = document.querySelector('.next-day')
  let prefix = null
  if(window.location.pathname.includes('goto')){
    prefix = ''
  }else{
    prefix = 'log/goto'
  }
  prevDateLink.href = `${prefix}?day=${prevDateObj.date}&month=${prevDateObj.month}&year=${prevDateObj.year}`
  nextDayLink.href = `${prefix}?day=${nextDateObj.date}&month=${nextDateObj.month}&year=${nextDateObj.year}`
}

const favorite = document.getElementById('favorite')
const setFavoriteHandler = () => {
  favorite.addEventListener('click', (e) => {
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
  setDates()
  setLinks()
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
  //set the date if page is not today's actual date
  if(!checkAjaxAndMomentDates()){
    data.dateObj = ajaxDateObj
  }
  ajaxPostRequest(data)
})

function ajaxPostRequest(data) {
  let url = `/${location.href.split('/').slice(-2)[0]}/log`
  if(location.href.includes('goto')) {
    let urlArray = location.href.split('/').slice(-3)
    url = `/${urlArray[0]}/${urlArray[1]}/${urlArray[2]}`
  }
  let httpRequest = new XMLHttpRequest()
  if(!httpRequest) {
    console.log('unable to make request')
    return false
  }
  httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState ===XMLHttpRequest.DONE) {
      if(httpRequest.status === 200) {
        location.reload()
      } else {
        console.log('there was a problem with the request')
      }
    }
  }
  httpRequest.open('POST', url, true)
  httpRequest.setRequestHeader('Content-Type', 'application/json')
  httpRequest.send(JSON.stringify(data))
}

const deleteIcons = document.querySelectorAll('.delete')
for(let i = 0; i < deleteIcons.length; i++) {
  deleteIcons[i].addEventListener('click', deleteHandler)
}

function deleteHandler(e){
  let entryId = e.currentTarget.parentElement.id
  let url = `/${document.querySelector('.username').textContent}/api/delete/${entryId}`

  let httpRequest = new XMLHttpRequest()
  if(!httpRequest) {
    console.log('unable to make request')
    return false
  }
  httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
      if(httpRequest.status === 200) {
        window.location.reload()
      } else {
        console.log('there was a problem with the request')
      }
    }
  }

  httpRequest.open('DELETE', url, true)
  httpRequest.send()
}

document.addEventListener('DOMContentLoaded', function() {
  renderMacroSums()
  calculateCalorieConsumed()
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
  const carbNodes = document.querySelectorAll('.entry-carb')
  const fatNodes = document.querySelectorAll('.entry-fat')
  const proteinNodes = document.querySelectorAll('.entry-protein')
  const carbs = mapMacroValues(carbNodes)
  const fats = mapMacroValues(fatNodes)
  const protein = mapMacroValues(proteinNodes)
  if(!carbs) {
    return {
      carbSum: 0,
      fatSum: 0,
      proteinSum: 0
    }
  }
  return {
    carbSum: carbs,
    fatSum: fats,
    proteinSum: protein
  }
}

function mapMacroValues(nodelist){
  let elements = [... nodelist]
  elements.unshift(0)
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

// show and hide favorites menu
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

// handle populating favorite macros to input form
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
        setFavEntry(fav)
      }
      e.currentTarget.className += ' fav-active'
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
