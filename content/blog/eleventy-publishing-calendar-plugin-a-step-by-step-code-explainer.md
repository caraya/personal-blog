import { Temporal } from '@js-temporal/polyfill';

export default function(eleventyConfig, options = {}) {
  const defaultOptions = {
    collections: ['posts'],
    calendarClass: 'publishing-calendar',
    dayClass: 'calendar-day',
    postClass: 'calendar-post',
    navClass: 'calendar-nav',
    colors: {
      header: '#f0f0f0',
      today: '#e0f7fa',
      past: '#f5f5f5',
      future: '#fff'
    },
    layout: 'grid',
    polyfillUrl: 'https://cdn.jsdelivr.net/npm/@js-temporal/polyfill/dist/index.umd.js'
  };

  const opts = { ...defaultOptions, ...options };

  eleventyConfig.addShortcode('publishingCalendar', function(month, year) {
    const calendarId = `calendar-${Math.random().toString(36).substr(2, 9)}`;
    const currentDate = Temporal.Now.plainDateISO();

    let targetMonth;
    try {
        if (month !== undefined && month !== null) {
            const m = parseInt(month, 10);
            const y = (year !== undefined && year !== null) ? parseInt(year, 10) : currentDate.year;

            if (isNaN(m)) throw new Error(`Invalid month: ${month}`);
            if (isNaN(y)) throw new Error(`Invalid year: ${year}`);

            targetMonth = Temporal.PlainYearMonth.from({ year: y, month: m });
        } else {
            targetMonth = currentDate.toPlainYearMonth();
        }
    } catch (e) {
        console.warn(`[publishing-calendar] Invalid date args: ${month}, ${year}. Using current month. Error: ${e.message}`);
        targetMonth = currentDate.toPlainYearMonth();
    }

    const startOfMonth = targetMonth.toPlainDate({ day: 1 });
    const endOfMonth = targetMonth.toPlainDate({ day: targetMonth.daysInMonth });
    const startOfWeek = startOfMonth.subtract({ days: startOfMonth.dayOfWeek - 1 }); // Monday start
    const endOfWeek = endOfMonth.add({ days: 7 - endOfMonth.dayOfWeek });

    // Collect posts
    const allPosts = [];
    opts.collections.forEach(collectionName => {
      if (this.ctx.collections[collectionName]) {
        allPosts.push(...this.ctx.collections[collectionName]);
      }
    });

    // Group posts by date and simplify for client-side
    const postsByDate = {};
    allPosts.forEach(post => {
      if (post.date) {
        const postDate = Temporal.PlainDate.from(post.date);
        const dateKey = postDate.toString();
        if (!postsByDate[dateKey]) postsByDate[dateKey] = [];
        postsByDate[dateKey].push({
            title: post.data.title,
            url: post.url,
            fileName: post.inputPath.split('/').pop(),
            contentType: post.data?.contentType || 'post'
        });
      }
    });

    // Generate calendar HTML
    let html = `<div id="${calendarId}" class="${opts.calendarClass}">`;
    html += `<div class="${opts.navClass}">`;
    const prevMonth = targetMonth.subtract({ months: 1 });
    const nextMonth = targetMonth.add({ months: 1 });
    html += `<a href="?month=${prevMonth.month}&year=${prevMonth.year}" class="calendar-nav-prev">Previous</a>`;
    html += `<h2>${targetMonth.toLocaleString('en', { month: 'long', year: 'numeric' })}</h2>`;
    html += `<a href="?month=${nextMonth.month}&year=${nextMonth.year}" class="calendar-nav-next">Next</a>`;
    html += `</div>`;

    html += `<div class="calendar-grid">`;
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    daysOfWeek.forEach(day => {
      html += `<div class="calendar-header">${day}</div>`;
    });

    let date = startOfWeek;
    while (Temporal.PlainDate.compare(date, endOfWeek) <= 0) {
      const dateKey = date.toString();
      const isCurrentMonth = date.month === targetMonth.month;
      const isToday = Temporal.PlainDate.compare(date, currentDate) === 0;
      const isPast = Temporal.PlainDate.compare(date, currentDate) < 0;
      let dayClass = opts.dayClass;
      if (!isCurrentMonth) dayClass += ' other-month';
      if (isToday) dayClass += ' today';
      if (isPast) dayClass += ' past';
      else dayClass += ' future';

      html += `<div class="${dayClass}" style="background-color: ${isToday ? opts.colors.today : isPast ? opts.colors.past : opts.colors.future};">`;
      html += `<div class="day-number">${date.day}</div>`;
      if (postsByDate[dateKey]) {
        postsByDate[dateKey].forEach(post => {
          html += `<div class="${opts.postClass} ${post.contentType}">`;
          html += `<a href="${post.url}">${post.title}</a>`;
          html += `<span class="filename">(${post.fileName})</span>`;
          html += `</div>`;
        });
      }
      html += `</div>`;
      date = date.add({ days: 1 });
    }
    html += `</div>`;
    html += `</div>`;

    // Add some basic CSS
    const css = `
      <style>
        .${opts.calendarClass} { font-family: Arial, sans-serif; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
        .calendar-header { background-color: ${opts.colors.header}; padding: 10px; text-align: center; font-weight: bold; }
        .${opts.dayClass} { min-height: 100px; padding: 5px; border: 1px solid #ccc; }
        .other-month { opacity: 0.5; }
        .${opts.postClass} { margin: 2px 0; font-size: 0.8em; }
        .filename { font-size: 0.7em; color: #666; }
        .${opts.navClass} { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
      </style>
    `;

    // Client-side script for dynamic navigation
    const script = `
    <script>
    (function() {
        function initCalendar() {
            const container = document.getElementById('${calendarId}');
            if (!container) return;

            const postsData = ${JSON.stringify(postsByDate)};
            const options = ${JSON.stringify(opts)};
            let currentMonth = ${targetMonth.month};
            let currentYear = ${targetMonth.year};

            function renderCalendar(month, year) {
                const targetMonth = Temporal.PlainYearMonth.from({ year: year, month: month });
                const monthName = targetMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

                let navHtml = '<div class="' + options.navClass + '">';
                navHtml += '<a href="#" class="calendar-nav-prev">Previous</a>';
                navHtml += '<h2>' + monthName + '</h2>';
                navHtml += '<a href="#" class="calendar-nav-next">Next</a>';
                navHtml += '</div>';

                let gridHtml = '<div class="calendar-grid">';
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                days.forEach(d => gridHtml += '<div class="calendar-header">' + d + '</div>');

                const startOfMonth = targetMonth.toPlainDate({ day: 1 });
                const endOfMonth = targetMonth.toPlainDate({ day: targetMonth.daysInMonth });

                const startOfWeek = startOfMonth.subtract({ days: startOfMonth.dayOfWeek - 1 });
                const endOfWeek = endOfMonth.add({ days: 7 - endOfMonth.dayOfWeek });

                let loopDate = startOfWeek;
                const today = Temporal.Now.plainDateISO();

                while (Temporal.PlainDate.compare(loopDate, endOfWeek) <= 0) {
                    const dateKey = loopDate.toString();

                    const isCurrentMonth = loopDate.month === targetMonth.month;
                    const isToday = loopDate.equals(today);
                    const isPast = Temporal.PlainDate.compare(loopDate, today) < 0;

                    let classes = options.dayClass;
                    if (!isCurrentMonth) classes += ' other-month';
                    if (isToday) classes += ' today';
                    else if (isPast) classes += ' past';
                    else classes += ' future';

                    let bgColor = isToday ? options.colors.today : (isPast ? options.colors.past : options.colors.future);

                    gridHtml += '<div class="' + classes + '" style="background-color: ' + bgColor + ';">';
                    gridHtml += '<div class="day-number">' + loopDate.day + '</div>';

                    if (postsData[dateKey]) {
                        postsData[dateKey].forEach(post => {
                            gridHtml += '<div class="' + options.postClass + ' ' + post.contentType + '">';
                            gridHtml += '<a href="' + post.url + '">' + post.title + '</a>';
                            gridHtml += '<span class="filename">(' + post.fileName + ')</span>';
                            gridHtml += '</div>';
                        });
                    }

                    gridHtml += '</div>';
                    loopDate = loopDate.add({ days: 1 });
                }
                gridHtml += '</div>';

                container.innerHTML = navHtml + gridHtml;
            }

            container.addEventListener('click', function(e) {
                if (e.target.classList.contains('calendar-nav-prev')) {
                    e.preventDefault();
                    currentMonth--;
                    if (currentMonth < 1) { currentMonth = 12; currentYear--; }
                    renderCalendar(currentMonth, currentYear);
                } else if (e.target.classList.contains('calendar-nav-next')) {
                    e.preventDefault();
                    currentMonth++;
                    if (currentMonth > 12) { currentMonth = 1; currentYear++; }
                    renderCalendar(currentMonth, currentYear);
                }
            });
        }

        if (typeof Temporal !== 'undefined') {
            initCalendar();
        } else {
            if (!document.getElementById('temporal-polyfill')) {
                const script = document.createElement('script');
                script.id = 'temporal-polyfill';
                script.src = '${opts.polyfillUrl}';
                script.onload = function() {
                    document.dispatchEvent(new Event('temporal-loaded'));
                };
                document.head.appendChild(script);
            }
            document.addEventListener('temporal-loaded', initCalendar);
        }
    })();
    </script>
    `;

    return css + html + script;
  });
};
