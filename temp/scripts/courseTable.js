const baseURL = "https://cors-anywhere.herokuapp.com/iitmandi.co.in:6996";
var allTags, allCourses;

var table = new Tabulator("#table", {
	height: false, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
	layout: "fitColumns", //fit columns to width of table (optional)
	initialSort: [{
		column: "courseCode",
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
			title: "Course Code",
			field: "courseCode"
		},
		{
			title: "Course Name",
			field: "courseName",
			formatter: "textarea"
		},
		{
			title: "LTPC",
			field: "ltpc"
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

	allTags = await (await fetch(baseURL + "/fetch/allTagObjects")).json();
	allCourses = await (await fetch(baseURL + "/fetch/allCourseObjects")).json();

	// construct multi select box
	tagOptions = allTags.map(tag => {
		option = {
			id: tag.name,
			text: tag.name.replace(/_/g, " ")
		};
		return option;
	});
	$('#tagList').select2({
		placeholder: 'Search by Text or Select Tags',
		width: 'resolve',
		data: tagOptions,
		tags: true,
	});
	tagOptionsText = tagOptions.map(function(value) {
  return value.text;
	});
	// set up the buttons
	$('.searchBtn').click(function () {
		if(!tagOptions.includes($('#tagList').val()[0]))	{
			table.setFilter([
				[{field:"courseName",type:"like",value:$('#tagList').val()[0]},
				{field:"courseCode",type:"like",value:$('#tagList').val()[0]}]
			]);
		}
		else {
			if ($('#tagList').val().length === 0) {
				table.setData(allCourses);
			} else {
				table.setData(selectedCourseList($('#tagList').val()));
			}
		}

	});
	$('.resetBtn').click(function () {
		// clear the select box
		$('#tagList').val(null).trigger('change');
		// populate table
		table.clearFilter();
		table.setData(allCourses);
	});

	// to populate the table initially
	$('.resetBtn').click();
});

function selectedCourseList(tagList) {
	var tagListObjs = allTags.filter(tag => tagList.indexOf(tag.name) !== -1);
	let selectedCourses = tagListObjs[0].courseList;

	tagListObjs.forEach((tag) => {
		const b = tag.courseList;
		selectedCourses = selectedCourses.filter(x => b.includes(x));
	});

	return allCourses.filter(course => selectedCourses.indexOf(course.courseCode) !== -1)
}
