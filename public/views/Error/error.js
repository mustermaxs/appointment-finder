function ErrorPage(params) {
  this.params = params;
}

ErrorPage.prototype.setParams = function (params) {
  this.params = params;
};

ErrorPage.prototype.init = function () {
  $("#errormsg").text(this.errorMsg);
};

ErrorPage.prototype.reset = function () {};
