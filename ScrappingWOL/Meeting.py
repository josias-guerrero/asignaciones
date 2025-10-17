import re

import functions.scrappingFunctions as scrappingFunctions
import requests
from bs4 import BeautifulSoup


class Meeting:
    url = "https://wol.jw.org/es/wol/meetings/r4/lp-s/"
    weekOfTheYear = 0
    songsList = []
    dateMetting = ""
    weeklyChapters = ""
    assignmentsList = []
    minutesPerAssignmentList = []
    rvmcLength = 0
    lifeLength = 0

    # regex
    minutesRegex = re.compile(r"^\(\d+ mins?\.\)")
    songsRegex = re.compile(r"^Canción \d+")
    assignmentRegex = re.compile(r'^\d')

    # Attributes generators
    def __getMeetingDateFromHeader(self, header):
        dateMeetingHTML = header.find("h1", id="p1")
        return scrappingFunctions.getSingleString(dateMeetingHTML)

    def __getWeeklyChaptersFromHeader(self, header):
        weeklyChaptersHTML = header.find("h2", id="p2")
        weeklyChaptersRaw = weeklyChaptersHTML.text
        weeklyChapters = weeklyChaptersRaw.replace("\xa0", " ")
        return weeklyChapters

    def __getSongsListFromBody(self, divBodyOfTheMeeting):
        allText = divBodyOfTheMeeting.stripped_strings
        songsListRaw = [
            text.replace("\xa0", " ")
            for text in allText
            if self.songsRegex.match(text.replace("\xa0", " "))
        ]
        songsList = scrappingFunctions.cleanListFromPattern(
            songsListRaw, self.songsRegex
        )
        return songsList

    def __getAssignmentsListFromBodyH3(self, bodyH3):
        presentationsList = []
        songClass = re.compile(r"^Canción")

        for h3 in bodyH3:
            # Comprobar si el h3 contiene texto de canción o si es None
            if not self.songsRegex.match(h3.text) and self.assignmentRegex.match(h3.text) and not songClass.match(h3.text):
                # Si no es una canción ni None, lo agregamos a presentationsList
                presentationsList.append(h3.text)

        return presentationsList

    def __getMinutesPerAssignmentListFromBody(self, divBodyOfTheMeeting):
        partsMinutesRaw = divBodyOfTheMeeting.find_all(string=self.minutesRegex)
        minutesList = scrappingFunctions.cleanListFromPattern(
            partsMinutesRaw, self.minutesRegex
        )
        if minutesList[0] == "(1 min.)":
            minutesList.pop(0)
        minutesList.pop()
        return minutesList

    def setRVMCLength(self, body):
        class_name = ["du-color--gold-700"]
        count = scrappingFunctions.count_elements_with_classes(body, class_name)
        self.rvmcLength = count - 1

    def setLifeLength(self, body):
        class_names = ["du-color--maroon-600", "du-fontSize--base"]
        count = scrappingFunctions.count_elements_with_classes(body, class_names)
        self.lifeLength = count - 1

    # Generate meeting content
    def __generateMeetingContent(self, url):
        RMVCUrl = scrappingFunctions.getRMVCUrl(url) 
        response = requests.get(RMVCUrl)
        soup = BeautifulSoup(response.text, "html.parser")

        # Section holders
        divWholeMeeting = soup.find("article", class_="article")
        header = divWholeMeeting.header
        divBodyOfTheMeeting = divWholeMeeting.find("div", class_="bodyTxt")
        bodyH3 = divBodyOfTheMeeting.find_all("h3")

        # setting elements
        self.dateMetting = self.__getMeetingDateFromHeader(header)
        self.weeklyChapters = self.__getWeeklyChaptersFromHeader(header)
        self.songsList = self.__getSongsListFromBody(divBodyOfTheMeeting)
        self.assignmentsList = self.__getAssignmentsListFromBodyH3(bodyH3)
        self.minutesPerAssignmentList = self.__getMinutesPerAssignmentListFromBody(divBodyOfTheMeeting)
        self.setRVMCLength(divBodyOfTheMeeting)
        self.setLifeLength(divBodyOfTheMeeting)

    def printMeetingContent(self):
        print(f"Date: {self.dateMetting}")
        print(f"Weekly chapters: {self.weeklyChapters}")
        print(f"Songs list: {self.songsList}")
        print(f"Assignments list: {self.assignmentsList}")
        print(f"Minutes per assignment list: {self.minutesPerAssignmentList}")

    def getMinutesWithAssignment(self):
        assignmentWithTime = zip(self.assignmentsList, self.minutesPerAssignmentList)
        list = []
        for assignment, time in assignmentWithTime:
            list.append(assignment + " " + time)
        return list

    # Constructors
    def __init__(self, year_or_url, weekOfTheYear=None):
        if weekOfTheYear is not None:
            url = self.url + str(year_or_url) + "/" + str(weekOfTheYear)
        else:
            url = year_or_url

        self.__generateMeetingContent(url)
