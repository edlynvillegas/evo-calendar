var defaultTheme = getRandom(4);
var today = new Date();
var events = [
    { id: 'cu9q73n', name: "Event #1", date: today.getMonth()+1 +'/3/'+today.getFullYear(), type: "event" },
    { id: 'imwyx6S', name: "Event #2", date: today.getMonth()+1 +'/18/'+today.getFullYear(), type: "event" },
    { id: '9jU6g6f', name: "Holiday #1", date: today.getMonth()+1 +'/10/'+today.getFullYear(), type: "holiday" },
    { id: '0g5G6ja', name: "Birthday #1", date: today.getMonth()+1 +'/14/'+today.getFullYear(), type: "birthday" },
    { id: 'y2u7UaF', name: "Holiday #2", date: today.getMonth()+1 +'/23/'+today.getFullYear(), type: "holiday" },
    { id: 'dsu7HUc', name: "Birthday #2", date: new Date(), type: "birthday" }
];
var active_events = [];
var curAdd, curRmv;

function getRandom(max) {
    return Math.floor((Math.random() * max));
}
$(document).ready(function() {

    $('#demoEvoCalendar').evoCalendar({
        theme: 'Neumorphism',
        todayHighlight: true,
        format: 'MM dd, yyyy',
        calendarEvents: [
            { id: 'd8jai7s', name: "Author's Birthday", date: "February/15/2020", type: "birthday", everyYear: true },
            { id: 'sKn89hi', name: "Evo Calendar time!", date: new Date(), type: "event" },
            { id: 'in8bha4', name: "Evo Calendar time!", date: new Date(), type: "holiday" }
        ]
    });

    $('[data-set-theme]').click(function (e) {
        setTheme(e.target);
    })

    $('#addBtn').click(function(e) {
        curAdd = getRandom(events.length);
        $('#demoEvoCalendar').evoCalendar('addCalendarEvent', events[curAdd]);
        active_events.push(events[curAdd])
        events.splice(curAdd, 1);
        if (events.length === 0) e.target.disabled = true;
        if (active_events.length > 0) $('#removeBtn').prop("disabled", false);
    })
    $('#removeBtn').click(function(e) {
        curRmv = getRandom(active_events.length);
        $('#demoEvoCalendar').evoCalendar('removeCalendarEvent', active_events[curRmv].id);
        events.push(active_events[curRmv]);
        active_events.splice(curRmv, 1);
        if (active_events.length === 0) e.target.disabled = true;
        if (events.length > 0) $('#addBtn').prop("disabled", false);
    })

    setTheme($('[data-set-theme]')[defaultTheme]);
    function setTheme(el) {
        var themeName = el.dataset.setTheme;
        $('[data-set-theme]').removeClass('active');
        $(el).addClass('active');
        $('#demoEvoCalendar').evoCalendar('setTheme', themeName);
    }
    // window.onbeforeunload = function(event) {
    //     $('#demoEvoCalendar').evoCalendar('destroy');
    // };

    // SETTINGS DEMO CODE
    var settingsDemo = getRandom($('[data-settings]').length);
    var settingsDemoEl = $('[data-settings]')[settingsDemo];
    var methodDemo = getRandom($('[data-method]').length);
    var methodDemoEl = $('[data-method]')[methodDemo];
    var eventDemo = getRandom($('[data-event]').length);
    var eventDemoEl = $('[data-event]')[eventDemo];

    showSettingsSample($(settingsDemoEl).data().settings);
    showMethodSample($(methodDemoEl).data().method);
    showEventSample($(eventDemoEl).data().event);

    $('[data-settings]').on('click', function (e) {
        var el = $(e.target).closest('[data-settings]');
        var ev = el.data().settings;
        showSettingsSample(ev);
    });
    $('[data-method]').on('click', function (e) {
        var el = $(e.target).closest('[data-method]');
        var ev = el.data().method;
        showMethodSample(ev);
    });
    $('[data-event]').on('click', function (e) {
        var el = $(e.target).closest('[data-event]');
        var ev = el.data().event;
        showEventSample(ev);
    });
});

// BUILD SETTINGS SAMPLE MARKUP
function showSettingsSample(ev) {
    var settingsCode = $('#event-settings');
    var markup;
    switch (ev) {
        case 'theme':
            markup = '<br><span class="green">// theme</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'theme\'</span>: <span class="red">\'Theme Name\'</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'language':
            markup = '<br><span class="green">// language</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'language\'</span>: <span class="red">\'en\'</span><br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// Supported language: en, es, de..</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'format':
            markup = '<br><span class="green">// format</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'format\'</span>: <span class="red">\'MM dd, yyyy\'</span><br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// some browsers doesn\'t support other format, so...</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'titleFormat':
            markup = '<br><span class="green">// titleFormat</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'titleFormat\'</span>: <span class="red">\'MM\'</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'eventHeaderFormat':
            markup = '<br><span class="green">// eventHeaderFormat</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'eventHeaderFormat\'</span>: <span class="red">\'MM dd\'</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'firstDayOfWeek':
            markup = '<br><span class="green">// firstDayOfWeek</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'firstDayOfWeek\'</span>: <span class="red">\'Mon\'</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'todayHighlight':
            markup = '<br><span class="green">// todayHighlight</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'todayHighlight\'</span>: <span class="blue">true</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'sidebarDisplayDefault':
            markup = '<br><span class="green">// sidebarDisplayDefault</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'sidebarDisplayDefault\'</span>: <span class="blue">false</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'sidebarToggler':
            markup = '<br><span class="green">// sidebarToggler</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'sidebarToggler\'</span>: <span class="blue">false</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'eventDisplayDefault':
            markup = '<br><span class="green">// eventDisplayDefault</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'eventDisplayDefault\'</span>: <span class="blue">false</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'eventListToggler':
            markup = '<br><span class="green">// eventListToggler</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>({<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'eventListToggler\'</span>: <span class="blue">false</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'calendarEvents':
            markup = '<br><span class="green">// calendarEvents</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'calendarEvents\'</span>, {<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="violet">\'calendarEvents\'</span>: [<br>'
                                +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;{<br>'
                                    +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">"4hducye"</span>, <span class="green">// Event\'s id (required, for removing event)</span><br>'
                                    +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">"Today\'s Event"</span>, <span class="green">// Name of event</span><br>'
                                    +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="blue">new</span> <span class="yellow">Date</span>(), <span class="green">// Date of event</span><br>'
                                    +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">"holiday"</span>, <span class="green">// Type of event (event|holiday|birthday)</span><br>'
                                    +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">everyYear</span>: <span class="blue">true</span> <span class="green">// Event is every year (optional)</span><br>'
                                +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;}<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;]<br>'
                        +'});'
                    +'<br> '
        break;
        default:

        break;
    }
    $('[data-settings]').removeClass('active');
    $('[data-settings="'+ev+'"]').addClass('active');
    settingsCode.html(markup);
}

// BUILD METHOD SAMPLE MARKUP
function showMethodSample(ev) {
    var methodCode = $('#method-code');
    var markup;
    switch (ev) {
        case 'setTheme':
            markup = '<br><span class="green">// setTheme</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'setTheme\'</span>, <span class="red">\'Theme Name\'</span>);'
                    +'<br> '
        break;
        case 'toggleSidebar':
            markup = '<br><span class="green">// toggleSidebar</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleSidebar\'</span>);'
                    +'<br> '
                    +'<br><span class="green">// open sidebar</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleSidebar\'</span>, <span class="blue">true</span>);'
                    +'<br> '
        break;
        case 'toggleEventList':
            markup = '<br><span class="green">// toggleEventList</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleEventList\'</span>);'
                    +'<br> '
                    +'<br><span class="green">// close event list</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'toggleEventList\'</span>, <span class="blue">false</span>);'
                    +'<br> '
        break;
        case 'getActiveDate':
            markup = '<br><span class="green">// getActiveDate</span><br>'
                    +'<span class="red">var</span> <span class="orange">active_date</span> = $(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'getActiveDate\'</span>);'
                    +'<br> '
        break;
        case 'getActiveEvents':
            markup = '<br><span class="green">// getActiveEvents</span><br>'
                    +'<span class="red">var</span> <span class="orange">active_events</span> = $(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'getActiveEvents\'</span>);'
                    +'<br> '
        break;
        case 'selectYear':
            markup = '<br><span class="green">// selectYear</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'selectYear\'</span>, <span class="red">2021</span>);'
                    +'<br> '
        break;
        case 'selectMonth':
            markup = '<br><span class="green">// selectMonth</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'selectMonth\'</span>, <span class="red">1</span>); <span class="green">// february</span>'
                    +'<br> '
        break;
        case 'selectDate':
            markup = '<br><span class="green">// selectDate</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'selectDate\'</span>, <span class="red">\'February 15, 2020\'</span>);'
                    +'<br> '
        break;
        case 'addCalendarEvent':
            markup = '<br><span class="green">// addCalendarEvent</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'addCalendarEvent\'</span>, {<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">\'kNybja6\'</span>,<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">\'Mom\\\'s Birthday\'</span>,<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="red">\'May 27, 2020\'</span>,<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">\'birthday\'</span><br>'
                    +'});'
                    +'<br><span class="green">// add multiple events</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'addCalendarEvent\'</span>, [<br>'
                    +'&#8194;&#8194;&#8194;&#8194;&#8194;{<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">\'kNybja6\'</span>,<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">\'Mom\\\'s Birthday\'</span>,<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="red">\'May 27, 1965\'</span>,<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">\'birthday\'</span><br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">everyYear</span>: <span class="blue">true</span> <span class="green">// optional</span><br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;},<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;{<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">id</span>: <span class="red">\'asDf87L\'</span>,<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">name</span>: <span class="red">\'Graduation Day!\'</span>,<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">date</span>: <span class="red">\'March 21, 2020\'</span>,<br>'
                            +'&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;<span class="blue">type</span>: <span class="red">\'event\'</span><br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;}<br>'
                    +']);'
                    +'<br> '
        break;
        case 'removeCalendarEvent':
            markup = '<br><span class="green">// removeCalendarEvent</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'removeCalendarEvent\'</span>, <span class="red">\'kNybja6\'</span>);'
                    +'<br> '
                    +'<br><span class="green">// delete multiple event</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'removeCalendarEvent\'</span>, [<span class="red">\'kNybja6\'</span>, <span class="red">\'asDf87L\'</span>]);'
                    +'<br> '
        break;
        case 'destroy':
            markup = '<br><span class="green">// destroy</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">evoCalendar</span>(<span class="violet">\'destroy\'</span>);'
                    +'<br> '
        break;
        default:

        break;
    }
    $('[data-method]').removeClass('active');
    $('[data-method="'+ev+'"]').addClass('active');
    methodCode.html(markup);
}

// BUILD EVENT SAMPLE MARKUP
function showEventSample(ev) {
    var eventCode = $('#event-code');
    var markup;
    switch (ev) {
        case 'selectDate':
            markup = '<br><span class="green">// selectDate</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'selectDate\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">newDate</span>, <span class="yellow">oldDate</span>) {<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'selectEvent':
            markup = '<br><span class="green">// selectEvent</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'selectEvent\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">activeEvent</span>) {<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>'
                    +'});'
                    +'<br> '
        break;
        case 'destroy':
            markup = '<br><span class="green">// destroy</span><br>'
                    +'$(<span class="red">\'#calendar\'</span>).<span class="yellow">on</span>(<span class="violet">\'destroy\'</span>, <span class="blue">function</span>(<span class="yellow">event</span>, <span class="yellow">evoCalendar</span>) {<br>'
                        +'&#8194;&#8194;&#8194;&#8194;&#8194;<span class="green">// code here...</span><br>'
                    +'});'
                    +'<br> '
        break;
        default:

        break;
    }
    $('[data-event]').removeClass('active');
    $('[data-event="'+ev+'"]').addClass('active');
    eventCode.html(markup);
}

// hash navigator
$('[data-go*="#"]').on('click', function(e) {
    e.preventDefault();
    var go = $(this).data().go;
    
    if (go === '#top') {
        $('html, body').animate({
            scrollTop: 0,
        },500);
        return;
    } else {
        var top = $(go)[0].offsetTop - $('header')[0].offsetHeight - 10;
    }
    $('html, body').animate({
        scrollTop: top,
    },500);
})