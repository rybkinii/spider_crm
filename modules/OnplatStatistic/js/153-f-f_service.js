SiteApp.factory('FF_Service', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{id:'0', email:null, passwd: null},
                data:['iud','id', 'f_template','f_template_old', 'f_service', 'f_terminal', 'l_terminaltemplate', 'l_termserviceblock', 'block', 'l_terminalserviceblock'],
				
				// i_session_name i_f_terminal
				// level f_service f_s_f_service is_catalog image_id name fullnameitin contract support c_provider c_taxtype pay_min_value pay_max_value tax_min_perc tax_def_perc tax_max_perc tax_min_amount tax_def_amount tax_max_amount regions dt_start l_termserviceblock l_terminaltemplate f_template
				
				load:{
                    query   : function(query){ 
                        query.action     = 'ask_f_service';
						//query.f_terminal = 4;
						if(!query.f_terminal)
							query.f_terminal = storage.f_terminal;
						storage.f_terminal = query.f_terminal;
						//console.log('ask_f_service: item', item);
                        return query;
                    },
                    item    : function(item)
                    {
						//console.log('ask_f_service: item', item);
						item.id = item.f_service;
						item.block= item.l_termserviceblock>0 ? 1:0;
						item.f_template_old = item.f_template;
                        return item;
                    },
					error:function(data){
						//console.log('ask_f_service: error', data);
						if(data.data.data.error && data.config.data.email)
							storage.Event('FF_Terminal:load:error', data.data.data.error );
					},
                    finally : function(data){
						
						var get_root = function(f_service, f_s_f_service){
							if(!f_s_f_service)
								return f_service;
							for(var i=0;i<storage.items.length;i++)
								if(storage.items[i].f_service==f_s_f_service)
									return get_root(storage.items[i].f_service,storage.items[i].f_s_f_service);
							return null;
						};
						storage.recalc_f_templates();

						for(var i=0;i<storage.items.length;i++)
							storage.items[i].root = get_root(storage.items[i].f_service,storage.items[i].f_s_f_service);
						

						
						//console.log('ask_f_service:prepare',storage.items);
						//console.log('ask_f_service: finally', data);
                        return null;
                    }
                },
                save:{
                    query   : function(query){
						query.action     = 'iud_f_terminalservice';
						query.f_terminal = storage.f_terminal;
						query.l_terminalserviceblock = query.l_termserviceblock;
						console.log(query);
                        return query;
                    },
                    item    : function(query, data){
                    },
                    finally : function(data)
                    {
						console.log('IUD',data, data);
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
				recalc_f_templates:function()
				{
					console.log('recalc_f_templates');
					var get_top_f_template = function(f_service, f_s_f_service, f_template){
						if(f_template)
							return f_template;
						
						for(var i=0;i<storage.items.length;i++)
							if(storage.items[i].f_service==f_s_f_service)
								return get_top_f_template(storage.items[i].f_service,storage.items[i].f_s_f_service, storage.items[i].f_template);
						
						return null;
					};
					
					for(var i=0;i<storage.items.length;i++)
					{
						if(storage.items[i]._inheritable == true)
						{
							delete storage.items[i]._inheritable;
							delete storage.items[i].f_template;
						}
						var old = storage.items[i].f_template;
						storage.items[i].f_template = get_top_f_template(storage.items[i].f_service, storage.items[i].f_s_f_service, storage.items[i].f_template);
						if(old != storage.items[i].f_template)
							storage.items[i]._inheritable = true;

							
					}
				},
                garbage : null
    });
    
    return storage;
    
}]);