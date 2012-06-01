/**
 * @class Ext.ux.form.field.BoxSelect
 * @extends Ext.form.field.ComboBox
 *
 * BoxSelect for ExtJS 4.1, a combo box improved for multiple value querying, selection and management.
 *
 * A friendlier combo box for multiple selections that creates easily individually
 * removable labels for each selection, as seen on facebook and other sites. Querying
 * and type-ahead support are also improved for multiple selections.
 *
 * Options and usage mostly remain consistent with the {@link Ext.form.field.ComboBox}
 * control. Some default configuration options have changed, but should still
 * work properly if overridden.
 *
 * Inspired by the SuperBoxSelect component for ExtJS 3 (http://technomedia.co.uk/SuperBoxSelect/examples3.html),
 * which in turn was inspired by the BoxSelect component for ExtJS 2 (http://efattal.fr/en/extjs/extuxboxselect/).
 *
 * Various contributions and suggestions made by many members of the ExtJS community which can be seen
 * in the user extension posting: http://www.sencha.com/forum/showthread.php?134751-Ext.ux.form.field.BoxSelect
 *
 * Many thanks go out to all of those who have contributed, this extension would not be
 * possible without your help.
 *
 * @author kvee_iv http://www.sencha.com/forum/member.php?29437-kveeiv
 * @contributors See AUTHORS.txt for a full list of major contributors
 * @version 2.0
 * @requires BoxSelect.css, BoxSelectField.js
 * @xtype boxselect
 */
Ext.define('Ext.ux.form.field.BoxSelect', {
    extend:'Ext.form.field.ComboBox',
    alias: ['widget.comboboxselect', 'widget.boxselect'],
    requires: ['Ext.selection.Model', 'Ext.data.Store'],

    /**
     * @cfg {Boolean} multiSelect
     * If set to <code>true</code>, allows the combo field to hold more than one value at a time, and allows selecting
     * multiple items from the dropdown list. (Defaults to <code>true</code>, the default usage for BoxSelect)
     */
    multiSelect: true,

    /**
	 * @cfg {Boolean} forceSelection
	 * <code>true</code> to restrict the selected value to one of the values in the list,
     * <code>false</code> to allow the user to set arbitrary text into the field (defaults to <code>true</code>, the default usage for BoxSelect)
     */
    forceSelection: true,

    /**
     * @cfg {Boolean} selectOnFocus <code>true</code> to automatically select any existing field text when the field
     * receives input focus (defaults to <code>true</code> for best multi-select usability during querying)
     */
    selectOnFocus: true,

    /**
     * @cfg {Boolean} triggerOnClick <code>true</code> to activate the trigger when clicking in empty space
     * in the field. Note that the subsequent behavior of this is controlled by the field's {@link #triggerAction}.
     * This behavior is similar to that of a basic ComboBox with {@link #editable} <code>false</code>.
     * (defaults to <code>true</code>).
     */
    triggerOnClick: true,

    /**
	 * @cfg {Boolean} createNewOnEnter
	 * When forceSelection is false, new records can be created by the user. These records are not added to the
	 * combo's store. By default, this creation is triggered by typing the configured 'delimiter'. With
	 * createNewOnEnter set to true, this creation can also be triggered by the 'enter' key. This configuration
	 * option has no effect if forceSelection is true. (defaults to <code>false</code>)
	 * <code>true</code> to allow the user to press 'enter' to create a new record
	 * <code>false</code> to only allow the user to type the configured 'delimiter' to create a new record
	 */
    createNewOnEnter: false,

    /**
	 * @cfg {Boolean} createNewOnBlur
	 * Similar to {@link #createNewOnEnter}, createNewOnBlur will create a new record when the field loses focus.
	 * This configuration option has no effect if forceSelection is true. Please note that this behavior is also
	 * affected by the configuration options {@link #autoSelect} and {@link #selectOnTab}. If those are true
	 * and an existing item would have been selected as a result, the partial text the user has entered will
	 * be discarded.
	 * <code>true</code> to create a new record when the field loses focus
	 * <code>false</code> to not create a new record on blur
	 */
    createNewOnBlur: false,

    /**
     * @cfg {Boolean} encodeSubmitValue
     * Controls the formatting of the form submit value of the field. (defaults to <code>false</code>). This
     * is not applicable of {@link #multiSelect} is false.
     * <code>true</code> for the field value to submit as a json encoded array in a single GET/POST variable
     * <code>false</code> for the field to submit as an array of GET/POST variables
     */
    encodeSubmitValue: false,

    /**
	 * @cfg {Boolean} stacked
	 * When stacked is true, each labelled item will fill to the width of the form field
	 * <code>true</code> to have each labelled item fill the width of the form field
	 * <code>false</code> to have each labelled item size to its displayed contents (defaults to <code>false</code>)
	 */
    stacked: false,

    /**
	 * @cfg {Boolean} pinList
	 * When multiSelect is true, the pick list used for the combo will stay open after each selection is made. This
	 * config option has no effect if multiSelect is false.
	 * <code>true</code> to keep the pick list expanded after each multiSelect selection
	 * <code>false</code> to collapse the pick list after each multiSelect selection (defaults to <code>true</code>)
	 */
    pinList: true,

    /**
     * @cfg {Boolean} grow <tt>true</tt> if this field should automatically grow and shrink to its content
     * (defaults to <tt>true</tt>)
     */
    grow: true,

    /**
     * @cfg {Number} growMin The minimum height to allow when <tt>{@link Ext.form.field.Text#grow grow}=true</tt>
     * (defaults to <tt>false</tt>, which allows for natural growth based on selections).
     */
    growMin: false,

    /**
     * @cfg {Number} growMax The maximum height to allow when <tt>{@link Ext.form.field.Text#grow grow}=true</tt>
     * (defaults to <tt>false</tt>, which allows for natural growth based on selections).
     */
    growMax: false,

    /**
     * @cfg {Boolean} filterPickList
     * True to hide the currently selected values from the drop down list. These items are hidden via
     * css to maintain simplicity in store and filter management.
     * <code>true</code> to hide currently selected values from the drop down pick list
     * <code>false</code> to keep the item in the pick list as a selected item
     */
    filterPickList: false,

    // private
    fieldSubTpl: [
        '<div id="{cmpId}-listWrapper" class="x-boxselect {fieldCls} {typeCls}">',
        '<ul id="{cmpId}-itemList" class="x-boxselect-list">',
        '<li id="{cmpId}-inputElCt" class="x-boxselect-input">',
        '<input id="{cmpId}-inputEl" type="{type}" ',
        '<tpl if="name">name="{name}" </tpl>',
        '<tpl if="size">size="{size}" </tpl>',
        '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
        'class="x-boxselect-input-field" autocomplete="off">',
        '</li>',
        '</ul>',
        '</div>',
        {
            compiled: true,
            disableFormats: true
        }
    ],

    // private
    childEls: [ 'listWrapper', 'itemList', 'inputEl', 'inputElCt' ],

    // private
    componentLayout: 'boxselectfield',

    /**
	 * Initialize additional settings and enable simultaneous typeAhead and multiSelect support
	 */
    initComponent: function() {
        var me = this,
        typeAhead = me.typeAhead;

        if (typeAhead && !me.editable) {
            Ext.Error.raise('If typeAhead is enabled the combo must be editable: true -- please change one of those settings.');
        }

        Ext.apply(me, {
            typeAhead: false
        });

        me.callParent();

        me.typeAhead = typeAhead;

        me.selectionModel = new Ext.selection.Model({
            store: me.valueStore,
            mode: 'MULTI',
            onSelectChange: function(record, isSelected, suppressEvent, commitFn) {
                commitFn();
            }
        });

        if (!Ext.isEmpty(me.delimiter) && me.multiSelect) {
            me.delimiterRegexp = new RegExp(String(me.delimiter).replace(/[$%()*+.?\[\\\]{|}]/g, "\\$&"));
        }
    },

    /**
	 * Register events for management controls of labelled items
	 */
    initEvents: function() {
        var me = this;

        me.callParent(arguments);

        if (!me.enableKeyEvents) {
            me.mon(me.inputEl, 'keydown', me.onKeyDown, me);
        }
        me.mon(me.inputEl, 'paste', me.onPaste, me);
        me.mon(me.listWrapper, 'click', me.onItemListClick, me);
        me.mon(me.selectionModel, 'selectionchange', me.applyMultiselectItemMarkup, me);
    },

    /**
	 * Create a store for the records of our current value based on the main store's model
	 */
    onBindStore: function(store, initial) {
        var me = this;

        if (store) {
            me.valueStore = new Ext.data.Store({
                model: store.model,
                proxy: {
                    type: 'memory'
                }
            });
            me.mon(me.valueStore, 'datachanged', me.applyMultiselectItemMarkup, me);
            if (me.selectionModel) {
                me.selectionModel.bindStore(me.valueStore);
            }
        }
    },
    onUnbindStore: function(store) {
        var me = this,
        valueStore = me.valueStore;

        if (valueStore) {
            if (me.selectionModel) {
                me.selectionModel.deselectAll();
                me.selectionModel.bindStore(null);
            }
            me.mun(valueStore, 'datachanged', me.applyMultiselectItemMarkup, me);
            valueStore.destroy();
            me.valueStore = null;
        }

        me.callParent(arguments);
    },

    /**
	 * Add refresh tracking to the picker for selection management
	 */
    createPicker: function() {
        var me = this,
        picker = me.callParent(arguments);

        me.mon(picker, {
            'beforerefresh': me.onBeforeListRefresh,
            scope: me
        });

        if (me.filterPickList) {
            picker.addCls('x-boxselect-hideselections');
        }

        return picker;
    },

    /**
	 * Clean up labelled items management controls
	 */
    onDestroy: function() {
        var me = this;

        Ext.destroyMembers(me, 'selectionModel', 'valueStore');

        me.callParent(arguments);
    },

    /**
	 * Overridden to avoid use of placeholder, as our main input field is often empty
	 */
    afterRender: function() {
        var me = this;

        if (Ext.supports.Placeholder && me.inputEl && me.emptyText) {
            delete me.inputEl.dom.placeholder;
        }

        me.bodyEl.applyStyles('vertical-align:top');

        if (me.grow) {
            if (Ext.isNumber(me.growMin) && (me.growMin > 0)) {
                me.listWrapper.applyStyles('min-height:'+me.growMin+'px');
            }
            if (Ext.isNumber(me.growMax) && (me.growMax > 0)) {
                me.listWrapper.applyStyles('max-height:'+me.growMax+'px');
            }
        }

        if (me.stacked === true) {
            me.itemList.addCls('x-boxselect-stacked');
        }

        me.applyMultiselectItemMarkup();

        me.callParent(arguments);
    },

    /**
	 * Overridden to search entire unfiltered store
	 */
    findRecord: function(field, value) {
        var ds = this.store,
        matches;

        if (!ds) {
            return false;
        }

        matches = ds.queryBy(function(rec, id) {
            return rec.isEqual(rec.get(field), value);
        });

        return (matches.getCount() > 0) ? matches.first() : false;
    },

    /**
	 * Overridden to map previously selected records to the "new" versions of the records
	 * based on value field, if they are part of the new store load
	 */
    onLoad: function() {
        var me = this,
        valueField = me.valueField,
        valueStore = me.valueStore,
        changed = false;

        if (valueStore) {
            if (!Ext.isEmpty(me.value) && (valueStore.getCount() == 0)) {
                me.setValue(me.value, false, true);
            }

            valueStore.suspendEvents();
            valueStore.each(function(rec) {
                var r = me.findRecord(valueField, rec.get(valueField)),
                i = r ? valueStore.indexOf(rec) : -1;
                if (i >= 0) {
                    valueStore.removeAt(i);
                    valueStore.insert(i, r);
                    changed = true;
                }
            });
            valueStore.resumeEvents();
            if (changed) {
                valueStore.fireEvent('datachanged', valueStore);
            }
        }

        me.callParent(arguments);
    },

    /**
	 * @private
	 * Used to determine if a record is filtered (for retaining as a multiSelect value)
	 */
    isFilteredRecord: function(record) {
        var me = this,
        store = me.store,
        valueField = me.valueField,
        storeRecord,
        filtered = false;

        storeRecord = store.findExact(valueField, record.get(valueField));

        filtered = ((storeRecord === -1) && (!store.snapshot || (me.findRecord(valueField, record.get(valueField)) !== false)));

        filtered = filtered || (!filtered && (storeRecord === -1) && (me.forceSelection !== true) &&
            (me.valueStore.findExact(valueField, record.get(valueField)) >= 0));

        return filtered;
    },

    /**
	 * Overridden to allow for continued querying with multiSelect selections already made
	 */
    doRawQuery: function() {
        var me = this,
        rawValue = me.inputEl.dom.value;

        if (me.multiSelect) {
            rawValue = rawValue.split(me.delimiter).pop();
        }

        this.doQuery(rawValue, false, true);
    },

    /**
	 * When the picker is refreshing, we should ignore selection changes. Otherwise
	 * the value of our field will be changing just because our view of the choices is.
	 */
    onBeforeListRefresh: function() {
        this.ignoreSelection++;
    },

    /**
	 * When the picker is refreshing, we should ignore selection changes. Otherwise
	 * the value of our field will be changing just because our view of the choices is.
	 */
    onListRefresh: function() {
        this.callParent(arguments);
        if (this.ignoreSelection > 0) {
            --this.ignoreSelection;
        }
    },

    /**
	 * Overridden to preserve current labelled items when list is filtered/paged/loaded
	 * and does not include our current value.
	 */
    onListSelectionChange: function(list, selectedRecords) {
        var me = this,
        valueStore = me.valueStore,
        mergedRecords = [],
        i;

        // Only react to selection if it is not called from setValue, and if our list is
        // expanded (ignores changes to the selection model triggered elsewhere)
        if ((me.ignoreSelection <= 0) && me.isExpanded) {
            // Pull forward records that were already selected or are now filtered out of the store
            valueStore.each(function(rec) {
                if (Ext.Array.contains(selectedRecords, rec) || me.isFilteredRecord(rec)) {
                    mergedRecords.push(rec);
                }
            });
            mergedRecords = Ext.Array.merge(mergedRecords, selectedRecords);

            i = Ext.Array.intersect(mergedRecords, valueStore.getRange()).length;
            if ((i != mergedRecords.length) || (i != me.valueStore.getCount())) {
                me.setValue(mergedRecords, false);
                if (!me.multiSelect || !me.pinList) {
                    Ext.defer(me.collapse, 1, me);
                }
                if (valueStore.getCount() > 0) {
                    me.fireEvent('select', me, valueStore.getRange());
                }
            }
            me.inputEl.focus();
            if (!me.pinList) {
                me.inputEl.dom.value = '';
            }
            if (me.selectOnFocus) {
                me.inputEl.dom.select();
            }
        }
    },

    /**
     * Overridden to use valueStore instead of valueModels, for inclusion of filtered records
     */
    syncSelection: function() {
        var me = this,
        picker = me.picker,
        valueField = me.valueField,
        pickStore, selection, selModel;

        if (picker) {
            pickStore = picker.store;

            // From the value, find the Models that are in the store's current data
            selection = [];
            if (me.valueStore) {
                me.valueStore.each(function(rec) {
                    var i = pickStore.findExact(valueField, rec.get(valueField));
                    if (i >= 0) {
                        selection.push(pickStore.getAt(i));
                    }
                });
            }

            // Update the selection to match
            me.ignoreSelection++;
            selModel = picker.getSelectionModel();
            selModel.deselectAll();
            if (selection.length > 0) {
                selModel.select(selection);
            }
            if (me.ignoreSelection > 0) {
                --me.ignoreSelection;
            }
        }
    },

    /**
	 * Overridden to align to itemList size instead of inputEl
     */
    doAlign: function(){
        var me = this,
            picker = me.picker,
            aboveSfx = '-above',
            isAbove;

        me.picker.alignTo(me.listWrapper, me.pickerAlign, me.pickerOffset);
        // add the {openCls}-above class if the picker was aligned above
        // the field due to hitting the bottom of the viewport
        isAbove = picker.el.getY() < me.inputEl.getY();
        me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
        picker[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
    },

    // Keep scroll position of suggest list
    alignPicker: function() {
        var me = this,
            picker = me.picker,
            pickerScrollPos = picker.getTargetEl().dom.scrollTop;

        me.callParent(arguments);

        if (me.isExpanded) {
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by min and max width) unless there are no records to display.
                picker.setWidth(me.listWrapper.getWidth());
            }

            picker.getTargetEl().dom.scrollTop = pickerScrollPos;
        }
    },

    /**
	 * @private
	 * Get the current cursor position in the input field
	 */
    getCursorPosition: function() {
        var cursorPos;
        if (Ext.isIE) {
            cursorPos = document.selection.createRange();
            cursorPos.collapse(true);
            cursorPos.moveStart("character", -this.inputEl.dom.value.length);
            cursorPos = cursorPos.text.length;
        } else {
            cursorPos = this.inputEl.dom.selectionStart;
        }
        return cursorPos;
    },

    /**
	 * @private
	 * Check to see if the input field has selected text
	 */
    hasSelectedText: function() {
        var sel, range;
        if (Ext.isIE) {
            sel = document.selection;
            range = sel.createRange();
            return (range.parentElement() == this.inputEl.dom);
        } else {
            return this.inputEl.dom.selectionStart != this.inputEl.dom.selectionEnd;
        }
    },

    /**
	 * Handles keyDown processing of key-based selection of labelled items
	 */
    onKeyDown: function(e, t) {
        var me = this,
        key = e.getKey(),
        rawValue = me.inputEl.dom.value,
        valueStore = me.valueStore,
        selModel = me.selectionModel,
        stopEvent = false,
        rec, i;

        if (me.readOnly || me.disabled || !me.editable) {
            return;
        }

        // Handle keyboard based navigation of selected labelled items
        if (me.isExpanded && (key == e.A && e.ctrlKey)) {
            me.select(me.getStore().getRange());
            selModel.deselectAll(true);
            me.collapse();
            me.inputEl.focus();
            stopEvent = true;
        } else if ((valueStore.getCount() > 0) &&
                ((rawValue == '') || ((me.getCursorPosition() === 0) && !me.hasSelectedText()))) {
            if ((key == e.BACKSPACE) || (key == e.DELETE)) {
                if (selModel.getCount() > 0) {
                    me.valueStore.remove(selModel.getSelection());
                } else {
                    me.valueStore.remove(me.valueStore.last());
                }
                me.setValue(me.valueStore.getRange());
                selModel.deselectAll();
                stopEvent = true;
            } else if ((key == e.RIGHT) || (key == e.LEFT)) {
                if ((selModel.getCount() === 0) && (key == e.LEFT)) {
                    selModel.select(valueStore.last());
                    stopEvent = true;
                } else if (selModel.getCount() > 0) {
                    rec = selModel.getLastFocused() || selModel.getLastSelected();
                    if (rec) {
                        i = valueStore.indexOf(rec);
                        if (key == e.RIGHT) {
                            if (i < (valueStore.getCount() - 1)) {
                                selModel.select(i + 1, e.shiftKey);
                                stopEvent = true;
                            } else if (!e.shiftKey) {
                                selModel.deselect(rec);
                                stopEvent = true;
                            }
                        } else if ((key == e.LEFT) && (i > 0)) {
                            selModel.select(i - 1, e.shiftKey);
                            stopEvent = true;
                        }
                    }
                }
            } else if (key == e.A && e.ctrlKey) {
                selModel.selectAll();
                stopEvent = e.A;
            }
            me.inputEl.focus();
        }

        if (stopEvent) {
            me.preventKeyUpEvent = stopEvent;
            e.stopEvent();
            return;
        }

        // Prevent key up processing for enter if it is being handled by the picker
        if (me.isExpanded && (key == e.ENTER) && me.picker.highlightedItem) {
            me.preventKeyUpEvent = true;
        }

        if (me.enableKeyEvents) {
            me.callParent(arguments);
        }

        if (!e.isSpecialKey() && !e.hasModifier()) {
            me.selectionModel.deselectAll();
            me.inputEl.focus();
        }
    },

    /**
	 * Handles auto-selection of labelled items based on this field's delimiter, as well
	 * as the keyUp processing of key-based selection of labelled items.
	 */
    onKeyUp: function(e, t) {
        var me = this,
        rawValue = me.inputEl.dom.value;

        if (me.preventKeyUpEvent) {
            e.stopEvent();
            if ((me.preventKeyUpEvent === true) || (e.getKey() === me.preventKeyUpEvent)) {
                delete me.preventKeyUpEvent;
            }
            return;
        }

        if (me.multiSelect && (me.delimiterRegexp && me.delimiterRegexp.test(rawValue)) ||
                ((me.createNewOnEnter === true) && e.getKey() == e.ENTER)) {
            rawValue = Ext.Array.clean(rawValue.split(me.delimiterRegexp));
            me.inputEl.dom.value = '';
            me.setValue(me.valueStore.getRange().concat(rawValue));
            me.inputEl.focus();
        }

        me.callParent([e,t]);
    },

    /**
     * Handles auto-selection of labelled items based on this field's delimiter when pasting
     * a list of values in to the field (e.g., for email addresses)
     */
    onPaste: function(e, t) {
        var me = this,
            rawValue = me.inputEl.dom.value,
            clipboard = (e && e.browserEvent && e.browserEvent.clipboardData) ? e.browserEvent.clipboardData : false;

        if (me.multiSelect && (me.delimiterRegexp && me.delimiterRegexp.test(rawValue))) {
            if (clipboard && clipboard.getData) {
                if (/text\/plain/.test(clipboard.types)) {
                    rawValue = clipboard.getData('text/plain');
                } else if (/text\/html/.test(clipboard.types)) {
                    rawValue = clipboard.getData('text/html');
                }
            }

            rawValue = Ext.Array.clean(rawValue.split(me.delimiterRegexp));
            me.inputEl.dom.value = '';
            me.setValue(me.valueStore.getRange().concat(rawValue));
            me.inputEl.focus();
        }
    },

    /**
     * Overridden to handle key navigation of pick list when list is filtered. This gets way
     */
    onExpand: function() {
        var me = this,
            keyNav = me.listKeyNav;

        me.callParent(arguments);

        if (keyNav || !me.filterPickList) {
            return;
        }
        keyNav = me.listKeyNav;
        keyNav.highlightAt = function(index) {
            var boundList = this.boundList,
                item = boundList.all.item(index),
                len = boundList.all.getCount(),
                direction;

            if (item && item.hasCls('x-boundlist-selected')) {
                if ((index == 0) || !boundList.highlightedItem || (boundList.indexOf(boundList.highlightedItem) < index)) {
                    direction = 1;
                } else {
                    direction = -1;
                }
                do {
                    index = index + direction;
                    item = boundList.all.item(index);
                } while ((index > 0) && (index < len) && item.hasCls('x-boundlist-selected'));

                if (item.hasCls('x-boundlist-selected')) {
                    return;
                }
            }

            if (item) {
                item = item.dom;
                boundList.highlightItem(item);
                boundList.getTargetEl().scrollChildIntoView(item, false);
            }
        };
    },

    /**
	 * Overridden to get and set the dom value directly for type-ahead suggestion (bypassing get/setRawValue)
	 */
    onTypeAhead: function() {
        var me = this,
        displayField = me.displayField,
        inputElDom = me.inputEl.dom,
        valueStore = me.valueStore,
        boundList = me.getPicker(),
        record, newValue, len, selStart;

        if (me.filterPickList) {
            var fn = this.createFilterFn(displayField, inputElDom.value);
            record = me.store.findBy(function(rec) {
                return ((valueStore.indexOfId(rec.getId()) === -1) && fn(rec));
            });
            record = (record === -1) ? false : me.store.getAt(record);
        } else {
            record = me.store.findRecord(displayField, inputElDom.value);
        }

        if (record) {
            newValue = record.get(displayField);
            len = newValue.length;
            selStart = inputElDom.value.length;
            boundList.highlightItem(boundList.getNode(record));
            if (selStart !== 0 && selStart !== len) {
                inputElDom.value = newValue;
                me.selectText(selStart, newValue.length);
            }
        }
    },

    /**
	 * Delegation control for selecting and removing labelled items or triggering list collapse/expansion
	 */
    onItemListClick: function(evt, el, o) {
        var me = this,
        itemEl = evt.getTarget('.x-boxselect-item'),
        closeEl = itemEl ? evt.getTarget('.x-boxselect-item-close') : false;

        if (me.readOnly || me.disabled) {
            return;
        }

        evt.stopPropagation();

        if (itemEl) {
            if (closeEl) {
                me.removeByListItemNode(itemEl);
            } else {
                me.toggleSelectionByListItemNode(itemEl, evt.shiftKey);
            }
            me.inputEl.focus();
        } else if (me.triggerOnClick) {
            me.onTriggerClick();
        }
    },

    /**
	 * Build the markup for the labelled items. Template must be built on demand due to ComboBox initComponent
	 * lifecycle for the creation of on-demand stores (to account for automatic valueField/displayField setting)
	 */
    getMultiSelectItemMarkup: function() {
        var me = this;

        if (!me.multiSelectItemTpl) {
            if (!me.labelTpl) {
                me.labelTpl = Ext.create('Ext.XTemplate',
                    '{[values.' + me.displayField + ']}'
                );
            } else if (Ext.isString(me.labelTpl)) {
                me.labelTpl = Ext.create('Ext.XTemplate', me.labelTpl);
            }

            me.multiSelectItemTpl = [
            '<tpl for=".">',
            '<li class="x-boxselect-item ',
            '<tpl if="this.isSelected(values.'+ me.valueField + ')">',
            ' selected',
            '</tpl>',
            '" qtip="{[typeof values === "string" ? values : values.' + me.displayField + ']}">' ,
            '<div class="x-boxselect-item-text">{[typeof values === "string" ? values : this.getItemLabel(values)]}</div>',
            '<div class="x-tab-close-btn x-boxselect-item-close"></div>' ,
            '</li>' ,
            '</tpl>',
            {
                compile: true,
                disableFormats: true,
                isSelected: function(value) {
                    var i = me.valueStore.findExact(me.valueField, value);
                    if (i >= 0) {
                        return me.selectionModel.isSelected(me.valueStore.getAt(i));
                    }
                },
                getItemLabel: function(values) {
                    return me.getTpl('labelTpl').apply(values);
                }
            }
            ];
        }

        return this.getTpl('multiSelectItemTpl').apply(Ext.Array.pluck(this.valueStore.getRange(), 'data'));
    },

    /**
	 * Update the labelled items rendering
	 */
    applyMultiselectItemMarkup: function() {
        var me = this,
        itemList = me.itemList,
        item;

        if (itemList) {
            while ((item = me.inputElCt.prev()) != null) {
                item.remove();
            }
            me.inputElCt.insertHtml('beforeBegin', me.getMultiSelectItemMarkup());
        }

        Ext.Function.defer(function() {
            if (me.picker && me.isExpanded) {
                me.alignPicker();
            }
            if (me.hasFocus) {
                me.inputElCt.scrollIntoView(me.listWrapper);
            }
        }, 15);
    },

    /**
	 * Returns the record from valueStore for the labelled item node
	 */
    getRecordByListItemNode: function(itemEl) {
        var me = this,
        itemIdx = 0,
        searchEl = me.itemList.dom.firstChild;

        while (searchEl && searchEl.nextSibling) {
            if (searchEl == itemEl) {
                break;
            }
            itemIdx++;
            searchEl = searchEl.nextSibling;
        }
        itemIdx = (searchEl == itemEl) ? itemIdx : false;

        if (itemIdx === false) {
            return false;
        }

        return me.valueStore.getAt(itemIdx);
    },

    /**
	 * Toggle of labelled item selection by node reference
	 */
    toggleSelectionByListItemNode: function(itemEl, keepExisting) {
        var me = this,
        rec = me.getRecordByListItemNode(itemEl);

        if (rec) {
            if (me.selectionModel.isSelected(rec)) {
                me.selectionModel.deselect(rec);
            } else {
                me.selectionModel.select(rec, keepExisting);
            }
        }
    },

    /**
	 * Removal of labelled item by node reference
	 */
    removeByListItemNode: function(itemEl) {
        var me = this,
        rec = me.getRecordByListItemNode(itemEl);

        if (rec) {
            me.valueStore.remove(rec);
            me.setValue(me.valueStore.getRange());
        }
    },

    /**
	 * Intercept calls to getRawValue to pretend there is no inputEl for rawValue handling,
	 * so that we can use inputEl for just the user input.
	 *
	 * **Note that in general, raw values are the rendered value for the input field,
	 * and therefore should not be used for comboboxes or most programmatic logic.**
	 */
    getRawValue: function() {
        var me = this,
        inputEl = me.inputEl,
        result;
        me.inputEl = false;
        result = me.callParent(arguments);
        me.inputEl = inputEl;
        return result;
    },

    /**
	 * Intercept calls to setRawValue to pretend there is no inputEl for rawValue handling,
	 * so that we can use inputEl for just the user input.
	 *
	 * **Note that in general, raw values are the rendered value for the input field,
	 * and therefore should not be used for comboboxes or most programmatic logic.**
	 */
    setRawValue: function(value) {
        var me = this,
        inputEl = me.inputEl,
        result;

        me.inputEl = false;
        result = me.callParent([value]);
        me.inputEl = inputEl;

        return result;
    },

    /**
	 * Adds a value or values to the current value of the field
	 * @param {mixed} valueMixed The value or values to add to the current value
	 */
    addValue: function(valueMixed) {
        var me = this;
        if (valueMixed) {
            me.setValue(Ext.Array.merge(me.value, Ext.Array.from(valueMixed)));
        }
    },

    /**
	 * Removes a value or values from the current value of the field
	 * @param {mixed} valueMixed The value or values to remove from the current value
	 */
    removeValue: function(valueMixed) {
        var me = this;

        if (valueMixed) {
            me.setValue(Ext.Array.difference(me.value, Ext.Array.from(valueMixed)));
        }
    },

    /**
	 * Intercept calls to setValue to use records from the valueStore when available.
	 * Unknown values (if forceSelection is true) will trigger a call to store.load
	 * once to try to retrieve those records. The list of unknown values will be
	 * submitted as the name of the valueField with values separated by the configured
	 * delimiter. This process will cause setValue to asynchronously process.
	 */
    setValue: function(value, doSelect, skipLoad) {
        var me = this,
        valueStore = me.valueStore,
        valueField = me.valueField,
        record, len, i, valueRecord, h,
        unknownValues = [];

        if (Ext.isEmpty(value)) {
            value = null;
        }
        if (Ext.isString(value) && me.multiSelect) {
            value = value.split(me.delimiter);
        }
        value = Ext.Array.from(value);

        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                valueRecord = valueStore.findExact(valueField, record);
                if (valueRecord >= 0) {
                    value[i] = valueStore.getAt(valueRecord);
                } else {
                    valueRecord = me.findRecord(valueField, record);
                    if (!valueRecord) {
                        if (me.forceSelection) {
                            unknownValues.push(record);
                        } else {
                            valueRecord = {};
                            valueRecord[me.valueField] = record;
                            valueRecord[me.displayField] = record;
                            valueRecord = new me.valueStore.model(valueRecord);
                        }
                    }
                    if (valueRecord) {
                        value[i] = valueRecord;
                    }
                }
            }
        }

        if ((skipLoad !== true) && (unknownValues.length > 0) && (me.queryMode === 'remote')) {
            var params = {};
            params[me.valueField] = unknownValues.join(me.delimiter);
            me.store.load({
                params: params,
                callback: function() {
                    if (me.itemList) {
                        me.itemList.unmask();
                    }
                    me.setValue(value, doSelect, true);
                    me.autoSize();
                }
            });
            return false;
        }

        /**
		 * For single-select boxes, use the last good (formal record) value if possible
		 */
        if (!me.multiSelect && (value.length > 0)) {
            for (i = value.length - 1; i >= 0; i--) {
                if (value[i].isModel) {
                    value = value[i];
                    break;
                }
            }
            if (Ext.isArray(value)) {
                value = value[value.length - 1];
            }
        }

        me.callParent([value, doSelect]);
    },

    /**
     * Returns the records for the field's current value
     * @return {Array} The records for the field's current value
     */
    getValueRecords: function() {
        return this.valueStore.getRange();
    },

    /**
     * Overridden to optionally allow for submitting the field as a json encoded array.
     */
    getSubmitData: function() {
        var me = this,
        val = me.callParent(arguments);

        if (me.multiSelect && me.encodeSubmitValue && val && val[me.name]) {
            val[me.name] = Ext.encode(val[me.name]);
        }

        return val;
    },

    /**
	 * Overridden to clear the input field if we are auto-setting a value as we blur.
	 */
    mimicBlur: function() {
        var me = this;

        if (me.selectOnTab && me.picker && me.picker.highlightedItem) {
            me.inputEl.dom.value = '';
        }

        me.callParent(arguments);
    },

    /**
	 * Overridden to handle partial-input selections more directly
	 */
    assertValue: function() {
        var me = this,
        rawValue = me.inputEl.dom.value,
        rec = !Ext.isEmpty(rawValue) ? me.findRecordByDisplay(rawValue) : false,
        value = false;

        if (!rec && !me.forceSelection && me.createNewOnBlur && !Ext.isEmpty(rawValue)) {
            value = rawValue;
        } else if (rec) {
            value = rec;
        }

        if (value) {
            me.addValue(value);
        }

        me.inputEl.dom.value = '';

        me.collapse();
    },

    /**
	 * Expand record values for evaluating change and fire change events for UI to respond to
	 */
    checkChange: function() {
        if (!this.suspendCheckChange && !this.isDestroyed) {
            var me = this,
            valueStore = me.valueStore,
            lastValue = me.lastValue,
            valueField = me.valueField,
            newValue = Ext.Array.map(Ext.Array.from(me.value), function(val) {
                if (val.isModel) {
                    return val.get(valueField);
                }
                return val;
            }, this).join(this.delimiter),
            isEqual = me.isEqual(newValue, lastValue);

            if (!isEqual || ((newValue.length > 0 && valueStore.getCount() < newValue.length))) {
                valueStore.suspendEvents();
                valueStore.removeAll();
                if (Ext.isArray(me.valueModels)) {
                    valueStore.add(me.valueModels);
                }
                valueStore.resumeEvents();
                valueStore.fireEvent('datachanged', valueStore);

                if (!isEqual) {
                    me.lastValue = newValue;
                    me.fireEvent('change', me, newValue, lastValue);
                    me.onChange(newValue, lastValue);
                }
            }
        }
    },

    /**
     * Overridden to be more accepting of varied value types
     */
    isEqual: function(v1, v2) {
        var fromArray = Ext.Array.from,
            valueField = this.valueField,
            i, len, t1, t2;

        v1 = fromArray(v1);
        v2 = fromArray(v2);
        len = v1.length;

        if (len !== v2.length) {
            return false;
        }

        for(i = 0; i < len; i++) {
            t1 = v1[i].isModel ? v1[i].get(valueField) : v1[i];
            t2 = v2[i].isModel ? v2[i].get(valueField) : v2[i];
            if (t1 !== t2) {
                return false;
            }
        }

        return true;
    },

    /**
	 * Overridden to use value (selection) instead of raw value and to avoid the use of placeholder
	 */
    applyEmptyText : function() {
        var me = this,
        emptyText = me.emptyText,
        inputEl, isEmpty;

        if (me.rendered && emptyText) {
            isEmpty = Ext.isEmpty(me.value) && !me.hasFocus;
            inputEl = me.inputEl;
            if (isEmpty) {
                inputEl.dom.value = emptyText;
                inputEl.addCls(me.emptyCls);
                me.listWrapper.addCls(me.emptyCls);
            } else {
                if (inputEl.dom.value === emptyText) {
                    inputEl.dom.value = '';
                }
                me.listWrapper.removeCls(me.emptyCls);
                inputEl.removeCls(me.emptyCls);
            }
            me.autoSize();
        }
    },

    /**
	 * Overridden to use inputEl instead of raw value and to avoid the use of placeholder
	 */
    preFocus : function(){
        var me = this,
        inputEl = me.inputEl,
        emptyText = me.emptyText,
        isEmpty;

        if (emptyText && inputEl.dom.value === emptyText) {
            inputEl.dom.value = '';
            isEmpty = true;
            inputEl.removeCls(me.emptyCls);
            me.listWrapper.removeCls(me.emptyCls);
        }
        if (me.selectOnFocus || isEmpty) {
            inputEl.dom.select();
        }
    },

    /**
	 * Intercept calls to onFocus to add focusCls, because the base field classes assume this should be applied to inputEl
	 */
    onFocus: function() {
        var me = this,
        focusCls = me.focusCls,
        itemList = me.itemList;

        if (focusCls && itemList) {
            itemList.addCls(focusCls);
        }

        me.callParent(arguments);
    },

    /**
	 * Intercept calls to onBlur to remove focusCls, because the base field classes assume this should be applied to inputEl
	 */
    onBlur: function() {
        var me = this,
        focusCls = me.focusCls,
        itemList = me.itemList;

        if (focusCls && itemList) {
            itemList.removeCls(focusCls);
        }

        me.callParent(arguments);
    },

    /**
	 * Intercept calls to renderActiveError to add invalidCls, because the base field classes assume this should be applied to inputEl
	 */
    renderActiveError: function() {
        var me = this,
        invalidCls = me.invalidCls,
        itemList = me.itemList,
        hasError = me.hasActiveError();

        if (invalidCls && itemList) {
            itemList[hasError ? 'addCls' : 'removeCls'](me.invalidCls + '-field');
        }

        me.callParent(arguments);
    },

    autoSize: function() {
        var me = this,
        height;

        if (me.grow && me.rendered) {
            me.autoSizing = true;
            me.updateLayout();
        }

        return me;
    },

    afterComponentLayout: function(newWidth) {
        var me = this,
            width;

        if (me.autoSizing) {
            height = me.getHeight();
            if (height !== me.lastInputHeight) {
                if (me.isExpanded) {
                    me.alignPicker();
                }
                me.fireEvent('autosize', me, height);
                me.lastInputHeight = height;
                delete me.autoSizing;
            }
        }
    }
});

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