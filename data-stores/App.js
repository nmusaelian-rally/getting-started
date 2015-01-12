/**
 * This example uses stores to read items from WSAPI
 */
Ext.define('Rally.gettingstarted.DataStores', {
    extend: 'Rally.app.App',
    
    /**
     * The app execution entry point
     */
    launch: function() {
        this._loadStories();
    },

    /**
     * Create a store to load unaccepted stories that
     * have at least one defect associated to it.  The data should be loaded
     * using the current project scoping.  Call _onStoriesLoaded on successful load.
     */
    _loadStories: function() {
        Ext.create('Rally.data.wsapi.Store', {
           model:'UserStory',
           filters:[
               {
                   property: 'ScheduleState',
                   operator: '<',
                   value: 'Accepted'
               },
               {
                   property: 'Defects.ObjectID',
                   operator: '!=',
                   value: null
               }
           ],
            autoLoad: true,
            fetch: ['Name','FormattedID','Defects'],
            listeners: {
                load: this._onStoriesLoaded,
                scope: this
            }
        });
    },
    _onStoriesLoaded: function(store, records, success) {
        var that = this;
        if(success && store.getCount()>0) {
            _.each(records, function(story){
                var defectStore = story.getCollection('Defects', {fetch:['FormattedID','Name', 'Requirement']});
                defectStore.load({
                    callback: that._onDefectsLoaded
                });
            });
        }
    },

    /**
     * Print the associated defects to the console in FormattedID: Name format.
     */
    _onDefectsLoaded: function(records, operation, success) {
        console.log('--------------------');
        _.each(records, function(defect){
            console.log(defect.get('FormattedID'), defect.get('Name'), 'of story ', defect.get('Requirement').FormattedID);
        });
    }
});