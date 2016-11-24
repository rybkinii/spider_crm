SiteApp.factory('FF_Templateax', ['SiteMeta', 'FSession', 'FF_Template', 'FF_Dictionaryes', function(SiteMeta, FSession, FF_Template, FF_Dict){

    var storage =  SiteMeta.storage({
                autogarbage : false,
                item:{id:0, l_templatetax:null, c_taxtype:null,pay_value_start:'0',value_perc:null,value_min_amount:null,value_max_amount:null,stat:0,dt_start:null,dt_stop:null, value_max_amount_temp:null},
                data:['iud','id','l_templatetax','c_taxtype','pay_value_start','value_perc','value_min_amount','value_max_amount','stat','dt_start','dt_stop', 'f_template', 'value_max_amount_temp'],
                load:{
                    query   : function(query){
                        query.action     = 'ask_l_templatetax';
                        if(!query.f_template)
                            query.f_template = storage.f_template;
                        if(!query.f_template)return null;
                        storage.f_template = query.f_template;
                        for(item in storage.items)
                            if(storage.items[item].f_template==query.f_template)
                                storage.items[item].garbage = true;
                        return query;
                    },
                    item    : function(item, data)
                    {
                        item.f_template = storage.f_template;
                        item.id = item.l_templatetax;
                        item.value_max_amount_temp = 0 || item.value_max_amount;
                        
                        item.pay_value_start = parseFloat(item.pay_value_start);
                        item.value_perc = parseFloat(item.value_perc);
                        item.value_min_amount = parseFloat(item.value_min_amount);
                        item.value_max_amount_temp = parseFloat(item.value_max_amount_temp);

                        return item;
                    },
                    error:function(data){
                            if(data.data.data.error && data.config.data.email)
                                    storage.Event('FF_Terminal:load:error', data.data.data.error );
                    },
                    finally : function(data){
                        return null;
                    }
                },
                save:{
                    query   : function(query){
                        query.action     = 'iud_l_templatetax';
                        for(item in storage.items)
                                storage.items[item].garbage = true;
//                        console.log(query);
                        query.value_max_amount = query.value_max_amount_temp;
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
                        item.id = new Date();
			if('FF',FF_Dict.dictionary('lst_terminals_c_taxtype').length>0)
			    item.c_taxtype = FF_Dict.dictionary('lst_terminals_c_taxtype')[0].c_taxtype;
                        return item;
                    }
                },
                garbage : null
    });
    
    return storage;
    
}]);