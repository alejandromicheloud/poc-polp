var Signup = function (scope) {
  var token = "";
  var email = "";
  var isSsoSignUp = false;
  var identity_provider = "oracle";
  var userData = {};

  function signup() {
    const name = scope.find("input.name").val();
    const email = scope.find("input.email").val();
    const lastname = scope.find("input.lastname").val();
    const password = scope.find("input.password").val();
    const schoolId = scope.find("select.school").val();
    const grades = [];
    const subjects = [];
    scope.find(".roster-grade:checked").each(function () {
      grades.push($(this).val());
    });
    scope.find(".roster-subject:checked").each(function () {
      subjects.push($(this).val());
    });
    const signupData = {
      token: token,
      identity_provider: identity_provider,
      email: email,
      name: name,
      lastname: lastname,
      password: password,
      role: "teacher",
      school_id: schoolId,
      grades: grades,
      subjects: subjects,
    };
    info("Creating account...");
    ajax(
      "signup",
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
    scope.find("form").submit(signup);
    scope.find(".school.search").on("keyup", function () {
      getOrganization($.trim($(this).val()));
    });
  }
  function getOrganization(search) {
    if (search == "" || search.length < 2) return;
    ajax(
      "roster/schools?search=" + search,
      "GET",
      {},
      function (resposeData) {
        console.log("success", resposeData);
        scope.find("select.school").html("");
        resposeData.data.organizations.map((school) => {
          scope
            .find("select.school")
            .append(`<option value="${school.id}">${school.name}</option>`);
        });
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function getGrades() {
    ajax(
      "roster/grades",
      "GET",
      {},
      function (resposeData) {
        console.log("success", resposeData);
        scope
          .find("td.grades")
          .html("<ul style='height: 200px; overflow: auto' />");
        renderGrades(resposeData.data.grades, scope.find("td.grades ul"));
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  function renderGrades(grades, sco) {
    for (var i = 0; i < grades.length; i++) {
      var grade = grades[i];
      sco.append(
        `<ul><li id="grade${grade.id}"><input type="checkbox" value="${grade.id}" class="roster-grade"/>${grade.name}</li></ul>`
      );
      if (grade.hasOwnProperty("grades") && grade.grades.length) {
        renderGrades(grade.grades, sco.find("#grade" + grade.id));
      }
    }
  }
  function getSubjects() {
    ajax(
      "roster/subjects",
      "GET",
      {},
      function (resposeData) {
        console.log("success", resposeData);
        scope
          .find("td.subjects")
          .html("<ul style='height: 200px; overflow: auto' />");
        resposeData.data.subjects.map((subject) => {
          scope
            .find("td.subjects ul")
            .append(
              `<li><input type="checkbox" value="${subject.id}" class="roster-subject" />${subject.name}</li>`
            );
        });
      },
      function (err) {
        console.log("error", err);
        info(JSON.stringify(err));
      }
    );
  }
  build();
  function reset() {
    scope.find(".info").html("");
  }
  function info(text) {
    scope.find(".info").html(text).show();
  }
  this.show = function () {
    isSsoSignUp = false;
    identity_provider = "oracle";
    console.log("signin show");
    scope.find("fieldset.password").show();
    reset();
    token = getUrlParameter("token");
    email = getUrlParameter("email");
    scope.find(".email").val(email);
    getGrades();
    getSubjects();
  };
  this.startSsoSignup = function (_token, provider, _userData) {
    isSsoSignUp = true;
    token = _token;
    console.log("token: " + token);
    identity_provider = provider;
    userData = _userData;
    scope.find("fieldset.password").hide();
    scope.find("input.email").val(userData.email);
    scope.find("input.name").val(userData.name);
    scope.find("input.lastname").val(userData.lastname);
  };
};
