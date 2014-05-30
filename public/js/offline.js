(function ($) {

    $.widget('ui.offline', {
	
		_create: function () {
			
			var that = this;
			
			that._clock();
		},
		
		_clock: function() {
			
			var that = this;
			
			if (that.clock) {
			
				var date = new Date();
				
				var hours = $._sprintf(date.getHours());
				
				hours += ':' + $._sprintf(date.getMinutes());
				
				
				$(that.clock).empty().text(hours);
			}
			
			setTimeout(function () { 
				that._clock(); 
			}, 1000);
			
		},
		
		_init: function() {
			
			var that = this;
			
			$.ads();
			
			$('#header').css('display', 'block');
			$('#footer').css('display', 'block');
			
			$(that.element).empty().html();
			
			$('<div id="right"></div>').appendTo(that.element);
							
			var left = $('<div id="left"></div>').appendTo(that.element);
			
			var div = $('<div class="infos"></div>').appendTo(left).css('height', '40px');
			
			that.clock = $('<div class="clock"></div>').appendTo(div).css('border', '0');
			
			var conteneur = $('<div id="conteneur"></div>').appendTo(that.element);
			
			var menu = $('<div id="menu"></div>').appendTo(conteneur);
			
			var right = $('<div class="bt_like"></div>').appendTo(menu);
			
			$('.fb-like').appendTo(right);
			
			var ul = $('<ul></ul>').appendTo(menu);
			
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.text.home + '</a>').appendTo(li).click(function () {
				$.init();
				return false;
			});
			
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.text.play + '</a>').appendTo(li).click(function () {
				that._init();
				return false;
			});
			
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.text.invite + '</a>').appendTo(li).click(function () {
				$.sendInvite();
				return false;
			});
			
			var contenu = $('<div class="contenu"></div>').appendTo(conteneur);
			
			var accueil = $('<div id="accueil"></div>').appendTo(contenu);
			
			var offline = $('<div class="offline"></div>').appendTo(accueil);
			
			$('<h2>' + $.options.text.one_player + '</h2>').appendTo(offline);
				
			var form = $('<div class="form"></div>').appendTo(offline);
					
			$('<label>' + $.options.text.player + '</label><input type="text" name="player" maxlength="30" />').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(offline);
			
			$('<label>' + $.options.text.color + '</label>').appendTo(form);
			
			var select = $('<select name="color"></select>').appendTo(form);
			
			var array = ["blanc", "noir"];

			for (var i in array) {
				$('<option value="' + array[i] + '">' + $.options.text[array[i]] + '</option>').appendTo(select);
			}
			
			var form = $('<div class="form"></div>').appendTo(offline);
			
			$('<label>' + $.options.text.level + '</label>').appendTo(form);
			
			var select = $('<select name="level"></select>').appendTo(form);
			
			var array = ["facile", "normal"];

			for (var i in array) {
				$('<option value="' + array[i] + '">' + $.options.text[array[i]] + '</option>').appendTo(select);
			}
			
			var form = $('<div class="form"></div>').appendTo(offline);
		
			$('<button>' + $.options.text.start_game +'</button>').appendTo(form).click(function () {
				$(contenu).ia();
			});
			
			var offline = $('<div class="offline"></div>').appendTo(accueil);
			
			$('<h2>' + $.options.text.two_player + '</h2>').appendTo(offline);
			
			var form = $('<div class="form"></div>').appendTo(offline);
					
			$('<label>' + $.options.text.player + ' 1</label><input type="text" name="player1" maxlength="30" />').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(offline);
					
			$('<label>' + $.options.text.player + ' 2</label><input type="text" name="player2" maxlength="30" />').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(offline);
					
			$('<label>' + $.options.text.time + '</label>').appendTo(form);
			
			var select = $('<select name="time"></select>').appendTo(form);
			
			$('<option value="">' + $.options.text.none + '</option>').appendTo(select);
			
			var array = [300, 600, 1200, 3600, 5400];

			for (var i in array) {

				var minute = array[i] / 60;
				$('<option value="' + array[i] + '">' + minute + ' ' + $.options.text.minutes + '</option>').appendTo(select);
			}
			
			var form = $('<div class="form"></div>').appendTo(offline);
		
			$('<button>' + $.options.text.start_game +'</button>').appendTo(form).click(function () {
				$(contenu).twoplayer();
			});
		},

    });

})(jQuery);