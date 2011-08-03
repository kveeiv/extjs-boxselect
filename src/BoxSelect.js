/**
 * @class Ext.ux.form.field.BoxSelect
 * @extends Ext.form.field.ComboBox
 * 
 * BoxSelect for ExtJS 4, a combo box improved for multiple value querying, selection and management.
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
 * possible without your help. Specific thanks to 
 * 
 * @author kvee_iv http://www.sencha.com/forum/member.php?29437-kveeiv
 * @version 1.1
 * @requires BoxSelect.css
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

	// private
	fieldSubTpl: [
		'<div class="x-boxselect">',
			'<ul class="x-boxselect-list {fieldCls} {typeCls}">',
				'<li class="x-boxselect-input">',
					'<input id="{id}" type="{type}" ',
						'<tpl if="name">name="{name}" </tpl>',
						'<tpl if="size">size="{size}" </tpl>',
						'<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
						'class="x-boxselect-input-field" autocomplete="off" />',
				'</li>',
			'</ul>',
			'<div id="{cmpId}-triggerWrap" class="{triggerWrapCls}" role="presentation">',
				'{triggerEl}',
				'<div class="{clearCls}" role="presentation"></div>',
			'</div>',
		'</div>',
        {
            compiled: true,
            disableFormats: true
        }
    ],

	// private
	renderSelectors: {
		itemList: 'ul.x-boxselect-list',
		inputEl: 'input.x-boxselect-input-field',
		inputElCt: 'li.x-boxselect-input'
	},

	//private
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

		me.callParent(arguments);

		me.typeAhead = typeAhead;

		me.selectionModel = new Ext.selection.Model({
			store: me.valueStore,
			mode: 'MULTI',
			onSelectChange: function(record, isSelected, suppressEvent, commitFn) {
				commitFn();
			}
		});

		if (!Ext.isEmpty(me.delimiter) && me.multiSelect) {
			me.delimiterEndingRegexp = new RegExp(String(me.delimiter).replace(/[$%()*+.?\[\\\]{|}]/g, "\\$&") + "$");
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
		me.mon(me.itemList, 'click', me.onItemListClick, me);
		me.mon(me.selectionModel, 'selectionchange', me.applyMultiselectItemMarkup, me);
	},

	/**
	 * Create a store for the records of our current value based on the main store's model
	 */
	bindStore: function(store, initial) {
		var me = this,
			oldStore = me.store;

		if (oldStore) {
			me.mun(oldStore, 'beforeload', me.onBeforeLoad, me);
		}
		if (me.valueStore) {
			me.mun(me.valueStore, 'datachanged', me.applyMultiselectItemMarkup, me);
			me.valueStore = null;
		}

		me.callParent(arguments);

		if (me.store) {
			me.valueStore = new Ext.data.Store({
				model: me.store.model,
				proxy: {
					type: 'memory'
				}
			});
			me.mon(me.valueStore, 'datachanged', me.applyMultiselectItemMarkup, me);
			me.mon(me.store, 'beforeload', me.onBeforeLoad, me);
		}
	},

	/**
	 * Add refresh tracking to the picker for selection management
	 */
	createPicker: function() {
		var me = this,
			picker = me.callParent(arguments);

		me.mon(picker, 'beforerefresh', me.onBeforeListRefresh, me);

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

		me.callParent(arguments);

		if (me.stacked === true) {
			me.itemList.addCls('x-boxselect-stacked');
		}

		me.applyMultiselectItemMarkup();
	},

	/**
	 * Overridden to search store snapshot instead of data (if available)
	 */
	findRecord: function(field, value) {
        var ds = this.store,
			rec = false,
            idx;
				
		if (ds.snapshot) {
			idx = ds.snapshot.findIndexBy(function(rec) {return rec.get(field) === value;});
			rec = (idx !== -1) ? ds.snapshot.getAt(idx) : false;
		} else {
			idx = ds.findExact(field, value);
			rec = (idx !== -1) ? ds.getAt(idx) : false;
		}

		return rec;
    },

	/**
	 * When the picker is refreshing, we should ignore selection changes. Otherwise
	 * the value of our field will be changing just because our view of the choices is.
	 */
	onBeforeLoad: function() {
		this.ignoreSelection++;
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

		me.callParent(arguments);

		me.ignoreSelection--;
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

		this.doQuery(rawValue);

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
		this.ignoreSelection--;
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
        if (!me.ignoreSelection && me.isExpanded) {
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
				me.inputEl.focus();
			}
			me.alignPicker();
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
			me.valueStore.each(function(rec) {
				var i = pickStore.findExact(valueField, rec.get(valueField));
				if (i >= 0) {
					selection.push(pickStore.getAt(i));
				}
			});

            // Update the selection to match
            me.ignoreSelection++;
            selModel = picker.getSelectionModel();
            selModel.deselectAll();
            if (selection.length > 0) {
                selModel.select(selection);
            }
            me.ignoreSelection--;
        }
    },

	/**
	 * Overridden to align to itemList size instead of inputEl
     */
    alignPicker: function() {
        var me = this,
            picker, isAbove,
            aboveSfx = '-above',
			itemBox = me.itemList.getBox(false, true);

        if (this.isExpanded) {
            picker = me.getPicker();
			var pickerScrollPos = picker.getTargetEl().dom.scrollTop;
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by min and max width) unless there are no records to display.
                picker.setSize(itemBox.width, picker.store && picker.store.getCount() ? null : 0);
            }
            if (picker.isFloating()) {
                picker.alignTo(me.itemList, me.pickerAlign, me.pickerOffset);

                // add the {openCls}-above class if the picker was aligned above
                // the field due to hitting the bottom of the viewport
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
			if (picker.getSelectedNodes().length > 0) {
				picker.getTargetEl().scrollTo('top', pickerScrollPos);
			}
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
        if ((valueStore.getCount() > 0) && 
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
			rawValue = me.inputEl.dom.value,
			rec;

		if (me.preventKeyUpEvent) {
			e.stopEvent();
			if ((me.preventKeyUpEvent === true) || (e.getKey() === me.preventKeyUpEvent)) {
				delete me.preventKeyUpEvent;
			}
			return;
		} 

		if (me.multiSelect && (me.delimiterEndingRegexp && me.delimiterEndingRegexp.test(rawValue)) || 
				((me.createNewOnEnter === true) && e.getKey() == e.ENTER)) {
			rawValue = rawValue.replace(me.delimiterEndingRegexp, '');
			if (!Ext.isEmpty(rawValue)) {
				rec = me.valueStore.findExact(me.valueField, rawValue);
				if (rec >= 0) {
					rec = me.valueStore.getAt(rec);
				} else {
					rec = me.store.findExact(me.valueField, rawValue);
					if (rec >= 0) {
						rec = me.store.getAt(rec);
					} else {
						rec = false;
					}
				}
				if (!rec && !me.forceSelection) {
					rec = {};
					rec[me.valueField] = rawValue;
					rec[me.displayField] = rawValue;
					rec = new me.valueStore.model(rec);
				}
				if (rec) {
					me.setValue(me.valueStore.getRange().concat(rec));
					me.inputEl.dom.value = '';
					me.inputEl.focus();
				}
			}
		}

		me.callParent([e,t]);

		Ext.Function.defer(me.alignPicker, 10, me);
    },

	/**
	 * Overridden to get and set the dom value directly for type-ahead suggestion (bypassing get/setRawValue)
	 */
	onTypeAhead: function() {
        var me = this,
            displayField = me.displayField,
			inputElDom = me.inputEl.dom,
            record = me.store.findRecord(displayField, inputElDom.value),
            boundList = me.getPicker(),
            newValue, len, selStart;

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

		if (itemEl) {
			if (closeEl) {
				me.removeByListItemNode(itemEl);
			} else {
				me.toggleSelectionByListItemNode(itemEl, evt.shiftKey);
			}
			me.inputEl.focus();
		} else {
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
			me.multiSelectItemTpl = [
				'<tpl for=".">',
						'<li class="x-boxselect-item ',
						'<tpl if="this.isSelected(values.'+ me.valueField + ')">',
						' selected',
						'</tpl>',
						'" qtip="{[typeof values === "string" ? values : values.' + me.displayField + ']}">' ,
						'<div class="x-boxselect-item-text">{[typeof values === "string" ? values : values.' + me.displayField + ']}</div>',
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
			me.autoSize();
			me.alignPicker();
		}
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
					me.itemList.unmask();
					me.setValue(value, doSelect, true);
				}
			});
			return false;
		}

		/**
		 * For single-select boxes, use the last value
		 */
		if (!me.multiSelect && (value.length > 0)) {
			value = value[value.length - 1];
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
	 * Overridden to handle creation of new value for unforced selections
	 */
	beforeBlur: function() {
		var me = this;
        me.doQueryTask.cancel();
		me.assertValue();
		me.collapse();
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
	 * Update the valueStore from the new value and fire change events for UI to respond to
	 */
	checkChange: function() {
		var me = this,
			valueStore = me.valueStore;

		valueStore.suspendEvents();
		valueStore.removeAll();
		if (Ext.isArray(me.valueModels)) {
			valueStore.add(me.valueModels);
		}
		valueStore.resumeEvents();
		valueStore.fireEvent('datachanged', valueStore);

		me.callParent(arguments);
	},

	/**
	 * Overridden to use value (selection) instead of raw value and to avoid the use of placeholder
	 */
	applyEmptyText : function() {
		var me = this,
            emptyText = me.emptyText,
            isEmpty;

        if (me.rendered && emptyText) {
            isEmpty = me.value.length < 1 && !me.hasFocus;
            
            if (isEmpty) {
                me.setRawValue(emptyText);
                me.inputEl.addCls(me.emptyCls);
            }

            me.autoSize();
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

	/**
	 * Ensure inputEl is sized well for user input using the remaining horizontal space available in the list element
	 */
	autoSize: function() {
		if(!this.rendered){
            return this;
        }

		var me = this,
        	inputElCt = me.inputElCt,
			lastEntry = inputElCt.dom.previousSibling,
			itemList = me.itemList,
			listBox = itemList.getBox(true, true),
			listWidth = listBox.width, 
			newWidth = listWidth - 10,
			newHeight;

		if (lastEntry) {
			newWidth = newWidth - (lastEntry.offsetLeft + Ext.fly(lastEntry).getWidth());
		}
		
		if (newWidth < 35) {
			newWidth = listWidth - 10;
		}

		inputElCt.setWidth(newWidth + 'px');

		me.callParent(arguments);

		newHeight = itemList.getHeight();
		if (!me.lastHeight) {
			me.lastHeight = newHeight;
		} else if (me.lastHeight != newHeight) {
			me.fireEvent('autosize', newHeight);
			me.lastHeight = newHeight;
			me.alignPicker();
		}
	}
});

/**
 * Overridden to resize the field at the item list wrap instead of the inputEl
 */
Ext.define('Ext.ux.layout.component.field.BoxSelectField', {

    /* Begin Definitions */

    alias: ['layout.boxselectfield'],

    extend: 'Ext.layout.component.field.Field',

    /* End Definitions */

    type: 'boxselectfield',

    sizeBodyContents: function(width, height) {
        var me = this,
            owner = me.owner,
            itemList = owner.itemList,
            triggerWrap = owner.triggerWrap,
            triggerWidth = owner.getTriggerWidth();

        // If we or our ancestor is hidden, we can get a triggerWidth calculation
        // of 0.  We don't want to resize in this case.
        if (owner.hideTrigger || owner.readOnly || triggerWidth > 0) {
            // Decrease the field's width by the width of the triggers. Both the field and the triggerWrap
            // are floated left in CSS so they'll stack up side by side.
            me.setElementSize(itemList, Ext.isNumber(width) ? width - triggerWidth : width);
    
            // Explicitly set the triggerWrap's width, to prevent wrapping
            triggerWrap.setWidth(triggerWidth);

			owner.autoSize();
        }
    }
});