function get_tp_prices(params, callback){
    var url = "https://api.guildwars2.com/v2/commerce/prices";
    //return 
    get_api_results(params, url, callback);    
}

function get_tp_items(params, callback){
    var url = "https://api.guildwars2.com/v2/items";
    //return 
    get_api_results(params, url, callback);    
}

function get_api_results(params, api_url, callback){
	var result = $.ajax({
	 	url: api_url,

	 	data: params,

		dataType : "json",

	  	success: function(json) {
            //console.log(JSON.stringify(json, null));
            //result = json;
            //console.log("-");
            //console.log(JSON.stringify(result, null));
	  		callback(json);
	 	},

		error: function( xhr, status, errorThrown) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	},
    });
}

function update_field(cell_location, new_value){
    if(cell_location.textContent != new_value){
        if(cell_location.textContent < new_value){
            $(cell_location).removeClass( "value-dropped");        
            $(cell_location).addClass( "value-raised");        
        }else{
            $(cell_location).removeClass( "value-raised"); 
            $(cell_location).addClass( "value-dropped");        
        }                            
                       
    }else{
        $(cell_location).removeClass( "value-raised value-dropped");        
    }

    cell_location.textContent = new_value;
}

function get_precursors(){


    var params = "ids=";
    var rows = document.getElementById('precursor-table').getElementsByTagName('tr');
    
    var first = true;
    
    $(rows).each(function()
    {
        if(first){
            params += $(this).id;
            first = false;
        }else{
            params += ",";
            params += $(this).id;               
        }
        
        console.log(params);
    });

    //get_tp_prices(params, process_item_updates);
}

function process_item_updates(result){

    var id;
    var buyPrice;
    var sellPrice;
    var classid;
    //console.log(JSON.stringify(result, null));
    $.each(result, function(key, value) {
           
        //console.log(value["buys"]["unit_price"]);
        id = value["id"];
        buyPrice = value["buys"]["unit_price"];
        demand = value["buys"]["quantity"];
        sellPrice = value["sells"]["unit_price"];
        supply = value["sells"]["quantity"];

        //$(value["id"] + ' .itemBuyPrice') = value["id"]["buys"]["unit_price"];
        //document.getElementById(value["id"]).getElementsByClassName('itemBuyPrice')[0].setAttribute("innerHTML", value["id"]["buys"]["unit_price"]);
        update_field(document.getElementById(id).getElementsByClassName('itemBuyPrice')[0], buyPrice); 
        

        update_field(document.getElementById(id).getElementsByClassName('itemDemand')[0], demand); 
        
        
        update_field(document.getElementById(id).getElementsByClassName('itemSellPrice')[0], sellPrice);


        update_field(document.getElementById(id).getElementsByClassName('itemSupply')[0], supply);            
            
    }); 
}


function get_item_info(){
    var precursors = "29166,29167,29168,29169,29170,29171,29172,29173,29174,29175,29176,29177,29178,29179,29180,29181,29182,29183,29184,29185";

    var params = "ids=" + precursors;
    get_tp_items(params, process_item_info);
}

function process_item_info(result){
    //console.log(JSON.stringify(result, null));
    var id;
    var name;
    var image;

    var table = document.getElementById("Legendary-table");


    $.each(result, function(key, value) {
        id = value["id"];
        name = value["name"];
        image = value["icon"];

        var row = table.insertRow(-1);
        row.id = id;
        var cell1 = row.insertCell(0);        
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);        
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);        
        var cell6 = row.insertCell(5);
        cell1.innerHTML = id;
        cell2.innerHTML = "<img class=\"image\" src=\"" + image + "\" width=\"20\" height=\"20\"> " + name;
        cell3.addClass = "itemBuyPrice";
        cell4.addClass = "itemDemand";
        cell5.addClass = "itemSellPrice";
        cell6.addClass = "itemSupply";
    });

    get_precursors();
    var TradingPostInterval = setInterval(function () {
            get_precursors();
        },60000);
}


//console.log(get_item_info());