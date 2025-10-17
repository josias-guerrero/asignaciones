from Meeting import Meeting
import datetime

meeting = Meeting(2025, 20)

meeting.printMeetingContent()
for assignment in meeting.getMinutesWithAssignment():
    print(assignment)
    