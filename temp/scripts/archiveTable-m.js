const baseURL = "https://boiling-forest-83645.herokuapp.com/iitmandi.co.in:6996";
var allTags, allCourses;


$(document).ready(async function () {

  allTags = ["calendar","courselist", "timetable", "fee", "other"]
  allCourses = await (await fetch(baseURL + "/fetch/allArchives")).json();

    $('.dynamicTableContainer').each(function (index, element) {

        // get curretn dynamic table container
        const currentPP = $(this)

        // parse default options
        let defaultOptions = currentPP.find('div.selectBoxContainer').attr('defaultOptions')
        defaultOptions = defaultOptions ? JSON.parse(defaultOptions) : []; // if default options not provided
        defaultOptions = allTags.filter(tag => defaultOptions.indexOf(tag) !== -1).map(tagObj => tagObj) // filter out invalid default options


        const resetButton = currentPP.find('button.resetButton')
        const searchButton = currentPP.find('button.searchButton')

        // find the table and add a random class name to it
        const dynamicTable = currentPP.find('div.dynamicTable')
        const randomClass = 'table-' + Math.random().toString(16).slice(2);
        dynamicTable.addClass(randomClass)
        console.log(dynamicTable.attr('class'))
        const selectBox = currentPP.find('select.selectBox')

        const table = new Tabulator('.' + randomClass, {
            height: false, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
            layout: "fitColumns", //fit columns to width of table (optional)
            responsiveLayout:"hide",
            initialSort: [{
                column: "title",
                dir: "desc"
            }, ],
            pagination: "local",
            paginationSize: 10,
            resizableColumns: false,
            columns: [ //Define Table Columns
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

        // construct multi select box
        tagOptions = allTags.map(tag => {
            option = {
                id: tag,
                text: tag
            };
            return option;
        });
        selectBox.select2({
            placeholder: 'Select Tags',
            width: 'resolve',
            data: tagOptions
        });

        // set up the buttons
        searchButton.click(function () {
            if (selectBox.val().length === 0 && defaultOptions.length === 0) {
                table.setData(allCourses);
            } else {
                table.setData(selectedCourseList(selectBox.val().concat(defaultOptions)));
            }
        });
        resetButton.click(function () {
            // clear the select box
            selectBox.val(defaultOptions).trigger('change');
            // populate table
            table.setData(selectedCourseList(defaultOptions));
        });

        // to populate the table initially
        resetButton.click();
    })
    $(window).css("overflow","hidden");
    $('.preloader').fadeOut('slow', function(){
         $(window).css("overflow","auto");
    });
})

function selectedCourseList(tagList) {
	let selectedCourses = [];
  allCourses.forEach((course)=>{
    if(course.category.indexOf(tagList) >=0){
      selectedCourses.push(course);
    }
  });

	return selectedCourses;
}
