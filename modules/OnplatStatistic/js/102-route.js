
SiteApp.config(['$routeProvider', '$httpProvider', '$locationProvider',  function($routeProvider, $httpProvider, $locationProvider)
{
    
    $locationProvider.html5Mode({enabled: true,requireBase: false});
    
    $routeProvider.
           


	when('/Payment/Index', { templateUrl: 'templates/Payment/Index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Report/Consolidated', { templateUrl: 'templates/Report/Consolidated.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Report/DailyReport', { templateUrl: 'templates/Report/DailyReport.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Balance/BankHistory', { templateUrl: 'templates/Balance/BankHistory.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Report/AgentCommissionEarned', { templateUrl: 'templates/Report/AgentCommissionEarned.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Report/ProfitFromSubagents', { templateUrl: 'templates/Report/ProfitFromSubagents.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Balance/History', { templateUrl: 'templates/Balance/History.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Encashment/Index', { templateUrl: 'templates/Encashment/Index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Report/TerminalsProfitability', { templateUrl: 'templates/Report/TerminalsProfitability.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Agent/Create', { templateUrl: 'templates/Agent/Create.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Agent/Search', { templateUrl: 'templates/Agent/Search.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Agent/Index', { templateUrl: 'templates/Agent/Index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	
        
        when('/Ways', { templateUrl: 'templates/User/Ways.html', controller: 'CtrlEmpty', reloadOnSearch: false }).	
        when('/Cassa', { templateUrl: 'templates/User/Cassa.html', controller: 'CtrlEmpty', reloadOnSearch: false }).	
	when('/User/Create', { templateUrl: 'templates/User/Create.html', controller: 'CtrlEmpty', reloadOnSearch: false }).	
	when('/User/', { templateUrl: 'templates/User/Index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
        when('/Me/', { templateUrl: 'templates/User/Me.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	//when('/User/:id', { templateUrl: 'templates/User/Info.html', controller: 'CtrlEmpty', reloadOnSearch: false }).

	when('/Terminal/Create', { templateUrl: 'templates/Terminal/Create.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Terminal/', { templateUrl: 'templates/Terminal/Index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Terminal/:id', { templateUrl: 'templates/Terminal/Services.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	//when('/Services', { templateUrl: 'templates/Terminal/Services.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Templates' , { templateUrl: 'templates/Terminal/Templates.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Templates/:id' , { templateUrl: 'templates/Terminal/Templateax.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	//when('/Terminal/:id/Services/:sid', { templateUrl: 'templates/Terminal/Services.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	
	when('/Commission/ExternalCommission', { templateUrl: 'templates/Commission/ExternalCommission.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Commission/IndexTemplate', { templateUrl: 'templates/Commission/IndexTemplate.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/NominalRules', { templateUrl: 'templates/NominalRules/NominalRules.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Terminal/IndexCollectorRoutes', { templateUrl: 'templates/Terminal/IndexCollectorRoutes.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Terminal/Locations', { templateUrl: 'templates/Terminal/Locations.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/DynamicReport/Create', { templateUrl: 'templates/DynamicReport/Create.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Agent/Activation', { templateUrl: 'templates/Agent/Activation.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Balance/Redistribution', { templateUrl: 'templates/Balance/Redistribution.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Balance/AgentCommissions', { templateUrl: 'templates/Balance/AgentCommissions.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Encashment/Verification', { templateUrl: 'templates/Encashment/Verification.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Monitoring/Index', { templateUrl: 'templates/Monitoring/Index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Monitoring/IndexLog', { templateUrl: 'templates/Monitoring/IndexLog.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Monitoring/IndexZReport', { templateUrl: 'templates/Monitoring/IndexZReport.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Advertisement/IndexAdvertMinisite', { templateUrl: 'templates/Advertisement/IndexAdvertMinisite.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Advertisement/IndexAdvertTemplate', { templateUrl: 'templates/Advertisement/IndexAdvertTemplate.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Advertisement/IndexAssignment', { templateUrl: 'templates/Advertisement/IndexAssignment.html', controller: 'CtrlEmpty', reloadOnSearch: false }).

	when('/Pays', { templateUrl: 'templates/Terminal/Pays.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/Incass', { templateUrl: 'templates/Terminal/Incass.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/'           , { templateUrl: 'templates/index.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
    when('/login'           , { templateUrl: 'templates/page-login.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/logout'           , { templateUrl: 'templates/page-logout.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	when('/ServiceSettings'           , { templateUrl: 'templates/ss_change.html', controller: 'CtrlEmpty', reloadOnSearch: false }).
	
	
    otherwise({ redirectTo: '/' });
    
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
}]);