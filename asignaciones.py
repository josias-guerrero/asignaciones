import sys
import os
import xlwings as xw

# Añadir el directorio ScrappingWOL al PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'ScrappingWOL')))

import ScrappingWOL.functions.dateFunctions as dateFunctions
from ScrappingWOL.Meeting import Meeting

def updateYearWeeks():
    book = xw.Book.caller()

    # Asegurarse de que la hoja "Data" existe
    try:
        sheet = book.sheets['Data']
    except KeyError:
        sheet = book.sheets.add('Data')

    # Leer el año desde la celda B2 de la hoja activa
    year = int(book.sheets.active.range("B2","B2").value)

    # Obtener las semanas del año
    weeks = dateFunctions.getWeeksOfTheYear(year)

    # Limpiar cualquier contenido existente en la hoja "Data"
    sheet.clear()
    sheet.range("A1", "A1").value = "SEMANAS DEL AÑO"

    for i, week in enumerate(weeks, start=1):
        sheet.range(f"A{i+1}", f"A{i+1}").value = week

def updateWeekContent(week, year):
    book = xw.Book.caller()
    meeting = Meeting(year, week)

    sheet = book.sheets['Asignaciones']
    sheet.range("A7", "A100").clear_contents()

    assignments = meeting.getMinutesWithAssignment()
    for i, assignment in enumerate(assignments, start=6):
        sheet.range(f"A{i+1}", f"A{i+1}").value = assignment
    
    sheet.range("D11", "D11").value = meeting.rvmcLength
    sheet.range("D12", "D12").value = meeting.lifeLength

    meetingLength = len(assignments) + 7

    setMeetingEssentials(meeting, sheet, meetingLength)

def setMeetingEssentials(meeting, sheet, meetingLength):
    sheet.range(f"A{meetingLength}", f"A{meetingLength}").value = "Oración"
    sheet.range("D5", "D5").value = meeting.weeklyChapters

    for i, song in enumerate(meeting.songsList, start=6):
        sheet.range(f"D{i+1}", f"D{i+1}").value = song