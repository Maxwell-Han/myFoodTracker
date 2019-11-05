//scripts for favorites add/edit/delete page
const favs = document.querySelectorAll('.fav-container')
const addFavButton = document.getElementById('add-entry')
const favForm = document.querySelector('.fav-form')
addFavButton.addEventListener('click', (e) => {
  favForm.submit()
})

// Selecting and Editing Existing Favorites
//Select a favorite and add data to top form
const focusOnFav = (favElement) => {
  let name = favElement.querySelector('.fav-name').textContent
  let carb = favElement.querySelector('.fav-carb').textContent
  let fat = favElement.querySelector('.fav-fat').textContent
  let protein = favElement.querySelector('.fav-protein').textContent
  let id = favElement.querySelector('.fav-id').textContent

  let form = document.querySelector('.fav-form')
  let formName = form.querySelector('.new-entry-name')
  let formCarb = form.querySelector('.new-entry-carb')
  let formFat = form.querySelector('.new-entry-fat')
  let formProtein = form.querySelector('.new-entry-protein')
  let formId = form.querySelector('.formId')

  formName.value = name
  formCarb.value = carb
  formFat.value = fat
  formProtein.value = protein
  formId.value = id
  toggleFormTitle()
}

//toggle form title text
const toggleFormTitle = () => {
  let edit = document.querySelector('.edit')
  let add = document.querySelector('.add')
  edit.style.display = 'inline-block'
  add.style.display = 'none'
}
const untoggleFormTitle = () => {
  let edit = document.querySelector('.edit')
  let add = document.querySelector('.add')
  edit.style.display = 'none'
  add.style.display = 'inline-block'
}
//toggle the save and delete buttons to be visible
const toggleEditIcons = () => {
  let deleteIcon = document.getElementById('delete')
  let saveIcon = document.getElementById('save')
  let addIcon = document.getElementById('add-entry')
  deleteIcon.style.display = 'block'
  saveIcon.style.display = 'block'
  addIcon.style.display = 'none'
}

const untoggleEditIcons = () => {
  let deleteIcon = document.getElementById('delete')
  let saveIcon = document.getElementById('save')
  let addIcon = document.getElementById('add-entry')
  deleteIcon.style.display = 'none'
  saveIcon.style.display = 'none'
  addIcon.style.display = 'block'
  untoggleFormTitle()
}

// change form action to delete and write handler for delete route
const deleteHandler = () => {
  let form = document.querySelector('.fav-form')
  let action = form.action
  form.action = `${action}/delete`
  form.submit()
}

// change form action to put and write handler for update route
const updateHandler = () => {
  console.log('hello from the update handler')
  let form = document.querySelector('.fav-form')
  let action = form.action
  form.action = `${action}/update`
  form.submit()
}
const saveIcon = document.getElementById('save')
const deleteIcon = document.getElementById('delete')

// clear edit form
const clearForm = () => {
  let form = document.querySelector('.fav-form')
  let clearButton = document.querySelector('.clear-button')
  clearButton.addEventListener('click', ()=> {
    form.reset()
    untoggleEditIcons()
  })
}

// add click handlers
const addFavContainerHandlers = () => {
  [...favs].forEach( fav => {
    fav.addEventListener('click', (e) => {
      console.log(e.target)
      let currentFav = e.target
      focusOnFav(currentFav)
      toggleEditIcons()
    })
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
    addFavContainerHandlers()
    clearForm()
    deleteIcon.addEventListener('click', deleteHandler)
    saveIcon.addEventListener('click', updateHandler)
});
