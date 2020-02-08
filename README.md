# evo-calendar
_Responsive calendar with modern design_

#### Features:
* Add and View calendar event(s)
* Set event type (event, holiday, birthday)

#### Future updates' features:
* Set disabled dates
* Remove event

#### Adding links:

Just add a link to the css file in your `<head>`:

```html
<!-- Add the evo-calendar.css for styling -->
<link rel="stylesheet" type="text/css" href="evo-calendar.css"/>
```

Then, before your closing ```<body>``` tag add:

```html
<!-- Add the evo-calendar.js for.. obviously, functionality! -->
<script src="evo-calendar.js"></script>
```

#### Initialization:

In your html file:
```html
<div id="evoCalendar"></div>
```

Then in your javascript file:
```js
<script>
  $("#evoCalendar").evoCalendar();
</script>
```

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
format | string | 'mm/dd/yyyy' | Date format
titleFormat | string | 'MM yyyy' | Date format for calendar title
eventHeaderFormat | string | 'MM d, yyyy' | Date format for calendar event's title
language | string | 'en' | Calendar's language
todayHighlight | boolean | false | Highlight today's date in calendar
sidebarToggler | boolean | true | Display the button for toggling the sidebar
eventListToggler | boolean | true | Display the button for toggling the event lists
calendarEvents | array | null | Defined events for calendar to show

#### calendarEvents Options Example
```js
  $("#evoCalendar").evoCalendar({
    calendarEvents: [
      {
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


### Methods

Method | Argument | Description
------ | -------| -----------
onSelectDate | none | Function to call when selecting date
onAddEvent | none | Function to call when 'Add event' is clicked
addCalendarEvent | array | Add event to calendar

#### addCalendarEvent Method Example
```js
  $("#evoCalendar").evoCalendar('addCalendarEvent', [
    {
     name: "My Birthday",
     date: "February/15/2020",
     type: "birthday",
     everyYear: true
    }
  ]);
```
