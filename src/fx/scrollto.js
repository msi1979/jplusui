/**

		var obj = {};
		if (y != null) {
			obj.scrollTop = y;
		}
		if (x != null) {
			obj.scrollLeft = x;
		}
		return this.animate(obj, duration, callback, 'abort');
		var scroll = this.getScroll();
		return this.scrollTo(y == null ? y : (scroll.y + y), x == null ? x : (scroll.x + x), duration, callback);