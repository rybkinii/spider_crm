

SiteApp.factory('FF_Contact', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{stat:0},
                data:['iud' , "f_contact", "f_client" , "c_contacttype" , "prefer" , "data", "prefer_loop"],
                			
                load:{
                    query   : function(query){
                        query.action     = 'ask_f_contact';
                        if(!query.f_client)
                            return null;
                        storage.f_client = query.f_client;//query.f_client=FSession.current.f_client;
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_contact;
                        item.prefer_loop = (item.prefer==1 ? true : false);
                        //console.log('FF_Contact' ,item);
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
                        
                        query.action     = 'iud_f_contact';
                        query.prefer = query.prefer_loop ? '1' : '0';
                        //query.f_client   = FSession.current.f_client;
                        //console.log('iud_f_contact:query',query);
                        return query;
                    },
                    item    : function(query, data){
                        //console.log('iud_f_contact:item',data);
                    },
                    finally : function()
                    {
                        storage.Load({f_client:storage.f_client});
                    }
                },
                create:{
                    item    : function(item) {
                        //item.id = new Date();
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