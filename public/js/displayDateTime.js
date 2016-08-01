/**
 * Created by R10253 on 6/7/2016.
 */
function displayDate() {
    var t = document.getElementById("today");
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var dayNames = ["Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday", "Saturday"];

    var d = new Date();
    var day = d.getDay();
    var date = d.getDate();
    var monthIndex = d.getMonth();
    var year = d.getFullYear();

    t.innerHTML = dayNames[day] + ', ' + date + ' ' + monthNames[monthIndex] + ' ' + year;
}

function displayTime() {
    var d = new Date();
    var y = document.getElementById("clock");
    var h = (d.getHours()).toString();
    var m = (d.getMinutes()).toString();
    var s = (d.getSeconds()).toString();
    var h2 = ("0" + h).slice(-2);
    var m2 = ("0" + m).slice(-2);
    var s2 = ("0" + s).slice(-2);
    y.innerHTML = h2 + ":" + m2 + ":" + s2;
}

$(function () {
    displayDate();
    setInterval(displayTime, 1000);
});