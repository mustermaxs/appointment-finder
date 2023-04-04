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
                <span><b>${option.dateOption}</b></span></br>
                <span id="time">??? fehlt noch</span>
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
