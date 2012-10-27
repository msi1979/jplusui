/**
 * @author xuld
 */



imports("Controls.Form.ListBox");
using("Controls.Core.ListControl");
using("Controls.Form.Picker");

/**
 * 表示一个组合框。
 * @class
 * @extends Picker
 * @example <pre>
 * var comboBox = new ComboBox();
 * comboBox.add("aaa");
 * comboBox.add("bbb");
 * comboBox.setSelectedIndex(0);
 * </pre>
 */
var ComboBox = Picker.extend({
	
	xtype: 'combobox',
	
	autoResize: true,
	
	// 悬停选中
	
	_getHover: function(){
		return this._hoverItem;
	},
	
	_setHover: function(item){
		var clazz = 'x-' + this.dropDown.xtype + '-hover';
		
		if(this._hoverItem){
			this._hoverItem.removeClass(clazz);
		}
		
		this._hoverItem = item ? item.addClass(clazz) : null;
		
	},
	
	/**
	 * 移动当前选中项的位置。
	 */
	_moveHover: function(delta){
		
		// 如果菜单未显示。
	    if(this.dropDownHidden()){
	    	
	    	// 显示菜单。
	    	this.showDropDown();
	    } else {
	    	
	    	var item = this._hoverItem || this.selectedItem;
	    	
	    	if(item){
	    		item = item[delta > 0 ? 'next' : 'prev']();
	    	}
	    	
	    	if(!item){
	    		item = this.dropDown.item(delta > 0 ? 0 : -1);
	    	}
	    	
	    	this._setHover(item);
	    	
	    }
	},
	
	onSelect: function(item){
		return this.trigger('select', item);
	},
	
	/**
	 * 处理键盘事件。
	 */
	onKeyDown: function(e){
		switch(e.keyCode) {
			
			// 上下
			case 40:
			case 38:
			
				// 阻止默认事件。
			    e.preventDefault();
			    
				this._moveHover(e.keyCode === 40 ? 1 : -1);
			    
			    break;
			    
			// 回车
			case 13:
			case 10:
				if(!this.dropDownHidden()){
					var currentItem = this._getHover();
					if(currentItem != null) {
						this.selectItem(currentItem);
						e.preventDefault();
					}
				}
		}
	},
	
	/**
	 * 当用户单击某一项时执行。
	 */
	onItemClick: function(item, e){
		
	    //e.preventDefault();
	    //e.StopPropogation();
	
		// 如果无法更改值，则直接忽略。
		if(!this.getAttr('disabled') && !this.getAttr('readonly')) {
				
			// 设置当前的选中项。
			this.selectItem(item);
			
		}

		return false;
		
	},
	
	/**
	 * 创建当前 Picker 的菜单。
	 * @return {Control} 下拉菜单。
	 * @protected virtual
	 */
	createDropDown: function(existDom){
		return new ComboBox.DropDownMenu(existDom);
	},
	
	_syncSelect: function(){
		var selected = this.hiddenField.find(':selected');
		this.first().setText(selected ? selected.getText() : this.hiddenField.getAttr('placeholder'));
	},
	
	/**
	 * 将当前文本的值同步到下拉菜单。
	 */
	updateDropDown: function(){
		
		var item;
		
		if(this.dropDownList){
			item = this.getSelectedItem();
		} else {
			item = this.dropDown.getItemByText(this.getText());
		}
		
		this._setHover(item);
	},
	
	updateText: function(item){
		
		// 如果是 dropDownList, 还需要更新 <select> 的值。
		if(this.dropDownList){
			var elem = this.hiddenField.node,
				oldIndex = elem.selectedIndex;
			if(item == null){
				elem.selectedIndex = -1;
			} else {
				elem.value = item.option.value;
			}
			this._syncSelect();
			
			if(oldIndex !== elem.selectedIndex)
				this.onChange();
		} else {
			IInput.setText.call(this, item.getText());
		}
		
	},
	
	clear: function(){
		if(this.dropDownList){
			this.updateText(null);
		} else {
			IInput.clear.call(this, value);
		}
	},
	
	setText: function(value){
		
		IInput.setText.call(this, value);
		
		if(this.dropDownList){
			this._syncSelect();
		}
		
		return this;
	},
	
	init: function (options) {
		
		// 1. 处理 <select>
		var selectNode;
		
		// 如果初始化的时候传入一个 <select> 则替换 <select>, 并拷贝相关数据。
		if(this.node.tagName === 'SELECT') {
			
			selectNode = this.node;
			
			// 调用 create 重新生成 dom 。
			this.node = Dom.parseNode(this.dropDownListTpl);
			
			this.dropDownList = true;
			
		}
		
		// 2. 初始化文本框
		
		// 初始化文本框
		this.base('init');
		
		// 3. 初始化菜单
		
		// 绑定下拉菜单的点击事件
		this.dropDown
			.itemOn('mouseover', this._setHover, this)
			.itemOn('click', this.onItemClick, this);
		
		// 4. 绑定事件
		
		// 监听键盘事件。
		this.on('keydown', this.onKeyDown);
		
		// IE6 Hack: keydown 无法监听到回车。
		if(navigator.isIE6) {
			this.on('keypress', this.onKeyDown);	
		}
		
		// 4. 设置默认项
			
		if(selectNode) {
			
			this.hiddenField = selectNode = new Dom(selectNode);
			
			// 让 listBox 拷贝 <select> 的成员。
			this.copyItemsFromSelect(selectNode);
			
			// 隐藏 <select> 为新的 dom。
			selectNode.hide();
			
			// 插入当前节点。
			selectNode.after(this);
		}
		
	},
	
	/**
	 * 模拟鼠标选择某一个项。
	 */
	selectItem: function (item) {
		this.setSelectedItem(item);
		return this.hideDropDown();
	},
	
	/**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 * @return {Control} 选中的项。
	 */
	getSelectedItem: function(){
		return this.selectedItem;
	},
	
	/**
	 * 设置当前选中的项。
	 * @param {Control} item 选中的项。
	 * @return this
	 */
	setSelectedItem: function(item){
		item = this.dropDown.itemOf(item);
		if(this.onSelect(item) !== false) {
			this.selectedItem = item;
			this.updateText(item);
		}
		return this;
	},
	
	getSelectedIndex: function(){
		return this.dropDown.indexOf(this.getSelectedItem());
	},
	
	setSelectedIndex: function(value){
		return this.setSelectedItem(this.dropDown.item(value));
	},
	
	resizeToFitItems: function(){
		var dropDown = this.dropDown,
			oldWidth = dropDown.getStyle('width'),
			oldDisplay = dropDown.getStyle('display');
			
		dropDown.setStyle('display', 'inline-block');
		dropDown.setWidth('auto');
		
		this.first().setSize(dropDown.getWidth());
		
		dropDown.setStyle('width', oldWidth);
		dropDown.setStyle('display', oldDisplay);
		return this;
	},
	
	copyItemsFromSelect: function(select){
		for(var node = select.node.firstChild; node; node = node.nextSibling) {
			if(node.tagName  === 'OPTION') {
				var item = this.add(Dom.getText(node));
				
				item.option = node;
				if(node.selected){
					this.setSelectedItem(item);
				}
			}
		}
		
		if(select.onclick)
			this.node.onclick = select.node.onclick;
		
		if(select.onchange)
			this.on('change', select.node.onchange);
		
		if(this.autoResize)
			this.setWidth(select.getWidth());
		
	}

}).addEvents('select');


ListControl.aliasMethods(ComboBox, 'dropDown');


ComboBox.DropDownMenu = ListControl.extend({
	
	xtype: "listbox"

});