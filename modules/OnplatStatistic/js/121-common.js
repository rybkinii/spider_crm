
SiteApp.filter('iud_change', function(){return function(item, props) {if(item.iud === 0 || item.iud === undefined)item.iud = 2;if(item.iud=== 2 && item.id===undefined)item.iud = 1;};});
SiteApp.filter('iud_undo', function(){return function(item, props) {if(item.iud=== 3)item.iud = 2;if(item.iud=== 4)item.iud = 1;};});
SiteApp.filter('iud_delete', function(){return function(item, props) {if(item.iud  === 1)item.iud = 4;else item.iud = 3;};});
SiteApp.filter('iud_class', function() {return function (item) {return ' iud_item iud-n' + item.iud + ' ';};});

SiteApp.filter('unique', function() {
  return function (arr, field) {
    var o = {}, i, l = arr.length, r = [];
    for(i=0; i<l;i+=1) {
      o[arr[i][field]] = arr[i];
    }
    for(i in o) {
      r.push(o[i]);
    }
    return r;
  };
});

SiteApp.filter('isset', function() {
  return function (value) {
      if(value==='' || value===null || value===undefined)
          return false;
    return true;
  };
});

SiteApp.filter('idx_value', function() {
  return function (search, attr) {
    for(var i=0;i<attr.list.length;i++)
        if(attr.list[i][attr.index]==search)
            return attr.list[i][attr.field];
    return search;
  };
});



;