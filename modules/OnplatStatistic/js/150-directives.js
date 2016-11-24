

SiteApp.directive('dateDiapazon', function($compile) {
  return {
    restrict: "E",
    require: '?ngModel',
    transclue: false,
    scope: {name: '=', class:'@'},
    link: function(scope, element, attrs, ngModel)
    {
        /*scope.selectorSource = null;
        scope.$watch('ngModel', function() {
                    scope.selectorSource = ngModel.$viewValue;
                });
        scope.setModel = function(val)
        {
            ngModel.$setViewValue(val);
            console.log(ngModel.$viewValue);
        };*/
		
		
		$('#Period').selectpicker({ liveSearch: false, maxOptions: 1 });
        
    },
    template: "\
					<select id=\Period\ class='selectpicker  show-tick input-sm form-control'>\
						<option value='0'>За сегодня</option>\
						<option value='1'>За вчера</option>\
						<option value='2'>За последние 7 дней</option>\
						<option value='3'>За последние 14 дней</option>\
						<option value='4'>За последние 30 дней</option>\
						<option value='5'>За текущий месяц</option>\
						<option value='6'>За прошлый месяц</option>\
					</select><br/><br/>\
				&nbsp;c&nbsp;\
				<input data-provide='datepicker' class='input-sm'>\
				&nbsp;по&nbsp;\
				<input data-provide='datepicker' class='input-sm'>\
"
  };
});

SiteApp.directive('datatable',['SiteDatabase','$location',  function(SiteDatabase,$location) {
  return {
    scope: {
      datatableService: '=service',
      detailLink: '=detaillink',      
      canDelete: '=candelete',            
      datatableCaption: '@caption',
      datatableNotice: '@notice',
      //datatableInfo: '@info',
	  datatablePaginator: '=paginator',
	  //datatablePagesize: '=pagesize',
      datatableTemplate: '=templates',
      datatableStatus: '=status',
      datatableModel: '=model',
    },
    link: function(scope, element, attrs, ctrl)
    {
        //scope.LangService = LangService;
        scope.SiteDatabase = SiteDatabase;
        scope.urlpath = $location.$$path;
        //scope.OrderServise = OrderServise;
        //scope.FoodsService = FoodsService;
        //scope.SystemService = SystemService;
        //console.log('FF_OperatorsInterval_fields');
        scope.ChangeDatatableTemplate = function(item, template)
        {
            var changed = item.__datatabletemplate != template.url;
            if(changed && !item.showinfo)
                item.showinfo = true;
            if(!changed)
                    item.showinfo = !item.showinfo;
            item.__datatabletemplate = template.url;
            //console.log(item.__datatabletemplate);
        }
    },
    templateUrl: '/templates/Directives/datatable.html'
  };
}]);

SiteApp.directive('datacontrol',['LangService',function(LangService) {
  return {
    scope: {
      datacontrolService: '=service'
    },
    link: function(scope, element, attrs)
    {
        //scope.LangService = LangService;
    },
    templateUrl: '/templates/Directives/datacontrol.html'
  };
}]);



SiteApp.directive("formatDate", function(){
  return {
   require: 'ngModel',
    link: function(scope, elem, attr, modelCtrl) {
      modelCtrl.$formatters.push(function(modelValue){
        return new Date(modelValue);
      })
    }
  }
});



SiteApp.directive('selectorSource', function($compile) {
  return {
    restrict: "E",
    require: '?ngModel',
    transclue: false,
    scope: {source: '=', search:'=',filter:'=',class:'@',clearing:'='},//
    link: function(scope, element, attrs, ngModel)
    {
        scope.selectorSource = null;
        scope.$watch('ngModel', function() {
                    scope.selectorSource = ngModel.$viewValue;
                });
        scope.setModel = function(val)
        {
            ngModel.$setViewValue(val);
            console.log(ngModel.$viewValue);
        };
        
    },
    template: "\
    <ui-select search-enabled='search'  ng-if='clearing' class='{{class}}' ng-model='selectorSource' ng-change='setModel(selectorSource);' theme='select2'>\
        <ui-select-match placeholder='select...' allow-clear='true'>\
            {{ source.fieldfun ? source.fieldfun($select.selected) : $select.selected[source.field] }}\
        </ui-select-match>\
        <ui-select-choices repeat='item[source.index] as item in source.list | filter: $select.search' >\
            {{source.fieldfun ? source.fieldfun(item) : item[source.field] }}\
        </ui-select-choices>\
    </ui-select>\
    <ui-select search-enabled='search'  ng-if='!clearing' class='{{class}}' ng-model='selectorSource' ng-change='setModel(selectorSource);' theme='select2'>\
        <ui-select-match placeholder='select...' allow-clear='false'>\
            {{$select.selected[source.field]}}\
        </ui-select-match>\
        <ui-select-choices repeat='item[source.index] as item in source.list | filter: $select.search'>\
            {{item[source.field]}}\
        </ui-select-choices>\
    </ui-select>\
"
  };
});



SiteApp.directive('ngStaticInclude', [
  '$compile',
  '$templateCache',
  function($compile, $templateCache) {
    return {
      restrict: 'E',
      priority: 400,
	  transclude: true,
      compile: function(element, attrs){
        var template = null;
        return function(scope, element){
			if(!template)
				template = $templateCache.get(scope.template);
          element.html(template);
          $compile(element.contents())(scope);
        };
      }
    };
  }
]);

SiteApp.directive("tree", ['$compile','$templateCache',function($compile, $templateCache) {
return {
    restrict: "E",
	priority: 400,
    scope: {family: '=',options:'=', current:'=', template:'@'},
    template: 
        '<ul>'+
            "<li ng-repeat='item in family'   ng-if='item[options.parent]==current[options.index]'>" + 
                "<i class='fa fa-plus clickable  pull-left'        ng-if=' childs_count(item[options.index]) && !$root.treedisplay[item.id]' ng-click='$root.treedisplay[item.id]=!$root.treedisplay[item.id];'></i>"+
                "<i class='fa fa-minus clickable pull-left'       ng-if=' childs_count(item[options.index]) &&  $root.treedisplay[item.id]' ng-click='$root.treedisplay[item.id]=!$root.treedisplay[item.id];'></i>"+
                "<i class='fa fa-file-o  clickable   pull-left' ng-if='!childs_count(item[options.index])'                      ng-click=''></i>"+                
				"<ng-static-include></ng-static-include>" + 
                "<div style='clear:both;'></div>"+
                "<tree ng-if='$root.treedisplay[item.id]' family='family' template='{{template}}' options='options' current='item'></tree>" +
            '</li>' +
        '</ul>', 
    compile: function(tElement, tAttr) {
        var contents = tElement.contents().remove();
        var compiledContents = $compile(contents);
		var templatename = tAttr.template;
		//var templatecache = $templateCache.get(templatename);
        return function(scope, iElement, iAttr) {			
            scope.childs_count = function(id)
            {
                var count = 0;
                for(var item in scope.family)
                    if(scope.family[item][scope.options.parent]==id)
                        count++;
                return count;
            }
            compiledContents(scope, function(clone, scope) {
				scope.template = templatename;
				iElement.append(clone);
			});
        };
    }
};
}]);

