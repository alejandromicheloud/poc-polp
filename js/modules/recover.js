var Recover = function (scope) {
  function sendEmail() {
    const email = scope.find("input[type='text']").val();
    info("Sending recovery email...");
    ajax(
      "recover",
      "POST",
      {
        email: email,
        link:
          "http://localhost/polp/?token=[TOKEN]&email=" +
          email +
          "#recover-account",
      },
      function (data) {
        console.log("success", data);
        info("The recover email was sended. Please, check your email to continue.");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function build() {
    scope.find("form").submit(sendEmail);
  }
  build();
  function reset() {
    scope.find(".info").html("");
  }
  function info(text) {
    scope.find(".info").html(text).show();
  }
  this.show = function () {
    console.log("recover show");
    reset();
  };
};
