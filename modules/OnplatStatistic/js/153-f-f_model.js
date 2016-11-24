

SiteApp.factory('FF_Model', ['SiteMeta', 'FSession', 'FF_Terminal', 'FF_Dictionaryes',function(SiteMeta, FSession, FF_Terminal, FF_Dictionaryes){

    var storage =  SiteMeta.storage({
                            
                item:{},
                data:['iud', "f_access" , "c_paytype", "c_acctype_dt", "c_acctype_ct", "f_client"],

					
                load:{
                    query   : function(query){
                        query.action     = 'ask_f_model';
                        //console.log('ask_f_model',query);
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_model;
                        //console.log('ask_f_model:item',item);
                        return item;
                    },
                    error:function(data){
                        //console.log('ask_f_model:error',data);
                    },
                    finally : function(data){
                        storage.Event('model:change');
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
                    'FF_Dictionaryes:loaded': function(event, data){
                        
                        var jj=0;
                        var dict = FF_Dictionaryes.dictionary('lst_system_c_paytype');
                        for(var i=0;i<dict.length;i++)
                        {
                            if(dict[i].name=='Пополнение счёта терминала')
                                jj= dict[i].c_paytype;
                        }
                        var mod = {f_client:data,c_paytype:jj};
                        if(!mod.f_client)
                            mod.f_client = FSession.current.f_client;
                        //console.log('catch!!!!!!!',mod,FSession);    
                        storage.Load(mod);
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