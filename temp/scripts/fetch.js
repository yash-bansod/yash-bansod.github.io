const proxyurl = "https://cors-anywhere.herokuapp.com/";
var table = document.querySelector('tbody');
var courseList = new Array();
var allTags = new Array();

fetchAllTags();

function fetchAllTags() {
  fetch(proxyurl+"ethereal-dawn.glitch.me/fetch/allTagObjects").then((response) => {
    response.json().then((jsonObj) => {
      jsonObj.forEach((tagObj) => {
        $('#tagList').append(new Option(tagObj.name.replace(/_/g," "),tagObj.name));
        allTags.push(tagObj.name);
        $('#tagList').multiselect('rebuild');
      });
    });
  });
}

function getCourseList(tagList) {
  tagList.forEach((tag) => {
    var tagUrl = "ethereal-dawn.glitch.me/fetch/tag/" + tag;

    fetch(proxyurl+tagUrl).then((response) => {
      response.json().then((jsonObj) => {
        jsonObj.courseList.forEach((course) => {
          if(courseList.indexOf(course) === -1) {
            courseList.push(course);
            getCourse(course);
          }
        });
      });
    });
  });
}

function getCourse(course) {
    var courseUrl = "ethereal-dawn.glitch.me/fetch/course/" + course;

    fetch(proxyurl+courseUrl).then((response) => {
      response.json().then((jsonObj) => {
        displayTable(jsonObj);
      });
    });
}

function displayTable(courseObj) {
  var row = table.insertRow(-1);
  var code = row.insertCell(0);
  var name = row.insertCell(1);
  var ltpc = row.insertCell(2);
  var file = row.insertCell(3);

  code.innerHTML = courseObj.courseCode;
  name.innerHTML = courseObj.courseName;
  ltpc.innerHTML = courseObj.ltpc;
  file.innerHTML = courseObj.filename;
}




$(document).ready(function() {
  $('#tagList').multiselect({
    nonSelectedText: 'All',
    buttonWidth: 200
  });
  var interval = setInterval(function(){
    if($('#tagList').val().length===0) {
      getCourseList(allTags);
      if($('tbody > tr').length === courseList.length && courseList.length !==0) {
        clearInterval(interval);
      }
    } else {
      clearInterval(interval);
    }
  },1000);


  $('#searchBtn').click(function() {
    $('tbody').empty();
    if($('#tagList').val().length===0) {
      getCourseList(allTags);
    }
    courseList = new Array();
    getCourseList($('#tagList').val());
  });

});
