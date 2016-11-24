SiteApp.factory('FF_Dictionaryes', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{id:'0', email:null, passwd: null},
                data:['iud','id','email','passwd', 'clientgroup', 'debug_mode', 'descr', 'error', 'session'],
				
				// i_session_name i_f_terminal
				// level f_service f_s_f_service is_catalog image_id name fullnameitin contract support c_provider c_taxtype pay_min_value pay_max_value tax_min_perc tax_def_perc tax_max_perc tax_min_amount tax_def_amount tax_max_amount regions dt_start l_termserviceblock l_terminaltemplate f_template
				
				load:{
                    query   : function(query){
                        query.action     = 'ask_f_dictionaryes';
						//console.log('ask_f_dictionaryes:query',query);
                        return query;
                    },
                    item    : function(item)
                    {
                        //console.log('ask_f_dictionaryes:item',item);
					//	console.log('dict: item', item);
                        return item;
                    },
					error:function(data){
						//console.log('ask_f_dictionaryes: error', data);
						if(data.data.data.error && data.config.data.email)
							storage.Event('FF_Terminal:load:error', data.data.data.error );
					},
                    finally : function(data){
						console.log('ask_f_dictionaryes: finally', data);
                        storage.Event('FF_Dictionaryes:loaded');
                        return null;
                    }
                },
                save:{
                    query   : function(query){
						query.action     = 'get_f_client_logout';
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
                        return item;
                    }
                },
                signals:{
                    'login:change': function(event, data){
                        storage.Load();
                    },
                    'session:debug:chage': function(event, data){
                        storage.Load();
                    }
                },
				dictionary:function(name)
				{
					var list = Array();
					for(var i=0;i<storage.items.length;i++)
					{
						//console.log(name,storage.items[i]);						
						if(storage.items[i]['dictionary']==name)
						{
							list.push(storage.items[i]);
						}
					}
					return list;
				},
                garbage : null
    });
    
    return storage;
    
}]);