# Project-1
College Info


## Live Link (If relevant)
 - https://blakeredwolf.github.io/Project-1/

## Description on how to use the app

College Info app helps you to find right college for you. Click the start button, then fill
the form to get information about specific college or type the city name to display the all the colleges
in the city that you typed. Results shows you college location, website, tutition, Students that gradute in 6 years
and Rentention Rate so you can compare the info for your desicion.


## Project Requirements

- Must uses at least two APIs
- Must use AJAX to pull data
- Must utilize at least one new library or technology that we haven’t discussed
- Must have a polished frontend / UI 
- Must meet good quality coding standards (indentation, scoping, naming)
- Must NOT use alerts, confirms, or prompts (look into modals!)
- Must have some sort of repeating element (table, columns, etc)
- Must use Bootstrap or Alternative CSS Framework
- Must be Deployed (Heroku or Firebase)
- Must have User Input Validation 
- Utilize Firebase for Persistent Data Storage (Consider this basically a requirement).
- Mobile Responsive

## Technologies Used

- Bootstrap and Css for design and mobile responsiveness
- Jquery for Dom Manipulation
- AJAX for API GET requests
- Gulp.js for
- Firebase for database


## Code Explanation


### AJAX Request to CollegeScoreCard
We created a function that allowed me to make an AJAX request to the CollegeScoreCard API and then allowed me to pass through a callback function in order to further process the JSON object that was returned. 

```
var queryURL = 'https://api.data.gov/ed/collegescorecard/v1/schools?api_key=D7r68I5ZV97qXjLtrdTqnxqPTb750zgQrIaRm21s'; 
		var queryFields = '&fields=2014.student.retention_rate.four_year.full_time,2014.cost.attendance.academic_year,school.name,2014.completion.completion_rate_4yr_150nt,school.city,school.zip,school.state,school.school_url';
		queryURL += queryFields;
		var search = {};
		
		var name = $('#name').val();
		if(name.trim() != "") {
			queryURL += '&school.name=' + name;
			search['name'] = name;
		}

		var city = $('#city').val();
		if(city.trim() != ""){
			queryURL += '&school.city=' + city;
			search['city'] = city;
		}

		 $.ajax({
          url: queryURL,
          method: "GET"
        })// After data comes back from the request
        .done(function(response) {
        	app.renderSearchResult(response.results);
        })

	We also used the firebase database to restore our data.

	var app = {

   searches: {},

   dbconfig: {
    apiKey: "AIzaSyCA4hOk8RMSQ2VFfhSU_yEbax-arF8-Rps",
    authDomain: "project-1-9fe5d.firebaseapp.com",
    databaseURL: "https://project-1-9fe5d.firebaseio.com",
    storageBucket: "project-1-9fe5d.appspot.com",
    messagingSenderId: "6250521181"
  },

    initFirebase:function() {
		 firebase.initializeApp(this.dbconfig);
		 this.database = firebase.database();
    },


