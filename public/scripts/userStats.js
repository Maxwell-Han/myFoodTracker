// grab user data from json
const favData = JSON.parse(document.querySelector('.favorites').textContent)
const entryData = JSON.parse(document.querySelector('.weekly-entries').textContent)

const macros = {
  carbs: parseInt(document.querySelector('.carb-target').textContent),
  fat: parseInt(document.querySelector('.fat-target').textContent),
  protein: parseInt(document.querySelector('.protein-target').textContent)
}

const consumed = document.querySelector('.cal-consumed')
const allowed = document.querySelector('.cal-allowed')
const calDifference = document.querySelector('.cal-difference')
const carbBalance = document.querySelector('.carb-balance')
const fatBalance = document.querySelector('.fat-balance')
const proteinBalance = document.querySelector('.protein-balance')
// get day and week total calories
const dailyCal = () => {
  let carbs = macros.carbs * 4
  let fat = macros.fat * 9
  let protein = macros.protein * 4
  return (carbs + fat + protein)
}

// up to the current day of the week, set the number of total calorie intake allowed
const setWeeklyCal = () => {
  let caloriesSoFar = getDayCount() * dailyCal()
  allowed.textContent = caloriesSoFar
}

const setPounds = () => {
  let pounds = document.querySelector('.pounds')
  let cals = parseInt(document.querySelector('.cal-difference').textContent)
  let poundsNumb = Number(Math.round(cals/3500+'e2')+'e-2')
  pounds.textContent  = poundsNumb
}
/*
  start with array of prev week food entries
  reduce through the array on the macro values and sum totals
*/
const getConsumedMacros = () => {
  let initialVal = {
    carb: 0,
    fat: 0,
    protein: 0
  }
  let arr = entryData.slice()
  arr.unshift(initialVal)
  let result = arr.reduce( (accumObj, entryObj) => {
      accumObj.carb += entryObj.carb
      accumObj.fat += entryObj.fat
      accumObj.protein += entryObj.protein
      return accumObj
  })
  return result
}

// based on day of week, get total cal consumption and fill in missing days with default consumption
// days with no entries will be filled with full calorie allowance so overall progress is not under stated
const calculateCaloriesAsOfToday = () => {
  let numbDaysSoFar = getDayCount()
  let numbDaysWithEntries = getDaysWithEntries()
  let numbDaysWithoutEntries = numbDaysSoFar - numbDaysWithEntries
  let consumedMacrosObj = getConsumedMacros()
  let carb = consumedMacrosObj.carb * 4
  let fat = consumedMacrosObj.fat * 9
  let protein = consumedMacrosObj.protein * 4
  let actuallyConsumedCal =  carb + fat + protein
  let defaultConsumedCal = numbDaysWithoutEntries * dailyCal()
  consumed.textContent =  actuallyConsumedCal + defaultConsumedCal
  calDifference.textContent = parseInt(allowed.textContent) - parseInt(consumed.textContent)
}

// get set of all created at week days
// get count of how many days until today don't have entries
const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const getDaysWithEntries = () => {
  const loggedDays = entryData.map( entry => {
    let dateObj = moment(entry.createdAt.slice(0,10))
    let dayIndex = moment(dateObj).day()
    return weekdays[dayIndex]
  })
  loggedDays.unshift([])
  const uniqueDays = loggedDays.reduce( ( accum, day) => {
    if(!accum.includes(day)) {
      accum.push(day)
      return accum
    }
    return accum
  })
  return uniqueDays.length
}

const getDayCount = () => {
  let todayNumb = moment().day() + 1
  return todayNumb
}

const calculateMacroBalances = () => {
  let numbDaysWithEntries = getDaysWithEntries()
  let consumedMacros = getConsumedMacros()
  let macroAllowance = {
    carbs: macros.carbs * numbDaysWithEntries,
    fat: macros.fat * numbDaysWithEntries,
    protein: macros.protein * numbDaysWithEntries
  }
  let macroBalances = {
    carb: macroAllowance.carbs - consumedMacros.carb,
    fat: macroAllowance.fat - consumedMacros.fat,
    protein: macroAllowance.protein - consumedMacros.protein,
  }
  return macroBalances
}

const setMacroBalances = () => {
  let macroBalances = calculateMacroBalances()
  carbBalance.textContent  = macroBalances.carb
  fatBalance.textContent  = macroBalances.fat
  proteinBalance.textContent  = macroBalances.protein
}

const calBalance = document.querySelector('.cal-balance')
const calDirection = document.querySelector('.cal-icon')

const setCalIcon = () => {
  if(calBalance > 0) {
    calDirection.textContent = "- "
    calDirection.style.color = "red"
  } else {
    calDirection.textContent = "+ "
    calDirection.style.color = "green"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setWeeklyCal()
  calculateCaloriesAsOfToday()
  setPounds()
  setMacroBalances()
  setCalIcon()
})
