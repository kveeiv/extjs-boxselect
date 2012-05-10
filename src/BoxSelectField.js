/**
 * This is an amalgamation of the TextArea field layout and the Trigger field layout,
 * with overrides to manage the layout of the field on the itemList wrap instead
 * of the inputEl and to grow based on inputEl wrap positioning instead of
 * raw text value.
 */

Ext.define('Ext.ux.layout.component.field.BoxSelectField', {

    /* Begin Definitions */

    alias: ['layout.boxselectfield'],

    extend: 'Ext.layout.component.field.Field',

    /* End Definitions */

    type: 'boxselectfield',

    /**
	 * Overridden to use an encoded value instead of raw value
	 */
    beforeLayout: function(width, height) {
        var me = this,
        owner = me.owner,
        lastValue = this.lastValue,
        value = Ext.encode(owner.value);
        this.lastValue = value;
        return me.callParent(arguments) || (owner.grow && value !== lastValue);
    },

    /**
     * Overridden to use itemList instead of inputEl, and to merge trigger field
     * sizing with text field growability.
     */
    sizeBodyContents: function(width, height) {
        var me = this,
        owner = me.owner,
        triggerWrap = owner.triggerWrap,
        triggerWidth = owner.getTriggerWidth(),
        itemList, inputEl, inputElCt, lastEntry,
        listBox, listWidth, inputWidth;

        // If we or our ancestor is hidden, we can get a triggerWidth calculation
        // of 0.  We don't want to resize in this case.
        if (owner.hideTrigger || owner.readOnly || triggerWidth > 0) {
            itemList = owner.itemList;

            // Decrease the field's width by the width of the triggers. Both the field and the triggerWrap
            // are floated left in CSS so they'll stack up side by side.
            me.setElementSize(itemList, Ext.isNumber(width) ? width - triggerWidth : width, height);

            // Explicitly set the triggerWrap's width, to prevent wrapping
            triggerWrap.setWidth(triggerWidth);

            // Size the input el to take up the maximum amount of remaining list width,
            // or the entirety of list width to cause wrapping if too little space remains.
            inputEl = owner.inputEl;
            inputElCt = owner.inputElCt;
            listBox = itemList.getBox(true, true);
            listWidth = listBox.width;

            if ((owner.grow && owner.growMax && (itemList.dom.scrollHeight > (owner.growMax - 25))) ||
                (owner.isFixedHeight() && (itemList.dom.scrollHeight > itemList.dom.clientHeight))) {
                listWidth = listWidth - Ext.getScrollbarSize().width;
            }
            inputWidth = listWidth - 10;
            lastEntry = inputElCt.dom.previousSibling;
            if (lastEntry) {
                inputWidth = inputWidth - (lastEntry.offsetLeft + Ext.fly(lastEntry).getWidth() + Ext.fly(lastEntry).getPadding('lr'));
            }
            if (inputWidth < 35) {
                inputWidth = listWidth - 10;
            }

            if (inputWidth >= 0) {
                me.setElementSize(inputEl, inputWidth);
                if (owner.hasFocus) {
                    inputElCt.scrollIntoView(itemList);
                }
            }
        }
    }

});
