let options = [];

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function formatDateWithHours(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}


$("#add-date").on("click", function () {

    const date = $("#datepicker").datepicker('getDate');
    const startDate = date?.setHours($('.start').timepicker('getTime').getHours());
    const startDateString = $('.start').timepicker('getTime').getHours().toString().padStart(2, '0') + ":00";

    const endDate = date?.setHours($('.end').timepicker('getTime').getHours());
    const endDateString = $('.end').timepicker('getTime').getHours().toString().padStart(2, '0') + ":00";

    if (date && startDate && endDate) {

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();



        const option = {
            startDate: formatDateWithHours(new Date(startDate)),
            endDate: formatDateWithHours(new Date(endDate)),
            day: day,
            month: month,
            year: year,
            startDateString: startDateString,
            endDateString: endDateString
        };

        options.push(option);

        sortOptions();
        renderOptions();

        resetInputFields();

    }

});

function resetInputFields() {
    $(".date").val("");
    $(".start, .end").val("00:00");
}

function sortOptions() {
    options.sort((a, b) => {
        if (a.startDate < b.startDate) {
            return -1;
        }
        if (a.startDate > b.startDate) {
            return 1;
        }
        return 0;
    });
}


function renderOptions() {
    $("#checkbox-list").html("");

    options.forEach((option, index) => {
        const listItem = `
        <div class="option-container" id="${index}" onclick="deleteItem(${index})">
          <div class="option-text">
          <span><b>${option.day}.${option.month}.${option.year}</b></span></br>
          <span id="time">${option.startDateString} - ${option.endDateString}</span>
          </div>
          <div class="overlay">
            <img src="img/trash.png" width="25rem" alt="Delete" >
          </div>
        </div>
      `;
        $("#checkbox-list").append(listItem);
    });
}

function deleteItem({ index }) {

    $('#' + index).remove();

    options.splice(index, 1);

    sortOptions();
    renderOptions();
}

$(document).ready(function () {

    $("#datepicker").datepicker({
        inline: true,
        startDate: new Date(),
    });

    $('.timepicker').timepicker({
        timeFormat: 'HH:mm',
        minTime: new Date(0, 0, 0, 8, 0, 0),
        maxTime: new Date(0, 0, 0, 23, 0, 0),
        startTime: new Date(0, 0, 0, 8, 0, 0),
        interval: 60,
    });

    $("#appointment-form").submit(event => {

        event.preventDefault();

        $.ajax({
            type: "POST",
            url: "./api/appointment/",
            dataType: "json",
            data: JSON.stringify({
                "title": $("#title").val(),
                "expirationDate": $("#expiration-date").val(),
                "location": $("#location").val(),
                "description": $("#description").val(),
                "userId": 1,
                // "password": $("#password").val(),
                "options": options
            }),
            success: ({ data: appointmentId }) => {
                window.location.href = "/appointment-finder/appointment.html#id=" + appointmentId;
            },
            error: (res) => console.log("ERROR:", res.responseText),

        });

    });

});
