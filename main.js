// if (location.hash == "") $("body").load("index.html");
// location.hash = "#id=42";
renderPage("index");
$(document).ready(() => {
  $(".nav-link").on("click", (ev) => {
    var page = ev.target.dataset.age;
    renderPage(page);
    // $("#indexJS").remove();
    console.log(page);
    // registerLinks();

    // $("body").load(page);
    // initPage();
  });
});

function registerLinks() {
  $("[data-page='appointment']").on("click", (ev) => {
    var page = ev.target.dataset.page;
    location.hash = ev.target.id;
    renderPage(page);
    // $("#indexJS").remove();
    console.log(page);

    // $("body").load(page);
    // initPage();
  });
}

async function renderPage(pageName) {
  $(".container").hide();
  $(`#${pageName}Container`).show();

  switch (pageName) {
    case "index":
      await initIndexPage();
      registerLinks();
      break;
    case "new":
      initNewAppointmentPage();
      break;
    case "appointment":
      await initAppointmentPage();
      break;
  }
}
