SiteApp.factory('FF_OperatorsInterval', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{id:'0', email:null, passwd: null},
                data:['iud','id','iud','f_operators_interval','f_service'],
				
				// i_session_name i_f_terminal
				// level f_service f_s_f_service is_catalog image_id name fullnameitin contract support c_provider c_taxtype pay_min_value pay_max_value tax_min_perc tax_def_perc tax_max_perc tax_min_amount tax_def_amount tax_max_amount regions dt_start l_termserviceblock l_terminaltemplate f_template
				
				load:{
                    query   : function(query){
                        query.action     = 'ask_f_operators_interval';
						if(!query.terminal)
							delete query.terminal;						
						console.log('ask_f_operators_interval', query);
                        return query;
                    },
                    item    : function(item)
                    {
						item.id = item.f_operators_interval;
						//console.log('ask_f_operators_interval: item', item);
                        return item;
                    },
					error:function(data){
						//console.log('ask_f_terminal: error', data);
						if(data.data.data.error && data.config.data.email)
							storage.Event('FF_Terminal:load:error', data.data.data.error );
					},
                    finally : function(data){
						//console.log('ask_f_operators_interval: finally', data);
                        return null;
                    }
                },
                save:{
                    query   : function(query){
						query.action     = 'iud_f_operators_interval';
						if(query.f_service==0 || query.f_service=='0')
						{
							delete query.f_service;
						}
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
                garbage : null
    });
    
    return storage;
    
}]);