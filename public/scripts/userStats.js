
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
document.addEventListener("DOMContentLoaded", setWeeklyCal)

/*
  start with array of prev week food entries
  reduce through the array on the macro values and sum totals
*/
const getConsumedMacros = () => {
  var initialVal = {
    carb: 0,
    fat: 0,
    protein: 0
  }
  var arr = entryData.slice()
  arr.unshift(initialVal)
  var result = arr.reduce( (accumObj, entryObj) => {
      accumObj.carb += entryObj.carb
      accumObj.fat += entryObj.fat
      accumObj.protein += entryObj.protein
      return accumObj
  })
  return result
}



// based on day of week, get total cal consumption and fill in missing days with default consumption
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
document.addEventListener('DOMContentLoaded', calculateCaloriesAsOfToday)

// moment(entryData[0].createdAt).date()
// get set of all created at week days
// get count of how many days until today don't have entries
// days with no entries should be assigned to meet calorie limit
const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const getDaysWithEntries = () => {
  const loggedDays = entryData.map( entry => {
    let dateObj = moment(entry.createdAt.slice(0,10))
    let dayIndex = moment(dateObj).day()
    return weekdays[dayIndex]
  })

  const uniqueDays = loggedDays.reduce( ( accum = [], day) => {
    if(!accum.includes(day)) {
      accum.push(day)
      return accum
    }
    return accum
  })
  return [uniqueDays].length
}

//get days missing between Sunday and today
// takes an array of logged days
const getMissingDays = (loggedDays) => {
  let todayNumb = moment().day()
  let currentWeekArr = weekdays.slice(0, todayNumb + 1)
  return currentWeekArr.filter( day => {
    if(!loggedDays.includes(day)) return day
  })
}

const getDayCount = () => {
  let todayNumb = moment().day() + 1
  return todayNumb
}

//get macro targets for user
// for every day that has entries, show the net consumption of each macro
/*
  total number of days with entries * daily macro intake - total number of days with entries * actual macro intake
*/
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
document.addEventListener('DOMContentLoaded', setMacroBalances)
