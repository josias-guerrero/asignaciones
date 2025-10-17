import datetime
import xlwings as xw
import locale

def getWeekNumber(day, month, year):
    date = datetime.date(year, month, day)
    weekNumber = date.isocalendar()[1]

    return weekNumber

def getWeeksOfTheYear(year):
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')

    weeks = []
    currentDate = datetime.date(year, 1, 1)
    if currentDate.weekday() != 0:  # Si no es lunes, buscar el próximo lunes
        currentDate += datetime.timedelta(days=(7 - currentDate.weekday()))

    while currentDate.year == year or (currentDate - datetime.timedelta(days=1)).year == year:
        # Inicio y fin de la semana (lunes a domingo)
        weekStart = currentDate
        weekEnd = currentDate + datetime.timedelta(days=6)

        if weekStart.month == weekEnd.month:  # Si el mes es el mismo
            semana_str = f"{weekStart.day}-{weekEnd.day} DE {weekStart.strftime('%B').upper()}"
        else:
            semana_str = f"{weekStart.day} DE {weekStart.strftime('%B').upper()} A {weekEnd.day} DE {weekEnd.strftime('%B').upper()}"

        weeks.append(semana_str)

        # Avanzar a la siguiente semana (el próximo lunes)
        currentDate += datetime.timedelta(days=7)

    return weeks
