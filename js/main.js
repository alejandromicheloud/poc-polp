var API_POLP = "http://localhost:3040/";
var mRecover,
  mRecoverAccount,
  mSignin,
  mHome,
  mProfile,
  mSignup,
  mSignupStart = null;
var jwt = null;

function showModule(id) {
  $("body > section").hide();
  $("body > section#" + id).show();
}

function ajax(_path, _type, _data, _success, _error) {
  var headers = {
    "Content-Type": "application/json",
  };
  if (jwt) {
    headers["Authorization"] = jwt;
  }
  $.ajax({
    type: _type ? _type : "GET",
    headers: headers,
    url: API_POLP + _path,
    data: JSON.stringify(_data),
    dataType: "json",
    cache: false,
    success: _success,
    error: _error,
  });
}

$(document).ready(function () {
  console.log("document ready");
  showModule("main");
  mRecover = new Recover($("section#recover"));
  mRecoverAccount = new RecoverAccount($("section#recover-account"));
  mSignupStart = new SignupStart($("section#signup-start"));
  mSignup = new Signup($("section#signup"));
  mSignin = new Signin($("section#signin"));
  mHome = new Home($("section#home"));
  mProfile = new Profile($("section#profile"));

  routie({
    signin: function () {
      showModule("signin");
      mSignin.show();
    },
    recover: function () {
      showModule("recover");
      mSignin.show();
    },
    "recover-account": function () {
      showModule("recover-account");
      mRecoverAccount.show();
    },
    "signup-start": function () {
      showModule("signup-start");
      mSignupStart.show();
    },
    signup: function () {
      showModule("signup");
      mSignup.show();
    },
    home: function () {
      showModule("home");
      mHome.show();
    },
    profile: function () {
      showModule("profile");
      mProfile.show();
    },
    main: function () {
      showModule("main");
    },
    "": function () {
      showModule("main");
    },
  });
});

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};
