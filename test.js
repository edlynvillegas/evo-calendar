$(document).ready(function() {
		$("#evoCalendar").evoCalendar({
			todayHighlight: true,
			sidebarToggler: true,
			calendarEvents: [
				{name: "New Year", date: "January/1/2020", type: "holiday"},
				{name: "Joe's Birthday", date: "February/15/2020", type: "event"}
			],
			onSelectDate: function() {
				console.log('onSelectDate!')
			}
		});
	})
