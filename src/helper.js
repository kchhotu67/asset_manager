const toCapital = (text) => {
    let name = text
    name = name.trim();
    name = name.split(' ');
    name = name.filter((item) => item !== "")
    name = name.map(item => {
        return item[0].toUpperCase() + item.substr(1);
    })
    return name.join(" ");
}

const parseOption = (option) => {
    let text =option;
    text = text.replaceAll('[', '');
    text = text.replaceAll(']', '');
    text = text.trim();
    text = text.split(',');
    return text.filter((item) => item !== "");
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function valueFormater(type, value) {
    if(!value) return value;
    if(type === 'date') return formatDate(value)
    return value;
}

const hideToast = () => {
    let element = document.getElementById('my-custom-toast-123');
    element.classList.remove("show");
}
const displayToast = ({COLOR, MESSAGE}) => {
    hideEventLoader()
    let element = document.getElementById('my-custom-toast-123');
    element.classList.add("show");
    element.style.background = COLOR;
    let messageEle = element.getElementsByClassName('toast-body')[0]
    messageEle.innerHTML = MESSAGE;
    setTimeout(hideToast, 2000)
}

const hideEventLoader = () => {
    let element = document.getElementById('my-event-loader');
    element.style.display = 'none'
}
const displayEventLoader = () => {
    let element = document.getElementById('my-event-loader');
    element.style.display = 'block'
}

module.exports = {toCapital, parseOption, formatDate, valueFormater, hideToast, displayToast, hideEventLoader, displayEventLoader}