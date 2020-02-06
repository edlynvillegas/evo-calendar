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
todayHighlight | boolean | false | Highlight today's date in calendar
sidebarToggler | boolean | true | Display the button for toggling the sidebar
calendarEvents | array | null | Defined events for calendar to shoW
