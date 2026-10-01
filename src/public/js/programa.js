const parser = new DOMParser()
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

const print = document.getElementById('pdf')
print.addEventListener('click', () => {
  window.print()
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
  chairman.textContent = store.meetingInfo.chairman.assigned
  prayerStart.textContent = store.meetingInfo.prayerStart.assigned
  prayerEnd.textContent = store.meetingInfo.prayerEnd.assigned
  songStart.textContent = store.songs[0]
  songHalf.textContent = store.songs[1]
  songEnd.textContent = store.songs[2]
  outWeek.textContent = store.week
  outChapters.textContent = store.chapters
}
function fillTreasures() {
  Object.entries(store.treasures).forEach(([key, value], index, array) => {
    if (index === array.length - 1) {
      const row = generateRow(key, value.assigned, null, 'Estudiante:')
      treasuresSection.append(row)
    } else {
      const row = generateRow(key, value.assigned)
      treasuresSection.append(row)
    }
  })
}
function fillMinistry() {
  Object.entries(store.ministry).forEach(([key, value]) => {
    const row = generateRow(key, value.assigned, value.assistant, 'Estudiante/Ayudante:')
    ministrySection.append(row)
  })
}
function fillChristians() {
  Object.entries(store.christians).forEach(([key, value], index, array) => {
    if (index === array.length - 1) {
      const row = generateRow(key, value.assigned, value.assistant, 'Conductor/Lector:')
      christiansSection.insertBefore(row, endDiv)
    } else {
      const row = generateRow(key, value.assigned)
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
