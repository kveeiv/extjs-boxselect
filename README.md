# Ext.ux.form.field.BoxSelect

This repository is for the ExtJS4 user extension featured on this post:
http://www.sencha.com/forum/showthread.php?134751-Ext.ux.form.field.BoxSelect-Intuitive-Multi-Select-ComboBox

Thanks to all those out there in the community that have contributed their patches or bug reports.

Hosted on github at https://github.com/kveeiv/extjs-boxselect


## Cmd package fork
This fork of extjs-boxselect has been reorganized by chris@jarv.us to function as a Sencha CMD package and is hosted at https://github.com/JarvusInnovations/extjs-boxselect

### Package usage
1.  Clone extjs-boxselect repository into `${workspace.dir}/packages`
2.  Add `"extjs-boxselect"` to the `"requires"` array in `${app.dir}/app.json`
3.  Add `"Ext.ux.form.field.BoxSelect"` to `requires` array at the top of any `Ext.define({...});` blocks you wish to use the `boxselect` xtype within

### Known issues
The examples are broken because the source SASS files for boxselect can no longer be included into a page without being processed by Sencha Cmd first. A proper example will need to be created that is structured as a complete ExtJS app that requires the extjs-boxselect package, but it may be kind of messy to have that contained within the package and it still won't built without a copy of the framework.
