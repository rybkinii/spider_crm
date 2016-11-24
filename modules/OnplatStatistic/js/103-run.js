SiteApp.run(function($rootScope)
{
    window.$transform = $rootScope;
    
	if(!$rootScope.Translate)
		$rootScope.Translate = function(a){return a;};
	if(!$rootScope.CreateTicker)
		$rootScope.CreateTicker = function(scope, name, period){setInterval(function(){ scope.$broadcast(name); }, period);}

    console.info($rootScope.Translate('Init kernel timers'));
    $rootScope.CreateTicker($rootScope, 'timer:second_1', 1*1000);
	$rootScope.CreateTicker($rootScope, 'timer:second_5', 2*1000);
	$rootScope.CreateTicker($rootScope, 'timer:second_10', 10*1000);
	$rootScope.CreateTicker($rootScope, 'timer:minute', 60*1000);
});