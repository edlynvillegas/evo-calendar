# evo-calendar
_Simple Modern-looking Event Calendar_

[![NPM](https://nodei.co/npm/evo-calendar.png)](https://nodei.co/npm/evo-calendar/)

[![](https://data.jsdelivr.com/v1/package/npm/evo-calendar/badge?style=rounded)](https://www.jsdelivr.com/package/npm/evo-calendar)
[![Known Vulnerabilities](https://snyk.io/test/npm/evo-calendar/1.1.0/badge.svg)](https://snyk.io/test/npm/evo-calendar/1.1.0)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fedlynvillegas%2Fevo-calendar.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fedlynvillegas%2Fevo-calendar?ref=badge_shield)

## :eyes: Demo:
[https://edlynvillegas.github.io/evo-calendar/](https://edlynvillegas.github.io/evo-calendar/)

![Evo Calendar Preview](/img/thumbnail.png)

## :bulb: Features:
* Flexible and fully customizable
* Responsive Calendar (desktop, tablet and mobile)
* Add, Remove and View single/multiple calendar events
* Set event type (event, holiday, birthday)
* Events and methods that lets you think outside the box!

:atom_symbol:  If you are using **React**, I recommend you to try this [RevoCalendar](https://github.com/gjmolter/revo-calendar)

## :art: Usage

#### CDN
Start working with Evo Calendar using CDN (jsDelivr)
* https://www.jsdelivr.com/package/npm/evo-calendar

#### Adding links using jsDelivr:

Just add a link to the css file in your `<head>`:

```html
<!-- Add the evo-calendar.css for styling -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css"/>
```

Then, before your closing ```<body>``` tag add:

```html
<!-- Add jQuery library (required) -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>

<!-- Add the evo-calendar.js for.. obviously, functionality! -->
<script src="https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/js/evo-calendar.min.js"></script>
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
#### Package Managers:
```js
# NPM
$ npm install evo-calendar

# YARN
$ yarn add evo-calendar
```

## :hammer_and_wrench: Settings

Settings | Type | Default | Description | Options
------ | ---- | ------- | ----------- | -------
theme | string | Default | Define calendar's theme | Default, Midnight Blue, Orange Coral, Royal Navy
format | string | 'mm/dd/yyyy' | Date format | Date string format
titleFormat | string | 'MM yyyy' | Date format for calendar title | Date string format
eventHeaderFormat | string | 'MM d, yyyy' | Date format for calendar event's title | Date string format
firstDayOfWeek | number | 0 | Displayed first day of the week | 0 (Sunday) - 6 (Saturday)
language | string | 'en' | Calendar's language | en, es, de, pt, fr, nl
todayHighlight | boolean | false | Highlight today's date in calendar | true, false
sidebarDisplayDefault | boolean | true | Set default visibility of sidebar | true, false
sidebarToggler | boolean | true | Display the button for toggling the sidebar | true, false
eventDisplayDefault | boolean | true | Set default visibility of event lists | true, false
eventListToggler | boolean | true | Display the button for toggling the event lists | true, false
calendarEvents | array | null | Defined events for calendar to show | Array of events

#### _calendarEvent_ Options Example
```js
  $("#evoCalendar").evoCalendar({
    calendarEvents: [
      {
        id: 'bHay68s', // Event's ID (required)
        name: "New Year", // Event name (required)
        date: "January/1/2020", // Event date (required)
        type: "holiday", // Event type (required)
        everyYear: true // Same event every year (optional)
      },
      {
        name: "Vacation Leave",
        badge: "02/13 - 02/15", // Event badge (optional)
        date: ["February/13/2020", "February/15/2020"], // Date range
        description: "Vacation leave for 3 days.", // Event description (optional)
        type: "event",
        color: "#63d867" // Event custom color (optional)
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
selectMonth | activeMonth, monthIndex |	Fires after selecting month
selectYear | activeYear |	Fires after changing year
destroy | calendar |	Fires after destroying calendar

##### _selectDate_ Event Example
```js
  $("#evoCalendar").on('selectDate', function() {
    // code here
  });
```

Need customization? [Go here!](https://www.buymeacoffee.com/edlynvillegas/e/5551)

Go to [demo](https://edlynvillegas.github.io/evo-calendar/) page for more example! :hugs::purple_heart:

<a href="https://www.paypal.me/edlynvillegas" target="_blank"><img src="https://vetsupportusa.com/wp-content/uploads/donate-paypal-main-1.png" alt="PayPal Me" height="60px"></a>
<a href="https://www.buymeacoffee.com/edlynvillegas" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee"></a>

## :mag: License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fedlynvillegas%2Fevo-calendar.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fedlynvillegas%2Fevo-calendar?ref=badge_large)

MIT License

Copyright (c) 2020 edlynvillegas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
