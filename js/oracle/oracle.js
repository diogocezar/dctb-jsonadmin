var Shared = {
	__is_empty: function(val){
		return (val == "" || val == null || val == undefined);
	},
}

var Preloader = {
	counter : 0,
	config  : {
		delay    : 500,
		recheck  : 200,
		timeout  : 200,
		velocity : "slow"
	},
	init: function(callBack){
		if(
			!Shared.__is_empty(Oracle.JSON["schema"]) &&
			!Shared.__is_empty(Oracle.JSON["data"])
		){
			Preloader.pageLoaded();
			callBack();
		}
		else{
			setTimeout(function(){
				console.log('Still Loading ' + Preloader.counter++);
				if(Preloader.counter > Preloader.config.timeout){
					console.error("Loading timeout.");
					Preloader.pageLoaded();
					callBack();
				}
				else{
					Preloader.init(callBack);
				}
			}, Preloader.config.recheck);
		}
	},
	pageLoaded: function(){
		Preloader.hide();
	},
	show: function(){
		$("#status").fadeIn();
		$("#preloader").delay(Preloader.delay).fadeIn(Preloader.velocity);
	},
	hide: function(){
		$("#status").fadeOut();
		$("#preloader").delay(Preloader.delay).fadeOut(Preloader.velocity);
	}
};

var MyJSON = {
	get: function(name){
		$.ajax({
			dataType : "json",
			url      : "./data/" + name + ".json",
			success: function (result) {
				Oracle.JSON[name] = result;
			},
			error: function (xhr, ajaxOptions, thrownError){
				console.error("Error loading json: " + xhr.status + " - " + thrownError);
			}
		});
	}
}

var Oracle = {
	JSON   : [],
	editor : null,
	config : {
		"id_container" : "form_json",
		"id_send"      : "form_send",
		"id_console"   : "form_console",
		"options" :
		{
				disable_collapse   	: true,
				disable_edit_json  	: true,
				disable_properties 	: true,
				iconlib 			: 'fontawesome4',
				theme   			: 'bootstrap3',
				ajax    			: true
		}
	},
	setResizes: function(){
		$(".json-output").height($("[data-schemaid='person']").height());
	},
	setEvents: function(){
			$("#" + Oracle.config['id_send']).on('click', function(){
				var errors = Oracle.editor.validate();
				if(!errors.length) {
  					var data = JSON.stringify(Oracle.editor.getValue(),null,4);
  					Oracle.save(data);
				}
        	})
        	$(".json-output").on('click', function(){
        		$(".json-output").focus();
        		$(".json-output").select();
        	});
	},
	start: function(){
			Oracle.config.options.schema = Oracle.JSON["schema"];
			var options = Oracle.config.options;
			$("#" + Oracle.config['id_container']).empty();
			var element = document.getElementById(Oracle.config['id_container']);
			Oracle.editor = new JSONEditor(element, options);
			Oracle.editor.on('ready', function(){
				Oracle.editor.setValue(Oracle.JSON["data"]);
			});
			Oracle.editor.on('change', function() {
	            $(".json-output").val(JSON.stringify(Oracle.editor.getValue(),null,4));
        	});
	},
	init: function(){
		MyJSON.get("schema");
		MyJSON.get("data");
		Preloader.init(function(){
			Oracle.start();
			Oracle.setEvents();
			Oracle.setResizes();
		});
	},
	save: function(data){
		$.ajax({
			type: "POST",
			url: "./save",
			data:
			{
				data: data,
			},
			success: function (result) {
				var result_json = JSON.parse(result);
				if(result_json.success == "false"){
					alert('Houve um erro ao salvar o JSON');
				}
				else{
					window.location.reload();
				}
			}
		});
	}
}

$(document).ready(function(){
    Oracle.init();
});