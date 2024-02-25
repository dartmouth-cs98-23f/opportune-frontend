/* date helper module */

// takes a date string as the argument of form year-month-day...
export function parseDate(date) {
    if(date instanceof Date) return date;
    const parsed = date.substr(0, 10).split('-');
    return new Date(parseInt(parsed[0]), parseInt(parsed[1]) - 1, parseInt(parsed[2]));
}

// takes a date string as the argument of form year-month-day...
export function parseDatePlus1(date) {
    if(date instanceof Date) return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const parsed = date.substr(0, 10).split('-');
    return new Date(parseInt(parsed[0]), parseInt(parsed[1]) - 1, parseInt(parsed[2]) + 1);
}

// takes a date string as the argument in any format
export function convertDateToAPIFormat(date) {
    const asDate = new Date(date);
    const day = asDate.getDate();
    const month = asDate.getMonth() + 1;
    const year = asDate.getFullYear();

    return year + '-' + month + '-' + day;
}

// takes a date as the object
export function formatDate(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const weekday = daysOfWeek[date.getDay()];
    const month = monthsOfYear[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${weekday}, ${month} ${day}, ${year}`;
}