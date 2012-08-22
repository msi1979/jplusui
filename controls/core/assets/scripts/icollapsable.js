/** * @author  xuld *//** * 表示一个可折叠的控件。 * @interface ICollapsable */var ICollapsable = {		/**	 * 获取目前是否折叠。	 * @virtual	 * @return {Boolean} 获取一个值，该值指示当前面板是否折叠。	 */	isCollapsed: function() {		return Dom.isHidden((this.content || this).node);	},		onCollapsing: function(duration){		return this.trigger('collapsing', duration);	},		onExpanding: function(duration){		return this.trigger('expanding', duration);	},		onCollapsed: function(){		this.trigger('collapsed');	},		onExpanded: function(){		this.trigger('expanded');	},	/**	 * 折叠面板。	 * @param {Number} duration 折叠效果使用的时间。	 */	collapse: function(duration){		var me = this;		if(me.onCollapsing(duration))			(me.content || me).hide('height', duration, function(){				me.addClass('x-' + me.xtype + '-collapsed');				me.onCollapsed();			}, 'ignore');		return this;	},	/**	 * 展开面板。	 * @param {Number} duration 折叠效果使用的时间。	 */	expand: function(duration){		if(this.onExpanding(duration)  ) {			this.removeClass('x-' + this.xtype + '-collapsed');			(this.content || this).show('height', duration, this.onExpanded.bind(this), 'ignore');		}		return this;	},		/**	 * 切换面板的折叠。	 * @param {Number} duration 折叠效果使用的时间。	 */	toggleCollapse: function(duration) {		return this.isCollapsed() ? this.expand(duration) : this.collapse(duration);	}	};