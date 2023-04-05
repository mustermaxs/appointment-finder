function formatDateWithHours(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

$(window).on("load", () => {
  // Get a reference to the spinner element
  const spinner = $("#spinner");

  $.ajax({
    type: "GET",
    url: "./api/appointment/",
    dataType: "json",
    beforeSend: () => spinner.show(),
    success: ({ data }) => {
      const container = $(".row");

      const reversedData = data.reverse();

      reversedData.forEach((appointment) => {
        const cardHtml = `
                <div class="col-md-6">
                  <div class="card mb-3">
                    <div class="card-header p-3 text-black">
                      <h5 class="card-title mb-0">${appointment.title}<span style="float:right; font-size:1rem" >${formatDateWithHours(appointment.createdOn)}</span></h5>
                    </div>
                    <div class="card-body">
                      <p class="card-text">Status: ${appointment.status}</p>
                      <p class="card-text">open till: ${appointment.expirationDate}</p>
                      <a href="appointment.html#id=${appointment.appointmentId}" class="btn btn-success">vote</a>
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
});
