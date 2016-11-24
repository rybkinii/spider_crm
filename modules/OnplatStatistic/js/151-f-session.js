SiteApp.factory('FSession', ['SiteMeta', function(SiteMeta, SiteConfiguration){

    var storage =  SiteMeta.storage({
                            
                item:{id:'0', email:null, passwd: null},
                data:['iud','id','email','passwd', 'clientgroup', 'debug_mode', 'descr', 'error', 'session'],
				load:{
                    query   : function(query){
                        query.action     = 'get_f_client_login';
						//console.log('get_f_client_login',query);
                        return query;
                    },
                    item    : function(item)
                    {
						//console.log('get_f_client_login_item',item);
						item.iud=2;
						storage.current = item;
						storage.Event('login:change' );
						
                        return item;
                    },
					error:function(data){
						//console.log('get_f_client_login_error',data);
						//if(data.data.data.error && data.config.data.email)
							storage.Event('login:error', data );
					},
                    finally : function(data){
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
                    'session:load': function(event, data){
                        storage.Load();
                    }
                },
                garbage : null
    });
    
    return storage;
    
}]);