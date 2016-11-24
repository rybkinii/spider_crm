
SiteApp.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
});


SiteApp.filter('filter_property',[ function() {
  return function(items, props) {
    var out = [];
    //console.log(items,props)
    if (!angular.isArray(items)) return items;
    items.forEach(function(item) {
        var match = true;
        for (var i = 0; i < props.length; i++)
        {
            var prop = props[i].field;
            var text = props[i].value;
            if(text.toLowerCase)
                text = text.toLowerCase();
            
            if(!item['__ignore_filters'])
            {
                if((typeof item[prop]||null)===null)
                    console.error('Filter','filter_property', items, prop, item[prop]);
                else
                {
					if(item[prop])
					{
						if(props[i].value.toLowerCase)
						{
							if (item[prop].toString().toLowerCase().indexOf(text) === -1)
								match = false;
						}
						else
						{
							if (item[prop] != text)
								match = false;
						}
					}
                }
            }
        }
        if (match) out.push(item);
    });
    
    return out;
  };
}]);

SiteApp.filter('imgFilter', function() {
    return function(imgs, id) {
        if (id === undefined) {
            return imgs;
        }
        var result = [];
        for (i = 0; i < imgs.length; i++) {
            if (imgs[i].id === id) {
                result.push(imgs[i]);
            }
        }
        return result;
    }
});

SiteApp.filter('propsMachFilter', function() {
    return function(items, props) {
        var out = [];
        if (angular.isArray(items)) {
            var keys = Object.keys(props);
            items.forEach(function(item) {
                var itemMatches = 0;
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    if((props[prop]||null)===null&&props[prop]!=0)
                        console.error('Filter','filter_property', items, props, props[prop]);
                    var text = props[prop].toString().toLowerCase();
                    if(item[prop])
                    if (item[prop].toString().toLowerCase() === text) {
                        itemMatches++;
                    }
                }
                if (itemMatches == keys.length) {
                    out.push(item);
                }
            });
        } else {
            out = items;
        }
        return out;
    };
});

SiteApp.filter('iud_change', function(){return function(item, props) {if(item.iud === 0 || item.iud === undefined)item.iud = 2;if(item.iud=== 2 && item.id===undefined)item.iud = 1;};})
SiteApp.filter('iud_undo', function(){return function(item, props) {if(item.iud=== 3)item.iud = 2;if(item.iud=== 4)item.iud = 1;};})
SiteApp.filter('iud_delete', function(){return function(item, props) {if(item.iud  === 1)item.iud = 4;else item.iud = 3;};})
SiteApp.filter('iud_class', function() {return function (item) {return ' iud_item iud-n' + item.iud + ' ';};})

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
})

SiteApp.filter('isset', function() {
  return function (value) {
      if(value==='' || value===null || value===undefined)
          return false;
    return true;
  };
})

SiteApp.filter('get_indexed_value', function() {
  return function (search, attr) {
    for(var i=0;i<attr.list.length;i++)
	{
        if(attr.list[i][attr.index]==search)
            return attr.list[i][attr.field];
	}
    return search;
  };
})

SiteApp.filter('check_filter', function() {
  return function (value, attr) {
    for(var filter in attr)
        if(attr[filter])
            if(attr[filter] != value[filter])
                return false;
    return true;
  };
})

SiteApp.filter('check_mask', function() {
  return function (value, attr) {
      return attr.list[attr.index] == 1;
    return true;
  };
});
