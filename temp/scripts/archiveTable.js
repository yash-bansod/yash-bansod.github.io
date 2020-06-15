const baseURL = "https://boiling-forest-83645.herokuapp.com/iitmandi.co.in:6996";
var allTags, allCourses;

var table = new Tabulator("#table", {
	height: false, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
	layout: "fitColumns", //fit columns to width of table (optional)
	initialSort: [{
		column: "title",
		dir: "asc"
	}, ],
	pagination: "local",
	paginationSize: 50,
	resizableColumns: false,
	columns: [ //Define Table Columns
		{
			title: "Sr. No.",
			formatter:"rownum", align:"center", width:40
		},
		{
			title: "Item",
			field: "title",
			formatter: "textarea"
		},
		{
			title: "File",
			field: "filename",
			formatter: function(cell, formatterParams, onRendered){
				const filename  = cell.getValue();

				// if file not present
				if(filename === '#') return "No file present"
				else return `<a href="${"http://iitmandi.co.in:6996/static/pdf/"+filename}" target="_blank" >PDF File</a>`;
			}
		},
	],
});

$(document).ready(async function () {
	//initailize it, so that the page isn't deformed while course data is fetched
	$('#tagList').select2({
		placeholder: 'Select Tags'
	});

	allTags = ["calendar","courselist", "timetable", "fee", "other"]
	allCourses = await (await fetch(baseURL + "/fetch/allArchives")).json();

	// construct multi select box
	tagOptions = allTags.map(tag => {
		option = {
			id: tag,
			text: tag
		};
		return option;
	});
	$('#tagList').select2({
		placeholder: 'Select Tags',
		width: 'resolve',
		data: tagOptions
	});

	// set up the buttons
	$('.searchBtn').click(function () {
		if ($('#tagList').val().length === 0) {
			table.setData(allCourses);
		} else {
			table.setData(selectedCourseList($('#tagList').val()));
		}
	});
	$('.resetBtn').click(function () {
		// clear the select box
		$('#tagList').val(null).trigger('change');
		// populate table
		table.setData(allCourses);
	});

	// to populate the table initially
	$('.resetBtn').click();
});

function selectedCourseList(tagList) {
	let selectedCourses = [];
  allCourses.forEach((course)=>{
    if(course.category.indexOf(tagList) >=0){
      selectedCourses.push(course);
    }
  });

	return selectedCourses;
}
