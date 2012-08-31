/** * @author  */using("Controls.Core.IMenuContainer");using("Controls.Form.ListBox");using("Controls.Form.ComboBox");var AutoComplete = Control.extend({		xtype: 'autocomplete',		onKeyDown: ComboBox.prototype.onKeyDown,		getSuggestItems: function(text){		if(!this._values){			this._values = this.controls.invoke('getText', []);		}				text = text.toLowerCase();		return this._values.filter(function(value){			return value.toLowerCase().indexOf(text) >= 0;		});	},		showSuggest: function(){		var text = this.getText();		var items = this.getSuggestItems(text);				if(!items || !items.length || (items.length === 1 && items[0] === text))  {			return this.hideMenu();		}				this.items.set(items);				this.target.showDropDown();		this.menu.selectedItem = null;		this.menu.setSelectedIndex(0);	},		onKeyUp: function(e){		switch(e.keyCode) {			case 40:			case 38:			case 13:			case 36:			case 37:			    return;		}						this.showSuggest();	},		onSelectItem: function(item){		this.setText(item.getText());		this.hideMenu();		return false;	},		onOverflowY: function(height){		this.menu.onOverflowY(height);	},		init: function(options){				var suggest = new ListBox();				suggest.bindSelector('mouseover');				suggest.on('itemclick', this.onSelectItem, this);				suggest.on('mousedown', function(e){			e.preventDefault();			this._menuDown = true;		}, this);				suggest.on('mouseup', function(){			this._menuDown = false;		}, this);				this.setMenu(suggest);				this.items = this.controls = suggest.controls;				this.on('keydown', this.onKeyDown);				if(navigator.isIE6) {			this.on('keypress', this.onKeyDown);		}				this.on('focus', this.showSuggest);				this.on('keyup', this.onKeyUp);				this.on('blur', function (e) {			var me = this;			if(this._menuDown)				return;			this.hideMenu();			this._menuDown = false;		});				this.setAttr('autocomplete', 'off');	}	}).implement(IMenuContainer);// AutoComplete.SuggestListBox = ListBox.extend({
// 	
	// xtype: 'suggest'
// 	
// });