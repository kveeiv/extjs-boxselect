/**
 *
 * Ensures the input element takes up the maximum amount of remaining list width,
 * or the entirety of the list width if too little space remains. In this case,
 * the list height will be automatically increased to accomodate the new line.
 */
Ext.define('Ext.ux.layout.component.field.BoxSelectField', {

	/* Begin Definitions */

	alias: ['layout.boxselectfield'],

	extend: 'Ext.layout.component.field.Trigger',

	/* End Definitions */

	type: 'boxselectfield',

	beginLayout: function(ownerContext) {
		var me = this,
				owner = me.owner;

		me.callParent(arguments);

		ownerContext.inputElCt = ownerContext.getEl('inputElCt');
		ownerContext.itemList = ownerContext.getEl('itemList');
	},

	beginLayoutFixed: function(ownerContext, width, suffix) {
		var me = this,
				owner = ownerContext.target;

		owner.triggerEl.setStyle('height', '24px');

		me.callParent(arguments);

		if (ownerContext.heightModel.fixed && ownerContext.lastBox) {
			owner.listWrapper.setStyle('height', ownerContext.lastBox.height+'px');
			owner.itemList.setStyle('height', '100%');
		}

		var listBox = owner.itemList.getBox(true, true),
				listWidth = listBox.width,
				lastEntry = owner.inputElCt.dom.previousSibling,
				inputWidth = listWidth - 10;

		if (lastEntry) {
			inputWidth = inputWidth - (lastEntry.offsetLeft + Ext.fly(lastEntry).getWidth() + Ext.fly(lastEntry).getPadding('lr'));
		}
		if (inputWidth < 35) {
			inputWidth = listWidth - 10;
		}

		owner.inputElCt.setStyle('width', inputWidth + 'px');
	}

});
