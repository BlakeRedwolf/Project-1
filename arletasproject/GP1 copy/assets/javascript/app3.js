

var app = {

   dbconfig: {
		apiKey: "AIzaSyBBHQ6yBbCm2wvpbEQdDzoGzNUUiZ80fR0",
    	authDomain: "group-project-a8e612.firebaseapp.com",
    	databaseURL: "https://group-project-a8e612.firebaseio.com",
    	storageBucket: "group-project-a8e612.appspot.com",
    	messagingSenderId: "246635514977"
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
		var queryURL = 'https://api.data.gov/ed/collegescorecard/v1/schools?api_key=D7r68I5ZV97qXjLtrdTqnxqPTb750zgQrIaRm21s'; 
		var queryFields = '&fields=2014.cost.avg_net_price.private,school.name,school.city,school.zip,school.state,school.school_url'
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
        	console.log(response);
        	app.renderSearchResult(response.results);
        })
        return search;
  	},

	renderSearchResult: function(data) {
		var searchMatch = $('#search-match');
		searchMatch.empty();
		
		var table = $('<table>');
		table.addClass('table');
		table.addClass('table-striped');


		searchMatch.append(table);
		var tableHeaders = ['Name', 'Zip', 'City',  'State', 'Url', 'Tuition']
		
		var headerRow = $('<tr>');
		headerRow.attr('scope','row');
		table.append(headerRow);

		for(var i=0;i<tableHeaders.length;i++){
			var headerCell = $('<th>');
			headerCell.text(tableHeaders[i]);
			headerRow.append(headerCell);
		}

		var tableBody= $('<tbody>');
		table.append(tableBody);

		var fields = ['school.name','school.zip', 'school.city','school.state','school.school_url','2014.cost.avg_net_price.private'];
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
		this.database.ref().push(criteria);
	},

	
	renderHistory: function() {
		$('#search-history').empty();
		var list = $('<ul>')
		list.addClass('list-group');
		$('#search-history').append(list);

		this.database.ref().once("value", function(record) {
			var record = record.val();
			for(var id in record) {
				var value = record[id] 
				var search = '';
				var title = '';
				var item = $('<li>');
				for(var key in value) {
					item.attr('data-' + key, value[key]);
					if(title.length > 0) {
						title += ',';
					}
					title  += value[key]
				}

				item.addClass('list-group-item');
				list.append(item);
				item.attr('data-search', search);
				item.attr('data-id', id);
				item.text(title);
				
				item.click(function() {
					var name = $(this).attr('data-name');
					$('#name').val(name);

					var city = $(this).attr('data-city');
					$('#city').val(city);

					app.search(true);
					

				})
			
				//clear all database
					//app.database.ref().remove();
				
					
			}
			
		});
			}
}


$(document).ready(function() {
	
	app.initFirebase();
	

	app.renderHistory();

	$('#search').click(function() {
		app.searchAndAdd();
	})
})
