$(document).ready(function () {
  // Retrieve the user's email from the session
  var userEmail = '<%= user.email %>'; // Assuming you are passing user object to the template

  // Listen for clicks on the plus button within each course card
  $('.course-card').on('click', '.fa-user-plus', function (event) {
      event.preventDefault();
      
      // Find the closest course-card to get course details
      var courseCard = $(this).closest('.course-card');
      
      // Extract course details
      var courseTitle = courseCard.find('.card-title').text();
      var courseInstructor = courseCard.find('.card-detail').children().first().text();
      var courseCode = courseCard.find('.card-detail').children().last().text();
      var courseImgUrl = courseCard.find('.card-img').attr('src');
      
      // Create a course object
      var course = {
          title: courseTitle,
          instructor: courseInstructor,
          code: courseCode,
          imgUrl: courseImgUrl
      };
      
      // Get the current list of courses for this specific user
      var myCourses = JSON.parse(localStorage.getItem(userEmail + '_myCourses')) || [];
      
      // Check if the course already exists in the user's courses
      var courseExists = myCourses.some(function (c) {
          return c.title === course.title;
      });

      if (!courseExists) {
          // Add new course to the user's list
          myCourses.push(course);
          localStorage.setItem(userEmail + '_myCourses', JSON.stringify(myCourses));
          alert('Course added to My Courses!');
      } else {
          alert('Course already exists in My Courses!');
      }
  });
});
