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
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    const startDate = date.setHours($('.start').timepicker('getTime').getHours());
    const startDateString = $('.start').timepicker('getTime').getHours().toString().padStart(2, '0') + ":00";

    const endDate = date.setHours($('.end').timepicker('getTime').getHours());
    const endDateString = $('.end').timepicker('getTime').getHours().toString().padStart(2, '0') + ":00";

    options.push({
        startDate: formatDateWithHours(new Date(startDate)),
        endDate: formatDateWithHours(new Date(endDate))
    });


    // If all inputs are valid, add a new date to the list
    if (date && startDate && endDate) {
        const listItem = `
        <div class="doodle-container" onclick="toggleCheckbox(event)">
          <div class="center">
            <label class="doodle-checkbox">
              <input type="checkbox" class="doodle-input" />
              <span class="custom-checkbox"></span>
            </label>
          </div>
          <div class="option-text">
            <span><b>${day}.${month}.${year}</b></span></br>
            <span id="time">${startDateString} - ${endDateString}</span>
          </div>
        </div>`;

        // Add the new item to the list
        $("#checkbox-list").append(listItem);

        // Reset the input fields
        $(".date").val("");
        $(".start, .end").val("00:00");
    }
});

function toggleCheckbox(event) {
    const target = event.target;
    if (target.tagName === 'LABEL') {
        return;
    }

    let checkbox;
    if (target.tagName === 'INPUT') {
        checkbox = target;
    } else {
        checkbox = target.closest('.doodle-container').querySelector('.doodle-input');
    }

    checkbox.checked = !checkbox.checked;
    event.preventDefault();
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
                "password": $("#password").val(),
                "options": options
            }),
            success: ({ data: appointmentId }) => {
                window.location.href = "/appointment-finder/appointment.html#id=" + appointmentId;
            },
            error: (res) => console.log("ERROR:", res.responseText),

        });

    });

});
