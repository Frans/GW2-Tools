function get_tp_prices(params, callback, tab){
    var url = "https://api.guildwars2.com/v2/commerce/prices";
    //return 
    get_api_results(params, callback, tab, url);    
}

function get_tp_items(params, callback, tab){
    var url = "https://api.guildwars2.com/v2/items";
    //return 
    get_api_results(params, callback, tab, url);    
}

function get_api_results(params, callback, tab, api_url){
	var result = $.ajax({
	 	url: api_url,

	 	data: params,

		dataType : "json",

	  	success: function(json) {
            //console.log(JSON.stringify(json, null));
            //result = json;
            //console.log("-");
            //console.log(JSON.stringify(result, null));
	  		callback(json, tab);
	 	},

		error: function( xhr, status, errorThrown) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	},
    });
}

function update_field(cell_location, new_value, new_html){
    if(cell_location.value != new_value){
        if(cell_location.value < new_value){
            $(cell_location).removeClass( "value-dropped");        
            $(cell_location).addClass( "value-raised");        
        }else{
            $(cell_location).removeClass( "value-raised"); 
            $(cell_location).addClass( "value-dropped");        
        }                            
                       
    }else{
        $(cell_location).removeClass( "value-raised value-dropped");        
    }

    cell_location.value = new_value;
    cell_location.innerHTML = new_html;
}

function get_item_updates(tab){


    var params = "ids=";
    //var rows = document.getElementById('precursor-table').getElementsByTagName('tr');
    
    var first = true;
    
    $("#" + tab + "-table .itemRow").each(function()
    {
        if(first){
            params += this.id;
            first = false;
        }else{
            params += ",";
            params += this.id;               
        }
        
        //console.log(params);
    });

    get_tp_prices(params, process_item_updates, tab);
}

function process_item_updates(result, tab){

    var id;
    var buyPrice;
    var sellPrice;
    var classid;
    var table = document.getElementById(tab + "-table");
    //console.log(JSON.stringify(result, null));
    $.each(result, function(key, value) {
           
        //console.log(value["buys"]["unit_price"]);
        id = value["id"];
        id = id.toString();
        buyPrice = value["buys"]["unit_price"];
        demand = value["buys"]["quantity"];
        sellPrice = value["sells"]["unit_price"];
        supply = value["sells"]["quantity"];

        //$(value["id"] + ' .itemBuyPrice') = value["id"]["buys"]["unit_price"];
        //document.getElementById(value["id"]).getElementsByClassName('itemBuyPrice')[0].setAttribute("innerHTML", value["id"]["buys"]["unit_price"]);
        buyPriceHTML = add_coin_images(buyPrice);
        update_field(document.getElementById(tab + "-table").getElementsByClassName("itemBuyPrice " +id)[0], buyPrice, buyPriceHTML); 
        

        update_field(document.getElementById(tab + "-table").getElementsByClassName("itemDemand " +id)[0], demand, demand); 
        
        sellPriceHTML = add_coin_images(sellPrice);
        update_field(document.getElementById(tab + "-table").getElementsByClassName("itemSellPrice " +id)[0], sellPrice, sellPriceHTML);


        update_field(document.getElementById(tab + "-table").getElementsByClassName("itemSupply " +id)[0], supply, supply);            
            
    }); 
}

function add_coin_images(price){
    price = price.toString();
    var length = price.length;
    var newPrice;
    while(length < 5){
        price = "0" + price;
        length = price.length;
    }

    //console.log(price);    
    newPrice = price.substr(length-2,2) + " <img class=\"image\" src=\"image/Copper_coin.png\" width=\"10\" height=\"10\">";     
    newPrice = price.substr(length-4,2) + " <img class=\"image\" src=\"image/Silver_coin.png\" width=\"10\" height=\"10\"> " + newPrice;
    newPrice = price.substr(0,length-4) + " <img class=\"image\" src=\"image/Gold_coin.png\" width=\"10\" height=\"10\"> " + newPrice;
    return newPrice;
}

function get_item_info(items){
    //var precursors = "29166,29167,29168,29169,29170,29171,29172,29173,29174,29175,29176,29177,29178,29179,29180,29181,29182,29183,29184,29185";
    
    
    var params;
    var tab;
    var len = items.length;
    var i;
    for(i = 0; i < len; i++){

        tab = items[i];
        i++;
        params = "ids=" + items[i];
        
        get_tp_items(params, process_item_info, tab);
    }
    //var params = "ids=" + precursors;
    //get_tp_items(params, process_item_info);
}

function process_item_info(result, tab){
    //console.log(JSON.stringify(result, null));
    var id;
    var name;
    var image;

    var table = document.getElementById(tab + "-table");
    var elements;
    var arr;
    var newRowSet = false;

    $.each(result, function(key, value) {
        id = value["id"];
        name = value["name"];
        image = value["icon"];
        var row;
        //console.log("find row for" + id);
        elements = document.getElementById(tab + "-table").getElementsByTagName( "tr" );
        arr = jQuery.makeArray( elements );
        $.each(arr, function(key2, value2){
            if(id < value2["id"]){
                //console.log(id + " is smaller then " + value2["id"]);
                row = table.insertRow(key2);                                
                newRowSet = true;
                return false;
            }
        });

        if(!newRowSet){
            row = table.insertRow(-1);            
            //console.log("new row");
        }
        newRowSet = false;
        
        row.id = id;
        $(row).addClass("itemRow");
        var cell1 = row.insertCell(0);        
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);        
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);        
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        $(cell1).addClass("itemID");
        cell1.innerHTML = id;       
        cell2.innerHTML = "<img class=\"image\" src=\"" + image + "\" width=\"20\" height=\"20\"> " + name;
        id = id.toString();
        $(cell2).addClass("itemName");
        $(cell3).addClass("itemBuyPrice");
        $(cell3).addClass(id);
        $(cell4).addClass("itemDemand");
        $(cell4).addClass(id);
        $(cell5).addClass("itemSellPrice");
        $(cell5).addClass(id);
        $(cell6).addClass("itemSupply");
        $(cell6).addClass(id);
        $(cell7).addClass("itemLinks");
        cell7.innerHTML = "<a href=\"http://wiki.guildwars2.com/wiki/" + name + "\" target=\"blank\">Wiki</a> - <a href=\"http://www.gw2spidy.com/item/" + id + "\" target=\"blank\">GW2Spidy</a> - <a href=\"http://www.gw2tp.com/item/" + id + "\" target=\"blank\">GW2TP</a>";
    });
    
    $("#" + tab + "-table tr:odd" ).addClass("odd");

    get_item_updates(tab);
    var TradingPostInterval = setInterval(function () {
            get_item_updates(tab);
        },60000);
}


//console.log(get_item_info());