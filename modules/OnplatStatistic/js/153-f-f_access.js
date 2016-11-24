

SiteApp.factory('FF_Access', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{id:0,f_template:null, f_client:null, is_inherit:null,name:null, stat:0},
                data:['iud', "f_access" , "f_client" , "name" , "login" , "passwd"],
				 
					
                load:{
                    query   : function(query){
                        query.action     = 'ask_f_access';
                        if(!query.f_client)
                            return null
                        //query.f_client=FSession.current.f_client;
                        storage.f_client   = query.f_client;
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_access;
                        //console.log('FF_Access' ,item);
                        return item;
                    },
                    error:function(data){
                        //console.log('FF_Access' ,data);
                            if(data.data.data.error && data.config.data.email)
                                    storage.Event('FF_Terminal:load:error', data.data.data.error );
                    },
                    finally : function(data){
                        //console.log('FF_Access' ,data);
                        return null;
                    }
                },
                save:{
                    query   : function(query){
                        query.action     = 'iud_f_access';
                        //storage.f_client   = FSession.current.f_client;
                        query.f_client = storage.f_client;
                        return query;
                    },
                    item    : function(query, data){
                    },
                    finally : function()
                    {
                        storage.Load({f_client:storage.f_client});
                    }
                },
                create:{
                    item    : function(item) {
                        item.id = new Date();
                        return item;
                    }
                },
                signals:{
                    'FF_Client:edititem:change': function(event, data){
                        storage.Load({f_client:data});
                    },
                    'f_client:change': function(event, data){
                        //storage.Load();
                    },
                    'session:debug:chage': function(event, data){
                        storage.Load();
                    }
                },
                garbage : null
    });
    
    return storage;
    
}]);