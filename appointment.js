const colors = [
  "#ff69eb",
  "#ff86c8",
  "#ffa3a5",
  "#ffbf81",
  "#ffdc5e",
  "#343a40",
  "#e71d36",
  "#4f5d75",
  "#89023e",
];

var userColorMap = {};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUserColor(userName) {
  if (userName in userColorMap) return userColorMap[userName];

  var randInt = getRandomInt(0, colors.length);
  var color = colors[randInt];
  userColorMap[userName] = color;

  return color;
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
}

function formatHours(inputDate) {
  const date = new Date(inputDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function getAppointmentId() {
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
      const container = $("#options-wrapper");

      container.append(`<div class="mb-3"><h2>${data.title}</h2></div>`);

      data.options.map((option) => {
        var color = getUserColor("sebastian");

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
                <span id="time">${formatHours(
                  option.startDate
                )} - ${formatHours(option.endDate)}</span>
            </div>
            <div class="votes-label-wrapper">
            <div style="background: ${color}" title="Sebastian" class="voter-label">Sebastian</div>
            </div>
        </div>
        `);
      });
    },
  });
}

// TODO comments rendern
function renderComments(appointmentId) {
  const spinner = $("#spinner");

  $.ajax({
    type: "GET",
    url: `./api/comment/${appointmentId}/`,
    dataType: "json",
    beforeSend: () => spinner.show(),
    complete: () => spinner.hide(),
    success: ({ data }) => {
      const container = $("#commentsection");

      data.map((comment) => {
        container.append(`
        <div class="comment">
        <h4 class="userName">${comment.userName}</h4> <span class="writtenOn">${comment.createdOn}</span>
        <p class="content">
            <span>${comment.content}</span>
        </p>
    </div>
        `);
      });
    },
  });
}

function postComment(appointmentId, userId) {
  var content = $("#newComment").val();
  content = content.trim();

  if (content == "") return;

  $.ajax({
    type: "POST",
    url: "./api/comment/",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      content: content,
      appointmentId: appointmentId,
      userId: userId,
    }),

    success: (response) => {
      console.log(response);
      $("#commentsection").innerHtml = "";
      renderComments(appointmentId);
      $("textarea").val("");
      $("#userName").val("");
    },
    onerror: (response) => {
      console.log(response);
    },
  });
}

function postVote(appointmentId, userName, optionId) {
  $.ajax({
    type: "POST",
    url: "./api/vote/",
    contentType: "application/json",
    data: { appointmentId, optionId, userName },
    success: (response) => {
      console.log(response);
    },
    onerror: (response) => {
      console.log(response);
    },
  });
}

function getVoteLablesString(appointmentId) {
  const labelsString = async () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `./api/user/`,
        type: "GET",
        data: { username: userName, action: "getid" },
        contentType: "application/json",
        success: ({ data }) => {
          resolve(data.userId);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  return labelsString();
}

function getUserIdByUserName(userName) {
  const getId = async () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `./api/user/`,
        type: "GET",
        data: { username: userName, action: "getid" },
        contentType: "application/json",
        success: ({ data }) => {
          resolve(data.userId);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  return getId();
}

// TODO
async function handleFormSubmit(ev) {
  ev.preventDefault();
  var userName = $("#userName").val().trim();

  if (userName == "") {
    alert("Please enter a username");
    return;
  }

  try {
    var userId = await getUserIdByUserName(userName);
    var appointmentId = getAppointmentId();

    postComment(appointmentId, userId);
  } catch (error) {
    console.error(error);
  }
}

$(document).ready(function () {
  var appointmentId = getAppointmentId();
  renderAppointment(appointmentId);
  renderComments(appointmentId);

  $("#appointment-form").submit((ev) => {
    handleFormSubmit(ev);
  });
});
