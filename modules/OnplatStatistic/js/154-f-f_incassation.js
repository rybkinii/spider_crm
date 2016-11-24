


SiteApp.factory('FF_Incassation', ['SiteMeta', 'FSession', 'FF_Terminal', 'FF_Client', function(SiteMeta, FSession, FF_Terminal, FF_Client){

    var storage =  SiteMeta.storage({
                            
                item:{id:'0', email:null, passwd: null},
                data:['iud','id','email','passwd', 'clientgroup', 'debug_mode', 'descr', 'error', 'session'],
				
				// i_session_name i_f_terminal
				// level f_service f_s_f_service is_catalog image_id name fullnameitin contract support c_provider c_taxtype pay_min_value pay_max_value tax_min_perc tax_def_perc tax_max_perc tax_min_amount tax_def_amount tax_max_amount regions dt_start l_termserviceblock l_terminaltemplate f_template
				
				load:{
                    query   : function(query){
                        query.action     = 'ask_f_incassation';
						query.f_terminal = [storage.f_terminal];
                                                query.f_client = [storage.f_client];
						
						query.dts_value_start = storage.dts_value_start //'01.07.2016';
						query.dts_value_stop = storage.dts_value_stop;//'14.09.2016';
						
                                                if(!storage.f_client)
						{
							query.f_client = [];
							for(var i=0;i<FF_Client.items.length;i++)
							{
								query.f_client.push(FF_Client.items[i].f_client);
							}
						}
                                                if(query.f_client.length==0)delete query.f_client;
                                                
						if(!storage.f_terminal)
						{
							query.f_terminal = [];
							for(var i=0;i<FF_Terminal.items.length;i++)
							{
								query.f_terminal.push(FF_Terminal.items[i].f_terminal);
							}
						}
                                                if(query.f_terminal.length==0)delete query.f_terminal;
						
						if(query.dts_value_start)
							if(query.dts_value_start.format)
								query.dts_value_start = query.dts_value_start.format("dd-mm-yyyy");
						if(query.dts_value_stop)
							if(query.dts_value_stop.format)
								query.dts_value_stop = query.dts_value_stop.format("dd-mm-yyyy");
						console.log('ALLAH ARBAR',query);
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_incassation;
                        return item;
                    },
					error:function(data){
						//console.log('ask_f_terminal: error', data);
						if(data.data.data.error && data.config.data.email)
							storage.Event('FF_Terminal:load:error', data.data.data.error );
					},
                    finally : function(data){


                        // ВАНГА
                        /*var test1 = Object.create(storage.items[0]);
                        var test2 = Object.create(storage.items[0]);
                        test1.f_terminal='5';
                        test2.f_terminal='5';
                        test2.dts_value = '2016-08-02 12:29:38';
                        storage.items.push(test1);
                        storage.items.push(test2);*/
                        // ОТЧЁТ
                        var history = {};
                        var dates = [];
                        
                        for(var i=0;i<storage.items.length;i++)
                            if(!history[storage.items[i].f_terminal])
                                history[storage.items[i].f_terminal] = {f_terminal:storage.items[i].f_terminal,descr:'Терминал №'+storage.items[i].f_terminal,records:[],total:0};
                        
                        for(terminal in history)
                        {
                            for(var i=0;i<storage.items.length;i++)
                            if(history[terminal].f_terminal==storage.items[i].f_terminal)
                            {
                                var parts = storage.items[i].dts_value.split(' ');
                                parts[0] = parts[0].split('-');parts[1] = parts[1].split(':');
                                var d = new Date(parts[0][0], parseInt(parts[0][1])-1, parts[0][2], parts[1][0], parts[1][1], parts[1][2] ,0);
                                var record = {date:d.format("dd-mm-yyyy"),value:storage.items[i].terminal_value_total_sum,colspan:1};
                                history[terminal].total+= parseFloat(storage.items[i].terminal_value_total_sum);
                                history[terminal].records.push(record);
                                var pos = -1;
                                for(var d =0;d<dates.length;d++)
                                    if(dates[d].date==record.date){pos=d;break;}
                                if(pos==-1)
                                    dates.push({date:record.date,count:1});
                            }
                        }
                        
                        dates = dates.sort(function (b, a) {
                            var parts1 = a.date.split('-');
                            var parts2 = b.date.split('-');
                            var rez1 = -1;
                            var rez2 = 1;
                            if(parseInt(parts1[0])>parseInt(parts2[0]))return rez1;
                            if(parseInt(parts1[0])==parseInt(parts2[0]))
                            {
                                if(parseInt(parts1[1])>parseInt(parts2[1]))return rez1;
                                if(parseInt(parts1[1])==parseInt(parts2[1]))
                                {
                                    if(parseInt(parts1[2])>parseInt(parts2[2]))return rez1;
                                }                                    
                            }
                            return rez2;
                        });
                        
                        for(data in dates)
                        {
                            for(terminal in history)
                            {
                                var count = 0;
                                for(var i=0;i<history[terminal].records.length;i++)
                                    if(history[terminal].records[i].date == dates[data].date)
                                    count++;

                                if(dates[data].count<count)
                                    dates[data].count = count;
                            }                            
                            for(terminal in history)
                            {
                                var count = 0;
                                for(var i=0;i<history[terminal].records.length;i++)
                                    if(history[terminal].records[i].date == dates[data].date)
                                    count++;
                                for(var i ='0';i<dates[data].count-count;i++)
                                {
                                    var record = {date:dates[data].date,value:' ',colspan:1};
                                    history[terminal].records.push(record);
                                }
                            }
                        }
                        
                        
                        for(terminal in history)
                        {
                            var records = [];
                            for(data in dates)                        
                            {
                                for(var i=0;i<history[terminal].records.length;i++)
                                    if(history[terminal].records[i].date == dates[data].date)
                                        records.push(history[terminal].records[i]);
                            }
                            history[terminal].records = records;
                        }
                        
                        storage.dates   = dates;
                        storage.history = history;

                        
                        //terminal_value_total_sum
                        //f_terminal
                        
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
                garbage : null
    });
	
	storage.dts_value_start = new Date();
	storage.dts_value_stop = new Date();
	storage.dts_value_start.setDate(storage.dts_value_start.getDate() - 14);
    
    return storage;
    
}]);