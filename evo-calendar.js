/*

    Author: Edlyn Villegas

*/

(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var EvoCalendar = window.EvoCalendar || {};

    EvoCalendar = (function() {

        var instanceUid = 0;

        
        function UTCDate(){
            return new Date(Date.UTC.apply(Date, arguments));
        }
        function getDateToday() {
            return new Date();
        }
        function EvoCalendar(element, settings) {
            var _ = this, dataSettings;
            _.defaults = {
                format: 'mm/dd/yyyy',
                titleFormat: 'MM yyyy',
                eventHeaderFormat: 'MM d, yyyy',
                language: 'en',
                todayHighlight: false,
                sidebarToggler: true,
                eventListToggler: true,
                calendarEvents: null,
                canAddEvent: true,

                onSelectDate: null,
                onAddEvent: null
            };

            _.initials = {
                validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                dates: {
                    en: {
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    }
                }
            }

            _.options = $.extend({}, _.defaults, settings);

            if(_.options.calendarEvents != null) {
                for(var i=0; i < _.options.calendarEvents.length; i++) {
                    if(_.isValidDate(_.options.calendarEvents[i].date)) {
                        _.options.calendarEvents[i].date = _.formatDate(new Date(_.options.calendarEvents[i].date), _.options.format, 'en')
                    }
                }
            }
            console.log(_.options)

            _.$cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // these are human-readable month name labels, in order
            _.$cal_months_labels = ['January', 'February', 'March', 'April',
                                 'May', 'June', 'July', 'August', 'September',
                                 'October', 'November', 'December'];

            // these are the days of the week for each month, in order
            _.$cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // this is the current date
            _.$cal_current_date = new Date();

            _.$month = (isNaN(_.$month) || _.$month == null) ? _.$cal_current_date.getMonth() : _.$month; // 0
            _.$year  = (isNaN(_.$year) || _.$year == null) ? _.$cal_current_date.getFullYear() : _.$year; // 2020
            _.$mainHTML = '';
            _.$sidebarHTML = '';
            _.$calendarHTML = '';
            _.$eventHTML = '';

            _.$active_day_el = null;
            _.$active_date = _.formatDate(new Date(), _.options.format, 'en');
            _.$active_month_el = null;
            _.$active_month = _.$month;
            _.$active_year_el = null;
            _.$active_year = _.$year;

            _.$calendar = $(element);
            _.$calendar_sidebar = '';
            _.$calendar_inner = '';
            _.$calendar_events = '';


            _.selectDate = $.proxy(_.selectDate, _);
            _.selectMonth = $.proxy(_.selectMonth, _);
            _.selectYear = $.proxy(_.selectYear, _);
            _.toggleSidebar = $.proxy(_.toggleSidebar, _);
            _.toggleEventList = $.proxy(_.toggleEventList, _);

            _.parseFormat = $.proxy(_.parseFormat, _);
            _.formatDate = $.proxy(_.formatDate, _);




            _.init(true);
        }

        return EvoCalendar;

    }());


    EvoCalendar.prototype.init = function(creation) {

        var _ = this;


        if (!$(_.$calendar).hasClass('calendar-initialized')) {

            $(_.$calendar).addClass('evo-calendar calendar-initialized');

            _.buildCalendar('all');
        }
    };

    EvoCalendar.prototype.buildCalendar = function(val, new_month, new_year) {
        var _ = this;

        // get first day of month
        new_month = (isNaN(new_month) || new_month == null) ? _.$active_month : new_month;
        new_year = (isNaN(new_year) || new_year == null) ? _.$active_year : new_year;
        var firstDay = new Date(new_year, new_month);
        var startingDay = firstDay.getDay();

        // find number of days in month
        var monthLength = _.$cal_days_in_month[new_month];

        // compensate for leap year
        if (new_month == 1) { // February only!
            if((new_year % 4 == 0 && new_year % 100 != 0) || new_year % 400 == 0){
                monthLength = 29;
            }
        }
        // do the header
        
        var monthName =  _.$cal_months_labels[new_month];

        var mainHTML = '';
        var sidebarHTML = '';
        var calendarHTML = '';
        

        
        function buildMainHTML() {
            var mainHTML = '<div class="calendar-sidebar"></div><div class="calendar-inner"></div><div class="calendar-events"></div>';
            if(_.options.canAddEvent) {
                mainHTML += '<span id="eventAddButton" title="Add event">ADD EVENT</span>';
            }
            if(_.options.eventListToggler) {
                mainHTML += '<span id="eventListToggler" title="Close event list"><button class="icon-button"><span class="chevron-arrow-right"></span></button></span>';
            }
            _.$mainHTML = mainHTML;
        }

        function buildSidebarHTML() {
            sidebarHTML = '<div class="calendar-year"><button class="icon-button" year-val="prev" title="Previous year"><span class="chevron-arrow-left"></span></button>&nbsp;<p>'+new_year+'&nbsp;</p><button class="icon-button" year-val="next" title="Next year"><span class="chevron-arrow-right"></span></button></div>';
            sidebarHTML += '<ul class="calendar-months">';
            for(var i = 0; i < _.$cal_months_labels.length; i++) {
                sidebarHTML += '<li class="month';
                sidebarHTML += (parseInt(_.$active_month) === i) ? ' active-month' : ''
                sidebarHTML += '" month-val="'+i+'">'+_.$cal_months_labels[i]+'</li>';
            }
            sidebarHTML += '</ul>';
            if(_.options.sidebarToggler) {
                sidebarHTML += '<span id="sidebarToggler" title="Close sidebar"><button class="icon-button"><span class="bars"></span></button></span>';
            }
            _.$sidebarHTML = sidebarHTML;
        }

        function buildCalendarHTML() {
            calendarHTML = '<table class="calendar-table">';
            calendarHTML += '<tr><th colspan="7">';
            calendarHTML +=  _.formatDate(new Date(monthName +' '+ new_year), _.options.titleFormat, 'en');
            calendarHTML += '</th></tr>';
            calendarHTML += '<tr class="calendar-header">';
            for(var i = 0; i <= 6; i++ ){
                calendarHTML += '<td class="calendar-header-day">';
                calendarHTML += _.$cal_days_labels[i];
                calendarHTML += '</td>';
            }
            calendarHTML += '</tr><tr class="calendar-body">';
            // fill in the days
            var day = 1;
            // this loop is for is weeks (rows)
            for (var i = 0; i < 9; i++) {
                // this loop is for weekdays (cells)
                for (var j = 0; j <= 6; j++) { 
                    calendarHTML += '<td class="calendar-day">';
                    if (day <= monthLength && (i > 0 || j >= startingDay)) {
                        var thisDay = _.formatDate(new Date(monthName +'/'+ day +'/'+ new_year), _.options.format, 'en');
                        calendarHTML += '<div class="day'
                        calendarHTML += ((_.$active_date === thisDay) ? ' calendar-active' : '') + '" date-val="'+thisDay+'">'+day+'</div>';
                        day++;
                    }
                    calendarHTML += '</td>';
                }
                // stop making rows if we've run out of days
                if (day > monthLength) {
                  break;
                } else {
                  calendarHTML += '</tr><tr class="calendar-body">';
                }
            }
            calendarHTML += '</tr></table>';
            _.$calendarHTML = calendarHTML;
        }
        
        function buildEventListHTML() {
            console.log('buildEventListHTML()')
            if(_.options.calendarEvents != null) {
                var eventHTML = '<div class="event-header"><p>'+_.formatDate(new Date(_.$active_date), _.options.eventHeaderFormat, 'en')+'</p></div>';
                var hasEventToday = false;
                eventHTML += '<div>';
                for (var i = 0; i < _.options.calendarEvents.length; i++) {
                    if(_.$active_date === _.options.calendarEvents[i].date) {
                        hasEventToday = true;
                        eventHTML += '<div class="event-container">';
                        eventHTML += '<div class="event-icon"><div class="event-bullet-'+_.options.calendarEvents[i].type+'"></div></div>';
                        eventHTML += '<div class="event-info"><p>'+_.options.calendarEvents[i].name+'</p></div>';
                        eventHTML += '</div>';
                    } else if (_.options.calendarEvents[i].everyYear) {
                        var d = _.formatDate(new Date(_.$active_date), 'mm/dd', 'en');
                        var dd = _.formatDate(new Date(_.options.calendarEvents[i].date), 'mm/dd', 'en');
                        if(d==dd) {
                            hasEventToday = true;
                            eventHTML += '<div class="event-container">';
                            eventHTML += '<div class="event-icon"><div class="event-bullet-'+_.options.calendarEvents[i].type+'"></div></div>';
                            eventHTML += '<div class="event-info"><p>'+_.options.calendarEvents[i].name+'</p></div>';
                            eventHTML += '</div>';
                        }
                    }
                };
                if(!hasEventToday) {
                    eventHTML += '<p>No event for this day.. so take a rest! :)</p>';
                }
                eventHTML += '</div>';
                _.$eventHTML = eventHTML;
            }
        }

        if(val == 'all') {
            buildMainHTML();
            buildSidebarHTML();
            buildCalendarHTML();
            buildEventListHTML();
        } else if (val == 'sidebar') {
            buildSidebarHTML();
        } else if (val == 'inner') {
            console.log('buildCalendar---inner', _.options.calendarEvents);
            buildCalendarHTML();
        } else if (val == 'events') {
            buildEventListHTML();
        }

        _.setHTML(val);
    };

    // Set the HTML to element
    EvoCalendar.prototype.setHTML = function(val) {
        var _ = this;

        if(val == 'all') {
            _.$calendar.html(_.$mainHTML);
            _.$calendar_sidebar = $('.calendar-sidebar');
            _.$calendar_inner = $('.calendar-inner');
            _.$calendar_events = $('.calendar-events');

            _.$calendar_sidebar.html(_.$sidebarHTML);
            _.$calendar_inner.html(_.$calendarHTML);
            _.$calendar_events.html(_.$eventHTML);
        } else if (val == 'sidebar') {
            _.$calendar_sidebar = $('.calendar-sidebar');
            _.$calendar_sidebar.html(_.$sidebarHTML);
        } else if (val == 'inner') {
            _.$calendar_inner = $('.calendar-inner');
            _.$calendar_inner.html(_.$calendarHTML);
        } else if (val == 'events') {
            _.$calendar_events = $('.calendar-events');
            _.$calendar_events.html(_.$eventHTML);
        }

        if(_.options.calendarEvents != null) {
            _.initCalendarEvents();
        }

        if(_.options.todayHighlight) {
            $('.day[date-val="'+_.formatDate(_.$cal_months_labels[_.$month] +'/'+ _.$cal_current_date.getDate() +'/'+ _.$year, _.options.format, 'en')+'"]').addClass('calendar-today');
        }

        _.initEventListener();
    };

    // Add calendar events
    EvoCalendar.prototype.initCalendarEvents = function() {
        var _ = this;
        // prevent duplication
        $('.event-indicator').empty();
        // find number of days in month
        var monthLength = _.$cal_days_in_month[_.$active_month];

        // compensate for leap year
        if (_.$active_month == 1) { // February only!
            if((_.$active_year % 4 == 0 && _.$active_year % 100 != 0) || _.$active_year % 400 == 0){
                monthLength = 29;
            }
        }
        
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            for (var x = 0; x < monthLength; x++) {
                var active_date = _.formatDate(new Date(_.$cal_months_labels[_.$active_month] +'/'+ (x + 1) +'/'+ _.$active_year), _.options.format, 'en');
                // console.log(active_date, _.formatDate(new Date(_.options.calendarEvents[i].date), _.options.format, 'en'))
                
                var thisDate = $('[date-val="'+active_date+'"]');
                if(active_date==_.options.calendarEvents[i].date) {
                    thisDate.addClass('calendar-'+ _.options.calendarEvents[i].type);

                    if($('[date-val="'+active_date+'"] span.event-indicator').length == 0) {
                        thisDate.append('<span class="event-indicator"></span>');
                    }

                    if($('[date-val="'+active_date+'"] span.event-indicator > .type-bullet > .type-'+_.options.calendarEvents[i].type).length == 0) {
                        var htmlToAppend = '<div class="type-bullet"><div class="type-'+_.options.calendarEvents[i].type+'"></div></div>';
                        thisDate.find('.event-indicator').append(htmlToAppend);
                    }
                } else if (_.options.calendarEvents[i].everyYear) {
                    var d = _.formatDate(new Date(active_date), 'mm/dd', 'en');
                    var dd = _.formatDate(new Date(_.options.calendarEvents[i].date), 'mm/dd', 'en');
                    if(d==dd) {
                        thisDate.addClass('calendar-'+ _.options.calendarEvents[i].type);
    
                        if($('[date-val="'+active_date+'"] span.event-indicator').length == 0) {
                            thisDate.append('<span class="event-indicator"></span>');
                        }
    
                        if($('[date-val="'+active_date+'"] span.event-indicator > .type-bullet > .type-'+_.options.calendarEvents[i].type).length == 0) {
                            var htmlToAppend = '<div class="type-bullet"><div class="type-'+_.options.calendarEvents[i].type+'"></div></div>';
                            thisDate.find('.event-indicator').append(htmlToAppend);
                        }
                    }
                }
            }
        };
    };

    // Add listeners
    EvoCalendar.prototype.initEventListener = function() {
        var _ = this;

        if(_.options.sidebarToggler) {
            $('#sidebarToggler')
               .off('click.evocalendar')
               .on('click.evocalendar', _.toggleSidebar);
        }
        if(_.options.eventListToggler) {
            $('#eventListToggler')
               .off('click.evocalendar')
               .on('click.evocalendar', _.toggleEventList);
        }
        if(_.options.canAddEvent) {
            $('#eventAddButton')
               .off('click.evocalendar')
               .on('click.evocalendar', _.options.onAddEvent);
        }


        $('[date-val]')
           .off('click.evocalendar')
           .on('click.evocalendar', _.selectDate)
           .on('click.evocalendar', _.options.onSelectDate);

        // set event listener for each month
        $('[month-val]')
           .off('click.evocalendar')
           .on('click.evocalendar', _.selectMonth);

        // set event listener for year
        $('[year-val]')
           .off('click.evocalendar')
           .on('click.evocalendar', _.selectYear);

    };

    // select year
    EvoCalendar.prototype.selectYear = function(event) {
        var _ = this;

        _.$active_year_el = $(event.currentTarget);

        if($(event.currentTarget).attr("year-val") == "prev") {
            --_.$active_year;
        } else if ($(event.currentTarget).attr("year-val") == "next") {
            ++_.$active_year;
        } else {

        }

        $('[year-val]').removeClass('active-year');
        $(_.$active_year_el).addClass('active-year');

        $('.calendar-year p').text(_.$active_year);
         _.buildCalendar('inner', null, _.$active_year);
    };

    // select month
    EvoCalendar.prototype.selectMonth = function(event) {
        var _ = this;

        _.$active_month = $(event.currentTarget).attr("month-val");
        _.$active_month_el = $("li[month-val="+_.$active_month+"]");
        $(_.$active_month_el).addClass('active-month');

        $('[month-val]').removeClass('active-month');
        $('[month-val='+_.$active_month+']').addClass('active-month');
         _.buildCalendar('inner', _.$active_month);
    };

    // select specific date
    EvoCalendar.prototype.selectDate = function(event) {
        var _ = this;

        _.$active_day_el = $(event.currentTarget);
        _.$active_date = _.$active_day_el.attr("date-val");
        $('.day').removeClass('calendar-active');
        $(_.$active_day_el).addClass('calendar-active');
         _.buildCalendar('events');
    };
    
    // toggle sidebar
    EvoCalendar.prototype.toggleSidebar = function(event) {
        var _ = this;

        if($(_.$calendar).hasClass('sidebar-hide')) {
            $(_.$calendar).removeClass('sidebar-hide');
        } else {
            $(_.$calendar).addClass('sidebar-hide');
        }
    };

    // toggle event list
    EvoCalendar.prototype.toggleEventList = function(event) {
        var _ = this;

        if($(_.$calendar).hasClass('event-hide')) {
            $(_.$calendar).removeClass('event-hide');
        } else {
            $(_.$calendar).addClass('event-hide');
        }
    };

    // toggle event list
    EvoCalendar.prototype.addCalendarEvent = function(new_data) {
        var _ = this;
        var data = new_data;
        for(var i=0; i < data.length; i++) {
            if(_.isValidDate(data[i].date)) {
                data[i].date = _.formatDate(new Date(data[i].date), _.options.format, 'en');
                _.options.calendarEvents.push(data[i]);
            }
        }
         _.buildCalendar('inner');
         _.buildCalendar('events');
    };

    EvoCalendar.prototype.parseFormat = function(format) {
        var _ = this;

        if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
            return format;
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(_.initials.validParts, '\0').split('\0'),
            parts = format.match(_.initials.validParts);
        if (!separators || !separators.length || !parts || parts.length === 0){
            throw new Error("Invalid date format.");
        }
        return {separators: separators, parts: parts};
    };

    EvoCalendar.prototype.isValidDate = function(d){
        return new Date(d) && !isNaN(new Date(d).getTime());
    }
    EvoCalendar.prototype.formatDate = function(date, format, language){
        var _ = this;
        if (!date)
            return '';
        if (typeof format === 'string')
            format = _.parseFormat(format);
        if (format.toDisplay)
            return format.toDisplay(date, format, language);
        var val = {
            d: new Date(date).getDate(),
            D: _.initials.dates[language].daysShort[new Date(date).getDay()],
            DD: _.initials.dates[language].days[new Date(date).getDay()],
            m: new Date(date).getMonth() + 1,
            M: _.initials.dates[language].monthsShort[new Date(date).getMonth()],
            MM: _.initials.dates[language].months[new Date(date).getMonth()],
            yy: new Date(date).getFullYear().toString().substring(2),
            yyyy: new Date(date).getFullYear()
        };
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];
        var seps = $.extend([], format.separators);
        for (var i=0, cnt = format.parts.length; i <= cnt; i++){
            if (seps.length)
                date.push(seps.shift());
            date.push(val[format.parts[i]]);
        }
        return date.join('');
    };



    $.fn.evoCalendar = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].evoCalendar = new EvoCalendar(_[i], opt);
            else
                ret = _[i].evoCalendar[opt].apply(_[i].evoCalendar, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));