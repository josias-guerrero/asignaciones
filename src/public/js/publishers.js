const publisherInput = document.getElementById('new-publisher-input')
const addPublisherForm = document.getElementById('new-publisher-form')

generatePublishersList()

addPublisherForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const newPublisherName = publisherInput.value
  try {
    const response = await fetch('/api/meetings/publishers/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newPublisherName }),
    })
    if (!response.ok) {
      throw new Error(`Error al agregar usuario: ${response.status}`)
    }
    generatePublishersList()
  } catch (error) {
    console.error('Error al añadir nuevo publicador', error)
  }
})

async function generatePublishersList() {
  const data = await fetchPublishers()
  const publishersList = data.data
  const container = document.getElementById('publishers-list')

  container.textContent = ''

  publishersList.forEach((publisher) => {
    const row = document.createElement('div')
    const name = document.createElement('span')

    name.textContent = publisher.name
    name.id = publisher.id

    name.classList.add('editable')
    row.classList.add('publisher-item')
    name.contentEditable = 'true'

    const updateBtn = createUpdateButton(row)
    const deleteBtn = createDeleteButton(row)

    const btnActionContainer = document.createElement('div')
    btnActionContainer.append(updateBtn, deleteBtn)

    row.append(name, btnActionContainer)
    container.append(row)
  })
}

export async function fetchPublishers() {
  try {
    const response = await fetch('/api/meetings/publishers')

    if (!response.ok) {
      throw new Error('Error al obtener los publicadores')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

function createDeleteButton(row) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = 'x'
  button.classList.add('btn-eliminar')
  button.tabIndex = -1

  button.onclick = () => {
    const input = row.querySelector('span')
    if (input) {
      fetch(`/api/meetings/publishers/${input.id}`, { method: 'DELETE' })
    }
    row.remove()
  }
  return button
}

function createUpdateButton(row) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = '✔'
  button.classList.add('btn-actualizar')
  button.tabIndex = -1

  button.addEventListener('click', () => {
    const inputName = row.querySelector('span')
    fetch(`/api/meetings/publishers/${inputName.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: inputName.textContent }),
    })
  })
  return button
}
