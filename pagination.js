// Pagination Logic

// Counts nymber of blog posts
var numberOfItems = $('#page .blogPost').length;

// Max number of blog posts per page
var limitPerPage = 3;

$('#page .blogPost:gt(' + (limitPerPage - 1) + ')').hide(); // Hide all items over page limits (e.g., 5th item, 6th item, etc.)

// total number of pages based on per page limit and posts counted.
var totalPages = Math.ceil(numberOfItems / limitPerPage)

// alert(totalPages);
// alert(numberOfItems);

//Adds First Page Marker
$(".pagination").append("<li class='page-item active'><a class='page-link' href='#')'>" + 1 + "</a></li>"); // Add first page marker

//Adds additional pages dynamically based on # of blog posts
for (var i = 2; i <= totalPages; i++) {
    $(".pagination").append("<li class='page-item'><a class='page-link' href='#'>" + i + "</a></li>"); // Insert page number into pagination tabs
}

// Add next button after all the page numbers  
$(".pagination").append("<li id='next-page' hidden='true'> <a class='page-link' href='#' aria-label='Next'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Next</span></a></li>");

// Function that displays new items based on page number that was clicked
$(".pagination li.page-item").on("click", function () {
    // Check if page number that was clicked on is the current page that is being displayed
    if ($(this).hasClass('active')) {
        return false; // Return false (i.e., nothing to do, since user clicked on the page number that is already being displayed)
    } else {
        var currentPage = $(this).index(); // Get the current page number
        $(".pagination li").removeClass('active'); // Remove the 'active' class status from the page that is currently being displayed
        $(this).addClass('active'); // Add the 'active' class status to the page that was clicked on
        $("#page .blogPost").hide(); // Hide all items in loop, this case, all the list groups
        let grandTotal = limitPerPage * currentPage; // Get the total number of items up to the page number that was clicked on

        // Loop through total items, selecting a new set of items based on page number
        for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
            $("#page .blogPost:eq(" + i + ")").show(); // Show items from the new page that was selected
        }
    }

});

// Function to navigate to the previous page when users click on the previous-page id (previous page button)
$("#next-page").on("click", function () {
    var currentPage = $(".pagination li.active").index(); // Identify the current active page
    // Check to make sure that users is not on lastr page and attempting to navigating to a next page
    if (currentPage == totalPages) {
        return false;
    } else {
        currentPage++; // Increment page by one
        $(".pagination li").removeClass('active'); // Remove the 'activate' status class from the previous active page number
        $("#page .blogPost").hide(); // Hide all items in the pagination loop
        let grandTotal = limitPerPage * currentPage; // Get the total number of items up to the page that was selected

        // Loop through total items, selecting a new set of items based on page number
        for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
            $("#page .blogPost:eq(" + i + ")").show(); // Show items from the new page that was selected
        }

        $(".pagination li.page-item:eq(" + (currentPage + 1) + ")").addClass('active'); // Make new page number the 'active' page
    }
});


// Function to navigate to the previous page when users click on the previous-page id (previous page button)
$("#previous-page").on("click", function () {
    var currentPage = $(".pagination li.active").index(); // Identify the current active page
    // Check to make sure that users is not on page 1 and attempting to navigating to a previous page
    if (currentPage === 1) {
        return false; // Return false (i.e., cannot navigate to a previous page because the current page is page 1)
    } else {
        currentPage--; // Decrement page by one
        $(".pagination li").removeClass('active'); // Remove the 'activate' status class from the previous active page number
        $("#page .blogPost").hide(); // Hide all items in the pagination loop
        let grandTotal = limitPerPage * currentPage; // Get the total number of items up to the page that was selected

        // Loop through total items, selecting a new set of items based on page number
        for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
            $("#page .blogPost:eq(" + i + ")").show(); // Show items from the new page that was selected
        }

        $(".pagination li.page-item:eq(" + (currentPage - 1) + ")").addClass('active'); // Make new page number the 'active' page
    }
});