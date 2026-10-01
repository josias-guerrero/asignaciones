import { getWeeksList } from './dates.js'

const yearInput = document.getElementById('year')
const weekSelect = document.getElementById('week')
const form = document.getElementById('carga')
const loadButton = document.getElementById('load-data')
let weekStore

yearInput.value = new Date().getFullYear()
renderWeeks(yearInput.value)

yearInput.addEventListener('change', (e) => {
  renderWeeks(e.target.value)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  localStorage.setItem('currentMeeting', JSON.stringify(weekStore))
})

form.addEventListener('input', (e) => {
  const { section, topic, field } = e.target.dataset

  if (section && topic && field) {
    weekStore[section][topic][field] = e.target.value
  }
})

loadButton.addEventListener('click', async (e) => {
  e.preventDefault()
  form.innerHTML = `
    <div class="fila">
      <span>Oracion de inicio</span>
      <input type="string" name="prayerStart" data-section="meetingInfo" data-topic="prayerStart" data-field="assigned"/>
    </div>
    <div class="fila">
      <span>Presidente</span>
      <input type="string" name="chairman" data-section="meetingInfo" data-topic="chairman" data-field="assigned"/>
    </div>
    <div id="treasures"><h2 class="cinta cinta--tesoros">TESOROS DE LA BIBLIA</h2></div>
    <div id="ministry"><h2 class="cinta cinta--maestros">SEAMOS MEJORES MAESTROS</h2></div>
    <div id="christians"><h2 class="cinta cinta--vida">NUESTRA VIDA CRISTIANA</h2></div>
    <div class="fila">
      <span>Oracion de conclusion</span>
      <input type="string" name="prayer-end" data-section="meetingInfo" data-topic="prayerEnd" data-field="assigned"/>
    </div>
    <button type="submit">Generar programa</button>
    `
  await renderAssignments()
})

async function renderAssignments() {
  try {
    const response = await fetch(`/api/meetings?year=${yearInput.value}&week=${weekSelect.value}`)
    const data = await response.json()
    const weekContent = data.data || data
    weekStore = createMeetingTopicStore(weekContent)
    console.log(weekStore)

    //sections
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
        christians.append(createTwoInputRow(a, 'christians'))
      } else {
        christians.append(createSingleInputRow(a, 'christians'))
      }
    })
  } catch (error) {
    console.error('Error al obtener o renderizar las asignaciones: ', error)
  }
}

function createTwoInputRow(titleText, sectionName) {
  const row = document.createElement('div')
  row.classList.add('fila')

  const title = document.createElement('span')
  title.textContent = titleText

  const div = document.createElement('div')

  const student = document.createElement('input')
  const assistant = document.createElement('input')

  student.dataset.section = sectionName
  student.dataset.topic = titleText
  student.dataset.field = 'student'
  student.required = true

  assistant.dataset.section = sectionName
  assistant.dataset.topic = titleText
  assistant.dataset.field = 'assistant'
  assistant.required = true
  div.append(student, assistant)

  row.append(title, div)
  return row
}

function createSingleInputRow(titleText, sectionName) {
  const row = document.createElement('div')
  row.classList.add('fila')

  const title = document.createElement('span')
  title.textContent = titleText

  const assigned = document.createElement('input')

  assigned.dataset.section = sectionName
  assigned.dataset.topic = titleText
  assigned.dataset.field = 'assigned'
  assigned.required = true

  row.append(title, assigned)
  return row
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
      prayerStart: { assigned: '' },
      prayerEnd: { assigned: '' },
      chairman: { assigned: '' },
    },
    week: apiResponse.week,
    chapters: apiResponse.chapters,
    songs: [...apiResponse.songs],

    treasures: Object.fromEntries(apiResponse.treasures.map((title) => [title, { assigned: '' }])),
    ministry: Object.fromEntries(
      apiResponse.ministry.map((title) => [title, { assigned: '', assistant: '' }])
    ),
    christians: Object.fromEntries(
      apiResponse.christians.map((title, index, array) => {
        if (index === array.length - 1) {
          return [title, { assigned: '', assistant: '' }]
        } else {
          return [title, { assigned: '' }]
        }
      })
    ),
  }
}
