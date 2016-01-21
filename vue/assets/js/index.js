/*
author:linjie1@kingsoft.com
modified date : 2016/1/14
*/
/* 自定义指令双击 */
Vue.directive('dbtap', {
	isFn: true,
	acceptStatement: true,
	bind: function() {
		// console.log('dbtap bound!');
	},
	update: function(fn) {
		var self = this;
		if (typeof fn !== 'function') {
			return console.error('The param of directive "v-dbtap" must be a function!');
		}
		$(self.el).doubleTap(function() {
			fn.call(self);
		});
	}
});

/* 自定义指令左滑动 */
Vue.directive('swipe', {
	bind: function() {
		var self = this;
		$(self.el)
			.on('touchstart', function(e) {
				$('.item_link').css('right', '-30%');
				swipeLeft.touchStart(e);
			})
			.on('touchmove', function(e) {
				swipeLeft.touchMove(e, $(self.el).children('.item_link'));
			}).on('touchend', swipeLeft.touchEnd);
	}
});

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
	})();


/* 左滑动 */
var swipeLeft = (function() {
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
			ev.preventDefault();
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
			if (dirY < 3 && Math.abs(dirX) > 5 ) {
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

/* 本地存储数据基本操作 */
var common = {
	initData: function(item) {
		var ls = localStorage.getItem(item);
		if (ls == null) {
			return [];
		}
		var data = JSON.parse(ls);
		return data;
	},
	addData: function(item, text) {
		var data = this.initData(item),
			todo = {
				"input": text,
				"time": new Date()
			};
		data.push(todo);
		// console.log(data);
		this.saveData(item, data);
	},
	saveData: function(item, data) {
		localStorage.setItem(item, JSON.stringify(data));
	},
	deleteData: function(item, index) {
		var data = this.initData(item);
		data.splice(index, 1);
		this.saveData(item, data);
	},
	getLen: function(item) {
		return this.initData(item).length;
	}
};

/* vue基本操作 */
var vm = new Vue({
	el: '.area',
	data: {
		new: '',
		newTodo: 'Add some todos',
		newDone: 'Double click to finish todos',
		deleteDoing: -1,
		deleteDone: -1
	},
	computed: {
		doing: function() {
			var doing = [];
			if (this.newTodo != '') {
				initDoing();
				this.newTodo = '';
				return doing;
			}
			if (this.deleteDoing != -1) {
				initDoing();
				this.deleteDoing = -1;
				return doing;
			}
			return [];

			function initDoing() {
				var datas = common.initData('doing').reverse(),
					len = datas.length;
				doing = [];
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						doing.push({
							text: datas[i].input
						});
					}
				} else {
					doing.push({
						text: 'Add some todos'
					});
				}
			}
		},
		done: function() {
			var done = [];
			if (this.newDone != '') {
				initDone();
				this.newDone = '';
				return done;
			}
			if (this.deleteDone != -1) {
				initDone();
				this.deleteDone = -1;
				return done;
			}
			return [];

			function initDone() {
				var datas = common.initData('done').reverse(),
					len = datas.length;
				done = [];
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						done.push({
							text: datas[i].input
						});
					}
				} else {
					done.push({
						text: 'Double click to finish todos'
					});
				}
			}
		}
	},
	methods: {
		addTodo: function() {
			var text = this.new.trim();
			if (text != '') {
				common.addData('doing', text);
				Hide.init($(".add"), $('.area2'), $('.pop'));
				this.newTodo = text;
				this.new = '';
			}
		},
		removeTodo: function(index) {
			var len = common.getLen('doing') - 1;
			// console.log(index, len);
			common.deleteData('doing', len - index);
			this.deleteDoing = len - index;
		},
		removeDone: function(index) {
			var len = common.getLen('done') - 1;
			console.log(this.deleteDone);
			common.deleteData('done', len - index);
			this.deleteDone = len - index;
			console.log(this.deleteDone);
		},
		addDone: function(text) {
			common.addData('done', text) - 1;
			this.newDone = text;
		},
		finDoing: function(index, text) {
			vm.removeTodo(index);
			vm.addDone(text);
		}
	}
});

$(function() {
	TapandShow.init($(".hamburger"), $('.area'), $('.aside'));
	TapandShow.init($(".add"), $('.area2'), $('.pop'));
}());