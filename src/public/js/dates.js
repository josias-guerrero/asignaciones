export function getWeeksList(year) {
  const weeksMap = new Map()

  // Primer día de la primera semana ISO del año
  let date = new Date(Date.UTC(year, 0, 4))
  const dayWeek = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() - dayWeek + 1)

  let weekNumber = 1

  while (date.getUTCFullYear() <= year) {
    const startWeek = new Date(date)
    const endWeek = new Date(date)
    endWeek.setUTCDate(endWeek.getUTCDate() + 6)

    // Detener si el inicio de la semana ya pertenece al año siguiente
    if (startWeek.getUTCFullYear() > year) break

    const startDay = startWeek.getUTCDate()
    const endDay = endWeek.getUTCDate()

    const startMonth = startWeek.toLocaleDateString('es-ES', { month: 'long', timeZone: 'UTC' })
    const endMonth = endWeek.toLocaleDateString('es-ES', { month: 'long', timeZone: 'UTC' })

    let textRange = ''
    if (startMonth === endMonth) {
      textRange = `${startDay} - ${endDay} de ${startMonth}`
    } else {
      textRange = `${startDay} de ${startMonth} a ${endDay} de ${endMonth}`
    }

    weeksMap.set(weekNumber, textRange)

    date.setUTCDate(date.getUTCDate() + 7)
    weekNumber++
  }

  return weeksMap
}
