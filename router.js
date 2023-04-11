function SPArouter(spaContainer) {
  var _spaContainer = null || spaContainer;
  const pages = {};
  this.pageHandler = null; // next pageHandler in queue
  const patterns = [];
  this.params = {};
  var startingParams = null;
  var currentPageHandler = null;

  this.addRegexRoute = (param, callback) => {
    let pattern = `${param}`;
    patterns.push({ pattern: pattern, cb: callback });
  };

  this.setStartingParams = (params) => {
    startingParams = params;
  };

  this.addRoute = (param, callback) => {
    const patternPath = /:([a-z]+)/g;
    const patternWithNamedGroups = "($1)=([a-z0-9]+)&";
    var pattern = param.replace(patternPath, patternWithNamedGroups);
    pattern = pattern.substring(0, pattern.length - 1); // remove trailing '&' character
    pattern = "(" + pattern + ")$"; // allow only exact match
    patterns.push({ pattern, cb: callback });
  };

  this.matchPattern = (hashValue) => {
    for (var index = 0; index < patterns.length; index++) {
      let pattern = patterns[index].pattern;
      let res = hashValue.match(pattern);

      if (res != null) {
        // first element in array is complete requested path
        // extract key value pairs (eg. page=index), in alternating order elements are "key", "value"
        for (var i = 2; i < res.length - 1; i++) {
          if (i % 2 == 0) this.params[res[i]] = res[++i];
        }
        return index;
      }
    }
    throw new Error("Page not registered");
  };

  this.addPage = (pageName, initiliazer) => {
    pages[pageName] = initiliazer;
  };

  this.getParams = () => {
    return this.params;
  };

  this.setStartingPage = (pageName) => {
    startingPage = `#page=${pageName}`;
  };

  this.getPatterns = () => {
    return patterns;
  };

  this.renderPage = () => {
    if (currentPageHandler != null) {
      currentPageHandler.reset();
    }
    this.pageHandler.init();
    currentPageHandler = this.pageHandler;
  };

  this.start = () => {
    if (_spaContainer == null) {
      throw new Error("No HTML container element has been registered yet!");
    }

    window.addEventListener("hashchange", () => {
      let hashValue = location.hash.replace("#", "");
      var patternIndex = this.matchPattern(hashValue);
      pageKey = this.params.page;
      this.pageHandler = new pages[pageKey](this.params);
      patterns[patternIndex].cb();
    });

    window.addEventListener("load", (ev) => {
      ev.preventDefault();

      if (startingParams == null) {
        location.hash = "#page=index"; // load page on index

        return;
      }
      location.hash = startingParams;
    });
  };
}

const spinner = $("#spinner");

var router = new SPArouter($("#spaMainContainer"));

router.addPage("index", IndexPage);
router.addPage("new", NewAppointmentPage);
router.addPage("appointment", AppointmentPage);
router.setStartingParams("#page=index");
router.setStartingPage("index");

router.addRoute(":page", () => {
  console.log("requested route: ", router.params.page);
  let params = router.params;
  console.log("PAGEHANDLER: ", router.pageHandler);
  router.renderPage();
});

router.addRoute(":page:id", () => {
  router.renderPage();
});

router.start();
