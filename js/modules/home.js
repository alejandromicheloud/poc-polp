var Home = function (scope) {
  function getApps() {
    info("Loading...");
    ajax(
      "apps",
      "GET",
      "",
      function (data) {
        console.log("success", data);
        info("");
        const apps = data.data.apps;
        scope.find(".appsContainer").html("");
        apps.map((app) => {
          scope.find(".appsContainer").append(getHtmlApp(app.domain));
        });
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function getHtmlApp(name) {
    return `
    <fieldset>
      <legend>${name}</legend>
      <button>Entrar</button>
    </fieldset>
    `;
  }
  function closeSession() {
    jwt = null;
    routie("");
  }
  function build() {
    scope.find(".btCloseSession").click(closeSession);
  }
  build();
  function reset() {
    scope.find(".info").html();
  }
  function info(text) {
    scope.find(".info").html(text).show();
  }
  this.show = function () {
    console.log("signin show");
    reset();
    getApps();
  };
};
