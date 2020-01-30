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

        function EvoCalendar(element, settings) {

            var _ = this, dataSettings;
            _.defaults = {
            	todayHighlight: false,
                sidebarToggler: true,
                calendarEvents: null,
            	onSelectDate: null,
                onAddEvent: null
            };

            _.initials = {

            }

            $.extend(_, _.initials);

            _.options = $.extend({}, _.defaults, settings);
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

			_.$active_day_el = null;
			_.$active_date = null;
			_.$active_month_el = null;
			_.$active_month = _.$month;
            _.$active_year_el = null;
            _.$active_year = _.$year;

            _.$calendar = $(element);
            _.$calendar_sidebar = '';
            _.$calendar_inner = '';


            _.selectDate = $.proxy(_.selectDate, _);
            _.selectMonth = $.proxy(_.selectMonth, _);
            _.selectYear = $.proxy(_.selectYear, _);
            _.toggleSidebar = $.proxy(_.toggleSidebar, _);

            _.init(true);
        }
        console.log('Welcome to EvoCalendar!')

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
        console.log('EvoCalendar... build!')

		// get first day of month
		new_month = (isNaN(new_month) || new_month == null) ? _.$active_month : new_month;
		new_year = (isNaN(new_year) || new_year == null) ? _.$active_year : new_year;
		var firstDay = new Date(new_year, new_month);
		var startingDay = firstDay.getDay();
		console.log('startingDay', new_month, new_year)

		// find number of days in month
		var monthLength = _.$cal_days_in_month[new_month];

		// compensate for leap year
		if (new_month == 1) { // February only!
			if((new_year % 4 == 0 && new_year % 100 != 0) || new_year % 400 == 0){
			monthLength = 29;
			}
		}
		// do the header
		var monthName = _.$cal_months_labels[new_month];

        var mainHTML = '<div class="calendar-sidebar"></div><div class="calendar-inner"></div><div class="calendar-events"></div>';

		var sidebarHTML = '<div class="calendar-year"><img year-val="prev" title="Previous year" src="assets/img/icons/chevron-left.png"/>&nbsp;<p>'+new_year+'&nbsp;</p><img year-val="next" title="Next year" src="assets/img/icons/chevron-right.png"/></div>';
			sidebarHTML += '<ul class="calendar-months">';
			for(var i = 0; i < _.$cal_months_labels.length; i++) {
				sidebarHTML += '<li class="month';
				sidebarHTML += (parseInt(_.$active_month) === i) ? ' active-month' : ''
				sidebarHTML += '" month-val="'+i+'">'+_.$cal_months_labels[i]+'</li>';
			}
			sidebarHTML += '</ul>'+( _.options.sidebarToggler ? '<span id="sidebarToggler" title="Close sidebar"><img src="assets/img/icons/bars.png"/></span>' : '');


        var calendarHTML = '<table class="calendar-table">';
			calendarHTML += '<tr><th colspan="7">';
			calendarHTML +=  monthName + "&nbsp;" + new_year;
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
					calendarHTML += '<div class="day'
                    calendarHTML += ((_.$active_date === (monthName +'/'+ day +'/'+ new_year)) ? ' calendar-active' : '') + '" date-val="'
					calendarHTML += monthName +'/'+ day +'/'+ new_year;
					calendarHTML += '">';
					calendarHTML += day;
					calendarHTML += '</div>';
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

        _.$mainHTML = mainHTML;
        _.$sidebarHTML = sidebarHTML;
        _.$calendarHTML = calendarHTML;

		_.setHTML(val);
    };

    // Set the HTML to element
    EvoCalendar.prototype.setHTML = function(val) {
        var _ = this;
            console.log(val)


        if(val == 'all') {
            _.$calendar.html(_.$mainHTML);
            _.$calendar_sidebar = $('.calendar-sidebar');
            _.$calendar_inner = $('.calendar-inner');

            _.$calendar_sidebar.html(_.$sidebarHTML);
            _.$calendar_inner.html(_.$calendarHTML);
        } else if (val == 'sidebar') {
            _.$calendar_sidebar = $('.calendar-sidebar');
            _.$calendar_sidebar.html(_.$sidebarHTML);
        } else if (val == 'inner') {
            _.$calendar_inner = $('.calendar-inner');
            _.$calendar_inner.html(_.$calendarHTML);
        }

        if(_.options.calendarEvents != null) {
            console.log('initCalendarEvents!');
            _.initCalendarEvents();
        }



        if(_.options.todayHighlight) {
        	$('.day[date-val="'+ _.$cal_months_labels[_.$month] +'/'+ _.$cal_current_date.getDate() +'/'+ _.$year +'"]').addClass('calendar-today');
        }

        _.initEventListener();
    };

    // Add calendar events
    EvoCalendar.prototype.initCalendarEvents = function() {
        var _ = this;
        
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            for (var x = 0; x < _.$cal_days_in_month[_.$active_month]; x++) {
                var active_date = _.$cal_months_labels[_.$active_month] +'/'+ (x + 1) +'/'+ _.$active_year;
                if(active_date==_.options.calendarEvents[i].date) {
                    $('[date-val="'+active_date+'"]').addClass('calendar-'+ _.options.calendarEvents[i].type);
                }
            }
            // console.log(_.options.calendarEvents[i]);
        };
    };

    // Add listeners
    EvoCalendar.prototype.initEventListener = function() {
        var _ = this;

        // set event listener for each date
        if(_.options.sidebarToggler) {
            $('#sidebarToggler')
               .off('click.evocalendar')
               .on('click.evocalendar', _.toggleSidebar);
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
        console.log(_.$active_month_el)
        // $('[month-val]').removeClass('active-month');
        $(_.$active_month_el).addClass('active-month');
        console.log(_.$active_month_el);

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
        console.log(_.$active_date);
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
