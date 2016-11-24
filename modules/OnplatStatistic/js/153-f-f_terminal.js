SiteApp.factory('FF_Terminal', ['SiteMeta', 'FSession', function(SiteMeta, FSession){

    var storage =  SiteMeta.storage({
                            
                item:{id:'0', email:null, passwd: null},
                data:['iud','f_terminal','f_client','hkey','time_start','time_stop','timezone','warning_limit','unregistered','stat','dt_stop','get_f_address'],
				
				
                    load:{
                    query   : function(query){
                        query.action     = 'ask_f_terminal';
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_terminal;
                        //console.log('ask_f_terminal: item', item);
                        if(!item.get_f_address)item.get_f_address=Object.Create();;
                        item.time_start = new Date(1970, 0, 1, item.time_start.split(':')[0], item.time_start.split(':')[1], item.time_start.split(':')[2]);//new Date.parse(item.time_start);
                        item.time_stop  = new Date(1970, 0, 1, item.time_stop.split(':')[0], item.time_stop.split(':')[1], item.time_stop.split(':')[2]);//new Date.parse(item.time_stop);
                        item.unregistered = (item.unregistered ==1 ? true : false);
                        item.stat = (item.stat ==0 ? true : false);
                        item.tname = item.get_f_address.descr;
                        item.warning_limit = parseFloat(item.warning_limit);
                        
                        item.get_f_address.proxy_descr =  item.get_f_address.descr;
                        
                        item.get_f_address.pdescr = function()
                        {
                            if(item.get_f_address.descr && item.get_f_address.descr!=0)
                            {
                                item.get_f_address.proxy_descr =  item.get_f_address.descr;
                                return;
                            }
                            
                            var descr = '';
                            var keys = Object.keys(item.get_f_address);
                            for(var i = 0;i<keys.length;i++)
                            {
                                if(item.get_f_address[keys[i]] && item.get_f_address[keys[i]]!=0 &&
                                        ['dt_start','f_terminal','f_address','pdescr','proxy_descr'].indexOf(keys[i])==-1)
                                    descr+=item.get_f_address[keys[i]]+' ';
                            }
                            item.get_f_address.proxy_descr = descr;
                        }
                        
                        var keys = Object.keys(item.get_f_address);
                        for(var i = 0;i<keys.length;i++)
                        {
                            if((!item.get_f_address[keys[i]] || item.get_f_address[keys[i]]==0) &&
                                    ['dt_start','f_terminal','f_address'].indexOf(keys[i])==-1)
                                delete item.get_f_address[keys[i]];
                        }
                            

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
                        query.action     = 'iud_f_terminal';
                        if(query.time_start)
                                if(query.time_start.format)
                                        query.time_start = query.time_start.format("HH:MM:ss");
                        if(query.time_stop)
                                if(query.time_stop.format)
                                        query.time_stop = query.time_stop.format("HH:MM:ss");
                        
                        query.f_address = query.get_f_address.f_address;
                        query.postindex = query.get_f_address.postindex;
                        query.region = query.get_f_address.region;
                        query.district = query.get_f_address.district;
                        query.town = query.get_f_address.town;
                        query.place = query.get_f_address.place;
                        query.street = query.get_f_address.street;
                        query.home = query.get_f_address.home;
                        query.corpus = query.get_f_address.corpus;
                        query.building = query.get_f_address.building;
                        query.flat = query.get_f_address.flat;
                        query.descr = query.get_f_address.descr;
                        query.latitude = query.get_f_address.latitude;
                        query.longitude = query.get_f_address.longitude;
                        if(!query.descr || query.descr==0)query.descr= query.get_f_address.proxy_descr;
                        
                        query.unregistered = (query.unregistered  ? 1 : 0);
                        query.stat = (query.stat  ? 0 : 1);
                        console.log('PREPARED',query);//return null;
                                
                        return query;
                    },
                    item    : function(query, data){
                    },
                    finally : function(data)
                    {
                        console.log('IUD',data);
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