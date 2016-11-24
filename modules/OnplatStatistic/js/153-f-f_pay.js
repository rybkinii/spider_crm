


SiteApp.factory('FF_Pay', ['SiteMeta', 'FSession', 'FF_Terminal', function(SiteMeta, FSession, FF_Terminal){

    var storage =  SiteMeta.storage({

                item:{id:'0', email:null, passwd: null},
                data:['iud','id','email','passwd', 'clientgroup', 'debug_mode', 'descr', 'error', 'session'],
				
					//{i_session_name,i_dts_value_start,i_dts_value_stop,i_parameter_value,i_f_service,i_f_terminal,i_f_client,i_request_id,i_f_pay,i_stat,terminal_f_pay,terminal_f_terminal,terminal_request_id,terminal_request_dt,terminal_dts_value,terminal_c_taxtype,terminal_f_taxterminal,terminal_value_total,terminal_value_comiss,terminal_value_pay,terminal_pay_descr,terminal_c_module,terminal_f_service,terminal_parameters,terminal_stat,terminal_c_error,system_pay_f_pay,system_pay_f_model,system_pay_c_currency,system_pay_f_account_dt,system_pay_f_account_ct,system_pay_dts_request,system_pay_dts_value,system_pay_value_cur,system_pay_value_rur,system_pay_descr,system_pay_stat,system_pay_c_error,system_comiss_f_pay,system_comiss_f_model,system_comiss_c_currency,system_comiss_f_account_dt,system_comiss_f_account_ct,system_comiss_dts_request,system_comiss_dts_value,system_comiss_value_cur,system_comiss_value_rur,system_comiss_descr,system_comiss_stat,system_comiss_c_error,gate_f_pay,gate_c_provider,gate_f_service,gate_f_template,gate_dts_value,gate_parameter_primary,gate_parameters,gate_value_total,gate_value_comiss,gate_value_pay,gate_stat,gate_c_error,gate_external_id}
				
				load:{
                    query   : function(query){
                        query.action     = 'ask_f_pay';
						query.f_terminal = storage.f_terminal;
						//query.f_service = 2;
						query.dts_value_start = storage.dts_value_start //'01.07.2016';
						query.dts_value_stop = storage.dts_value_stop;//'14.09.2016';
						
						if(query.dts_value_start)
							if(query.dts_value_start.format)
								query.dts_value_start = query.dts_value_start.format("dd-mm-yyyy");
						if(query.dts_value_stop)
							if(query.dts_value_stop.format)
								query.dts_value_stop = query.dts_value_stop.format("dd-mm-yyyy");
							
						if(!query.terminal)
							delete query.terminal;
						//console.log('ask_f_pay', query);
                        return query;
                    },
                    item    : function(item)
                    {
						//console.log('ask_f_pay: item', item);
						item.id = item.terminal_f_pay;
                        return item;
                    },
					error:function(data){
						console.log('ask_f_pay: error', data);
						if(data.data.data.error && data.config.data.email)
							storage.Event('FF_Terminal:load:error', data.data.data.error );
					},
                    finally : function(data){
						console.log('ask_f_pay: finally', data);
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
	storage.dts_value_start.setDate(storage.dts_value_start.getDate() - 7);
    return storage;
    
}]);