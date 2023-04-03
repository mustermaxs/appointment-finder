// Event handler for adding a date to the list
$("#add-date").on("click", function () {
    // Get the selected date and format it
    const date = $("#datepicker").datepicker('getDate');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    // Get the selected start and end times and format them
    const start = $('.start').timepicker('getTime').getHours().toString().padStart(2, '0') + ":00";
    const end = $('.end').timepicker('getTime').getHours().toString().padStart(2, '0') + ":00";

    // If all inputs are valid, add a new date to the list
    if (date && start && end) {
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
            <span id="time">${start} - ${end}</span>
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
});
