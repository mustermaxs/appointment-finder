function SPArouter() {
  const patterns = [];
  this.params = {};
  const KEY_INDEX = 1;
  const VALUE_INDEX = 2;

  this.addRegexRoute = (param, callback) => {
    let pattern = `${param}`;
    patterns.push({ pattern: pattern, cb: callback });
  };

  this.addRoute = (param, patternFixed = false, callback) => {
    if (patternFixed) {
      this.addRegexRoute(param, callback);
      return;
    }
    let pattern;
    const paramPattern = /:([a-z]+)/g;
    const replacement = "($1)=([a-z0-9]+)&";
    var b = param.replace(paramPattern, replacement);
    b = b.substring(0, b.length - 1);
    b = "(" + b + ")$";
    let params = b;
    patterns.push({ pattern: params, cb: callback });
  };

  this.matchPattern = (hashValue) => {
    this.params = {};
    for (var index = 0; index < patterns.length; index++) {
      let pattern = patterns[index].pattern;
      let res = hashValue.match(pattern);
      if (res != null) {
        for (var i = 2; i < res.length - 1; i++) {
          if (i % 2 == 0) this.params[res[i]] = res[++i];
        }
        patterns[index].cb();
      }
    }
  };

  this.getParams = () => {
    return this.params;
  };

  this.getPatterns = () => {
    return patterns;
  };

  this.start = () => {
    window.addEventListener("hashchange", () => {
      let hashValue = location.hash.replace("#", "");
      this.matchPattern(hashValue);
    });
  };
  return this;
}

var router = SPArouter();

router.addRoute(":page", () => {
  console.log("requested route: ", router.params.page);
});
