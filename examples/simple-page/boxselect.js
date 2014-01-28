/*

This file contains example usages of the Ext.ux.form.field.BoxSelect component, and is based on the
examples of comboboxes provided in Ext JS 4.

*/
Ext.USE_NATIVE_JSON = false;

Ext.require([
    'Ext.ux.form.field.BoxSelect'
    ]);

Ext.onReady(function() {
    /**
     * Tooltip setup to use for showing example configurations
     */
    Ext.tip.QuickTipManager.init();
    var cfgTip = Ext.create('Ext.tip.ToolTip', {
        autoHide: false,
        maxWidth: 600,
        html: 'Field Configuration:',
        renderTo: Ext.getBody()
    });
    var createShowConfigButton = function(config, fieldCmp) {
        var fieldCfg = Ext.String.htmlEncode(Ext.JSON.encodeValue(config, "\n"));
        Ext.create('Ext.Button', {
            text: 'Show Config',
            cls: 'btn-examplecfg',
            renderTo: fieldCmp.initialConfig.renderTo,
            handler: function() {
                cfgTip.update(
                    cfgTip.initialConfig.html + '<br />' +
                    '<pre>' + fieldCfg  + '</pre>'
                );
                cfgTip.showBy(fieldCmp.el, 'tl-tr?');
            }
        });
    };


    /**
     * Configuration options that are used throughout these examples, unless
     * overridden in the specific examples
     */
    var baseExampleConfig = {
        fieldLabel: 'Select multiple states',
        displayField: 'name',
        valueField: 'abbr',
        width: 500,
        labelWidth: 130,
        emptyText: 'Pick a state, any state',
        store: 'States',
        queryMode: 'local'
    };

    var addExampleSelect = function(config, renderTo) {
        var fieldCfg = Ext.applyIf(config, baseExampleConfig);
        var fieldCmp = Ext.create('Ext.ux.form.field.BoxSelect', Ext.applyIf({
            renderTo: renderTo
        }, fieldCfg));
        createShowConfigButton(fieldCfg, fieldCmp);
    }

    /**
     * Basic BoxSelect using the data store, initialized with multiple values
     */
    addExampleSelect({
        value: ['TX', 'CA']
    }, 'basicBoxselect');

    /**
     * Basic BoxSelect using the data store, initialized with a single value
     */
    addExampleSelect({
        fieldLabel: 'More States',
        value: 'WA'
    }, 'basicBoxselect');

    /**
     * Example of more advanced template configurations
     */
    addExampleSelect({
        delimiter: ', ', // Default, reiterated for showing use in concat'd value
        value: 'AZ, CA, NC',

        // Customized label display for selected values
        labelTpl: '<img src="{flagUrl}" style="height: 25px; vertical-align: middle; margin: 2px;" /> {name} ({abbr})',

        // This tpl config is part of the native ComboBox and is used to control
        // the display of the BoundList (picker), and is only included here for reference
        listConfig: {
            tpl: [
                '<ul><tpl for=".">',
                '<li role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item' + '"' +
                ' style="background-image:url({flagUrl}); background-repeat: no-repeat; background-size: 25px; padding-left: 30px;">' +
                '{name}: {slogan}</li>',
                '</tpl></ul>'
            ]
        }
    }, 'templateConfigs');

    /**
     * Example of multiSelect: false
     */
    addExampleSelect({
        fieldLabel: 'Select a state',
        multiSelect: false,
        filterPickList: true
    }, 'singleSelect');

    /**
     * Example of:
     * - Using a remote store and automatically querying for unknown values.
     * - Changing the default delimiter
     * - Initializing with multiple values via concat'd string
     * - Modifying click behavior (triggerOnClick)
     * - Modifying templates used for selected values (labelTpl)
     * - Modifying templates used for dropdown list (part of the default ComboBox behavior, listConfig.tpl)
     */
    addExampleSelect({
        fieldLabel: 'With Remote Store',

        // Remote store things
        store: 'RemoteStates',
        pageSize: 25,
        queryMode: 'remote',

        // Value delimiter examples
        delimiter: '|',
        value: 'NC|VA|ZZ',

        // Click behavior
        triggerOnClick: false,

        // Display template modifications
        labelTpl: '{name} ({abbr})',
        listConfig: {
            tpl: [
                '<ul><tpl for=".">',
                '<li role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item' + '">{name}: {slogan}</li>',
                '</tpl></ul>'
            ]
        }
    }, 'autoQuery');


    /**
     * Example of multi-select email address field using:
     * - forceSelection false to allow new entries to be added
     * - createNewOnEnter/createNewOnBlur to allow for new entries to be
     *   created for different user interactions
     * - filterPickList true to hide existing selections from the dropdown picker
     *
     * Note, does not use the baseExampleConfig from this example page.
     */
    var emails = [
    'test@example.com', 'somebody@somewhere.net', 'johnjacob@jingleheimerschmidts.org',
    'rumpelstiltskin@guessmyname.com', 'fakeaddresses@arefake.com', 'bob@thejoneses.com'
    ];
    addExampleSelect({
        fieldLabel: 'Enter multiple email addresses',
        width: 500,
        growMin: 75,
        growMax: 120,
        labelWidth: 130,
        store: emails,
        queryMode: 'local',
        forceSelection: false,
        createNewOnEnter: true,
        createNewOnBlur: true,
        filterPickList: true
    }, 'emailSuggest');


    /**
     * Example of stacked, pinList, triggerOnClick and other configuration options
     */
    addExampleSelect({
        fieldLabel: 'Select multiple states',
        displayField: 'name',
        width: 500,
        labelWidth: 130,
        store: 'States',
        queryMode: 'local',
        valueField: 'abbr',
        value: 'WA, TX',
        stacked: true,
        pinList: false,
        triggerOnClick: false,
        filterPickList: true
    }, 'otherConfigs');


    /**
     * @see boxselect-advanced.js
     */
    BoxSelectExample.renderButtonTo('valueSetting');
});