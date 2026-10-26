import { getWeeksList } from './dates.js'
import { fetchPublishers } from './publishers.js'

const yearInput = document.getElementById('year')
const weekSelect = document.getElementById('week')
const form = document.getElementById('carga')
const loadButton = document.getElementById('load-data')
const request = await fetchPublishers()
const publisherList = request.data
let weekStore

yearInput.value = new Date().getFullYear()
renderWeeks(yearInput.value)

yearInput.addEventListener('change', (e) => {
  renderWeeks(e.target.value)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  localStorage.setItem('currentMeeting', JSON.stringify(weekStore))
  window.location.href = 'programa.html'
})

form.addEventListener('input', (e) => {
  const { section, topic, field } = e.target.dataset

  if (section && topic && field) {
    if (section === 'meetingInfo') {
      weekStore.meetingInfo[topic][field] = e.target.selectedOptions[0].text
      return
    }

    if (Array.isArray(weekStore[section])) {
      const item = weekStore[section].find((entry) => entry.topic === topic)
      if (item) {
        console.log(e.target.selectedOptions[0].text)
        item[field] = e.target.selectedOptions[0].text
      }
    }
  }
})

loadButton.addEventListener('click', async (e) => {
  e.preventDefault()
  form.innerHTML = `
    <div id='prayerStart'> </div>
    <div id='chairman'> </div>
    <div id="treasures"><h2 class="cinta cinta--tesoros">TESOROS DE LA BIBLIA</h2></div>
    <div id="ministry"><h2 class="cinta cinta--maestros">SEAMOS MEJORES MAESTROS</h2></div>
    <div id="christians"><h2 class="cinta cinta--vida">NUESTRA VIDA CRISTIANA</h2></div>
    <div id='prayerEnd'> </div>
    <button type="submit">Generar programa</button>
    `
  //create meetingInfo selects
  const prayerStart = createSingleInputRow('Oración de inicio', 'meetingInfo')
  const prayerStartRow = document.getElementById('prayerStart')
  prayerStartRow.append(prayerStart)

  const chairman = createSingleInputRow('Presidente', 'meetingInfo')
  const chairmanRow = document.getElementById('chairman')
  chairmanRow.append(chairman)

  const prayerEnd = createSingleInputRow('Oración de conclusión', 'meetingInfo')
  const prayerEndRow = document.getElementById('prayerEnd')
  prayerEndRow.append(prayerEnd)

  await renderAssignments()
})

async function renderAssignments() {
  try {
    const response = await fetch(`/api/meetings?year=${yearInput.value}&week=${weekSelect.value}`)
    const data = await response.json()
    const weekContent = data.data || data
    weekStore = createMeetingTopicStore(weekContent)
    console.log(weekStore)

    // sections
    const treasures = document.getElementById('treasures')
    const ministry = document.getElementById('ministry')
    const christians = document.getElementById('christians')

    weekContent.treasures.forEach((a) => {
      treasures.append(createSingleInputRow(a, 'treasures'))
    })
    weekContent.ministry.forEach((a) => {
      ministry.append(createTwoInputRow(a, 'ministry'))
    })
    weekContent.christians.forEach((a, index, array) => {
      if (index === array.length - 1) {
        christians.append(createTwoInputRow(a, 'christians', true))
      } else {
        christians.append(createSingleInputRow(a, 'christians', true))
      }
    })
  } catch (error) {
    console.error('Error al obtener o renderizar las asignaciones: ', error)
  }
}

function createTwoInputRow(titleText, sectionName, editable = false) {
  const row = document.createElement('div')
  row.classList.add('fila')

  const title = document.createElement('span')
  title.textContent = titleText
  title.tabIndex = -1

  const div = document.createElement('div')

  const student = createPublisherSelect()
  const assistant = createPublisherSelect()

  student.dataset.section = sectionName
  student.dataset.topic = titleText
  student.dataset.field = 'assigned'
  student.required = true

  assistant.dataset.section = sectionName
  assistant.dataset.topic = titleText
  assistant.dataset.field = 'assistant'
  div.append(student, assistant)

  if (editable) {
    row.setAttribute('name', 'editable')
    row.classList.add('editable')
    title.contentEditable = 'true'
    const deleteBtn = createDeleteButton(row)

    title.addEventListener('blur', () => {
      const nuevoTitulo = title.textContent.trim()
      const tituloAnterior = student.dataset.topic

      const item = weekStore[sectionName].find((entry) => entry.topic === tituloAnterior)
      if (item && nuevoTitulo !== '') {
        item.topic = nuevoTitulo
        student.dataset.topic = nuevoTitulo
        assistant.dataset.topic = nuevoTitulo
      }
    })
    row.append(deleteBtn, title, div)
    return row
  }

  row.append(title, div)
  return row
}

function createDeleteButton(row) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = 'x'
  button.classList.add('btn-eliminar')
  button.tabIndex = -1

  button.onclick = () => {
    const input = row.querySelector('input')
    if (input) {
      const { section, topic } = input.dataset
      if (Array.isArray(weekStore[section])) {
        const index = weekStore[section].findIndex((entry) => entry.topic === topic)
        if (index !== -1) {
          weekStore[section].splice(index, 1)
        }
      }
    }
    row.remove()
  }
  return button
}

function createSingleInputRow(titleText, sectionName, editable = false) {
  const row = document.createElement('div')
  row.classList.add('fila')

  const title = document.createElement('span')
  title.textContent = titleText

  const assigned = createPublisherSelect()

  assigned.dataset.section = sectionName
  assigned.dataset.topic = titleText
  assigned.dataset.field = 'assigned'

  if (editable) {
    title.classList.add('editable')
    title.tabIndex = -1
    row.classList.add('editable')

    const deleteBtn = createDeleteButton(row)
    title.contentEditable = 'true'

    title.addEventListener('blur', () => {
      const nuevoTitulo = title.textContent.trim()
      const tituloAntiguo = assigned.dataset.topic

      const item = weekStore[sectionName].find((entry) => entry.topic === tituloAntiguo)

      if (item && nuevoTitulo !== '') {
        item.topic = nuevoTitulo
        assigned.dataset.topic = nuevoTitulo
      }
    })
    row.append(deleteBtn, title, assigned)
    return row
  }

  row.append(title, assigned)
  return row
}

function createPublisherSelect() {
  const select = document.createElement('select')
  select.required = true

  const defaultOption = new Option('Seleccione participante', '', true, true)
  defaultOption.disabled = true

  select.append(
    defaultOption,
    ...publisherList.map((publisher) => new Option(publisher.name, publisher.id))
  )
  return select
}

function renderWeeks(year) {
  const weeks = getWeeksList(Number(year))
  weekSelect.innerHTML = ''

  weeks.forEach((label, weekNum) => {
    const option = document.createElement('option')
    option.value = weekNum
    option.textContent = label
    weekSelect.appendChild(option)
  })
}

function createMeetingTopicStore(apiResponse) {
  return {
    meetingInfo: {
      'Oración de inicio': { assigned: '' },
      'Oración de conclusión': { assigned: '' },
      Presidente: { assigned: '' },
    },
    week: apiResponse.week,
    chapters: apiResponse.chapters,
    songs: [...apiResponse.songs],

    treasures: apiResponse.treasures.map((title) => ({ topic: title, assigned: '' })),
    ministry: apiResponse.ministry.map((title) => ({ topic: title, assigned: '', assistant: '' })),
    christians: apiResponse.christians.map((title, index, array) => ({
      topic: title,
      assigned: '',
      ...(index === array.length - 1 ? { assistant: '' } : {}),
    })),
  }
}
