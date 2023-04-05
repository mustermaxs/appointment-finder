function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}.${month}.${year}`;
}

function formatHours(inputDate) {
  const date = new Date(inputDate);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function getAppointmentIdFromURL() {
  var hashRaw = document.location.hash;
  var hash = hashRaw.split("#")[1];
  var appointmentId = hash.split("id=")[1];

  return appointmentId;
}

function toggleCheckbox(event) {
  const target = event.target;
  if (target.tagName === "LABEL") {
    return;
  }

  let checkbox;
  if (target.tagName === "INPUT") {
    checkbox = target;
  } else {
    checkbox = target
      .closest(".doodle-container")
      .querySelector(".doodle-input");
  }

  checkbox.checked = !checkbox.checked;
  event.preventDefault();
}

function renderAppointment(appointmentId) {
  const spinner = $("#spinner");
  $.ajax({
    type: "GET",
    url: `./api/appointment/${appointmentId}/`,
    dataType: "json",
    beforeSend: () => spinner.show(),
    complete: () => spinner.hide(),
    success: ({ data }) => {
      const container = $("#appointment-form");

      container.append(`<div class="mb-3"><h2>${data.title}</h2></div>`);

      data.options.map((option) => {
        container.append(`
            <div class="doodle-container" onclick="toggleCheckbox(event)">
            <div class="center">
                <label class="doodle-checkbox">
                    <input type="checkbox" class="doodle-input" />
                    <span class="custom-checkbox"></span>
                </label>
            </div>
            <div class="option-text">
                <span><b>${formatDate(option.startDate)}</b></span></br>
                <span id="time">${formatHours(option.startDate)} - ${formatHours(option.endDate)}</span>
            </div>
        </div>`);
      });
    },
  });
}

// TODO comments rendern
function renderComments(appointmentId) {
  //   $.ajax({
  //     type: "GET",
  //     url: `./api/appointment/${appointmentId}/`,
  //     dataType: "json",
  //     beforeSend: () => spinner.show(),
  //     success: ({ data }) => {
  //     },
  //   });
}

var appointmentId = getAppointmentIdFromURL();
renderAppointment(appointmentId);
// renderComments(appointmentId);
