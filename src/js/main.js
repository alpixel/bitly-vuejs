const BITLY_URL = 'https://api-ssl.bitly.com/v3/shorten?';
const BITLY_LOGIN = "o_4nm0b7lfsb";
const BITLY_KEY = "R_3acba2a6f39844c2adb685084688f6bd";


var urlsStorage = {
	// Parse localStorage with saved urls
	fetch: function() {

		// get localStorage datas
		var localUrl = JSON.parse(localStorage.getItem('longUrl') || '[]');

		// For each url stored in the localStorage
	    localUrl.forEach(function (url, index) {
	      url.longUrl = index;
	    });

	    localUrl.uid = localUrl.length;

	    return localUrl
	},

	// Save urls into the localStorage
	save: function (taburl) {
	    localStorage.setItem('longUrl', JSON.stringify(taburl))
	}
}

var app = new Vue({
	el: '#app',
	data : {
		// Main Input where long URL is written
		longUrl : '',

		// Result of the cropped URL
		shortenUrl : '',

		// Error control
		errorInput : false,

		// Array with all saved URL
		taburl : urlsStorage.fetch(),

		isLoading : false
	},
	methods: {
		// Method who control input and call others methods
		controlDatas : function() {

			// Is longUrl is not empty
			if(this.longUrl != '' && checkUrl(this.longUrl)) {

				this.isLoading = true;

				// Call addUrl method
				this.cropUrl();

				//Set errorInput to false
				this.errorInput = false;
			} else {

				// Set errorInput to true
				this.errorInput = true;
			}
		},

		// Add the new url into results table
		addUrl : function() {

			// Push the new cropped url into the results table
			this.taburl.push({
				url : this.longUrl,
				shortenUrl : this.shortenUrl
			});

			// Save urls into localStorage
			urlsStorage.save(this.taburl);

			// Reset main input
			this.longUrl = '';
			this.shortenUrl = '';

			// Set isLoading to false
			this.isLoading = false;
		},

		// Crop URL with tinyurl API
		cropUrl : function() {
			var vm = this

			// send API request
			axios.get(BITLY_URL, {
				params : {
			        "format": "json",
			        "apiKey": BITLY_KEY,
			        "login": BITLY_LOGIN,
			        "longUrl": this.longUrl
			    }
		    })
			.then(function (response) { 
				if(response.status == 200) {
					// set app vars
					vm.longUrl = response.data.data.long_url;
					vm.shortenUrl = response.data.data.url;

					// Call addUrl method
					vm.addUrl();
				} else {
					console.log('Opps dude, status code != 200 :( ')
				}
			})
			.catch(function (error) {
				console.log('Error! ' + error);
				
				// Set isLoading to false
				this.isLoading = false;
			});
		},

		// Delete a urls from the table
		deleteUrl : function(index) {

			// Delete this url from the array
			this.taburl.splice(index,1);

			// Save urls into localStorage
			urlsStorage.save(this.taburl);
		},

		// Reset form
		clearInput : function(){
			this.longUrl = '';
			this.errorInput = false;
		}
	}
});


// Test if a string is an url
function checkUrl(url) {
	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

