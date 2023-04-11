function IndexPage(params) {
  this.params = params;
  this.pageTitle = "Appointments";
}

IndexPage.prototype.setParams = function (params) {
  this.params = params;
};

IndexPage.prototype.formatDateWithHours = function (inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Get a reference to the spinner element
IndexPage.prototype.init = function () {
  $("#spaMainContainer").load("./public/views/Index/spaIndex.html", () => {
    $("#pageHeadline").text(this.pageTitle);
  });
  const spinner = $("#spinner");
  $.ajax({
    type: "GET",
    url: "./api/appointment/",
    dataType: "json",
    beforeSend: () => spinner.show(),
    success: ({ data }) => {
      const container = $("#cardsContainer");

      const reversedData = data.reverse();

      reversedData.forEach((appointment) => {
        const expirationDate = new Date(appointment.expirationDate);
        const currentDate = new Date();
        let expired = false;

        if (currentDate > expirationDate) {
          expired = true;
        }

        let expiredText = "expires on";
        if (expired) {
          expiredText = "expired on:";
        }

        const cardHtml = `
                <div class="col-md-6">
                  <div class="card mb-3">
                    <div class="card-header p-3 text-black custum-card-header">
                      <h5 class="card-title mb-0">${
                        appointment.title
                      }</h5><span style="display: block" >${this.formatDateWithHours(
          appointment.createdOn
        )}</span>
                    </div>
                    <div class="card-body">
                      <p class="card-text" ${
                        expired ? 'style="color:darkred"' : ""
                      }>${expiredText} ${appointment.expirationDate}</p>
                      <a href="#page=appointment&id=${
                        appointment.appointmentId
                      }" class="btn btn-success">${
          expired ? "details" : "vote"
        }</a>
                    </div>
                  </div>
                </div>
              `;

        container.append(cardHtml);
      });
    },
    error: (res) => alert(JSON.stringify(res)),

    complete: () => spinner.hide(),
  });
};

IndexPage.prototype.reset = () => {};
