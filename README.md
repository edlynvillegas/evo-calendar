# evo-calendar
_Simple Modern-looking Event Calendar_

### :eyes: Demo:
[https://edlynvillegas.github.io/evo-calendar/](https://edlynvillegas.github.io/evo-calendar/)

![Evo Calendar Preview](/img/thumbnail.png)

### :bulb: Features:
* Flexible and fully customizable
* Responsive Calendar (desktop, tablet and mobile)
* Add, Remove and View calendar event(s)
* Set event type (event, holiday, birthday)
* Events and methods that lets you think outside the box!

### :art: Usage

#### Adding links:

Just add a link to the css file in your `<head>`:

```html
<!-- Add the evo-calendar.css for styling -->
<link rel="stylesheet" type="text/css" href="evo-calendar.min.css"/>
```

Then, before your closing ```<body>``` tag add:

```html
<!-- Add jQuery library (required) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<!-- Add the evo-calendar.js for.. obviously, functionality! -->
<script src="evo-calendar.min.js"></script>
```

#### Initialization:

In your html file:
```html
<div id="calendar"></div>
```

Then in your javascript file:
```js
<script>
  $("#calendar").evoCalendar();
</script>
```

### :hammer_and_wrench: Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
theme | string | null | Define calendar's theme
format | string | 'mm/dd/yyyy' | Date format
titleFormat | string | 'MM yyyy' | Date format for calendar title
eventHeaderFormat | string | 'MM d, yyyy' | Date format for calendar event's title
firstDayOfWeek | string | 'Sun' | Displayed first day of the week
language | string | 'en' | Calendar's language
todayHighlight | boolean | false | Highlight today's date in calendar
sidebarDisplayDefault | boolean | true | Set default visibility of sidebar
sidebarToggler | boolean | true | Display the button for toggling the sidebar
eventDisplayDefault | boolean | true | Set default visibility of event lists
eventListToggler | boolean | true | Display the button for toggling the event lists
calendarEvents | array | null | Defined events for calendar to show

#### _calendarEvent_ Options Example
```js
  $("#evoCalendar").evoCalendar({
    calendarEvents: [
      {
      // Event's ID (required)
      id: 'bHay68s',
      // Event name (required)
       name: "New Year",
      // Event date (required)
       date: "January/1/2020",
      // Event type (required)
       type: "holiday",
      // Same event every year (optional)
       everyYear: true
      },
      {
       name: "Vacation Leave",
       date: "February/13/2020",
       type: "event"
       }
    ]
  });
```


#### Methods

Method | Argument | Description
------ | -------| -----------
setTheme | string |	Set/Change theme
toggleSidebar | boolean (optional) | Toggle sidebar display
toggleEventList | boolean (optional) | Toggle event list display
getActiveDate | none |	Get the selected date
getActiveEvents | none |	Get the event(s) of selected date
selectYear	| number |	Select year programmatically
selectMonth	| number (0-11) |	Select month programmatically
selectDate	| string |	Select date programmatically
addCalendarEvent | array/object | Add Calendar event(s)
removeCalendarEvent | array/string | Remove event(s) by their id
destroy	| none |	Well.. destroy the calendar

##### _addCalendarEvent_ Method Example
```js
  $("#evoCalendar").evoCalendar('addCalendarEvent', [
    {
     id: '09nk7Ts',
     name: "My Birthday",
     date: "February/15/2020",
     type: "birthday",
     everyYear: true
    }
  ]);
```

#### Events

Event | Argument | Description
------ | -------| -----------
selectDate | newDate, oldDate |	Fires after selecting date
selectEvent | activeEvent |	Fires after selecting event
destroy | calendar |	Fires after destroying calendar

##### _selectDate_ Event Example
```js
  $("#evoCalendar").on('selectDate', function() {
    // code here
  });
```

> Note: this is just me, exploring things.. 🙂
