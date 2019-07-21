const proxyurl = "https://cors-anywhere.herokuapp.com/";
var allTags = new Array();
var allCourses;
fetchAllTags();
fetchAllCourses();

var table = new Tabulator("#table", {
	height:false, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
  layout:"fitColumns", //fit columns to width of table (optional)
  initialSort:[
    {column: "courseCode", dir:"asc"},
  ],
  pagination: "local",
  paginationSize: 10,
  resizableColumns:false,
	columns:[ //Define Table Columns
 	{title:"Course Code", field:"courseCode"},
 	{title:"Course Name", field:"courseName", formatter: "textarea" },
 	{title:"LTPC", field:"ltpc"},
 	{title:"File", field:"filename", formatter: "link", formatterParams: {
    label:"PDF file",
    target: "_blank",
    urlPrefix: "https://ethereal-dawn.glitch.me/static/pdf/",
    urlField: "filename"
  }},
	],
});

$(document).ready(function() {
  $('#tagList').multiselect({
    enableFiltering: true,
    maxHeight: 400,
    nonSelectedText: 'All',
    buttonWidth: 200,
    buttonClass: 'btn btn-outline-dark',
    delimiterText: '\n',
    enableCaseInsensitiveFiltering: true
  });
  $('#searchBtn').click(function() {
    destroyBadges();
    if($('#tagList').val().length === 0) {
      table.setData(allCourses);
    } else {
      table.setData(selectedCourseList($('#tagList').val()));
      createBadges($('#tagList').val());
    }
  });
  $('#resetBtn').click(function() {
    destroyBadges();
    $('#tagList').multiselect('deselectAll', false);
    $('#tagList').multiselect('updateButtonText');
    table.setData(allCourses);
  });
});

function fetchAllTags() {
  fetch(proxyurl+"ethereal-dawn.glitch.me/fetch/allTagObjects").then((response) => {
    response.json().then((jsonObj) => {
      jsonObj.forEach((tagObj) => {
        $('#tagList').append(new Option(tagObj.name.replace(/_/g," "),tagObj.name));
        allTags.push(tagObj);
      });
      $('#tagList').multiselect('rebuild');
    });
  });
}

function fetchAllCourses() {
  fetch(proxyurl+"ethereal-dawn.glitch.me/fetch/allCourseObjects").then((response) => {
    response.json().then((jsonObj) => {
      jsonObj.forEach((course) => {
        delete course.tags;
        delete course.credit;
        delete course.__v;
      });
      allCourses = jsonObj;
      table.setData(allCourses);
    });
  });
}

function selectedCourseList(tagList) {
  var selectedCourses = new Array();
  var tagListObjs = allTags.filter( tag => tagList.indexOf(tag.name) in tagList);
  var a = tagListObjs[0].courseList,b;
  tagListObjs.forEach((tag) => {
    b = tag.courseList;
    let intersection = a.filter(x => b.includes(x));
    a = intersection;
  });
  selectedCourses = a;
  return allCourses.filter( course => selectedCourses.indexOf(course.courseCode) in selectedCourses)
}

function createBadges(tagList) {
  $('#tagBadges').append('<div class="container" id="badgeWrapper"></div>');
  tagList.forEach((tag) => {
    var txt = $('<span class="badge badge-secondary" style></span>').text(tag.replace(/_/g," "));
    $('#badgeWrapper').append(txt);
    $('#badgeWrapper > span').css({"margin-top": "10px", "margin-left": "5px", "margin-right": "5px"});
  });
}

function destroyBadges() {
  $('#badgeWrapper').remove();
}
