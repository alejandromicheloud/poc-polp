var Profile = function (scope) {
  var userData = null;
  function whoami() {
    info("Loading...");
    ajax(
      "whoami",
      "GET",
      "",
      function (data) {
        console.log("success", data);
        userData = data.data;
        info("");
        $("input.email").val(userData.username);
        $("input.name").val(userData.name);
        $("input.lastname").val(userData.lastname);

        scope
          .find("button.microsoft")
          .html("Link to Microsoft")
          .removeClass("link unlink")
          .addClass("link");
        scope
          .find("button.google")
          .html("Link to Google")
          .removeClass("link unlink")
          .addClass("link");
        userData.oauth_accounts.map((account) => {
          scope
            .find("button." + account.provider)
            .html(
              "Unlink " +
                account.provider +
                " account <strong>" +
                account.email +
                "</strong>"
            )
            .removeClass("link unlink")
            .addClass("unlink")
            .data(account)
            .click(function () {
              if ($(this).hasClass("unlink")) {
                unlinkAccount($(this).data());
              } else {
                if ($(this).hasClass("google")) {
                  $("#bt-google-sso-login").click();
                } else {
                  microsoftSignIn(function (token) {
                    linkAccount(token, "microsoft");
                  });
                }
              }
            });
        });
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function unlinkAccount(account) {
    console.log("unlinkAccount", account);
    account.identity_provider = account.provider;
    info("Loading...");
    ajax(
      "oauth-account",
      "DELETE",
      account,
      function (data) {
        console.log(data);
        scope
          .find("button." + account.provider)
          .html("Link to " + account.provider)
          .removeClass("link unlink")
          .addClass("link");
        info("Unlink successfully!");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function linkAccount(token, provider) {
    console.log("linkAccount", token, provider);
    info("Loading...");
    ajax(
      "oauth-account",
      "POST",
      {
        token: token,
        identity_provider: provider,
      },
      function (data) {
        console.log(data);
        whoami();
        info("Link successfully!");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function saveChanges() {
    const name = $.trim(scope.find("input.name").val());
    const lastname = $.trim(scope.find("input.lastname").val());
    const password1 = $.trim(scope.find("input.password1").val());
    const password2 = $.trim(scope.find("input.password2").val());
    if (name.length < 2) {
      return alert("The Name is too short");
    }
    if (lastname.length < 2) {
      return alert("The Lastname is too short");
    }
    if (password1 !== "" || password2 !== "") {
      if (password1.length < 3) {
        return alert("The password is too short");
      }
      if (password1 !== password2) {
        return alert("Both passwords must be equals");
      }
    }
    var data = {
      name: name,
      lastname: lastname,
    };
    if (password1 !== "") {
      data.password = password1;
    }
    info("Saving...");
    ajax(
      "profile",
      "PATCH",
      data,
      function (data) {
        console.log("success", data);
        info("Saved successfully!");
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }

  function closeSession() {
    jwt = null;
    routie("");
  }
  function build() {
    scope.find(".btCloseSession").click(closeSession);
    scope.find(".btSave").click(saveChanges);
    $("body").bind("GOOGLE_SSO_SUCCESS", function (e, token) {
      if (scope.is(":visible")) {
        linkAccount(token, "google");
      }
    });
  }
  build();
  function reset() {
    scope.find(".info").html();
  }
  function info(text) {
    scope.find(".info").html(text).show();
  }
  this.show = function () {
    console.log("profile show");
    reset();
    whoami();
  };
};
