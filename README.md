# evo-calendar
_Responsive calendar with modern design_

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
calendarEvents | array | null | Defined events for calendar to shoW
