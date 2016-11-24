SiteApp.factory('FF_Client', ['SiteMeta', 'FSession','FF_Dictionaryes', function(SiteMeta, FSession, FF_Dictionaryes){

    var storage =  SiteMeta.storage({
                            
                item:{},
                data:['iud','id','f_client','c_clientjur','c_clientgroup','name1','name2','name3','descr','sex','birthday','timezone','email','passwd','debug_mode','stat', 'ask_f_clientextra'],
				
                load:{
                    query   : function(query){
                        query.action     = 'ask_f_client';
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_client;

                        if(FSession.current.descr == item.descr)
                        { 
                                FSession.current.f_client = item.f_client;
                                storage.Event('f_client:change' );
                        }
                        //console.log('ask_f_client', item);
                        //console.log('FF_Client:load:item',item);
                        return item;
                    },
                    error:function(data){
                            if(data.data.data.error && data.config.data.email)
                                    storage.Event('FF_Client:load:error', data.data.data.error );
                    },
                    finally : function(data){
                        storage.Recalc();
                        storage.Event('FF_Client:loaded', data );
                        //if(storage.items.length==1)
                            //storage.Param('edititem').value = storage.items[0].id;
                        return null;
                    }
                },                
                save:{
                    query   : function(query){
                        
                        <?php if(in_array($clientgroup,array("Архитектор"))): ?>
                            query.admin     = 'hello world!';
                        <?php endif; ?>
                        
                        query.action     = 'iud_f_client';
                        if(query.birthday)
                                if(query.birthday.format)
                                        query.birthday = query.birthday.format("dd-mm-yyyy");
                        
                        if(query.c_clientgroup=='0' || query.c_clientgroup==0 || query.c_clientgroup==null)
                                delete query.c_clientgroup;
                                
                        var arr = [];
                        for(var e =0;e<query.ask_f_clientextra.data.length;e++)
                        {   
                            if(query.ask_f_clientextra.data[e].iud!=0 && query.ask_f_clientextra.data[e].stat==0)
                            {
                                if(query.ask_f_clientextra.data[e].value_dec==0 || query.ask_f_clientextra.data[e].value_dec==null)
                                    delete query.ask_f_clientextra.data[e].value_dec;
                                arr.push(query.ask_f_clientextra.data[e]) ;
                            }
                        }
                        query.ask_f_clientextra.data = arr;
                        
                        
                        return query;
                    },
                    item    : function(query, data){
                    },
                    finally : function(data)
                    {
                        storage.Load();
                    }
                },
                
                
                create:{
                    item    : function(item) {
                        item.ask_f_clientextra = {data:[]};
                        return item;
                    }
                },
                signals:{
                    'FF_Dictionaryes:loaded': function(event, data){
                        storage.Recalc();
                    },
                    'login:change': function(event, data){
                        storage.Load();
                    },
                    'session:debug:chage': function(event, data){
                        storage.Load();
                    }
                },
                garbage : null,
                Recalc : function(){
                    //return;
                    var dictionary = FF_Dictionaryes.dictionary('lst_system_c_extratype');
                    for(var i =0;i<storage.items.length;i++)
                    {
                        for(var d =0;d<dictionary.length;d++)
                        {
                            var finded = false;
                            for(var e =0;e<storage.items[i].ask_f_clientextra.data.length;e++)
                                if(dictionary[d].c_extratype==storage.items[i].ask_f_clientextra.data[e].c_extratype && storage.items[i].ask_f_clientextra.data[e].stat==0)
                                        finded = storage.items[i].ask_f_clientextra.data[e];

                            if(finded)
                            {
                                finded.iud = 0;
                                finded.id = finded.f_clientextra;                                
                            }else
                            {
                                storage.items[i].ask_f_clientextra.data.push({
                                    id:new Date(),
                                    iud:1,
                                    f_clientextra:0,
                                    f_client:storage.items[i].f_client,
                                    c_extratype:dictionary[d].c_extratype,
                                    c_datatype:dictionary[d].c_datatype,
                                    value_dec:null,
                                    stat:0,
                                    value_char:null,
                                    value_time:'2016-01-01 01:01:01',
                                });
                            }
                        }
                    }    
                    //console.log('Recalc',storage.items);
                }
    });
    
    return storage;
    
}]);