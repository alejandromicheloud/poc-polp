var RecoverAccount = function (scope) {
  var token = "";
  var email = "";

  function recover() {
    const name = scope.find("input.name").val();
    const lastname = scope.find("input.lastname").val();
    const password = scope.find("input.password").val();
    const signupData = {
      token: token,
      email: email,
      name: name,
      lastname: lastname,
      password: password,
      role: "teacher",
    };
    info("Recovering account...");
    ajax(
      "recover-password",
      "POST",
      signupData,
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
  function build() {
    scope.find("form").submit(recover);
  }
  build();
  function reset() {
    scope.find(".info").html("");
  }
  function info(text) {
    scope.find(".info").html(text).show();
  }
  this.show = function () {
    console.log("recover-account show");
    reset();
    token = getUrlParameter("token");
    email = getUrlParameter("email");
    scope.find(".email").val(email);
  };
};
