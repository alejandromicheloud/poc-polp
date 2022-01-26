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
  function build() {
    scope.find("form").submit(doLogin);
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
