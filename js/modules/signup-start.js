var SignupStart = function (scope) {
  function doLogin() {
    const email = scope.find("input[type='text']").val();
    info("Loading...");
    ajax(
      "login-status?username=" + email,
      "GET",
      "",
      function (data) {
        console.log("success", data);
        routie("signin");
      },
      function (err) {
        if (err.status && err.status === 404) {
          sendEmail();
        } else {
          console.log("error", err);
          info(JSON.stringify(err));
        }
      }
    );
  }
  function sendEmail() {
    const email = scope.find("input[type='text']").val();
    info("Sending email of verification...");
    ajax(
      "signup-start",
      "POST",
      {
        email: email,
        link: "http://localhost/polp/?token=[TOKEN]&email=" + email + "#signup",
      },
      function (data) {
        console.log("success", data);
        info("Email of verify sended. Please, check your email to continue.");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function onGetToken(token, provider, userData) {
    routie("signup");
    setTimeout(function () {
      mSignup.startSsoSignup(token, provider, userData);
    }, 500);
  }
  function build() {
    scope.find("form").submit(doLogin);
    $("body").bind("GOOGLE_SSO_SUCCESS", function (e, token, userData) {
      if (scope.is(":visible")) {
        onGetToken(token, "google", userData);
      }
    });
    scope.find("button.microsoft").click(function () {
      microsoftSignIn(function (token, userData) {
        onGetToken(token, "microsoft", userData);
      });
    });
    scope.find("button.google").click(function () {
      $("#bt-google-sso-login").click();
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
