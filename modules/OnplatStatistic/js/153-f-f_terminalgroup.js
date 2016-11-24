

SiteApp.factory('FF_Terminalgroup', ['SiteMeta', 'FSession', 'FF_Client', 'FF_Terminal', 'FF_Dictionaryes', function(SiteMeta, FSession, FF_Client, FF_Terminal, FF_Dictionaryes){

    var storage =  SiteMeta.storage({
                            
                item:{},
                data:['iud', "f_terminalgroup", "f_client", "name", "f_terminals"],

                load:{
                    query   : function(query){
                        query.action     = 'ask_f_terminalgroup';
                        if(!query.f_client)
                            delete query.f_client;
                        console.log('ask_f_terminalgroup', query);
                        return query;
                    },
                    item    : function(item)
                    {
                        item.id = item.f_terminalgroup;
                        var f_terminals = item.f_terminals.replace('{', '').replace('}', '').split(',');
                        var nterm = {};
                        for(var i=0;i<FF_Terminal.items.length;i++)
                            nterm[FF_Terminal.items[i].f_terminal] = f_terminals.indexOf(FF_Terminal.items[i].f_terminal)!=-1 ? true : false;
                        item.f_terminals = nterm;
                        console.log('ask_f_terminalgroup:item',item);
                        return item;
                    },
                    error:function(data){
                        console.log('ask_f_terminalgroup:error',data);
                    },
                    finally : function(data){                      
                        console.log('ask_f_terminalgroup:finally',data);
                        return null;
                    }
                },
                save:{
                    query   : function(query){
                        query.action     = 'iud_f_terminalgroup';
                        var term = [];
                        var idxs = Object.keys(query.f_terminals);
                        for(var i=0;i<idxs.length;i++)
                            if(query.f_terminals[idxs[i]])term.push(idxs[i]);
                         query.f_terminals = term;
                        if(!query.f_terminalgroup)
                            delete query.f_terminalgroup;
                        console.log('iud_f_terminalgroup', query);
                        return query;
                    },
                    item    : function(query, data){
                        console.log('iud_f_terminalgroup:item', data);
                    },
                    finally : function(data)
                    {
                        console.log('iud_f_terminalgroup:finally', data);
                        storage.Load({f_client:storage.f_client});
                    }
                },
                create:{
                    item    : function(item) {
                        item.id = new Date();
                        var nterm = {};
                        for(var i=0;i<FF_Terminal.items.length;i++)
                            nterm[FF_Terminal.items[i].f_terminal] = false;
                        item.f_terminals = nterm;
                        return item;
                    }
                },
                signals:{
                    'FF_Dictionaryes:loaded': function(event, data){
                        storage.Load();
                    },
                    'f_client:change': function(event, data){
                        //storage.Load();
                    },
                    'session:debug:chage': function(event, data){
                        //storage.Load();
                    }
                },
                st:0,
                ct:0,
                cc:0,
                garbage : null
    });
    
    return storage;
    
}]);