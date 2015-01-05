/**
 * This example app performs a full CRUD lifecycle of a user story.
 */
Ext.define('Rally.gettingstarted.DataModels', {
    extend: 'Rally.app.App',
    
    /**
     * The app execution entry point
     * _getStoryModel should be called here
     */
    launch: function() {
        this._getStoryModel();
    },

    /**
     * Use Rally.data.ModelFactory to retrieve the story data model.
     * When complete, call _createStory
     */
    _getStoryModel: function() {
        console.log('retrieving data model...');
        Rally.data.ModelFactory.getModel({
            type: 'UserStory',
            success: this._createStory,  //Uncaught TypeError: Cannot read property 'substring' of undefined if used perens this._createStory()
            scope: this
        });
    },

    /**
     * Create a new user story and persist it to the server.
     * The model's save method should be useful here.
     * When complete, call _readStory
     */
    _createStory: function(model) {
         var newStory = Ext.create(model,{
             Name:'some appsdk2 story'
         });
        console.log('creating a new story...') ;
        newStory.save({
            callback: this._readStory,
            scope: this
        })
    },

    /**
     * Read the record you just created.
     * The model's load method should be useful here.
     * When complete call _printStory
     */
    _readStory: function(story, operation) {
        if(operation.wasSuccessful()){
            console.log('created story successfully...\nreading the story...') ;
            var model = story.self;
            //model's load method:   https://help.rallydev.com/apps/2.0rc3/doc/#!/api/Rally.domain.WsapiModel-static-method-load
            //Asynchronously load a model instance by id
            model.load(story.getId(),{        //http://help.rallydev.com/apps/2.0rc3/doc/#!/api/Ext.data.Model-method-getId
                fetch: ['FormattedID','PlanEstimate'] ,
                callback: this._printStory,
                scope: this
            })
        }


    },

    /**
     * Print the story's FormattedID to the console.
     * The model's get method should be useful here.
     * Hint: did you remember to fetch FormattedID in _readStory?
     * Call _updateStory when done.
     */
    _printStory: function(story, operation) {
          if(operation.wasSuccessful()){
              console.log('FormattedID', story.get('FormattedID')) ;
              this._updateStory(story);
          }
    },

    /**
     * Set the story's PlanEstimate to 5.
     * The model's set and save methods should be useful here.
     * When complete call _deleteStory
     */
    _updateStory: function(story) {
        story.set('PlanEstimate', 5);
        console.log('updating story...');
        story.save({
            callback: this._displayStory,
            scope: this
        })
    },

    _displayStory:function(story,operation) {
        if(operation.wasSuccessful()){
           this.add({
               xtype: 'component',
               id: 'story-info',
               itemId: 'story-info',
               html:  'FormattedID: ' + story.get('FormattedID') + ' PlanEstimate: ' + story.get('PlanEstimate')
           });
           this._deleteStory(story);
        }
    },

    /**
     * Delete the story.
     * The model's destroy method should be useful here.
     * When complete console.log a success message.
     */
    _deleteStory: function(story) {
            console.log('deleting story...');
            story.destroy({
                callback: this._done,
                scope: this
            });
    },

    _done:function(story, operation){
        if(operation.wasSuccessful()){
            if(this.down('#story-info')) {
                Ext.getCmp('story-info').update('story is deleted');
            }
            console.log('done!')
        }

    }
});
