/**
 * @author xuld
 */


imports("Controls.Part.Arrow");
imports("Controls.Tip.ToolTip");
using("Controls.Core.ContentControl");
using("Controls.Core.IToolTip");


	
/**
 * 表示一个工具提示。
 * @extends ContentControl
 */
var ToolTip = ContentControl.extend(IToolTip).implement({
		
	///**
	// * 当指针在具有指定工具提示文本的控件内保持静止时，工具提示保持可见的时间期限。-1表示不自动隐藏。 0 表示始终不显示。
	// * @type Number
	// */
	//autoDelay: -1,
	
	xtype: 'tooltip',
	
	menuTpl: '<span>\
				<span class="x-arrow-fore">◆</span>\
			</span>',

	content: function () {
	    return this.find('.x-tooltip-content');
	}

});

