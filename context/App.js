/**
 * This example explores the app context object and
 * displays select information from it using simple components.
 */
Ext.define('Rally.gettingstarted.Context', {
    extend: 'Rally.app.App',
    
    /**
     * The app execution entry point
     */
    launch: function() {
        var context = this.getContext();
        console.log(context);
        //Display the current workspace name
        this._displayContextValue(context.getWorkspace().Name); //no need for more verbose _refObjectName

        //Display the current project name
        this._displayContextValue(context.getProject().Name);

        //Display the current user's name
        this._displayContextValue(context.getUser().UserName); //no need for more verbose _refObjectName

        //Display the current subscription type
        this._displayContextValue(context.getSubscription().SubscriptionType); //Unlimited

        //Display the current workspace's datetime format
        var workspaceConfig =  context.getWorkspace().WorkspaceConfiguration;
        this._displayContextValue(workspaceConfig.DateTimeFormat); //yyyy-MM-dd hh:mm:ss a

        //Display the current user's profile datetime format
        var userProfile =  context.getUser().UserProfile;
        var timeZone = userProfile.TimeZone || workspaceConfig.TimeZone;
        this._displayContextValue(timeZone);   //America/Denver

        //Display the current user's permission level
        //Sub Admin? Workspace Admin? Project Admin? Project Editor? Project Viewer?
        var permissions = context.getPermissions();
        console.log(permissions);

        if(permissions.isSubscriptionAdmin()) {
            this._displayContextValue("sub admin");
        }
        else if(permissions.isWorkspaceAdmin(context.getWorkspace())){
            this._displayContextValue("workspace admin");
        }
        else if(permissions.isProjectAdmin(context.getProject())){
            this._displayContextValue("project admin");
        }
        else if(permissions.isProjectEditor(context.getProject())){
            this._displayContextValue("project editor");
        }
        else{
            this._displayContextValue("project viewer");
        }



        //Is the global project scoping the same as this context's project scoping?

        var globalContext = context.getGlobalContext();
        var globalProjectRef =  Rally.util.Ref.getRelativeUri(globalContext.getProject());
        //var appProjectRef = Rally.util.Ref.getRelativeUri(context.getProject());
        //console.log(globalProjectRef, appProjectRef); //it does not matter where in Rally the same user is currently logged in.
        /*
        per http://help.rallydev.com/apps/2.0rc3/doc/#!/guide/context:
         getGlobalContext - The global page context. Usually the same, but may be different if the app is scoped to a specific project.
        */

        var otherProjectRef = '/project/14686098099'; //first Project-SDK2

        var newContext = Ext.create(Rally.app.Context, {
               initialValues: {
                   project: otherProjectRef
               }
        });
        this.setContext(newContext);
        context = this.getContext();
        console.log(context.getProject());
        console.log(globalContext.getProject()); //returns obj


        var same = globalProjectRef === Rally.util.Ref.getRelativeUri(context.getProject());
        if(same) {
            this._displayContextValue('Global project ' + globalProjectRef + ' is the same as app project ' + context.getProject());
        }
        else{
            this._displayContextValue('Global project ' + globalProjectRef + ' is different from app project scope ' + context.getProject());
        }


        //Is there a timebox scope specified (iteration or release)?
        var timebox = context.getTimeboxScope();
        var type = timebox && timebox.getType();
        var record = timebox && timebox.getRecord();
        if(timebox){
            this._displayContextValue(type + ' selected ' + (record ? record.get('Name') : 'unscheduled'));  //use a pair of perens around ternary operator
        }
        else{
            this._displayContextValue('no timebox');
        }

    },

    /**
     * A helper function that will display
     * the specified value in the app.
     */
    _displayContextValue: function(value) {
        this.add({
            xtype: 'component',
            html: value
        });
    }
});
