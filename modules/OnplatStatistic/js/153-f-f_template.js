SiteApp.factory('FF_Template', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{id:0,f_template:null, f_client:null, is_inherit:true,name:null, stat:0},
                data:['iud','f_template', 'f_client', 'is_inherit','name'],
					
				load:{
                    query   : function(query){
                        query.action     = 'ask_f_template';
						if(!query.f_client)
							query.f_client=FSession.current.f_client;
						console.log(query);
                        return query;
                    },
                    item    : function(item)
                    {
                        item.pay_value_start = parseFloat(item.pay_value_start);
						item.is_inherit = (item.is_inherit == 1 ? true : false);
                        item.id = item.f_template;
                        return item;
                    },
					error:function(data){
						//console.log('ask_f_terminal: error', data);
						if(data.data.data.error && data.config.data.email)
							storage.Event('FF_Terminal:load:error', data.data.data.error );
					},
                    finally : function(data){
						//console.log('ask_f_terminal: finally', data);
                        return null;
                    }
                },
                save:{
                    query   : function(query){
						query.action     = 'iud_f_template';
						query.f_client=FSession.current.f_client;
						query.is_inherit = (query.is_inherit ? 1 : 0);
                        return query;
                    },
                    item    : function(query, data){
                    },
                    finally : function()
                    {
                        storage.Load();
                    }
                },
                create:{
                    item    : function(item) {
                        item.id = new Date();
                        return item;
                    }
                },
                signals:{
					'f_client:change': function(event, data){
                        storage.Load();
                    },
                    'session:debug:chage': function(event, data){
                        storage.Load();
                    }
                },
                garbage : null
    });
    
    return storage;
    
}]);