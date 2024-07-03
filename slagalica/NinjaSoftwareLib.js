function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    

    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
};

/* START URL specific functions */

var nsUrl = namespace("ninjaSoftware.url");

nsUrl.getParameterValue = function (parameterName) {
    parameterName = parameterName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + parameterName + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
};

nsUrl.setParameters = function (params, openInNewWindow) {
    var queryParameters = {};
    var queryString = location.search.substring(1);
    var re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    $.each(params, function (key, value) {
        queryParameters[key] = value;
    });

    if (openInNewWindow) {
        window.open(window.location.pathname + "?" + $.param(queryParameters));
    }
    else {
        location.search = $.param(queryParameters);
    }
};

/* END URL specific functions */

/* START HTML element specific functions */

var nsHtmlInput = namespace("ninjaSoftware.htmlInput");

nsHtmlInput.submitAsRedirect = function (submitId, redirectUrl) {
    $(document).ready(function () {
        $("#" + redirectUrl).click(function (e) {
            e.preventDefault();
            window.location.href = redirectUrl;
        });
    });
};

/* END HTML element specific functions */

/* START AngularJs specific functions*/ 

var nsAngular = namespace("ninjaSoftware.angularjs");

nsAngular.safeApply = function ($scope, fn) {
	var phase = $scope.$root.$$phase;
	
	if (phase == '$apply' || phase == '$digest') {
		if(fn && (typeof(fn) === 'function')) {
			fn();
		}
	}
	else {
		$scope.$apply(fn);
	}
};

nsAngular.isObjectExist = function (item) {
	if (item) {
		return String.trim(item.toString()).length > 0;
	}
	else {
		return false;
	}
};

/* END AngularJs specific functions */

/* START js validation */

var nsValidation = namespace("ninjaSoftware.validation");

nsValidation.isNumeric = function (input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
};

/* END js validation */

/* START AJAX helpers */

var nsAjaxHelper = namespace("ninjaSoftware.ajaxHelper");

// params{ url, jsonObject, success, error }
nsAjaxHelper.postJson = function (params) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: params.url,
        data: JSON.stringify(params.jsonObject),
        dataType: "json",
        success: function (result) {
            //alert("save");
            params.success(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            params.error(XMLHttpRequest, textStatus, errorThrown);
        },
        async: false,
        cache: false
    });
};

// params { url, data, success, error }
nsAjaxHelper.getJson = function (params) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: params.url,
        data: params.data,
        success: function (result) {
            //alert("load");
            params.success(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            params.error(XMLHttpRequest, textStatus, errorThrown);
        },
        async: false,
        cache: false
    });
};

/* START AJAX helpers */