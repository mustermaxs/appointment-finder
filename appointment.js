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

function assignLabelColor(userName) {
  if (userName in userColorMap) return userColorMap[userName];

  var randInt = getRandomInt(0, colors.length);
  var color = colors[randInt];
  userColorMap[userName] = color;

  return color;
}

let selectedOptions = [];

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

function toggleCheckbox(event, optionId) {
  event.preventDefault();

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

  // Check if the checkbox is disabled
  if (checkbox.disabled) {
    return;
  }

  checkbox.checked = !checkbox.checked;

  if (checkbox.checked) {
    selectedOptions.push(optionId);
  } else {
    const index = selectedOptions.indexOf(optionId);
    if (index > -1) {
      selectedOptions.splice(index, 1);
    }
  }
}

async function renderAppointment(appointmentId) {
  const spinner = $("#spinner");
  $.ajax({
    type: "GET",
    url: `./api/appointment/${appointmentId}/`,
    dataType: "json",
    beforeSend: () => spinner.show(),
    complete: () => spinner.hide(),
    success: ({ data }) => {
      const container = $("#options-container");

      const expirationDate = new Date(data.expirationDate);
      const currentDate = new Date();
      let expired = false;

      if (currentDate > expirationDate) {
        expired = true;
      }

      $("#title").append(
        `<div class="mb-3"><h2>${data.title}</h2> <span style="color:darkred">${
          expired ? "Voting time is over!" : ""
        }</span></div>`
      );

      data.options.map((option) => {
        var showVotes = false;
        const isExpired = expired ? "expired" : "";
        var voterLabelColor;
        var voterLabels = "";
        if (option.votes.length > 0) {
          showVotes = true;
          option.votes.forEach((vote) => {
            voterLabelColor = assignLabelColor(vote.userName);
            voterLabels += `<div style="background: ${voterLabelColor}" title="${vote.userName}" class="voter-label">${vote.userName}</div>`;
          });
        }

        var optionEl = `
        <div class="doodle-wrapper">
        <div class="info" id="infobox-${option.optionId}">
        <button type="button" class="closeInfobox">x</button>
        <div title="${data.title}" class="infobox-title"><h5>${
          data.title
        }</h5></div>
        <hr>
        <p>
          <span class="detailCategory">Location: </span><span> ${
            data.location
          }</span> <br>
          
        <span class="detailCategory">Created on: </span>${
          data.createdOn
        }</span><br>
        <span class="detailCategory">Description: </span>
        <span>
        ${data.description}</span> <br>
        </p>
        </div>
        <div class="infobutton" id="infobutton-${option.optionId}">i</div>
            <div class="doodle-container ${isExpired}-container" id="${
          option.optionId
        }" onclick="toggleCheckbox(event, ${option.optionId})">
            <div class="center">
                <label class="doodle-checkbox ${isExpired}-checkbox">
                    <input type="checkbox" class="doodle-input" ${
                      expired ? "disabled" : ""
                    } />
                    <span class="custom-checkbox ${isExpired}-checkbox"></span>
                </label>
            </div>
            <div class="option-text">
                <span><b>${formatDate(option.startDate)}</b></span></br>
                <span id="time">${formatHours(
                  option.startDate
                )} - ${formatHours(option.endDate)}</span>
            </div>
</div>            `;
        optionEl += showVotes
          ? `<div class="votes-label-wrapper">
${voterLabels}
</div>`
          : "";
        optionEl += `</div>`;

        container.append(optionEl);
        $("#infobutton-" + option.optionId).click((ev) => {
          $("#infobox-" + option.optionId).fadeIn(50);
          $("#infobox-" + option.optionId).mouseenter((ev) => {
            ev.target.style.display = "block";
            console.log("on info box");
          });
        });

        // $(document).click((ev) => {
        //   if (ev.target.class != ".info") {
        //     $(".info").fadeOut(50);
        //   }
        // });

        $(".closeInfobox").click(() => {
          $("#infobox-" + option.optionId).fadeOut(50);
        });
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

      const reversedData = data.reverse();

      reversedData.map((comment) => {
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
      $("#commentsection").empty();
      renderComments(appointmentId);
      $("textarea").val("");
      $("#userName").val("");
    },
    onerror: (response) => {
      console.log(response);
    },
  });
}

function postVote(appointmentId, userId, optionId) {
  $.ajax({
    type: "POST",
    url: "./api/vote/",
    contentType: "application/json",
    data: JSON.stringify({ appointmentId, userId, optionId }),
    success: (response) => {
      console.log(response);
    },
    onerror: (response) => {
      console.log(response);
    },
  });
}

function getVoteLabelsString(appointmentId) {
  var labelsString = $.ajax({
    url: `./api/vote/${appointmentId}/`,
    type: "GET",
    async: false,
    success: ({ data }) => {
      var tempString = "";
      var color = assignLabelColor(vote.userName);
      data.map((vote) => {
        tempString += `<div style="background: ${color}" title="${vote.userName}" class="voter-label">${vote.userName}</div>`;
      });
    },
    error: (error) => {},
  });

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

  try {
    var userId = await getUserIdByUserName(userName);
    var appointmentId = getAppointmentId();

    selectedOptions.forEach((optionId) => {
      postVote(appointmentId, userId, optionId);
    });
  } catch (error) {
    console.error(error);
  }
}

$(document).ready(function () {
  var appointmentId = getAppointmentId();
  renderAppointment(appointmentId);
  renderComments(appointmentId);

  $("#appointment-form").submit((ev) => handleFormSubmit(ev));
});
