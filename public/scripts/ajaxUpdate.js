//handle edit actions for existing entries
let editButtons = document.querySelectorAll('.edit')
for(let i = 0; i < editButtons.length; i++){
  editButtons[i].addEventListener('click',showEdit)
}

function showEdit(e){
  console.log(e.currentTarget)
  let edit = e.currentTarget
  let optionsDiv = edit.parentElement
  let id = edit.parentElement.id
  let protein = optionsDiv.previousElementSibling
  let fat = protein.previousElementSibling
  let carbs = fat.previousElementSibling
  let name = carbs.previousElementSibling
  let newProtein = document.createElement('input')
  let newFat = document.createElement('input')
  let newCarbs = document.createElement('input')
  let newName = document.createElement('input')

  newProtein.value = protein.textContent
  newProtein.name = "update-entry-protein"
  newFat.value = fat.textContent
  newFat.name = "update-entry-fat"
  newCarbs.value = carbs.textContent
  newCarbs.name = "update-entry-carb"
  newName.value = name.textContent
  newName.name = "update-entry-name"

  protein.parentNode.replaceChild(newProtein, protein)
  fat.parentNode.replaceChild(newFat, fat)
  carbs.parentNode.replaceChild(newCarbs, carbs)

  name.parentNode.replaceChild(newName, name)

  let newOptions = createEditOptions()
  optionsDiv.parentNode.replaceChild(newOptions, optionsDiv)

  let editOptionsContainer = document.querySelector('.edit-options-container')
  let cancelButton = document.querySelector('.cancel')
  let saveButton = document.querySelector('.save')
  cancelButton.addEventListener('click', function(){
    editOptionsContainer.parentNode.replaceChild(optionsDiv, editOptionsContainer)
    newProtein.parentNode.replaceChild(protein, newProtein)
    newFat.parentNode.replaceChild(fat, newFat)
    newCarbs.parentNode.replaceChild(carbs, newCarbs)
    newName.parentNode.replaceChild(name, newName)
  })

  saveButton.addEventListener('click', function(){
    let data = {
      carb: parseInt(newCarbs.value),
      fat: parseInt(newFat.value),
      protein: parseInt(newProtein.value),
      name: newName.value,
    }
    editHandler(id, data)
  })
}

//edit handler
// add click handler to all edit
// select the entry field values and change to form
function createEditOptions(){
  let cancel = document.createElement('i')
  cancel.textContent = 'cancel'
  cancel.className = "cancel material-icons"
  // let spacing = document.createElement('span')
  // spacing.textContent = "||"
  let save = document.createElement('i')
  save.textContent = 'save'
  save.className = "save material-icons"
  let optionsContainer = document.createElement('div')
  optionsContainer.className = "edit-options-container"
  optionsContainer.appendChild(cancel)
  // optionsContainer.appendChild(spacing)
  optionsContainer.appendChild(save)

  return optionsContainer
}


function editHandler(id, data){
  let url = `/${document.querySelector('.username').textContent}/api/update/${id}`
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
  httpRequest.open('PUT', url, true)
  httpRequest.setRequestHeader('Content-Type', 'application/json')
  httpRequest.send(JSON.stringify(data))
}
