// Initialize Firebase
  // dbconfig = {
  //   apiKey: "AIzaSyCA4hOk8RMSQ2VFfhSU_yEbax-arF8-Rps",
  //   authDomain: "project-1-9fe5d.firebaseapp.com",
  //   databaseURL: "https://project-1-9fe5d.firebaseio.com",
  //   storageBucket: "project-1-9fe5d.appspot.com",
  //   messagingSenderId: "6250521181"
  // };
  // firebase.initializeApp(config);

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


    searchAndAdd:function() {
      var search = this.search();
      this.addSearch(search);
    },

	search:function() {
		$('#search-match').empty();
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
        return search;
  	},

	renderSearchResult: function(data) {
		var searchMatch = $('#search-match');
		// searchMatch.empty();
		
		var table = $('<table>');
		table.addClass('table');
		table.addClass('table-bordered');


		searchMatch.append(table);
	
		var tableHeads = '<tr>';
		var tableHeaders = ['Name', 'City', 'State', 'Url', 'Tutition', 'Grad < 6 Yrs', 'Rentention Rate']// Tutition Students who gradute in 6 years Retention Rate
		for(var i = 0;i<tableHeaders.length;i++) {
			tableHeads += '<th>'+tableHeaders[i]+'</th>';
		}
		tableHeads += '</tr>';
		table.append(tableHeads);

		var headerRow = $('<tr>');
		headerRow.attr('scope','row');
		table.append(headerRow);
	
		// for(var i=0;i<tableHeaders.length;i++){
		// 	var headerCell = $('<th>');
		// 	headerCell.text(tableHeaders[i]);
		// 	headerRow.append(headerCell);
		// }

		var tableBody= $('<tbody>');
		table.append(tableBody);

		var fields = ['school.name','school.city','school.state','school.school_url', '2014.cost.attendance.academic_year','2014.completion.completion_rate_4yr_150nt','2014.student.retention_rate.four_year.full_time'];
		for(var i = 0;i<data.length;i++) {
			var school = data[i];
			var row = $('<tr>');
			row.attr('scope','row');
			for(var j=0;j<fields.length;j++){
				var cell = $('<td>');
				cell.text(school[fields[j]]);
				row.append(cell);
			}
			tableBody.append(row);
		}
	},
	addSearch:function(criteria) {
		var searchId = '';
		for(var k in criteria) {
			searchId += k+'=' + criteria[k] + ',';
		}
		criteria.counter = 1;
		criteria.id = searchId;

		//create or udpate counter
		this.database.ref(searchId).transaction(function(record) {
			if(record) {
				record.counter = record.counter + 1;
			} else {
				record = criteria;
			}
			return record;
		});
	},

	sortSearchByCount :function() {
		var result = [];
		for(var k in this.searches) {
			var record = app.searches[k];
			record.id = k;
			result.push(record);
		}
		//actual sorting
		for(var i = 0; i < result.length - 1;i++) {
			for(var j = i + 1; j < result.length; j++) {
				if(result[i].counter < result[j].counter) {
					var temp = result[j];
					result[j] =result[i]
					result[i] = temp; 
				}
			}
		}
		return result;
	},
	renderHistory: function() {

		$('#search-history').empty();
		var list = $('<ul>')
		list.addClass('list-unstyled');
		$('#search-history').append(list);


			var sortedRecords = this.sortSearchByCount();
		
			//show no more then 20 most popular searches
			var maxHistryCount = sortedRecords.length;
			if(maxHistryCount > 5) {
				maxHistryCount = 5;
			}
			for(var i = 0;i< maxHistryCount;i++) {
				var record = sortedRecords[i] 
				var search = '';
				var title = '';
				var item = $('<li>');
				for(var key in record) {
					if(key == 'counter' || key == 'id') {
						continue; //skip to next iteration
					}
					item.attr('data-' + key, record[key]);
					if(title.length > 0) {
						title += ',';
					}
					title  += record[key]
				}

				//item.addClass('list-group-item');
				item.addClass('d-flex');
				item.css('display', 'flex');
				item.css('justify-content','space-between');
				list.append(item);
				item.attr('data-search', search);
				item.attr('data-id', record.id);
				var searchText = $('<span>');
								

				searchText.text(title);
				item.append(searchText);

				var counter = $('<span>');
				counter.addClass('badge');
				counter.addClass('badge-default');
				
				counter.text(record.counter);
				item.append(counter);
				
				item.click(function() {
					var name = $(this).attr('data-name');
					$('#name').val(name);

					var city = $(this).attr('data-city');
					$('#city').val(city);

					app.search(true);
				})
			}
	},

	setReadListener: function() {
		this.database.ref().on("value", function(data) {
			var recordWithId = data.val();
			for(var k in  recordWithId) {
				app.searches[k] = recordWithId[k];
			}
			 app.renderHistory();
		});
	}
				//clear all database
};


$(document).ready(function() {
	
	app.initFirebase();
	app.setReadListener();
	//firebase.database().ref().remove();


	$('#search').click(function() {
		app.searchAndAdd();
	})
})


function loadnews() {
      //alert('Fired');
      //$("#nytDiv").empty();
      
      // Constructing a queryURL using the animal name
      var queryURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=college+admission+sat&fq=type_of_material('Article')ANDnews_desk:('Op-Ed')&?begin_date=20170101&api-key=84acc639b7af470facdac4d12ca2b946"      

		$.ajax({
          url: queryURL,
          method: "GET"
        })
        // After data comes back from the request
        .done(function(response) {
          //console.log(queryURL);
          //console.log(response);

          var results = response.response.docs;
          //console.log(results);
          //return;
          for (var i = 0; i < 6; i++) {
          	//console.log(i);
          	//console.log(results[i].multimedia[0].url);

          	// Creating and storing a div tag
           
            var nytDiv = $('<div></div>');
            var anchor = $("<a></a>");
            //var img = $("<img>");
            //var ur = results[i].multimedia[0].url;
            //var hr = 'http://www.nytimes.com/'+ur;
            //console.log(hr);
            //img.attr("src", hr);
            //console.log(hr);
            //return;
            anchor.attr("href", results[i].web_url);
            anchor.text(results[i].headline.main);
             // img.attr('src', results[i].multimedia[1].url);
            //nytDiv.append(img);
            nytDiv.append(anchor);
            //console.log(anchor);
            
            $("#nytDiv").append(nytDiv);
            //console.log(nytDiv);

          };
        });
  
};

$( document ).ready(function() {
		loadnews();
	})