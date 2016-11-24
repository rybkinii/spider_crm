SiteApp.controller('CtrlMain', [
    '$rootScope'
    ,'$scope'
    ,'$filter'
    ,'$location' 
    ,'$routeParams'
    ,'SiteDatabase'

    ,'FF_Dictionaryes','FSession', 'FF_Terminal', 'FF_Client', 'FF_Service', 'FF_Template','FF_Templateax', 'FF_OperatorsInterval', 'FF_Pay', 'FF_Incassation', 'FF_Access', 'FF_Contact', 'FF_Model', 'FF_Account', 'FF_Terminalgroup'
    ,function(
    $rootScope
    ,$scope
    ,$filter
    ,$location
    ,$routeParams
    ,SiteDatabase
    ,FF_Dictionaryes,FSession, FF_Terminal, FF_Client, FF_Service, FF_Template, FF_Templateax, FF_OperatorsInterval, FF_Pay, FF_Incassation, FF_Access, FF_Contact, FF_Model, FF_Account, FF_Terminalgroup
            ) {
        
                $scope.FF_Contact = FF_Contact;
		$scope.FF_Access = FF_Access;
                
                $rootScope.FF_Terminalgroup = FF_Terminalgroup; 
                $rootScope.FF_Model = FF_Model; 
		$rootScope.FF_OperatorsInterval = FF_OperatorsInterval; 
		$rootScope.FF_Template = FF_Template; 
		$rootScope.FF_Templateax = FF_Templateax; 
		$rootScope.FF_Dictionaryes = FF_Dictionaryes;
		$rootScope.FSession = FSession;
		$rootScope.FF_Terminal = FF_Terminal;
		$rootScope.FF_Client = FF_Client;
		$rootScope.FF_Service = FF_Service;
		$rootScope.FF_Pay = FF_Pay;
		$rootScope.FF_Incassation = FF_Incassation;
	
        
        $rootScope.editors = ['Архитектор', 'Администратор'];
        
  $scope.userAgent = navigator.userAgent;
  
  $rootScope.$on('$routeChangeStart', function() { $rootScope.loading = true; });
  $rootScope.$on('$routeChangeSuccess', function() { $rootScope.loading = false; });
  
  $rootScope.$on('login:error', function() { 
  console.log('FSession',FSession);
	$location.path('/');
  });
  $rootScope.$on('login:change', function() { 
  console.log('FSession',FSession);
  /*
        if(SystemService.mode.length==0)
        {
            $rootScope.inside=true;
            if(
                    /\/garson/g.test($location.$$path) ||
                    /\/cook/g.test($location.$$path)   ||
                    /\/admin/g.test($location.$$path)
                    )
            $location.path('/');
            $rootScope.$broadcast('order:load');
        }
  */
  });
	$scope.SwitchDebug = function()
	{
		if(FSession.current.debug_mode)
		{
			FSession.current.debug_mode=!FSession.current.debug_mode;
			$rootScope.$broadcast('session:debug:chage');		
		}
	}


		
    //$scope.userAgent = navigator.userAgent;
	//console.log(window.outerWidth);    
    //var getModalUrl = function() { var random = Math.random(); return "/templates/modals.html?r=" + random; }
    //$rootScope.ModalUrl =  getModalUrl();    
    /*$rootScope.$on("$routeChangeStart",function(event, next, current)
    {
        $rootScope.ModalUrl =  getModalUrl();
        $rootScope.$broadcast('route:change');
    });*/    
    //$scope.Ui.turnOn("uiSidebarLeft");


    $rootScope.$broadcast('session:load');
	
	
	
	//console.log(FF_Service);
	

	$rootScope.Int = function(a){
		return parseInt(a);
	}


	
}]);

SiteApp.controller('CtrlServiceSettings', [ '$rootScope', '$scope', 'FF_Client', 'FF_Dictionaryes', 'FF_OperatorsInterval', 'FF_Service', '$routeParams', function( $rootScope, $scope, FF_Client, FF_Dictionaryes, FF_OperatorsInterval, FF_Service, $routeParams ) 
{
	$scope.FF_Dictionaryes = FF_Dictionaryes;
	$scope.FF_Client       = FF_Client;
	$scope.FF_Service       = FF_Service;
	$scope.FF_OperatorsInterval       = FF_OperatorsInterval;
	
	$rootScope.operator = null;
	$rootScope.region = null;
	$rootScope.f_service_null = true;
	
	if(!FF_Service.f_terminal)
		FF_Service.f_terminal= 4;
	if(FF_Service.items.length==0)
		FF_Service.Load();
	
	$scope.currentPage = 1 ,$scope.numPerPage = 20 ,$scope.maxSize = 5;
	$scope.numPages = function () {
		var count = FF_OperatorsInterval.items.length;
		return Math.ceil(count / $scope.numPerPage); 
	};
	$scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
	$scope.paging = {begin:begin, end:end};
  });
  
  $scope.groupchange = function(f_service)
  {
		for(var i = 0;i<FF_OperatorsInterval.items.length;i++)
		{
			var item = FF_OperatorsInterval.items[i];
			if((([null,'','0'].indexOf($rootScope.operator)!=-1)||(item.operator.indexOf($rootScope.operator)!=-1))&&(([null,'','0'].indexOf($rootScope.region)!=-1)||(item.region.indexOf($rootScope.region)!=-1)) &&  item.stat==0)
			{
				FF_OperatorsInterval.items[i].f_service = f_service;
				FF_OperatorsInterval.items[i].iud = 2;
				$rootScope.f_service_null = false;
			}
		}
  }
  
  $scope.selfilter = function(item)
  {
	  return true;
  }
  $scope.fieldselect = function(item){return item ? item.name : null;}


}]);

SiteApp.controller('CtrlPay', ['$scope', '$rootScope', '$routeParams', 'FF_Pay', 'FF_Service', function($scope, $rootScope, $routeParams, FF_Pay, FF_Service)
{
  $scope.FF_Pay = FF_Pay;
  $scope.FF_Service = FF_Service;
  
  FF_Service.f_terminal= null;
  FF_Service.Load();
  $scope.currentPage = 1 ,$scope.numPerPage = 50 ,$scope.maxSize = 5;
  $scope.numPages = function () {return Math.ceil(FF_Pay.items.length / $scope.numPerPage);};
  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
	$scope.paging = {begin:begin, end:end};
  });
  
}]);

SiteApp.controller('CtrlTemplates', ['$scope', '$rootScope', '$routeParams', 'FF_Template', 'FF_Templateax', 'FF_Dictionaryes', function($scope, $rootScope, $routeParams, FF_Template, FF_Templateax, FF_Dictionaryes)
{
	$scope.FF_Template = FF_Template;
	$scope.FF_Templateax = FF_Templateax;
        $scope.FF_Dictionaryes = FF_Dictionaryes;
        
        $scope.FF_TemplateCurrent = function(item)
        {
            FF_Template.Param('edititem', FF_Template.Param('edititem').value== item.id ? '0' : item.id);
            for(var i=0;i<FF_Templateax.items.length;i++)
                if(FF_Templateax.items[i].f_template==item.f_template)
                    return;
            FF_Templateax.Load({f_template: item.f_template});
        }
        
        $scope.recalc_max_amount = function(item)
        {
            //item.pay_value_start
            //item.value_perc
            //item.value_min_amount
            if(item.value_min_amount)
                item.value_max_amount_temp = (item.value_max_amount && item.value_max_amount!=0) ? item.value_max_amount : 15000*( (item.value_perc && item.value_perc!=0) ? (item.value_perc/100) : 1.0);
            
        }


}]);

SiteApp.controller('CtrlTemplateax', ['$scope', '$rootScope', '$routeParams', 'FF_Template', 'FF_Templateax', function($scope, $rootScope, $routeParams, FF_Template, FF_Templateax)
{
		$scope.FF_Template   = FF_Template;
		$scope.FF_Templateax = FF_Templateax;
		$scope.f_template    = $routeParams.id;
		if($rootScope.f_template != $scope.f_template)
		{
			FF_Templateax.f_template = $routeParams.id;
			var mod = {f_template	  : $scope.f_template,};
			FF_Templateax.Load({f_template	  : $scope.f_template});
		}
		$rootScope.f_template = $routeParams.id;
    
}]);



SiteApp.controller('CtrlIncassation', ['$scope', '$rootScope', '$routeParams', 'FF_Incassation', 'FF_Terminal', 'FF_Client', function($scope, $rootScope, $routeParams, FF_Incassation, FF_Terminal, FF_Client)
{
    $scope.FF_Client = FF_Client;
    $scope.FF_Terminal = FF_Terminal;
    $scope.FF_Incassation = FF_Incassation;
  $scope.currentPage = 1 ,$scope.numPerPage = 50 ,$scope.maxSize = 5;
  $scope.numPages = function () {return Math.ceil(FF_Incassation.items.length / $scope.numPerPage);};
  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
	$scope.paging = {begin:begin, end:end};
  });
  
}]);

SiteApp.controller('CtrlEmpty', ['$scope', '$rootScope', '$routeParams', function($scope, $rootScope, $routeParams)
{
}]);



SiteApp.controller('CtrlHead', [ '$rootScope', '$scope', function( $rootScope, $scope ) 
{
}]);

SiteApp.controller('CtrlSession', [ '$rootScope', '$scope', 'FSession', function( $rootScope, $scope, FSession ) 
{
	$scope.FSession = FSession;

	$rootScope.$on('login:error', function(event, data){
		console.error(data);
	});
}]);



SiteApp.controller('CtrlTerminalIndex', [ '$rootScope', '$scope', 'FF_Terminal', 'FF_Client', 'FF_Service', 'FF_Dictionaryes', function( $rootScope, $scope, FF_Terminal, FF_Client, FF_Service, FF_Dictionaryes )
{
	$rootScope.rightside = 1;
	$rootScope.rightsidetitle = 'Фильтры';



    $scope.stat = null;
	$scope.f_client = null;
	$scope.FF_Terminal = FF_Terminal;
	$scope.FF_Client = FF_Client;
	$scope.FF_Service = FF_Service;
	$scope.FF_Dictionaryes = FF_Dictionaryes;

	
}]);

SiteApp.controller('CtrlTerminalInfo', [ '$rootScope', '$scope', 'FF_Terminal', '$routeParams', function( $rootScope, $scope, FF_Terminal, $routeParams ) 
{
	$scope.FF_Terminal = FF_Terminal;
	$scope.f_terminal  = $routeParams.id;
        
}]);

SiteApp.controller('CtrlTerminalServices', [ '$rootScope', '$scope', 'FF_Terminal', 'FF_Service' ,'FF_Template','FF_Templateax','$routeParams', function( $rootScope, $scope, FF_Terminal, FF_Service, FF_Template,FF_Templateax,$routeParams ) 
{
	// MARK
	$scope.FF_Terminal = FF_Terminal;
	$scope.FF_Service = FF_Service;
	$scope.FF_Template   = FF_Template;
	$scope.FF_Templateax = FF_Templateax;
	
	$scope.f_terminal    = $routeParams.id;
	if($rootScope.f_terminal != $scope.f_terminal)
	{
		FF_Service.f_terminal = $routeParams.id;
		var mod = {f_terminal	  : $scope.f_terminal,};
		FF_Service.Load(mod);			
	}
	$rootScope.f_terminal = $routeParams.id;
	
}]);

SiteApp.controller('CtrlUserInfo', [ '$rootScope', '$scope', 'FF_Client', 'FF_Dictionaryes', '$routeParams', function( $rootScope, $scope, FF_Client, FF_Dictionaryes, $routeParams ) 
{
	$scope.FF_Dictionaryes = FF_Dictionaryes;
	$scope.FF_Client       = FF_Client;
	$scope.f_client        = $routeParams.id;
}]);

SiteApp.controller('CtrlUserIndex', [ '$rootScope', '$scope', 'FF_Client', 'FF_Dictionaryes', 'FF_Terminal', 'FF_Service', 'FF_Access', 'FSession', 'FF_Contact', function( $rootScope, $scope, FF_Client, FF_Dictionaryes, FF_Terminal,FF_Service, FF_Access, FSession, FF_Contact ) 
{
	

        $scope.FF_Contact = FF_Contact;
	$scope.FSession = FSession;
	$scope.FF_Access = FF_Access;
	$scope.FF_Terminal = FF_Terminal;
	$scope.FF_Client = FF_Client;
	$scope.FF_Service = FF_Service;
	$scope.FF_Dictionaryes = FF_Dictionaryes;
        
        
        
        $rootScope.$on('FF_Client:loaded', function(){
            if(FF_Client.items.length==1)
                FF_Client.Event('FF_Client:edititem:change', FF_Client.items[0].f_client );
        });
        
        $scope.edit_client = function(item){
            FF_Client.Param('edititem', FF_Client.Param('edititem').value== item.id ? '0' : item.id);
            if(FF_Client.Param('edititem').value == item.id)
                FF_Client.Event('FF_Client:edititem:change', item.f_client );
        };

	
}]);

SiteApp.controller('CtrlUserCassa', [ '$rootScope', '$scope', 'FF_Client', 'FF_Dictionaryes', '$routeParams', 'FF_Model', 'FF_Terminal', 'FF_Account', 'SiteDatabase', 'FSession',function( $rootScope, $scope, FF_Client, FF_Dictionaryes, $routeParams, FF_Model, FF_Terminal, FF_Account, SiteDatabase, FSession ) 
{
    
        $scope.FSession = FSession;
	$scope.FF_Dictionaryes = FF_Dictionaryes;
	$scope.FF_Client       = FF_Client;
	$scope.f_client        = $routeParams.id;
        $scope.FF_Model        = FF_Model;
        $scope.FF_Account        = FF_Account;
        $scope.c_acctype= 0;
        $scope.f_client= 0;
        
        var dt='0',ct='0';
        var dictionary_c_acctype = [];
        
        $rootScope.$on('FF_Dictionaryes:loaded', function(){});
        
        $rootScope.$on('model:change', function(){
            $scope.item_selected();            
        });
        
        $scope.hzhzhzhz = 0;
        $scope.hzhz2 = 0;
        
        $scope.reload_model = function(model)
        {
            //FF_Model.Load({f_client:FSession.current.f_client,c_paytype:hzhzhzhz})
            console.log('catch!!!',{f_client:FSession.current.f_client,c_paytype:$scope.hzhzhzhz});
        };
        
        $scope.item_selected = function(item)
        {
            var dict = FF_Dictionaryes.dictionary('lst_system_c_paytype');
            for(var i =0;i<FF_Model.items.length;i++)
            for(var j =0;j<dict.length;j++)
                if(FF_Model.items[i].c_paytype==dict[j].c_paytype && dict[j].name=='Пополнение счёта терминала')
                    $scope.hzhzhzhz = FF_Model.items[i].c_paytype;
        }
        
        $scope.filter42 = function(fab1,fab2,field1,field2, field3)
        {
            var arr = [];
            for(var i=0;i<fab1.items.length;i++)
                for(var j=0;j<fab2.items.length;j++)
                    if(fab1.items[i][field1]===fab2.items[j][field2])
                    {
                        fab2.items[j].f_model = fab1.items[i];
                        arr.push(fab2.items[j]);
                    }
            if(arr.length>0)
                if(!$scope.hzhz2)
                    $scope.hzhz2 = arr[0].c_acctype;
            return arr;
        }
                
                
        $scope.Process = function(client, mod1, mod2)
        {

            var date = new Date();
            var ct = 0;    
            var model = 0;
            var acc = 0;
            /*for(var i=0;i<FF_Account.items.length;i++)
                if(FF_Account.items[i].f_account==mod2)
                {
                    model = FF_Account.items[i].f_model;
                    acc  = FF_Account.items[i].f_account;
                }
            
            for(var i=0;i<FF_Account.items.length;i++)
                if(FF_Account.items[i].f_client==client.f_client &&
                    model.c_acctype_dt == FF_Account.items[i].c_acctype)
                {
                    ct = FF_Account.items[i].f_account;
                    //console.log('MOD',ct);
                }*/
            
            var mod = {
                        action:'iud_system_f_pay',
                        iud:1,
                        //f_pay IN BIGINT,
                        c_currency:1,
                        f_account_dt:client.cur,
                        f_account_ct:mod2,//acc,//mod2,
                        dts_request:date.format("yyyy-mm-dd HH:MM:ss"),
                        value_cur:client.amount,
                        //additional IN XML,
                        stat:0,
                        c_error:0,
                        c_paytype:mod1
                
                    };
            
            console.log('iud_system_f_pay',mod, client, mod1, mod2);
            //return;
            SiteDatabase.query(
                    mod, function(data1,data2){
                        console.log('iud_system_f_pay:result',data1,data2);
                    }, function(data1,data2){
                        FF_Account.reload();
                    }, null
                    );
        }
}]);




SiteApp.controller('CtrlUserWays', [ '$rootScope', '$scope', 'FF_Client', 'FF_Dictionaryes', 'FF_Terminal','$routeParams', 'FF_Terminalgroup', function( $rootScope, $scope, FF_Client, FF_Dictionaryes,FF_Terminal, $routeParams, FF_Terminalgroup ) 
{
    
        $scope.FF_Terminal = FF_Terminal;
        $scope.FF_Terminalgroup = FF_Terminalgroup;
	$scope.FF_Dictionaryes = FF_Dictionaryes;
	$scope.FF_Client       = FF_Client;
	$scope.f_client        = $routeParams.id;
        return;
        FF_Terminalgroup.items.push({
            iud:1,
            f_client:5,
            name:"test2",
            f_terminals:[4]
        });
        
        FF_Terminalgroup.Save();
}]);