const store = JSON.parse(localStorage.getItem('currentMeeting'))
// Meeting Info
const chairman = document.getElementById('president')
const prayerStart = document.getElementById('prayer-start')
const prayerEnd = document.getElementById('prayer-end')
const songStart = document.getElementById('song-start')
const songHalf = document.getElementById('song-half')
const songEnd = document.getElementById('song-end')
const outWeek = document.getElementById('week')
const outChapters = document.getElementById('chapters')
//sections
const treasuresSection = document.getElementById('out-treasures')
const christiansSection = document.getElementById('out-christians')
const ministrySection = document.getElementById('out-ministry')

const endDiv = document.getElementById('end')
document.addEventListener('DOMContentLoaded', generateMeeting)

document.title = `Programa ${store.week}`

const print = document.getElementById('pdf')
print.addEventListener('click', () => {
  window.print()
})

const home = document.getElementById('home')
home.addEventListener('click', () => {
  window.location.href = '/'
})

function generateMeeting() {
  if (!store) {
    window.location.href = '/'
  }
  fillMeetingGeneralInfo()
  fillTreasures()
  fillMinistry()
  fillChristians()
}
function fillMeetingGeneralInfo() {
  chairman.textContent = store.meetingInfo.Presidente.assigned
  prayerStart.textContent = store.meetingInfo['Oración de inicio'].assigned
  prayerEnd.textContent = store.meetingInfo['Oración de conclusión'].assigned
  songStart.textContent = store.songs[0]
  songHalf.textContent = store.songs[1]
  songEnd.textContent = store.songs[2]
  outWeek.textContent = store.week
  outChapters.textContent = store.chapters
}
function fillTreasures() {
  store.treasures.forEach((item, index, array) => {
    if (index === array.length - 1) {
      const row = generateRow(item.topic, item.assigned, null, 'Estudiante:')
      treasuresSection.append(row)
    } else {
      const row = generateRow(item.topic, item.assigned)
      treasuresSection.append(row)
    }
  })
}
function fillMinistry() {
  store.ministry.forEach((item) => {
    const row = generateRow(item.topic, item.assigned, item.assistant, 'Estudiante/Ayudante:')
    ministrySection.append(row)
  })
}
function fillChristians() {
  store.christians.forEach((item, index, array) => {
    if (index === array.length - 1) {
      const row = generateRow(item.topic, item.assigned, item.assistant, 'Conductor/Lector:')
      christiansSection.insertBefore(row, endDiv)
    } else {
      const row = generateRow(item.topic, item.assigned)
      christiansSection.insertBefore(row, endDiv)
    }
  })
}
function generateRow(topic, assigned, assistant, small = '') {
  const row = document.createElement('div')
  row.classList.add('fila')
  row.innerHTML = `
    <div class="topic"><small>0:00</small> <span>${topic}</span></div>
    <div class="asignado">
      <small>${small}</small>
      <div><span>${assigned}</span>${assistant ? `/<span>${assistant}</span>` : ''}</div>
    </div>
`
  return row
}
