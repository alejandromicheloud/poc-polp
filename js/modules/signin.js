var Signin = function (scope) {
  function doLogin() {
    const email = scope.find("input[type='text']").val();
    const password = scope.find("input[type='password']").val();
    info("Loading...");
    ajax(
      "login",
      "POST",
      {
        username: email,
        password: password,
      },
      function (data) {
        console.log("success", data);
        jwt = data.data.token;
        info("ok");
        routie("home");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function doLoginOauth(token, provider) {
    ajax(
      "login-oauth",
      "POST",
      {
        token: token,
        identity_provider: provider,
      },
      function (data) {
        console.log("success", data);
        jwt = data.data.token;
        info("ok");
        routie("home");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function doLoginMicrosoft() {
    microsoftSignIn(function (token) {
      doLoginOauth(token, "microsoft");
    });
    return false;
  }
  function build() {
    scope.find("button[type='submit']").click(doLogin);
    scope.find("button.microsoft").click(doLoginMicrosoft);
    $("body").bind("GOOGLE_SSO_SUCCESS", function (e, token) {
      if (scope.is(":visible")) {
        doLoginOauth(token, "google");
      }
    });
  }
  build();
  function reset() {
    scope.find(".info").html("");
  }
  function info(text) {
    scope.find(".info").html(text).show();
  }
  this.show = function () {
    console.log("signin show");
    reset();
  };
};
