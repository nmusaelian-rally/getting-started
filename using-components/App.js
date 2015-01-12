/**
 * This example introduces the concept of configuring and
 * adding components to an app and connecting them with events.
 */
Ext.define('Rally.gettingstarted.UsingComponents', {
    extend: 'Rally.app.App',
    
    /**
     * The app execution entry point
     */
    launch: function() {
        //Add a combobox displaying the available
        //defect priorities.  Wire up event listeners for
        //when the combobox is initially loaded and when
        //its value changes
        this.add({
            xtype: 'rallyfieldvaluecombobox',
            itemId: 'priorityCombobox',
            fieldLabel: 'Filter by Priority:',
            model: 'Defect',
            field: 'Priority',
            context: this.getContext().getDataContext(),  //returns obj containing workspace, proj, projectScopeUp and projectScopeDown properties
            listeners: {
                ready: this._onLoad,
                select:this._onSelect,
                scope: this
            }
        });
    },

    /**
     * Once the priority combobox has been loaded
     * add a grid of defects for the selected priority
     */
    _onLoad: function() {
        this.add({
            xtype: 'rallygrid',
            columnCfgs: [
                'Name',
                'FormattedID',
                'Priority',
                'Severity'
            ],
            context: this.getContext(),
            storeConfig:{
                model: 'Defect',
                filters:[this._getPriorityFilter()]
            }
        });
    },

    /**
     * Refresh the grid when the combobox changes value
     */
    _onSelect: function() {
        var grid = this.down('rallygrid') ;
        var store = grid.getStore();
        store.clearFilter(true);
        store.filter(this._getPriorityFilter());
    } ,
    _getPriorityFilter: function() {
        return {
            property: 'Priority',
            operator: '=',
            value:  this.down('#priorityCombobox').getValue()
        };
    }
});
