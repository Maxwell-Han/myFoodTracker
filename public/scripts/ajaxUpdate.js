var editButtons = document.querySelectorAll('.edit')
for(let i = 0; i < editButtons.length; i++){
  editButtons[i].addEventListener('click',showEdit)
}

function showEdit(e){
  let edit = e.currentTarget
  let optionsDiv = edit.parentElement
  let id = edit.parentElement.id
  let favorite = edit.parentElement.previousElementSibling
  let protein = favorite.previousElementSibling
  let fat = protein.previousElementSibling
  let carbs = fat.previousElementSibling
  let name = carbs.previousElementSibling


  let newProtein = document.createElement('input')
  let newFat = document.createElement('input')
  let newCarbs = document.createElement('input')
  let newFavorite = document.createElement('input')
  let newName = document.createElement('input')
  newFavorite.type = "checkbox"
  if(favorite.className === "heart-filled"){
    newFavorite.value = "false"
  }else{
    newFavorite.value = "true"
  }

  newProtein.value = protein.textContent
  newFat.value = fat.textContent
  newCarbs.value = carbs.textContent
  newName.value = name.textContent

  protein.parentNode.replaceChild(newProtein, protein)
  fat.parentNode.replaceChild(newFat, fat)
  carbs.parentNode.replaceChild(newCarbs, carbs)
  favorite.parentNode.replaceChild(newFavorite, favorite)
  name.parentNode.replaceChild(newName, name)

  let newOptions = createEditOptions()
  optionsDiv.parentNode.replaceChild(newOptions, optionsDiv)

  let editOptionsContainer = document.querySelector('.edit-options-container')
  let cancelButton = document.querySelector('.cancel')
  let saveButton = document.querySelector('.save')
  cancelButton.addEventListener('click', function(){
    console.log('hello from the cancel button')
    editOptionsContainer.parentNode.replaceChild(optionsDiv, editOptionsContainer)
    newProtein.parentNode.replaceChild(protein, newProtein)
    newFat.parentNode.replaceChild(fat, newFat)
    newCarbs.parentNode.replaceChild(carbs, newCarbs)
    newFavorite.parentNode.replaceChild(favorite, newFavorite)
    newName.parentNode.replaceChild(name, newName)
  })

  saveButton.addEventListener('click', function(){
    let data = {
      carb: parseInt(newCarbs.value),
      fat: parseInt(newFat.value),
      protein: parseInt(newProtein.value),
      name: newName.value,
      favorite: newFavorite.checked
    }
    editHandler(id, data)
  })

}

//edit handler
// add click handler to all edit
// select the entry field values and change to form
function createEditOptions(){
  var cancel = document.createElement('span')
  cancel.textContent = 'Cancel'
  cancel.className = "cancel"
  var spacing = document.createElement('span')
  spacing.textContent = "||"
  var save = document.createElement('span')
  save.textContent = 'Save'
  save.className = "save"
  var optionsContainer = document.createElement('div')
  optionsContainer.className = "edit-options-container"
  optionsContainer.appendChild(cancel)
  optionsContainer.appendChild(spacing)
  optionsContainer.appendChild(save)

  return optionsContainer
}


function editHandler(id, data){
  let url = `/${document.querySelector('.username').textContent}/api/update/${id}`
  console.log('hello from the edit handler! ', 'the id is ', id)
  console.log('the data is ', data)
  var httpRequest = new XMLHttpRequest()
  if(!httpRequest) {
    console.log('unable to make request')
    return false
  }
  httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState ===XMLHttpRequest.DONE) {
      if(httpRequest.status === 200) {
        console.log('the response text is ', httpRequest.responseText)
        location.reload()
      } else {
        console.log('there was a problem with the request')
      }
    }
  }

  httpRequest.open('PUT', url, true)
  httpRequest.setRequestHeader('Content-Type', 'application/json')
  httpRequest.send(JSON.stringify(data))

}
