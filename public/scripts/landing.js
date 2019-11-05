
const demoButton = document.querySelector('.demo')

const demoForm = document.querySelector('.demo-form')

demoButton.addEventListener('click', () => {
  demoForm.submit()
})
