/*

This file contains example usages of the Ext.ux.form.field.BoxSelect component, and is based on the 
examples of comboboxes provided in Ext JS 4.

*/
Ext.require([
    'Ext.ux.form.field.BoxSelect'
]);

Ext.onReady(function() {
    Ext.tip.QuickTipManager.init();

    // Define the model for a State
    Ext.define('State', {
        extend: 'Ext.data.Model',
        fields: [
            {type: 'string', name: 'abbr'},
            {type: 'string', name: 'name'},
            {type: 'string', name: 'slogan'}
        ]
    });

    // The data for all states
    var states = [
        {"abbr":"AL","name":"Alabama","slogan":"The Heart of Dixie"},
        {"abbr":"AK","name":"Alaska","slogan":"The Land of the Midnight Sun"},
        {"abbr":"AZ","name":"Arizona","slogan":"The Grand Canyon State"},
        {"abbr":"AR","name":"Arkansas","slogan":"The Natural State"},
        {"abbr":"CA","name":"California","slogan":"The Golden State"},
        {"abbr":"CO","name":"Colorado","slogan":"The Mountain State"},
        {"abbr":"CT","name":"Connecticut","slogan":"The Constitution State"},
        {"abbr":"DE","name":"Delaware","slogan":"The First State"},
        {"abbr":"DC","name":"District of Columbia","slogan":"The Nation's Capital"},
        {"abbr":"FL","name":"Florida","slogan":"The Sunshine State"},
        {"abbr":"GA","name":"Georgia","slogan":"The Peach State"},
        {"abbr":"HI","name":"Hawaii","slogan":"The Aloha State"},
        {"abbr":"ID","name":"Idaho","slogan":"Famous Potatoes"},
        {"abbr":"IL","name":"Illinois","slogan":"The Prairie State"},
        {"abbr":"IN","name":"Indiana","slogan":"The Hospitality State"},
        {"abbr":"IA","name":"Iowa","slogan":"The Corn State"},
        {"abbr":"KS","name":"Kansas","slogan":"The Sunflower State"},
        {"abbr":"KY","name":"Kentucky","slogan":"The Bluegrass State"},
        {"abbr":"LA","name":"Louisiana","slogan":"The Bayou State"},
        {"abbr":"ME","name":"Maine","slogan":"The Pine Tree State"},
        {"abbr":"MD","name":"Maryland","slogan":"Chesapeake State"},
        {"abbr":"MA","name":"Massachusetts","slogan":"The Spirit of America"},
        {"abbr":"MI","name":"Michigan","slogan":"Great Lakes State"},
        {"abbr":"MN","name":"Minnesota","slogan":"North Star State"},
        {"abbr":"MS","name":"Mississippi","slogan":"Magnolia State"},
        {"abbr":"MO","name":"Missouri","slogan":"Show Me State"},
        {"abbr":"MT","name":"Montana","slogan":"Big Sky Country"},
        {"abbr":"NE","name":"Nebraska","slogan":"Beef State"},
        {"abbr":"NV","name":"Nevada","slogan":"Silver State"},
        {"abbr":"NH","name":"New Hampshire","slogan":"Granite State"},
        {"abbr":"NJ","name":"New Jersey","slogan":"Garden State"},
        {"abbr":"NM","name":"New Mexico","slogan":"Land of Enchantment"},
        {"abbr":"NY","name":"New York","slogan":"Empire State"},
        {"abbr":"NC","name":"North Carolina","slogan":"First in Freedom"},
        {"abbr":"ND","name":"North Dakota","slogan":"Peace Garden State"},
        {"abbr":"OH","name":"Ohio","slogan":"The Heart of it All"},
        {"abbr":"OK","name":"Oklahoma","slogan":"Oklahoma is OK"},
        {"abbr":"OR","name":"Oregon","slogan":"Pacific Wonderland"},
        {"abbr":"PA","name":"Pennsylvania","slogan":"Keystone State"},
        {"abbr":"RI","name":"Rhode Island","slogan":"Ocean State"},
        {"abbr":"SC","name":"South Carolina","slogan":"Nothing Could be Finer"},
        {"abbr":"SD","name":"South Dakota","slogan":"Great Faces, Great Places"},
        {"abbr":"TN","name":"Tennessee","slogan":"Volunteer State"},
        {"abbr":"TX","name":"Texas","slogan":"Lone Star State"},
        {"abbr":"UT","name":"Utah","slogan":"Salt Lake State"},
        {"abbr":"VT","name":"Vermont","slogan":"Green Mountain State"},
        {"abbr":"VA","name":"Virginia","slogan":"Mother of States"},
        {"abbr":"WA","name":"Washington","slogan":"Green Tree State"},
        {"abbr":"WV","name":"West Virginia","slogan":"Mountain State"},
        {"abbr":"WI","name":"Wisconsin","slogan":"America's Dairyland"},
        {"abbr":"WY","name":"Wyoming","slogan":"Like No Place on Earth"}
    ];

    var statesStore = Ext.create('Ext.data.Store', {
        model: 'State',
        data: states
    });

    // Basic BoxSelect using the data store
    var basicBoxselect = Ext.create('Ext.ux.form.field.BoxSelect', {
        fieldLabel: 'Select multiple states',
        renderTo: 'basicBoxselect',
        displayField: 'name',
        width: 500,
        labelWidth: 130,
        store: statesStore,
        queryMode: 'local',
		valueField: 'abbr',
		value: 'WA, TX'
    });

	var emails = [
		'test@example.com', 'somebody@somewhere.net', 'johnjacob@jingleheimerschmidts.org',
		'rumpelstiltskin@guessmyname.com', 'fakeaddresses@arefake.com', 'bob@thejoneses.com'
	];

	var emailSuggest = Ext.create('Ext.ux.form.field.BoxSelect', {
		fieldLabel: 'Enter multiple email addresses',
		renderTo: 'emailSuggest',
		width: 500,
		labelWidth: 130,
		store: emails,
		queryMode: 'local',
		forceSelection: false,
		createNewOnEnter: true
	});

    var singleSelect = Ext.create('Ext.ux.form.field.BoxSelect', {
        fieldLabel: 'Select a state',
        renderTo: 'singleSelect',
        displayField: 'name',
		multiSelect: false,
        width: 500,
        labelWidth: 130,
        store: statesStore,
        queryMode: 'local',
		value: 'CA',
		valueField: 'abbr'
    });

    var stackedView = Ext.create('Ext.ux.form.field.BoxSelect', {
        fieldLabel: 'Select multiple states',
        renderTo: 'stackedSelect',
        displayField: 'name',
        width: 500,
        labelWidth: 130,
        store: statesStore,
        queryMode: 'local',
		valueField: 'abbr',
		value: 'WA, TX',
		stacked: true,
		pinList: false
    });

	

});