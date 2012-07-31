/**
 * Example of value setting, retrieving and value events, and layout managed height.
 *
 * ** WARNING **
 * This example contains overnesting and poor design in order to provide edge use-cases for testing.
 * Additionally, it is not intended to be copy and pasted directly as best practices. In many cases, this
 * attempts to use some of the worst practices in order to ensure its stability in such scenarios.
 * ** WARNING **
 */
BoxSelectExample = {
    renderButtonTo: function(renderTo) {
        Ext.create('Ext.Button', {
            text: 'Open Example Window',
            renderTo: renderTo,
            handler: BoxSelectExample.openWindow,
            scope: this
        });
    },
    getFieldListeners: function() {
        return {
            'change': function(field, newValue, oldValue) {
                this.addMessage(field, 'change',
                    'New value is "' + (newValue ? newValue : '') + '" ' +
                    '(Old was "' + (oldValue ? oldValue : '') + '") ' +
                    field.getValueRecords().length + ' records selected.');
            },
            'select': function(field, records) {
                this.addMessage(field, 'select',
                    records.length + ' records selected.');
            },
            'valueselectionchange': function(field, records) {
                this.addMessage(field, 'valueselectionchange',
                    records.length + ' records selected.');
            },
            'valuefocuschange': function(field, oldFocused, newFocused) {
                var newHighlightValue = newFocused ? newFocused.get(field.valueField) : '',
                oldHighlightValue = oldFocused ? oldFocused.get(field.valueField) : '';

                this.addMessage(field, 'valuefocuschange',
                    'New highlight is "' + newHighlightValue + '" ' +
                    '(Old was "' + oldHighlightValue + '")');
            },
            scope: this
        };
    },
    openWindow: function() {
        this.exampleWindow = Ext.create('Ext.window.Window', {
            title: 'Ext.ux.form.field.BoxSelect Value and Event Management',
            width: 700,
            height: 500,
            modal: true,
            bodyPadding: 5,
            bodyStyle: 'background: #666 !important;',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'form',
                title: 'Example Form',
                width: '40%',
                border: true,
                layout: {
                    type: 'accordion',
                    multi: true
                },
                defaultType: 'panel',
                defaults: {
                    layout: 'fit',
                    bodyPadding: 5
                },
                items: [{
                    title: 'Primary States',
                    items: [{
                        xtype: 'boxselect',
                        itemId: 'PrimaryStates',
                        name: 'PrimaryStates',
                        fieldLabel: 'Select Multiple States',
                        store: 'States',
                        queryMode: 'local',
                        valueField: 'abbr',
                        displayField: 'name',
                        delimiter: '|',
                        value: 'CA|NY',
                        emptyText: 'At least one state must be specified as primary.',
                        allowBlank: false,
                        listeners: this.getFieldListeners()
                    }],
                    bbar: [{
                        text: 'Set NJ',
                        handler: function() {
                            this.exampleWindow.down('#PrimaryStates').setValue('NJ');
                        },
                        scope: this
                    },{
                        text: 'Add VA',
                        handler: function() {
                            this.exampleWindow.down('#PrimaryStates').addValue('VA');
                        },
                        scope: this
                    },{
                        text: 'Remove CA',
                        handler: function() {
                            this.exampleWindow.down('#PrimaryStates').removeValue('CA');
                        },
                        scope: this
                    }]
                },{
                    title: 'Backup States (Optional)',
                    collapsed: true,
                    items: [{
                        xtype: 'boxselect',
                        name: 'BackupStates',
                        fieldLabel: 'Select Multiple States',
                        queryMode: 'local',
                        valueField: 'abbr',
                        displayField: 'name',
                        delimiter: '|',
                        store: 'States',
                        emptyText: 'If there are backup states, you may specify them here.',
                        listeners: this.getFieldListeners()
                    }]
                }],
                buttons: [{
                    text: 'Reset',
                    handler: function() {
                        this.up('form').getForm().reset();
                    }
                },{
                    text: 'What Would Submit?',
                    formBind: true,
                    disabled: true,
                    handler: function(btn) {
                        var form = btn.up('form').getForm();
                        if (form.isValid()) {
                            this.addMessage('Form', 'URL Encoded Submit Values', form.getValues(true));
                            this.addMessage('Form', 'JSON Object Submit Values', Ext.encode(form.getValues(), true));
                        }
                    },
                    scope: this
                }]
            },{
                xtype: 'panel',
                width: '60%',
                margin: '0 0 0 4',
                bodyPadding: 4,
                layout: 'fit',
                items: [{
                    xtype: 'component',
                    itemId: 'eventMessages',
                    overflowY: 'scroll',
                    cls: 'eventmessagebox',
                    autoEl: {
                        tag: 'div',
                        html: 'BoxSelect Messages:'
                    }
                }]
            }]
        });
        this.exampleWindow.show();
        if (this._msgs) {
            Ext.Array.each(this._msgs, function(msgCfg) {
                this.addMessage(msgCfg[0], msgCfg[1], msgCfg[2]);
            }, this);
            delete this._msgs;
        }
    },
    addMessage: function(fromField, msgType, msg) {
        if (this.exampleWindow) {
            var msgBlock = this.exampleWindow.down('#eventMessages');

            var newMsg = '[' + Ext.Date.format(new Date(), "g:i:s A ") + '] ';

            newMsg += '[<i>' + (fromField.name ? fromField.name : fromField) + '</i> fired <b>' + msgType + '</b>]<br />' + msg;

            msgBlock.update(msgBlock.el.dom.innerHTML + '<hr />' + newMsg);
            msgBlock.el.scroll('down', msgBlock.el.dom.scrollHeight);
        } else {
            if (!this._msgs) {
                this._msgs = [];
            }
            this._msgs.push([fromField, msgType, msg]);
        }
    }
};