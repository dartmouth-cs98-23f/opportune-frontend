/* date helper module */

export function parseDate(date) {
    const parsed = date.substr(0, 10).split('-');
    return new Date(parseInt(parsed[0]), parseInt(parsed[1]) - 1, parseInt(parsed[2]));
}

export function parseDatePlus1(date) {
    const parsed = date.substr(0, 10).split('-');
    return new Date(parseInt(parsed[0]), parseInt(parsed[1]) - 1, parseInt(parsed[2]) + 1);
}

export function convertDateToAPIFormat(date) {
    const asDate = new Date(date);
    const day = asDate.getDate();
    const month = asDate.getMonth() + 1;
    const year = asDate.getFullYear();

    return year + '-' + month + '-' + day;
}