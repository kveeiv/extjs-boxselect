/**
 * Ensures the input element takes up the maximum amount of remaining list width,
 * or the entirety of the list width if too little space remains. In this case,
 * the list height will be automatically increased to accomodate the new line. This
 * growth will not occur if {@link Ext.ux.form.field.BoxSelect#multiSelect} or
 * {@link Ext.ux.form.field.BoxSelect#grow} is false.
 */
Ext.define('Ext.ux.layout.component.field.BoxSelectField', {
    /* Begin Definitions */
    alias: ['layout.boxselectfield'],
    extend: 'Ext.layout.component.field.Trigger',

    /* End Definitions */

    type: 'boxselectfield',

    /*For proper calculations we need our field to be sized.*/
    waitForOuterWidthInDom:true,

    beginLayout: function(ownerContext) {
        var me = this,
            owner = me.owner;

        me.callParent(arguments);

        ownerContext.inputElCtContext = ownerContext.getEl('inputElCt');
        owner.inputElCt.setStyle('width','');

        me.skipInputGrowth = !owner.grow || !owner.multiSelect;
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
        /*No inputElCt calculations here!*/
    },

    /*Calculate and cache value of input container.*/
    publishInnerWidth:function(ownerContext) {
        var me = this,
            owner = me.owner,
            width = owner.itemList.getWidth(true) - 10,
            lastEntry = owner.inputElCt.prev(null, true);

        if (lastEntry && !owner.stacked) {
            lastEntry = Ext.fly(lastEntry);
            width = width - lastEntry.getOffsetsTo(lastEntry.up(''))[0] - lastEntry.getWidth();
        }

        if (!me.skipInputGrowth && (width < 35)) {
            width = width - 10;
        } else if (width < 1) {
            width = 1;
        }
        ownerContext.inputElCtContext.setWidth(width);
    }
});
