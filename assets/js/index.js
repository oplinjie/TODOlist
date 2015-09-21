/*
author:linjie1@kingsoft.com
modified date : 2015/9/15
*/

var TapandShow = (function() {
		var init = function(link) {
			var show_tag = arguments;
			link.tap(function(e) {
				$.each(show_tag, function(idx, argument) {
					$(argument).toggleClass('active');
				});
			})
		};
		return {
			init: init
		}
	})(),

	Hide = (function() {
		var init = function() {
			var show_tag = arguments;
			$.each(show_tag, function(idx, argument) {
				$(argument).removeClass('active');
			});
		};
		return {
			init: init
		}
	})(),

	PostData = (function() {
		var init = function(el) {
				var value = input.value;
				if (value == "") {
					input.placeholder = "cann't be empty";
				} else {
					var data = loadData();
					var doing = {
						"input": value,
						"time": new Date()
					};
					data.push(doing);
					saveData(data);
					addData(doing);
					input.value = '';
				}
			},
			loadData = function(items) {

			}

	})();


function post() {
	var input = document.getElementById('input'),
		value = input.value;
	if (value == "") {
		input.placeholder = "cann't be empty";
		return false;
	} else {
		var data = handleData.loadData("doing"),
			doing = {
				"input": value,
				"time": new Date()
			},
			len = data.length;
		data.push(doing);
		handleData.saveData('doing', data);
		handleData.addData('.doing ul', doing, len + 1);
		input.value = '';
		return true;
	}
}

// function loadData(items) {
// 	var collection = localStorage.getItem(items);
// 	if (collection !== null) {
// 		return JSON.parse(collection);
// 	} else return [];
// }

// function saveData(items, data) {
// 	localStorage.setItem(items, JSON.stringify(data));
// }

// function addData(el, item, num) {
// 	$(el).prepend('<li class="item" data-num="' + num + '"><a class="item_text" href="javascript:;">' + item.input + '</a><a class="item_link" href="">×</a></li>');
// }

var handleData = (function() {
	var loadData = function(item) {
			var collection = localStorage.getItem(item);
			if (collection !== null) {
				return JSON.parse(collection);
			} else return [];
		},
		saveData = function(items, data) {
			localStorage.setItem(items, JSON.stringify(data));
		},
		addData = function(el, item, num) {
			$(el).prepend('<li class="item" data-num="' + num + '"><a class="item_text" href="javascript:;">' + item.input + '</a><a class="item_link" href="">×</a></li>');

		};
	return {
		loadData: loadData,
		saveData: saveData,
		addData: addData
	}
})();

var InitData = (function() {
	var init = function() {
			var doing = localStorage.getItem("doing"),
				done = localStorage.getItem("done");
			if (doing !== null) {
				showData('.doing ul', doing);
			}
			if (done !== null) {
				showData('.done ul', done);
			}
		},
		showData = function(el, items) {
			var data = JSON.parse(items);
			for (var i = 0; i < data.length; i++) {
				$(el).prepend('<li class="item" data-num="' + (i + 1) + '"><a class="item_text" href="javascript:;">' + data[i].input + '</a><a class="item_link" href="">×</a></li>');
			}
		};

	return {
		init: init
	}
})();

var swipe = (function() {
	var mouseData = {
			sX: 0,
			eX: 0,
			sY: 0,
			eY: 0
		},
		pos1,
		pos2,
		pos3,
		dirX,
		dirY,
		right,
		width,
		el,
		touchStart = function(ev) {
			pos1 = ev.changedTouches[0];
			// 记录开始时位置
			mouseData.sX = pos1.pageX;
			mouseData.sY = pos1.pageY;
		},
		touchMove = function(ev, element) {
			el = element;
			pos2 = ev.changedTouches[0];
			//记录结束时位置
			mouseData.eX = pos2.pageX;
			mouseData.eY = pos2.pageY;

			//求位置差
			dirX = mouseData.sX - mouseData.eX;
			dirY = Math.abs(mouseData.eY - mouseData.sY);

			mouseData.sX = mouseData.eX;
			mouseData.sY = mouseData.eY;

			right = parseInt(el.css('right'));
			width = parseInt(el.css('width'));
			//位置偏移小于5时切换
			if (dirY < 5) {
				right = right + dirX;
				if (right <= 0 && Math.abs(right) < width) {
					el.css('right', right + 'px');
				} else if (Math.abs(right) > width) {
					el.css('right', '-30%');
				} else if (right > 0) {
					el.css('right', '0');
				}
			}
		},
		touchEnd = function(ev) {
			//大于50%直接100%
			//小于50%直接0
			if (Math.abs(right) < (width / 2)) {
				el.css('right', '0');
			} else if (Math.abs(right) > (width / 2)) {
				el.css('right', '-30%');
			}
		}
	return {
		touchStart: touchStart,
		touchMove: touchMove,
		touchEnd: touchEnd
	}
})();

Array.prototype.remove = function(dx) {
	if (isNaN(dx) || dx > this.length) {
		return false;
	}
	for (var i = 0, n = 0; i < this.length; i++) {
		if (this[i] != this[dx]) {
			this[n++] = this[i]
		}
	}
	this.length -= 1;
}

$(function() {
	InitData.init();

	TapandShow.init($(".hamburger"), $('.area'), $('.aside'));

	TapandShow.init($(".add"), $('.area2'), $('.pop'));

	$("form").submit(function() {
		if (post()) {
			Hide.init($(".add"), $('.area2'), $('.pop'));
			location.reload();
		}
	});

	$('.doing .item').doubleTap(function() {
		var num = $(this).data('num'),
			text = $(this).find('.item_text').text();

		console.log(num + text);
		$(this).remove();

		var doing = handleData.loadData('doing');
		doing.remove(num - 1);
		handleData.saveData('doing', doing);

		var done = handleData.loadData('done'),
			done_item = {
				"input": text,
				"time": new Date()
			},
			len = done.length;
		done.push(done_item);
		handleData.saveData('done', done);
		handleData.addData('done ul', done_item, len + 1);
		location.reload();
	});

	$('.item')
		.on('touchstart', function(e) {
			$('.item_link').css('right', '-30%');
			swipe.touchStart(e);
		})
		.on('touchmove', function(e) {
			swipe.touchMove(e, $(this).children('.item_link'));
		}).on('touchend', swipe.touchEnd);

	$('.item_link').each(function() {
		$(this).tap(function() {
			var $parent = $(this).parent(),
				num = $parent.data('num'),
				$section = $parent.parent().parent();

			$parent.remove();

			if ($section.hasClass('doing')) {
				var doing = handleData.loadData('doing');
				doing.remove(num - 1);
				handleData.saveData('doing', doing);
			} else if ($section.hasClass('done')){
				var done = handleData.loadData('done');
				done.remove(num - 1);
				handleData.saveData('done', done);
			}
			location.reload();
		});
	});
}());