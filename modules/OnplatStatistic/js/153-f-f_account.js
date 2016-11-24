

SiteApp.factory('FF_Account', ['SiteMeta', 'FSession', 'FF_Terminal', 'FF_Dictionaryes', function(SiteMeta, FSession, FF_Terminal, FF_Dictionaryes){

    var storage =  SiteMeta.storage({
                            
                item:{},
                data:['iud', "f_account", "c_currency", "c_acctype", "f_client", "name", "f_terminal"],
                autogarbage : false,
					
                load:{
                    query   : function(query){
                        query.action     = 'ask_f_account';
                        query.c_currency = '1';
                        /*
                        if(storage.cc==0)
                            query.c_acctype  = storage.st;
            
                        if(storage.cc==storage.st)
                            query.c_acctype  = storage.ct;
                        
                        storage.cc = query.c_acctype;*/
                        
                        delete query.f_account;
                        delete query.f_client;
                        delete query.name;
                        delete query.f_terminal;
                        
                        for(item in storage.items)
                            if(storage.items[item].c_acctype==query.c_acctype)
                                storage.items[item].garbage = true;
                        
                        //console.log('ask_f_account', storage.st,storage.ct ,query);
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_model;
                        //console.log('ask_f_account:item',item);
                        return item;
                    },
                    error:function(data){
                        //console.log('ask_f_account:error',data);
                    },
                    finally : function(data){
                        
                        /*if(storage.cc == storage.st)
                        {
                            storage.status =  'ready';
                            storage.Load();
                        }
                        if(storage.cc == storage.ct)    
                            storage.cc = 0;*/
                        
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
                        item.balance = parseFloat(item.balance);
                        return item;
                    }
                },
                signals:{
                    'FF_Dictionaryes:loaded': function(event, data){
                        storage.reload();
                    },
                    'f_client:change': function(event, data){
                        //storage.Load();
                    },
                    'session:debug:chage': function(event, data){
                        //storage.Load();
                    }
                },
                st:0,
                ct:0,
                cc:0,
                garbage : null,
                reload: function(){
                        dictionary_c_acctype = FF_Dictionaryes.dictionary('lst_system_c_acctype');
                        for(var i=0;i<dictionary_c_acctype.length;i++) 
                        {
                            if(dictionary_c_acctype[i].name.indexOf('Счёт Системы')==0)
                                storage.st = dictionary_c_acctype[i].c_acctype;
                            if(dictionary_c_acctype[i].name.indexOf('Счёт терминалов')==0)
                                storage.ct = dictionary_c_acctype[i].c_acctype;
                        }
                        storage.Load({c_acctype:[storage.st,storage.ct]});
                }
    });
    
    return storage;
    
}]);