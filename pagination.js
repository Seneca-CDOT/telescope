// Pagination Logic

// Counts nymber of blog posts
const numberOfItems = $('#page .blogPost').length;

// Max number of blog posts per page
const limitPerPage = 3;

$(`#page .blogPost:gt(${limitPerPage - 1})`).hide(); // Hide all items over page limits (e.g., 5th item, 6th item, etc.)

// total number of pages based on per page limit and posts counted.
const totalPages = Math.ceil(numberOfItems / limitPerPage);

// alert(totalPages);
// alert(numberOfItems);

// Adds First Page Marker
$('.pagination').append(`<li class='page-item active'><a class='page-link' href='#')'>${1}</a></li>`);

// Adds additional pages dynamically based on # of blog posts
for (let i = 2; i <= totalPages; i++) {
  // Insert page number into pagination tabs
  $('.pagination').append(`<li class='page-item'><a class='page-link' href='#'>${i}</a></li>`);
}

// Add next button after all the page numbers
$('.pagination').append("<li id='next-page' hidden='true'>"
 + "<a class='page-link' href='#' aria-label='Next'><span aria-hidden='true'>"
 + "&laquo;</span><span class='sr-only'>Next</span></a></li>");

// Function that displays new items based on page number that was clicked
$('.pagination li.page-item').on('click', function () {
  // Check if page number that was clicked on is the current page that is being displayed
  if ($(this).hasClass('active')) {
    return false; // Exit function if invalid
  }
  const currentPage = $(this).index(); // Get the current page number
  $('.pagination li').removeClass('active'); // Remove the 'active' class status from the page that is currently being displayed
  $(this).addClass('active'); // Add the 'active' class status to the page that was clicked on
  $('#page .blogPost').hide(); // Hide all items in loop, this case, all the list groups
  // Get the total number of items up to the page number that was clicked on
  const grandTotal = limitPerPage * currentPage;

  // Loop through total items, selecting a new set of items based on page number
  for (let i = grandTotal - limitPerPage; i < grandTotal; i++) {
    $(`#page .blogPost:eq(${i})`).show(); // Show items from the new page that was selected
  }
  return true;
});

// Navigate to the previous page when users click on the next-page id
$('#next-page').on('click', () => {
  let currentPage = $('.pagination li.active').index(); // Identify the current active page
  // Check to make sure that users is not on lastr page and attempting to navigating to a next page
  if (currentPage === totalPages) {
    return false;
  }
  currentPage++; // Increment page by one
  $('.pagination li').removeClass('active'); // Remove the 'activate' status class from the previous active page number
  $('#page .blogPost').hide(); // Hide all items in the pagination loop
  // Get the total number of items up to the page that was selected
  const grandTotal = limitPerPage * currentPage;

  // Loop through total items, selecting a new set of items based on page number
  for (let i = grandTotal - limitPerPage; i < grandTotal; i++) {
    $(`#page .blogPost:eq(${i})`).show(); // Show items from the new page that was selected
  }

  $(`.pagination li.page-item:eq(${currentPage + 1})`).addClass('active'); // Make new page number the 'active' page
  return true;
});


// Navigate to the previous page when users click on the previous-page id
$('#previous-page').on('click', () => {
  let currentPage = $('.pagination li.active').index(); // Identify the current active page
  // Check to make sure that users is not on page 1 and attempting to navigating to a previous page
  if (currentPage === 1) {
    return false; // Exit function if invalid
  }
  currentPage--; // Decrement page by one
  $('.pagination li').removeClass('active'); // Remove the 'activate' status class from the previous active page number
  $('#page .blogPost').hide(); // Hide all items in the pagination loop
  // Get the total number of items up to the page that was selected
  const grandTotal = limitPerPage * currentPage;

  // Loop through total items, selecting a new set of items based on page number
  for (let i = grandTotal - limitPerPage; i < grandTotal; i++) {
    $(`#page .blogPost:eq(${i})`).show(); // Show items from the new page that was selected
  }

  $(`.pagination li.page-item:eq(${currentPage - 1})`).addClass('active'); // Make new page number the 'active' page
  return true;
});
