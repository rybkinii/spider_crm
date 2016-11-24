
SiteApp.factory('SiteDatabase', ['$http','$httpParamSerializer', 'SiteConfiguration', function($http, $httpParamSerializer, config){

    console.info('Loading factory SiteDatabase...');
    
    var factory = {
            config        : config,
            url_query     : '//' + config.server  + '/' +config.entry,
            url_local     : '//' + config.local   + '/' +config.entry,
            url_file      : '//' + config.server  + '/' +config.files,
            url_test      : '//' + config.server  + '/' +config.test,
            query_method  : config.method,
            headers : {
                'Content-Type'     : 'application/x-www-form-urlencoded'
            }
    };

    if(factory.config.transform)
        factory.transform = {
            reqest:function(data, headersGetter){
                if(factory.config.debug === true)
                    console.debug('SiteDatabase', 'Reqest',data);
				var recursiveEncoded = $.param( data );
				//console.log(data, recursiveEncoded);
                return recursiveEncoded;//$httpParamSerializer(data);                
            },
            responce:function(data, headersGetter){
                if(factory.config.debug === true)
                    console.debug('SiteDatabase', 'Responce',data);
                    var res = {valid:false,data:null};
                    
                    var json = data;

                    try
                    {
                        res = {valid:true,data:angular.fromJson(json)};
                    }catch(ex)
                    {
                        res = {valid:false,data:data};
                    }
                return res;
            }
        };
    else
        factory.transform = {
            reqest:function(data, headersGetter){
                if(factory.config.debug === true)
                    console.debug('SiteDatabase', 'Reqest',data);
                return data;
            },
            responce:function(data, headersGetter){
                if(factory.config.debug === true)
                    console.debug('SiteDatabase', 'Responce',data);
                return data;
            }
        };
    
    factory.error = function(req, err)
    {
        if(req.status===403)
        if(req.data)
        if(req.data.data.length>0)
        {
            console.error('SiteDatabase', req.data.data, req.config.data);
            return;
        }
        if(req && err)
            console.error('SiteDatabase', req, err);
        else if(req)
            console.error('SiteDatabase', req);
        else
            console.error('SiteDatabase',err);
    };    
    
    factory.query = function(user_data, user_success, user_error, type)
    {
            var local_transform_request = function (data, headersGetter)
            {
                var keys = Object.keys(data);
                var str = '';
                for(var i=0;i<keys.length;i++)
                    str += keys[i] + '=' + data[keys[i]] + (i==keys.length-1 ? '' : '&');
                return str;
            };
            
            var req = {
                method           : factory.query_method,
                transformResponse: factory.transform.responce,
                transformRequest : type === 'local' ? local_transform_request : factory.transform.reqest,
                data             : user_data,
                headers          : factory.headers
            };
            

            req.url = factory.url_query;
            
            if(type === 'local')
            {
                //console.log('LOCAL!!!', req);
                req.url         = factory.url_local;
                req.crossDomain = true;
                req.crossOrigin = true;
            }
			
            var err_fun = user_error || factory.error;
			
            if(type === 'raw')
                req.transformResponse =  function (data, headersGetter){return data;};
            
            //if(type === 'local')
                //console.log('LOCAL!!!', req);
            $http(req)
            .then
            (
                function(data){if(data.status!=200){err_fun(data);return;}if(user_success)user_success(data.data.data, data);},
                function(data){err_fun(data);}
            );
    };
    
    
    return factory;
}]);


SiteApp.factory('SiteMeta',['$rootScope','$filter', 'SiteDatabase', function($rootScope, $filter, Database){
        
        var factory = {};

        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var propIsEnumerable = Object.prototype.propertyIsEnumerable;
        function toObject(val){if (val === null || val === undefined) {throw new TypeError('Object.assign cannot be called with null or undefined');}return Object(val);}



                
        factory.assign = function (target, source) {
                var from;
                var to = toObject(target);
                var symbols;
                for (var s = 1; s < arguments.length; s++) {
                        from = Object(arguments[s]);
                        for (var key in from) {
                                if (hasOwnProperty.call(from, key)) {
                                        to[key] = from[key];
                                }
                        }
                        if (Object.getOwnPropertySymbols) {
                                symbols = Object.getOwnPropertySymbols(from);
                                for (var i = 0; i < symbols.length; i++) {
                                        if (propIsEnumerable.call(from, symbols[i])) {
                                                to[symbols[i]] = from[symbols[i]];
                                        }
                                }
                        }
                }
                return to;
        };

        factory.field = function(item, name, init){
                var extra_name = '__sitemeta'+name;
                if(!init)
                {
                    if(item[extra_name])
                        return item[extra_name];
                    if(item[name])
                        return item[name];
                }
                var initer = Object.create({
                                events  :{changed:function(newval){}},
                                filters :{get:function(v){return v;},set:function(v){return v;}}
                             });
                angular.copy(init, initer);
                var value = item[name]!==undefined ? item[name] : initer.default;//'00:00';
                item.__defineGetter__(name, function(){return initer.filters.get(initer.value);});
                item.__defineSetter__(name, function(v){ var newval  = initer.filters.set(v, initer); if(initer.value != newval){initer.value = newval; initer.events.changed(initer.value);}});
                item[extra_name] = initer;
                item[name] = value;
                return initer;
        };


        factory.types = {
                'Time':{
                                value   : new Date(),
                                default : '00:00',
                                filters :{
                                    get:function(v){
                                        return (v.getUTCHours() < 10 ? '0' : '') + v.getUTCHours() + ':' + (v.getUTCMinutes() < 10 ? '0' : '') + v.getUTCMinutes();
                                    },
                                    set:function(v, obj){
                                        var vv = v ? v : '00:00';                                        
                                        var parts = vv.split(':');
                                        obj.value.setUTCHours(parseInt(parts[0]));
                                        obj.value.setUTCMinutes(parseInt(parts[1]));
                                        
                                        return obj.value;
                                    }
                                }
                        },
        };
        
        factory.storage = function(source){
    
            var storage = {
                items : [],
                debug : false,
                status: 'ready',
                autogarbage : true,
////////////////////////////////////////////////////////////////////////////////// ����������� ���������
                item:{id:0},                                                    // ������ ��������
                data:['id'],                                                    // ���� ��� ��������
                signals:[],                                                     // ������
                values:[],                                                      // ���������� ���������� �������
                link           : function(item){},
                load:{                                                          
                    query      : function(query) {return query; },     // ���������� ������� �������. ���� ���������� null ������ ����������
                    item       : function(item)  {return item;  },     // ���������� ���������� ������. ���� ���������� null ������ �� �����������
                    finally    : function(data)  {return null;  }      // ������ ��������
                },
                save:{                                                          
                    query   : function(query)       {return query;},            // ���������� ������� ���������� ������. ���� ���������� null ������ ����������
                    item    : function(query, data) {return query;},            // ������ ��������
                    finally : function(query)       {}                          // ��� ������� ���������
                },
                create:{                                                        
                    item    : function(item)  {return item;},                   // �������� �������. ���� ���������� null ������ �� ��������
                    finally : function(item)  {}                                // ����� �������� �������.
                },
                garbage     : null                                              // �������������
////////////////////////////////////////////////////////////////////////////////  
            };

                        
            factory.assign(storage, source);

            //console.log(storage);
            
            storage.Garbage = function(){
                if(storage.garbage)
                    return storage.garbage();
                var i = storage.items.length;
                while (i--)
                    if(storage.items[i].garbage === true)
                        storage.items.splice(i, 1);
            };
            
            storage.Param = function(name, val, overwrite){
                
                var obj = Object.create(null);
                for(var index in storage.values)
                    if(name === storage.values[index].name)
                    {
                        //console.log('finded!');
                        delete obj;
                        obj = storage.values[index];
                    }
                    //console.log(name,obj);

                if(!obj.name)
                {
                    //console.log('create');
                    obj.name  = name;
                    obj.value = undefined;
                    storage.values.push(obj);
                }
                
                if(val || (!val && overwrite))
                {
                    obj.value = val;
                    //console.log('Param set',obj);
                }
                else 
                    //console.log('Param get',obj);
                
                //console.log(storage.values);
                
                return obj;
            };
            
            storage.Create = function(mod){
                var item = {};
                item.id = new Date().getTime();
                angular.extend(item,storage.item,mod);
                if(storage.create.item)
                    item = storage.create.item(item);
                if(item)
                {
                    item.iud = 1;
                    storage.items.unshift(item);
                }                
                
                if(storage.create.finally)
                    storage.create.finally(item);

                return item;
            };
            
            storage.Status = function(name)
            {
                storage.status = name;
                
            };
            
            storage.Link = function()
            {
                for(item in storage.items)
                    if(storage.link)
                        storage.link(storage.items[item]);
            };
            
            storage.AddItem = function(ditem){
                var item = {};
                angular.copy(storage.item,item);
                factory.assign(item, ditem);
                item.iud = 0;
                item = storage.load.item(item);
                if(item)
                {
                    storage.items.push(item);
                    storage.link(item);
                }                
            };
            
            storage.Load   = function(mod){
                    if(storage.status !== 'ready')
                    {
                        //setTimeout( storage.Load(mod) , 1000);
                        return;
                    }
                    
                    storage.Status('loading');
                    
                    
                    var request          = {};
					
	
                    angular.copy(mod,request);
					


                    var tested_request = storage.load.query(request);

                    if(!tested_request)
                    {
                        //console.warn('Storage', 'Test fail', request);
                        storage.Status('ready');
                        return;
                    }

                    //if(storage.debug)
                        //console.debug('Storage','request', tested_request);
                    
                    if(storage.autogarbage==true)
                        for(item in storage.items)
                            storage.items[item].garbage = true;
                    //console.log(tested_request);
					
					var keys = Object.keys(request);
					for (var i = 0; i < keys.length; i++)
					{
						//console.log(typeof request[keys[i]]);
						if(request[keys[i]]===null)
							delete request[keys[i]];
						if(typeof request[keys[i]]==='object')
							if(request[keys[i]].length==1 && request[keys[i]][0]=='')
								delete request[keys[i]];
					}
					
                    Database.query( tested_request, function(data, req){
                            //if(storage.debug)
                                //console.debug('Storage','responce', req, data);
							if(data.error)
							{
								if(storage.load.error)
									storage.load.error(req, data.error);
								else
									console.error('Storage '+data.error, req );
							}else
							{
								
								if(data.meta)
								{
									for (var i = 0; i < data.meta.length; i++)
									if(storage.load.meta)
										storage.load.meta(data.meta[i]);
									else
										console.info('Storage meta', data.meta[i], req );
								}
								if(data.notice)
								{
									for (var i = 0; i < data.notice.length; i++)
									if(storage.load.notice)
										storage.load.notice(data.notice[i]);
								}
								if(!data.data)
								console.error(data);
									else
								if(Object.keys(data.data[0]).length!=0)
								{
									for (var i = 0; i < data.data.length; i++)
									{
										storage.AddItem(data.data[i]);
									}
								}
							}
                            
                            //if(storage.autogarbage)
                            storage.Garbage();
                            //if(storage.debug)
                                //console.debug('Storage','finally', req, data);
                            storage.load.finally(req, data);
                            storage.Status('ready');
                    },function(error, query){
                        //console.log('ERROR!!!');
                        if(storage.load.error)
                            storage.load.error(error, query);
                        else
                            Database.error(error, query)
                        storage.Status('ready');
                    });
            };
            
            storage.Save   = function(mod){
                    
					
                    if(storage.status != 'ready')return;
                    //console.log('!!!!!!!!');
                    storage.Status('saving');
                    
                    var queryready = [];
                    
                    function check_ready()
                    {
                        //console.log('check_ready');
                        for(var kk=0;kk<queryready.length;kk++)
                            if(queryready[kk].ready!==1)
                                return;
                        storage.Status('ready');
                        storage.save.finally(queryready[kk]);
                    }
                    
                    for (var i = 0; i < storage.items.length; i++)
                    {
                        var test_iud = storage.items[i].iud !== undefined ? storage.items[i].iud : storage.items[i].type;
                        if(!test_iud)
                            continue;
                        if(test_iud > 3 || test_iud < 1)
                            continue;

                        if(storage.items[i].iud==1)
                            storage.items[i].id = 0;
                        
                        var request          = {};
                        
                        angular.copy(mod,request);
                       
                        for(var j=0;j<storage.data.length;j++)
                            if(storage.data[j].indexOf('~')==-1)
                                request[storage.data[j]] = storage.items[i][storage.data[j]];
                        
                        var tested_request = storage.save.query(request);

                        if(!tested_request)
                        {
                            console.warn('Storage', 'Test fail', request);
                            continue;
                        }
                        
                        //if(storage.debug)
                            //console.debug('Storage','request', tested_request);
                            
                        queryready.push(tested_request);
                        
                        for(var nidn in tested_request)
                        {
                            if(tested_request[nidn] === null || tested_request[nidn] === undefined)
                                tested_request[nidn] = 0;
                        }
                        //console.log('queryready',queryready);
                        Database.query( tested_request, function(data, req){

                            //console.debug('Storage','responce', req, data);
							//console.log(data, req);
                            /*for (var i = 0; i < data.length; i++)
                            {
                                if(data[i].error)
                                {
                                    console.error(data[i].error, req);
                                    continue;
                                }
                            }*/
							
							console.log(data);
							
							if(data.error)
							{
								if(storage.save.error)
									storage.save.error(req, data.error);
								else
									console.error('Storage '+data.error, req );
							}else
							{
								if(data.meta)
								{
									for (var i = 0; i < data.meta.length; i++)
									if(storage.save.meta)
										storage.save.meta(data.meta[i]);
									else
										console.info('Storage meta', data.meta[i], req );
								}
								if(data.notice)
								{
									for (var i = 0; i < data.notice.length; i++)
									if(storage.save.notice)
										storage.save.notice(data.notice[i]);
								}
								
								storage.save.item(req, data.data[0]);
							}
							
                            req.config.data.ready = 1;
                            check_ready();
							//console.log('status', storage.status, queryready, req);
                            
                        },function(error, query){
                            
                            if(storage.save.error)
                                storage.save.error(error, query);
                            else
                                Database.error(error, query);
                            
                            query.ready = 1;
                            if(typeof query.data == 'object')
                                query.data.ready = 1;
                            
                            check_ready();
                        });
                    }
                    check_ready();
            };
            
			storage.Event   = function(name,data){
				$rootScope.$broadcast(name, data);
			};
			
			
			
            for(var signal in storage.signals)
                $rootScope.$on(signal, storage.signals[signal]);
            
			storage.Param('editable', '0');
			
            return storage;
        }
        


        return factory;
}])

;

