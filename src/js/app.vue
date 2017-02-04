<template>
	<div class="contain-app">
		<h1>
            Shorten URLs with VueJS & Bitly API
        </h1>
        <p class="intro cc-pab-20">
            A simple VueJS app to shorten urls, using bitly API. If you like, you can <a class="github-button" href="https://github.com/alpixel/bitly-vuejs/fork" data-icon="octicon-repo-forked" aria-label="Fork alpixel/bitly-vuejs on GitHub">Fork</a> or <a class="github-button" href="https://github.com/alpixel/bitly-vuejs" data-icon="octicon-star" aria-label="Star alpixel/bitly-vuejs on GitHub">Star</a> it on GitHub :)<br />
            Urls are saved into <strong>your local storage.</strong>
        </p>
        <form>
            <div class="form-item cc-chained" :class="{'error' : errorInput}">
                <label>Url to crop :</label>
                <input class="cc-w-50" v-model="longUrl" placeholder="Paste long url here..." />
                <button type="submit" @click.prevent="controlDatas" :class="{'cc-loading' : isLoading}">Crop</button>
                <a href="#" class="btn cc-bg-red cc-mal-10 cc-thin" @click.prevent="clearInput">Clear</a>
            </div>
        </form>

        <div class="cc-mat-30" v-show="taburl.length > 0">
            <h2>My shorten URL</h2>

            <div class="wrap-table">
                <div class="table-help cc-hidden-m" ref="helptable" @click.prevent="hideHelp">
                    <i class="ion-arrow-swap"></i>
                </div>
                
                <!-- Component : show saved urls -->
                <table-urls :taburl="taburl" v-on:deleteUrl="deleteUrl"></table-urls>
            </div>
        </div>

        <p class="last">
            Build with <a href="https://dev.bitly.com/" target="_blank">Bitly API</a>, <a href="https://vuejs.org/" target="_blank">VueJS</a> and <a href="http://chuckcss.io/" target="_blank">ChuckCSS</a>
        </p>
	</div>
</template>

<script>
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
		      url.uid = url.uid;
		    });

		    //localUrl.uid = localUrl.length;

		    return localUrl
		},

		// Save urls into the localStorage
		save: function (taburl) {
		    localStorage.setItem('longUrl', JSON.stringify(taburl))
		}
	}

	// Test if a string is an url
	function checkUrl(url) {
		return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
	}

	// Import component
	import tableUrls from './components/table-urls.vue'

	export default {
		name: 'vuejs-app',
		data () {
			return {
				// Main Input where long URL is written
				longUrl : '',

				// Result of the cropped URL
				shortenUrl : '',

				// Error control
				errorInput : false,

				// Array with all saved URL
				taburl : urlsStorage.fetch(),

				isLoading : false
			}			
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
					uid : this.taburl.length,
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

			// Reset form
			clearInput : function() {
				this.longUrl = '';
				this.errorInput = false;
			},

			// Delete an url from the table and save into the localStorage
            deleteUrl : function(index) {
                // Delete this url from the array
                this.taburl.splice(index,1);

                // Save urls into localStorage
                urlsStorage.save(this.taburl);
            },

	        // On phone, remove help table when clicked
	        hideHelp : function(el) {
	            this.$refs.helptable.className += ' hideme';
	        }
		},
		components: {
			tableUrls
		}
	}
</script>