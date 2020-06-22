/*!
 * Evo Calendar - Simple and Modern-looking Event Calendar Plugin
 *
 * Licensed under the MIT License
 * 
 * Version: 1.0.0
 * Author: Edlyn Villegas
 * Docs: https://edlynvillegas.github.com/evo-calendar
 * Repo: https://github.com/edlynvillegas/evo-calendar
 * Issues: https://github.com/edlynvillegas/evo-calendar/issues
 * 
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
        function EvoCalendar(element, settings) {
            var _ = this;
            _.defaults = {
                theme: null,
                format: 'mm/dd/yyyy',
                titleFormat: 'MM yyyy',
                eventHeaderFormat: 'MM d, yyyy',
                firstDayOfWeek: 0,
                language: 'en',
                todayHighlight: false,
                sidebarDisplayDefault: true,
                sidebarToggler: true,
                eventDisplayDefault: true,
                eventListToggler: true,
                calendarEvents: null
            };
            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                default_class: $(element)[0].classList.value,
                validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                dates: {
                    en: {
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    },
                    es: {
                        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                    },
                    de: {
                        days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                        daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                        monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
                    },
                    pt: {
                        days: ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"],
                        daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                        daysMin: ["Do", "2a", "3a", "4a", "5a", "6a", "Sa"],
                        months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                        monthsShort: ["Jan", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
                    }
                }
            }
            _.initials.weekends = {
                sun: _.initials.dates[_.options.language].daysShort[0],
                sat: _.initials.dates[_.options.language].daysShort[6]
            }


            // Format Calendar Events into selected format
            if(_.options.calendarEvents != null) {
                for(var i=0; i < _.options.calendarEvents.length; i++) {
                    // If event doesn't have an id, throw an error message
                    if(!_.options.calendarEvents[i].id) {
                        console.log("%c Event named: \""+_.options.calendarEvents[i].name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
                    }
                    if(_.isValidDate(_.options.calendarEvents[i].date)) {
                        _.options.calendarEvents[i].date = _.formatDate(_.options.calendarEvents[i].date, _.options.format)
                    }
                }
            }

            // Global variables
            _.startingDay = null;
            _.monthLength = null;
            
            // CURRENT
            _.$current = {
                month: (isNaN(this.month) || this.month == null) ? new Date().getMonth() : this.month,
                year: (isNaN(this.year) || this.year == null) ? new Date().getFullYear() : this.year,
                date: _.formatDate(_.initials.dates[_.defaults.language].months[new Date().getMonth()]+' '+new Date().getDate()+' '+ new Date().getFullYear(), _.options.format)
            }

            // ACTIVE
            _.$active = {
                month: _.$current.month,
                year: _.$current.year,
                date: _.$current.date,
                event_date: _.$current.date,
                events: []
            }

            // LABELS
            _.$label = {
                days: [],
                months: _.initials.dates[_.defaults.language].months,
                days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            }

            // HTML Markups (template)
            _.$markups = {
                calendarHTML: '',
                mainHTML: '',
                sidebarHTML: '',
                eventHTML: ''
            }
            // HTML DOM elements
            _.$elements = {
                calendarEl: $(element),
                innerEl: null,
                sidebarEl: null,
                eventEl: null,

                sidebarToggler: null,
                eventListToggler: null,

                activeDayEl: null,
                activeMonthEl: null,
                activeYearEl: null
            }
            _.$breakpoints = {
                tablet: 768,
                mobile: 425
            }

            _.formatDate = $.proxy(_.formatDate, _);
            _.selectDate = $.proxy(_.selectDate, _);
            _.selectMonth = $.proxy(_.selectMonth, _);
            _.selectYear = $.proxy(_.selectYear, _);
            _.selectEvent = $.proxy(_.selectEvent, _);
            _.toggleSidebar = $.proxy(_.toggleSidebar, _);
            _.toggleEventList = $.proxy(_.toggleEventList, _);
            
            _.instanceUid = instanceUid++;

            _.init(true);
        }

        return EvoCalendar;

    }());

    // v1.0.0 - Initialize plugin
    EvoCalendar.prototype.init = function(init) {
        var _ = this;
        var windowW = $(window).width();
        
        if (!$(_.$elements.calendarEl).hasClass('calendar-initialized')) {
            $(_.$elements.calendarEl).addClass('evo-calendar calendar-initialized');
            if (windowW <= _.$breakpoints.tablet) { // tablet/mobile
                $(_.$elements.calendarEl).addClass('sidebar-hide event-hide'); // close sidebar and event list on load
            } else {
                if (!_.options.sidebarDisplayDefault) $(_.$elements.calendarEl).addClass('sidebar-hide'); // set sidebar visibility on load
                if (!_.options.eventDisplayDefault) $(_.$elements.calendarEl).addClass('event-hide'); // set event-hide visibility on load
            }
            if (_.options.theme) _.setTheme(_.options.theme); // set calendar theme
            _.buildTheBones(); // start building the calendar components
        }
    };
    // v1.0.0 - Destroy plugin
    EvoCalendar.prototype.destroy = function() {
        var _ = this;
        // code here
        _.destroyEventListener();
        if (_.$elements.calendarEl) {
            _.$elements.calendarEl.removeClass('calendar-initialized');
            _.$elements.calendarEl.removeClass('evo-calendar');
            _.$elements.calendarEl.removeClass('sidebar-hide');
            _.$elements.calendarEl.removeClass('event-hide');
        }
        _.$elements.calendarEl.empty();
        _.$elements.calendarEl.attr('class', _.initials.default_class);
        $(_.$elements.calendarEl).trigger("destroy", [_])
    }

    // v1.0.0 - Limit title (...)
    EvoCalendar.prototype.limitTitle = function(title, limit) {
        var newTitle = [];
        limit = limit === undefined ? 18 : limit;
        if ((title).split(' ').join('').length > limit) {
            var t = title.split(' ');
            for (var i=0; i<t.length; i++) {
                if (t[i].length + newTitle.join('').length <= limit) {
                    newTitle.push(t[i])
                }
            }
            return newTitle.join(' ') + '...'
        }
        return title;
    }
            
    // v1.0.0 - Parse format (date)
    EvoCalendar.prototype.parseFormat = function(format) {
        var _ = this;
        if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
            return format;
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(_.initials.validParts, '\0').split('\0'),
            parts = format.match(_.initials.validParts);
        if (!separators || !separators.length || !parts || parts.length === 0){
            console.log("%c Invalid date format ", "color:white;font-weight:bold;background-color:#e21d1d;");
        }
        return {separators: separators, parts: parts};
    };
    
    // v1.0.0 - Format date
    EvoCalendar.prototype.formatDate = function(date, format, language) {
        var _ = this;
        if (!date)
            return '';
        language = language ? language : _.defaults.language
        if (typeof format === 'string')
            format = _.parseFormat(format);
        if (format.toDisplay)
            return format.toDisplay(date, format, language);

        var ndate = new Date(date);
        // if (!_.isValidDate(ndate)) { // test
        //     ndate = new Date(date.replace(/-/g, '/'))
        // }
        
        var val = {
            d: ndate.getDate(),
            D: _.initials.dates[language].daysShort[ndate.getDay()],
            DD: _.initials.dates[language].days[ndate.getDay()],
            m: ndate.getMonth() + 1,
            M: _.initials.dates[language].monthsShort[ndate.getMonth()],
            MM: _.initials.dates[language].months[ndate.getMonth()],
            yy: ndate.getFullYear().toString().substring(2),
            yyyy: ndate.getFullYear()
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
    
    EvoCalendar.prototype.setTheme = function(themeName) {
        var _ = this;
        var prevTheme = _.options.theme;
        _.options.theme = themeName.toLowerCase().split(' ').join('-');

        if (_.options.theme) $(_.$elements.calendarEl).removeClass(prevTheme);
        if (_.options.theme !== 'default') $(_.$elements.calendarEl).addClass(_.options.theme);
    }

    
    EvoCalendar.prototype.resize = function() {
        var _ = this;
        var hasSidebar = !_.$elements.calendarEl.hasClass('sidebar-hide');
        var hasEvent = !_.$elements.calendarEl.hasClass('event-hide');
        var windowW = $(window).width();

        if (windowW <= _.$breakpoints.tablet && windowW > _.$breakpoints.mobile) {
            
            if(hasSidebar) _.toggleSidebar();
            if(hasEvent) _.toggleEventList();

            $(window)
                .off('click.evocalendar.evo-' + _.instanceUid)
                .on('click.evocalendar.evo-' + _.instanceUid, $.proxy(_.toggleOutside, _));
        } else if (windowW <= _.$breakpoints.mobile) {

            if(hasSidebar) _.toggleSidebar(false);
            if(hasEvent) _.toggleEventList(false);

            $(window)
                .off('click.evocalendar.evo-' + _.instanceUid)
        } else {
            $(window)
                .off('click.evocalendar.evo-' + _.instanceUid);
        }
    }

    // v1.0.0 - Initialize event listeners
    EvoCalendar.prototype.initEventListener = function() {
        var _ = this;

        // resize
        $(window)
            .off('resize.evocalendar.evo-' + _.instanceUid)
            .on('resize.evocalendar.evo-' + _.instanceUid, $.proxy(_.resize, _));

        // IF sidebarToggler: set event listener: toggleSidebar
        if(_.options.sidebarToggler) {
            _.$elements.sidebarToggler
            .off('click.evocalendar')
            .on('click.evocalendar', _.toggleSidebar);
        }
        
        // IF eventListToggler: set event listener: toggleEventList
        if(_.options.eventListToggler) {
            _.$elements.eventListToggler
            .off('click.evocalendar')
            .on('click.evocalendar', _.toggleEventList);
        }

        // set event listener for each month
        _.$elements.sidebarEl.find('[data-month-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectMonth);

        // set event listener for year
        _.$elements.sidebarEl.find('[data-year-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectYear);

        // set event listener for every event listed
        _.$elements.eventEl.find('[data-event-index]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectEvent);
    };
    EvoCalendar.prototype.destroyEventListener = function() {
        var _ = this;
        
        $(window).off('resize.evocalendar.evo-' + _.instanceUid);
        $(window).off('click.evocalendar.evo-' + _.instanceUid);
        
        // IF sidebarToggler: remove event listener: toggleSidebar
        if(_.options.sidebarToggler) {
            _.$elements.sidebarToggler
            .off('click.evocalendar');
        }
        
        // IF eventListToggler: remove event listener: toggleEventList
        if(_.options.eventListToggler) {
            _.$elements.eventListToggler
            .off('click.evocalendar');
        }

        // remove event listener for each day
        _.$elements.innerEl.find('.calendar-day').children()
        .off('click.evocalendar')

        // remove event listener for each month
        _.$elements.sidebarEl.find('[data-month-val]')
        .off('click.evocalendar');

        // remove event listener for year
        _.$elements.sidebarEl.find('[data-year-val]')
        .off('click.evocalendar');

        // remove event listener for every event listed
        _.$elements.eventEl.find('[data-event-index]')
        .off('click.evocalendar');
    };
    
    // v1.0.0 - Calculate days (incl. monthLength, startingDays based on :firstDayOfWeekName)
    EvoCalendar.prototype.calculateDays = function() {
        var _ = this, nameDays, weekStart, firstDay;
        _.monthLength = _.$label.days_in_month[_.$active.month]; // find number of days in month
        if (_.$active.month == 1) { // compensate for leap year - february only!
            if((_.$active.year % 4 == 0 && _.$active.year % 100 != 0) || _.$active.year % 400 == 0){
                _.monthLength = 29;
            }
        }
        nameDays = _.initials.dates[_.options.language].daysShort;
        weekStart = _.options.firstDayOfWeek;
        
        while (_.$label.days.length < nameDays.length) {
            if (weekStart == nameDays.length) {
                weekStart=0;
            }
            _.$label.days.push(nameDays[weekStart]);
            weekStart++;
        }
        console.log(_.$label.days)
        firstDay = new Date(_.$active.year, _.$active.month).getDay() - weekStart;
        _.startingDay = firstDay < 0 ? (_.$label.days.length + firstDay) : firstDay;
    }

    // v1.0.0 - Build the bones! (incl. sidebar, inner, events), called once in every initialization
    EvoCalendar.prototype.buildTheBones = function() {
        var _ = this;
        _.calculateDays();
        
        if (!_.$elements.calendarEl.html()) {
            var markup;

            // --- BUILDING MARKUP BEGINS --- //

            // sidebar
            markup = '<div class="calendar-sidebar">'+
                        '<div class="calendar-year">'+
                            '<button class="icon-button" role="button" data-year-val="prev" title="Previous year">'+
                                '<span class="chevron-arrow-left"></span>'+
                            '</button>'+
                            '&nbsp;<p></p>&nbsp;'+
                            '<button class="icon-button" role="button" data-year-val="next" title="Next year">'+
                                '<span class="chevron-arrow-right"></span>'+
                            '</button>'+
                        '</div><div class="month-list">'+
                        '<ul class="calendar-months">';
                            for(var i = 0; i < _.$label.months.length; i++) {
                                markup += '<li class="month" role="button" data-month-val="'+i+'">'+_.initials.dates[_.options.language].months[i]+'</li>';
                            }
                        markup += '</ul>';
            markup += '</div></div>';
        
            // inner
            markup += '<div class="calendar-inner">'+
                            '<table class="calendar-table">'+
                                '<tr><th colspan="7"></th></tr>'+
                                '<tr class="calendar-header">';
                                for(var i = 0; i < _.$label.days.length; i++ ){
                                    var headerClass = "calendar-header-day";
                                    if (_.$label.days[i] === _.initials.weekends.sat || _.$label.days[i] === _.initials.weekends.sun) {
                                        headerClass += ' --weekend';
                                    }
                                    markup += '<td class="'+headerClass+'">'+_.$label.days[i]+'</td>';
                                }
                                markup += '</tr></table>'+
                        '</div>';

            // events
            markup += '<div class="calendar-events">'+
                            '<div class="event-header"><p></p></div>'+
                            '<div class="event-list"></div>'+
                        '</div>';

            // --- Finally, build it now! --- //
            _.$elements.calendarEl.html(markup);

            if (!_.$elements.sidebarEl) _.$elements.sidebarEl = $(_.$elements.calendarEl).find('.calendar-sidebar');
            if (!_.$elements.innerEl) _.$elements.innerEl = $(_.$elements.calendarEl).find('.calendar-inner');
            if (!_.$elements.eventEl) _.$elements.eventEl = $(_.$elements.calendarEl).find('.calendar-events');

            // if: _.options.sidebarToggler
            if(_.options.sidebarToggler) {
                $(_.$elements.sidebarEl).append('<span id="sidebarToggler" role="button" aria-pressed title="Close sidebar"><button class="icon-button"><span class="bars"></span></button></span>');
                if(!_.$elements.sidebarToggler) _.$elements.sidebarToggler = $(_.$elements.sidebarEl).find('span#sidebarToggler');
            }
            if(_.options.eventListToggler) {
                $(_.$elements.calendarEl).append('<span id="eventListToggler" role="button" aria-pressed title="Close event list"><button class="icon-button"><span class="chevron-arrow-right"></span></button></span>');
                if(!_.$elements.eventListToggler) _.$elements.eventListToggler = $(_.$elements.calendarEl).find('span#eventListToggler');
            }
        }

        _.buildSidebarYear();
        _.buildSidebarMonths();
        _.buildCalendar();
        _.buildEventList();
        _.initEventListener(); // test

        _.resize();
    }

    // v1.0.0 - Build Event: Event list
    EvoCalendar.prototype.buildEventList = function() {
        var _ = this, markup, hasEventToday = false;
        
        _.$active.events = [];
        // Event date
        var title = _.formatDate(_.$active.date, _.options.eventHeaderFormat, _.options.language);
        _.$elements.eventEl.find('.event-header > p').text(title);
        // Event list
        var eventListEl = _.$elements.eventEl.find('.event-list');
        // Clear event list item(s)
        if (eventListEl.children().length > 0) eventListEl.empty();
        if (_.options.calendarEvents) {
            for (var i = 0; i < _.options.calendarEvents.length; i++) {
                if(_.$active.date === _.options.calendarEvents[i].date) {
                    hasEventToday = true;
                    _.addEventList(_.options.calendarEvents[i])
                }
                else if (_.options.calendarEvents[i].everyYear) {
                    var d = new Date(_.$active.date).getMonth() + 1 + ' ' + new Date(_.$active.date).getDate();
                    var dd = new Date(_.options.calendarEvents[i].date).getMonth() + 1 + ' ' + new Date(_.options.calendarEvents[i].date).getDate();
                    // var d = _.formatDate(_.$active.date, 'mm/dd');
                    // var dd = _.formatDate(_.options.calendarEvents[i].date, 'mm/dd');
                    if(d==dd) {
                        hasEventToday = true;
                        _.addEventList(_.options.calendarEvents[i])
                    }
                }
            };
        }
        // IF: no event for the selected date
        if(!hasEventToday) {
            if (_.$active.date === _.$current.date) {
                markup = '<p>No event for today.. so take a rest! :)</p>';
            } else {
                markup = '<p>No event for this day.. so take a rest! :)</p>';
            }
        }
        eventListEl.append(markup)
    }

    // v1.0.0 - Add single event to event list
    EvoCalendar.prototype.addEventList = function(event_data) {
        var _ = this, markup;
        var eventListEl = _.$elements.eventEl.find('.event-list');
        if (eventListEl.find('[data-event-index]').length === 0) eventListEl.empty();
        _.$active.events.push(event_data);
        markup = '<div class="event-container" role="button" data-event-index="'+(event_data.id)+'">';
        markup += '<div class="event-icon"><div class="event-bullet-'+event_data.type+'"></div></div>';
        markup += '<div class="event-info"><p>'+_.limitTitle(event_data.name)+'</p></div>';
        markup += '</div>';
        eventListEl.append(markup);

        _.$elements.eventEl.find('[data-event-index="'+(event_data.id)+'"]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectEvent);
    }
    // v1.0.0 - Remove single event to event list
    EvoCalendar.prototype.removeEventList = function(event_data) {
        var _ = this, markup;
        var eventListEl = _.$elements.eventEl.find('.event-list');
        if (eventListEl.find('[data-event-index="'+event_data+'"]').length === 0) return; // event not in active events
        eventListEl.find('[data-event-index="'+event_data+'"]').remove();
        if (eventListEl.find('[data-event-index]').length === 0) {
            eventListEl.empty();
            if (_.$active.date === _.$current.date) {
                markup = '<p>No event for today.. so take a rest! :)</p>';
            } else {
                markup = '<p>No event for this day.. so take a rest! :)</p>';
            }
            eventListEl.append(markup)
        }
    }
    
    // v1.0.0 - Build Sidebar: Year text
    EvoCalendar.prototype.buildSidebarYear = function() {
        var _ = this;
        
        _.$elements.sidebarEl.find('.calendar-year > p').text(_.$active.year);
    }

    // v1.0.0 - Build Sidebar: Months list text
    EvoCalendar.prototype.buildSidebarMonths = function() {
        var _ = this;
        
        _.$elements.sidebarEl.find('.calendar-months > [data-month-val]').removeClass('active-month');
        _.$elements.sidebarEl.find('.calendar-months > [data-month-val="'+_.$active.month+'"]').addClass('active-month');
    }

    // v1.0.0 - Build Calendar: Title, Days
    EvoCalendar.prototype.buildCalendar = function() {
        var _ = this, markup, title;
        
        _.calculateDays();

        title = _.formatDate(new Date(_.$label.months[_.$active.month] +' 1 '+ _.$active.year), _.options.titleFormat, _.options.language);
        _.$elements.innerEl.find('.calendar-table th').text(title);

        _.$elements.innerEl.find('.calendar-body').remove(); // Clear days
        
        markup += '<tr class="calendar-body">';
                    var day = 1;
                    for (var i = 0; i < 9; i++) { // this loop is for is weeks (rows)
                        for (var j = 0; j < _.$label.days.length; j++) { // this loop is for weekdays (cells)
                            if (day <= _.monthLength && (i > 0 || j >= _.startingDay)) {
                                var dayClass = "calendar-day";
                                if (_.$label.days[j] === _.initials.weekends.sat || _.$label.days[j] === _.initials.weekends.sun) {
                                    dayClass += ' --weekend'; // add '--weekend' to sat sun
                                }
                                markup += '<td class="'+dayClass+'">';

                                var thisDay = _.formatDate(_.$label.months[_.$active.month]+' '+day+' '+_.$active.year, _.options.format);
                                markup += '<div class="day" role="button" data-date-val="'+thisDay+'">'+day+'</div>';
                                day++;
                            } else {
                                markup += '<td>';
                            }
                            markup += '</td>';
                        }
                        if (day > _.monthLength) {
                            break; // stop making rows if we've run out of days
                        } else {
                            markup += '</tr><tr class="calendar-body">'; // add if not
                        }
                    }
                    markup += '</tr>';
        _.$elements.innerEl.find('.calendar-table').append(markup);

        if(_.options.todayHighlight) {
            _.$elements.innerEl.find("[data-date-val='" + _.$current.date + "']").addClass('calendar-today');
        }
        
        // set event listener for each day
        _.$elements.innerEl.find('.calendar-day').children()
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectDate)

        var selectedDate = _.$elements.innerEl.find("[data-date-val='" + _.$active.date + "']");
        
        if (selectedDate) {
            // Remove active class to all
            _.$elements.innerEl.children().removeClass('calendar-active');
            // Add active class to selected date
            selectedDate.addClass('calendar-active');
        }
        if(_.options.calendarEvents != null) { // For event indicator (dots)
            _.buildEventIndicator();
        }
    };

    EvoCalendar.prototype.addEventIndicator = function(active_date, type) {
        var _ = this, htmlToAppend, thisDate = _.$elements.innerEl.find('[data-date-val="'+active_date+'"]');

        if (thisDate.find('span.event-indicator').length === 0) {
            thisDate.append('<span class="event-indicator"></span>');
        }

        if (thisDate.find('span.event-indicator > .type-bullet > .type-'+type).length === 0) {
            htmlToAppend = '<div class="type-bullet"><div class="type-'+type+'"></div></div>';
            thisDate.find('.event-indicator').append(htmlToAppend);
        }
    }

    EvoCalendar.prototype.removeEventIndicator = function(active_date, type) {
        var _ = this;
        var eventLength = 0;

        // Check if no '.event-indicator', 'cause nothing to remove
        if (_.$elements.innerEl.find('[data-date-val="'+active_date+'"] span.event-indicator').length === 0) {
            return;
        }

        // Check how many events that has the same type
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            if(active_date === _.options.calendarEvents[i].date && type === _.options.calendarEvents[i].type) {
                eventLength++;
            }
        }

        // If has no type of event, then delete 
        if (eventLength === 0) {
            _.$elements.innerEl.find('[data-date-val="'+active_date+'"] span.event-indicator > .type-bullet > .type-'+type).parent().remove();
        }
    }

    
    /****************
    *    METHODS    *
    ****************/

    // v1.0.0 - Build event indicator on each date
    EvoCalendar.prototype.buildEventIndicator = function() {
        var _ = this;
        
        // prevent duplication
        _.$elements.innerEl.find('.calendar-day > day > .event-indicator').empty();
        
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            for (var x = 0; x < _.monthLength; x++) {
                // each day
                var active_date = _.formatDate(_.$label.months[_.$active.month] +' '+ (x + 1) +' '+ _.$active.year, _.options.format);
                
                if(active_date==_.options.calendarEvents[i].date) {
                    _.addEventIndicator(active_date, _.options.calendarEvents[i].type);
                }
                else if (_.options.calendarEvents[i].everyYear) {
                    var d = new Date(active_date).getMonth() + 1 + ' ' + new Date(active_date).getDate();
                    var dd = new Date(_.options.calendarEvents[i].date).getMonth() + 1 + ' ' + new Date(_.options.calendarEvents[i].date).getDate();
                    // var d = _.formatDate(active_date, 'mm/dd');
                    // var dd = _.formatDate(_.options.calendarEvents[i].date, 'mm/dd');
                    if(d==dd) {
                        _.addEventIndicator(active_date, _.options.calendarEvents[i].type);
                    }
                }
            }
        }
    };

    // v1.0.0 - Select event
    EvoCalendar.prototype.selectEvent = function(event) {
        var _ = this;
        var el = $(event.target).closest('.event-container');
        var id = $(el).data('eventIndex');
        var index = _.options.calendarEvents.map(function (event) { return event.id }).indexOf(id);
        $(_.$elements.calendarEl).trigger("selectEvent", [_.options.calendarEvents[index]])
    }

    // v1.0.0 - Select year
    EvoCalendar.prototype.selectYear = function(event) {
        var _ = this;
        var el, yearVal;
        var windowW = $(window).width();
        var hasSidebar = !_.$elements.calendarEl.hasClass('sidebar-hide');

        if (typeof event === 'string' || typeof event === 'number') {
            if ((parseInt(event)).toString().length === 4) {
                yearVal = parseInt(event);
            }
        } else {
            el = $(event.target).closest('[data-year-val]');
            yearVal = $(el).data('yearVal');
        }

        if(yearVal == "prev") {
            --_.$active.year;
        } else if (yearVal == "next") {
            ++_.$active.year;
        } else if (typeof yearVal === 'number') {
            _.$active.year = yearVal;
        }
        
        if (windowW <= _.$breakpoints.mobile) {
            if(hasSidebar) _.toggleSidebar(false);
        }

        _.buildSidebarYear();
        _.buildCalendar();
    };

    // v1.0.0 - Select month
    EvoCalendar.prototype.selectMonth = function(event) {
        var _ = this;
        var windowW = $(window).width();
        var hasSidebar = !_.$elements.calendarEl.hasClass('sidebar-hide');
        
        if (typeof event === 'string' || typeof event === 'number') {
            if (event >= 0 && event <=_.$label.months.length) {
                // if: 0-11
                _.$active.month = (event).toString();
            }
        } else {
            // if month is manually selected
            _.$active.month = $(event.currentTarget).data('monthVal');
        }

        if (windowW <= _.$breakpoints.tablet) {
            if(hasSidebar) _.toggleSidebar(false);
        }
        
        _.buildSidebarMonths();
        _.buildCalendar();
    };

    // v1.0.0 - Select specific date
    EvoCalendar.prototype.selectDate = function(event) {
        var _ = this;
        var oldDate = _.$active.date;
        var date, year, month, activeDayEl, isSameDate;

        if (typeof event === 'string' || typeof event === 'number' || event instanceof Date) {
            date = _.formatDate(new Date(event), _.options.format)
            year = new Date(date).getFullYear();
            month = new Date(date).getMonth();
            
            if (_.$active.year !== year) _.selectYear(year);
            if (_.$active.month !== month) _.selectMonth(month);
            activeDayEl = _.$elements.innerEl.find("[data-date-val='" + date + "']");
        } else {
            activeDayEl = $(event.currentTarget);
            date = activeDayEl.data('dateVal')
        }
        isSameDate = _.$active.date === date;
        // Set new active date
        _.$active.date = date;
        _.$active.event_date = date;
        // Remove active class to all
        _.$elements.innerEl.find('[data-date-val]').removeClass('calendar-active');
        // Add active class to selected date
        activeDayEl.addClass('calendar-active');
        // Build event list if not the same date events built
        if (!isSameDate) _.buildEventList();
        // EVENT FIRED: selectDate
        $(_.$elements.calendarEl).trigger("selectDate", [_.$active.date, oldDate])
    };
    
    // v1.0.0 - Return active date
    EvoCalendar.prototype.getActiveDate = function() {
        var _ = this;
        return _.$active.date;
    }
    
    // v1.0.0 - Return active events
    EvoCalendar.prototype.getActiveEvents = function() {
        var _ = this;
        return _.$active.events;
    }

    // v1.0.0 - Hide Sidebar/Event List if clicked outside
    EvoCalendar.prototype.toggleOutside = function(event) {
        var _ = this, hasSidebar, hasEvent, isInnerClicked;

        hasSidebar = !_.$elements.calendarEl.hasClass('sidebar-hide');
        hasEvent = !_.$elements.calendarEl.hasClass('event-hide');
        isInnerClicked = event.target === _.$elements.innerEl[0];

        if (hasSidebar && isInnerClicked) _.toggleSidebar(false);
        if (hasEvent && isInnerClicked) _.toggleEventList(false);
    }

    // v1.0.0 - Toggle Sidebar
    EvoCalendar.prototype.toggleSidebar = function(event) {
        var _ = this, hasSidebar, hasEvent, windowW;
        windowW = $(window).width();

        if (event === undefined || event.originalEvent) {
            $(_.$elements.calendarEl).toggleClass('sidebar-hide');
        } else {
            if(event) {
                $(_.$elements.calendarEl).removeClass('sidebar-hide');
            } else {
                $(_.$elements.calendarEl).addClass('sidebar-hide');
            }
        }

        if (windowW <= _.$breakpoints.tablet && windowW > _.$breakpoints.mobile) {
            hasSidebar = !_.$elements.calendarEl.hasClass('sidebar-hide');
            hasEvent = !_.$elements.calendarEl.hasClass('event-hide');
            if (hasSidebar && hasEvent) _.toggleEventList();
        }
    };

    // v1.0.0 - Toggle Event list
    EvoCalendar.prototype.toggleEventList = function(event) {
        var _ = this, hasSidebar, hasEvent, windowW;
        windowW = $(window).width();

        if (event === undefined || event.originalEvent) {
            $(_.$elements.calendarEl).toggleClass('event-hide');
        } else {
            if(event) {
                $(_.$elements.calendarEl).removeClass('event-hide');
            } else {
                $(_.$elements.calendarEl).addClass('event-hide');
            }
        }

        if (windowW <= _.$breakpoints.tablet && windowW > _.$breakpoints.mobile) {
            hasEvent = !_.$elements.calendarEl.hasClass('event-hide');
            hasSidebar = !_.$elements.calendarEl.hasClass('sidebar-hide');
            if (hasEvent && hasSidebar) _.toggleSidebar();
        }
    };

    // v1.0.0 - Add Calendar Event(s)
    EvoCalendar.prototype.addCalendarEvent = function(arr) {
        var _ = this;

        function addEvent(data) {
            if(!data.id) {
                console.log("%c Event named: \""+data.name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
            if(_.isValidDate(data.date)) {
                data.date = _.formatDate(new Date(data.date), _.options.format);
                if (!_.options.calendarEvents) _.options.calendarEvents = [];
                _.options.calendarEvents.push(data);
                // add to date's indicator
                _.addEventIndicator(data.date, data.type);
                // add to event list IF active.event_date === data.date
                if (_.$active.event_date === data.date) _.addEventList(data);
                _.$elements.innerEl.find("[data-date-val='" + data.date + "']")
            } else {
                console.log("%c Event named: \""+data.name+"\" has invalid date ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
        }
        if (arr instanceof Array) { // Arrays of events
            for(var i=0; i < arr.length; i++) {
                addEvent(arr[i])
            }
        } else if (typeof arr === 'object') { // Single event
            addEvent(arr)
        }
    };

    // v1.0.0 - Remove Calendar Event(s)
    EvoCalendar.prototype.removeCalendarEvent = function(arr) {
        var _ = this;

        function deleteEvent(data) {
            // Array index
            var index = _.options.calendarEvents.map(function (event) { return event.id }).indexOf(data);
            
            if (index >= 0) {
                var active_date = _.options.calendarEvents[index].date;
                var type = _.options.calendarEvents[index].type;
                // Remove event from calendar events
                _.options.calendarEvents.splice(index, 1);
                // remove to event list
                _.removeEventList(data);
                // remove event indicator
                _.removeEventIndicator(active_date, type);
            } else {
                console.log("%c "+data+": ID not found ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
        }
        if (arr instanceof Array) { // Arrays of index
            for(var i=0; i < arr.length; i++) {
                deleteEvent(arr[i])
            }
        } else { // Single index
            deleteEvent(arr)
        }
    };

    EvoCalendar.prototype.isValidDate = function(d){
        return new Date(d) && !isNaN(new Date(d).getTime());
    }

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