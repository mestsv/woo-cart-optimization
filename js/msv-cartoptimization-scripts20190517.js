function arrPrice(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.price);
		});
	return task_prices;
}

function arrId(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.id);
		});
	return task_prices;
}

function totalMultiple(arrPrice, arrCount){
//скалярное произведение двух векторов	
if(!arrPrice.length) return;
  var res = 0;
  for(var i = 0; i < arrPrice.length; i++){
    res += arrPrice[i] * arrCount[i];
  }
  return res;
};

function checkProducts(selected_products, product_count){
  if(!product_count.length) {
	  return;
	  }
  var key = 1;
  for(var i=0;i<selected_products.length;i++){
	  if (product_count[i]<selected_products[i].min_count
	  || product_count[i]>selected_products[i].max_count) {
		key=0;
		} 
  }
  return key;
};

//Кэлтэй массив онорор. Хас табаар киирэрин. Браузертан ылар
function arrCountProducts_for_cart(selected_products){
	var arr= [];
	for(var i=0;i<selected_products.length;i++){
		var lengt_pr=selected_products[i].max_count-selected_products[i].min_count+1;
		var arr1=[];
		for(var j=0;j<lengt_pr;j++){
			arr1[j]=parseInt(selected_products[i].min_count)+j;
		}
		arr[i]=arr1;
	}
return arr;
}

function cartesianProduct(arr){
    return arr.reduce(function(a,b){
        return a.map(function(x){
            return b.map(function(y){
                return x.concat(y);
            })
        }).reduce(function(a,b){ return a.concat(b) },[])
    }, [[]])
}

function filterByBudget(selected_products,arrcartez,budget){
    var filtered = [];
    for(var i = 0; i < arrcartez.length; i++){
        var obj = arrcartez[i];
		if(totalMultiple(arrPrice(selected_products),obj)<=budget){
        filtered.push(obj);
		}
    }
    return filtered;
}

//key = 0 будет по  стоимости key = 1 будет по полезности
function createTable(selected_products, tableData, count, newColumnName, key,count_of_cat_products) {
  let n=0;
  var table = document.createElement('table');
  table.setAttribute("class", "table");
  table.setAttribute("id", "tableSelected"+key );
  var tableBody = document.createElement('tbody');
  var row0=document.createElement('tr');
  row0.setAttribute("id", "myTr");
  tableBody.appendChild(row0);
 
  for(var i=0;i<selected_products.length;i++){
		var y = document.createElement("th")
		y.setAttribute("id", "myTr"+i);
		var t = document.createTextNode(selected_products[i].name);
		y.appendChild(t);
		row0.appendChild(y);
	}
	
	//Добавляю цену товаров
	t = document.createTextNode(newColumnName);
	var y = document.createElement("th")
	y.appendChild(t);
	row0.appendChild(y);
  
	tableData.forEach(function(rowData, index) {
	var row = document.createElement('tr');
	row.setAttribute("id", "selectedTr"+key+index);
	var priceRow;

    rowData.forEach(function(cellData, index) {
	  var cell = document.createElement('td');
	  cell.setAttribute("id", "td"+index);
	  cell.appendChild(document.createTextNode(cellData));
	  row.appendChild(cell);
	 // console.log("Это key = "+key);
	  if(key=="0"){
		priceRow=totalMultiple(rowData, arrPrice(selected_products));
		//console.log("arrPrice(selected_products) "+arrPrice(selected_products));
	  }
	  if(key=="1"){
	//	  console.log("key 2 arrPreference=",selectedPreferenceProducts(count_of_cat_products));
		priceRow=totalMultiple(rowData, selectedPreferenceProducts(count_of_cat_products));
	  }
    });
	
	var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(priceRow));
      row.appendChild(cell);
	  
	if(n<count){
    tableBody.appendChild(row);
	n++;
	}
  });

  table.appendChild(tableBody);
  return table;
}


function createTableNotSorted(filteredPr, filteredPrices, filteredUtilities,count,arrNameNonFiltered){
	let n=0;
	var table = document.createElement('table');
	var tableBody = document.createElement('tbody');
	var row0=document.createElement('tr');
	tableBody.appendChild(row0);
	// Строка названий товаров
	for(var i=0;i<filteredPr[0].length;i++){
		var y = document.createElement("th")
		var t = document.createTextNode(arrNameNonFiltered[i]);
		y.appendChild(t);
		row0.appendChild(y);
	}
	y = document.createElement("th");
	t = document.createTextNode("Стоимость");
	y.appendChild(t);
	row0.appendChild(y);
	y = document.createElement("th");
	t = document.createTextNode("Полезность");
	y.appendChild(t);
	row0.appendChild(y);
	//тело таблицы
	filteredPr.forEach(function(rowData, index) {
		var row = document.createElement('tr');
		rowData.forEach(function(cellData, index) {
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode(cellData));
			row.appendChild(cell);
		});
		var cell = document.createElement('td');
		cell.appendChild(document.createTextNode(filteredPrices[index]));
		row.appendChild(cell);
		
		cell = document.createElement('td');
		cell.appendChild(document.createTextNode(filteredUtilities[index]));
		row.appendChild(cell);
		
		if(n<count){
		tableBody.appendChild(row);
		n++;
		}
	});
	table.appendChild(tableBody);
    return table;
}



//Бу матрица В - товардар ханнык категорияларга киирэллэрин кордорор
function createMatrixB(selected_products, count_of_cat_products) {
	var arrCatB=[];
	for(var j=0;j<count_of_cat_products.length;j++){
		var arr1=[];
		for(var i=0;i<selected_products.length;i++){
					arr1[i]=0;
		}
	
		for(var k=0;k<count_of_cat_products[j];k++){
			var num= j.toString()+k;
			var product_name="#"+"product_name_"+num;
				for(var i=0;i<selected_products.length;i++){
					var key=0;
				key=selected_products[i].name==jQuery(product_name).text();
				if(key){
					arr1[i]=1;
				}
			}
		}
		arrCatB[j]=arr1;
	}
	return arrCatB;
}	

//массивтан биир столбесы оруур
function arrName(selected_products) {
	var task_name = [];
	jQuery.each(selected_products, function( key, value ) {
		task_name.push(value.name);
		});
	return task_name;
}

function arrPreference(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.preference);
		});
	return task_prices;
}

function arrMin_count(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.min_count);
		});
	return task_prices;
}

function arrMax_count(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.max_count);
		});
	return task_prices;
}

//Браузерга тахсыбыт мин уонна мах продуктар киэнин булар
function selectedMinMaxProducts(count_of_cat_products){
	var arrCountMinMax=[];
	console.log("count_of_cat_products.length="+count_of_cat_products.length);
	for(var i0=0;i0<count_of_cat_products.length;i0++){
		console.log("count_of_cat_products[i0]="+count_of_cat_products[i0]);
		for(var i1=0;i1<count_of_cat_products[i0];i1++){
			
			if(jQuery('select').is("#minabox"+i0+i1)){
				//console.log("Нашел minabox"+i0+i1);
				//console.log("Нашел minabox val="+jQuery("#minabox"+i0+i1).val());
			arrCountMinMax.push(jQuery("#minabox"+i0+i1).val());	
			};
			if(jQuery('select').is("#maxabox"+i0+i1)){
				//console.log("Нашел maxabox"+i0+i1);
				//console.log("Нашел maxabox val="+jQuery("#maxabox"+i0+i1).val());
			arrCountMinMax.push(jQuery("#maxabox"+i0+i1).val());
			}
		}
	}
	//console.log("Новый carrCountMinMax"+arrCountMinMax);
	return arrCountMinMax;
}

//Браузерга тахсыбыт preference продуктар киэнин булар
function selectedPreferenceProducts(count_of_cat_products){
	var arr=[];
	for(var i0=0;i0<count_of_cat_products.length;i0++){
		
		for(var i1=0;i1<count_of_cat_products[i0];i1++){
			if(jQuery('select').is("#prefe"+i0+i1)){
			arr.push(jQuery("#prefe"+i0+i1).val());	
			//console.log("Нашел Префе"+i0+i1);
			};
		}
	}
	return arr;
}

//Браузерга тахсыбыт категориялар мин мах киэнин булар
function selectedMinMaxCategories(count_of_cat_products){
	console.log("В категории count_of_cat_products.length="+count_of_cat_products.length);
	var arrCountMinMax=[];
	
	for(var i0=0;i0<count_of_cat_products.length;i0++){
		if(jQuery('select').is("#minabox"+i0)){
			console.log("Нашел minabox"+i0);
			console.log("Нашел minabox val="+jQuery("#minabox"+i0).val());
		arrCountMinMax.push(jQuery("#minabox"+i0).val());	
		};
		if(jQuery('select').is("#maxabox"+i0)){
			console.log("Нашел maxabox"+i0);
			console.log("Нашел maxabox val="+jQuery("#maxabox"+i0).val());
		arrCountMinMax.push(jQuery("#maxabox"+i0).val());
		
		}
	}
	
	return arrCountMinMax;
}

//Браузерга тахсыбыт Категорияларынан фильтдыыр
function filterByMatrixB(cartesianPr,matrix_b,arrCountMinMaxCategories){
	var arr=[];
	var cartesianPr1=cartesianPr;
	var oddMinMaxCategories=arrCountMinMaxCategories.filter(function(item, number) {
		return	number % 2 == 0;
		});
		var evenMinMaxCategories=arrCountMinMaxCategories.filter(function(item, number) {
		return	number % 2 != 0;
		});
	for(var i=0;i<matrix_b.length;i++){
		var filtered = cartesianPr1.filter(function(item, number) {
		return ((totalMultiple(item, matrix_b[i])>=oddMinMaxCategories[i])&&(totalMultiple(item, matrix_b[i])<=evenMinMaxCategories[i]));
		});
		arr[i]=filtered;
		cartesianPr1=arr[i];
	}
    return cartesianPr1;
}

////////////////////////////////////////////////////////////////////////////////////////

jQuery(document).ready(function() {
	
	jQuery(".button25").click(function(){
	
	var arrObjectsMin = []; // объявление массива
	var arrObjectsMax = []; // объявление массива
	let str='';
	var budget = jQuery("#new_budget").val();
	var arrCountMinMax=[];
	var arrCountMinMaxCategories=[];
	var arrPreferenceIn=[];
	var arrPriceFiltered=[];
	var filtered_selected_products=[];
	var filtered_arrPreferenceIn=[];
	var arrNameNonFiltered=[];

	//count_of_cat_products бэрэбиэкэлиэххэ. Категорияга хас устуука товар баарын кордорор
	console.log("НЕФИЛЬТРОВАННЫЙ count_of_cat_products "+count_of_cat_products);
	jQuery.each(filtered_selected_products, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});
	
	//Бу манна бары категориялар префеларын булар. Киирэр массивка хас категория аайы хас товар баарын укпутум
	arrPreferenceIn=selectedPreferenceProducts(count_of_cat_products);
	console.log("arrPreferenceIn="+arrPreferenceIn);
	//jQuery.each(arrPreferenceIn, function( key, value ) {
		//jQuery.each(value, function( key1, value1 ) {
		//console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		//});
	//});
	
	
	//Бу товардар ID
	//console.log("Бу товардар ID products_ids_array",products_ids_array);
	
	///////////////////////////
	arrCountMinMax=selectedMinMaxProducts(count_of_cat_products);
	/*
	console.log("НЕФИЛЬТРОВАННЫЙ arrCountMinMax "+arrCountMinMax);
	jQuery.each(arrCountMinMax, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});
	*/
	/////////////////////////////////
	
	//count_of_cat_products бэрэбиэкэлиэххэ. Категорияга хас устуука товар баарын кордорор
	console.log("НЕФИЛЬТРОВАННЫЙ count_of_cat_products "+count_of_cat_products);
	jQuery.each(filtered_selected_products, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});

	arrCountMinMaxCategories=selectedMinMaxCategories(count_of_cat_products);
	
	/*
	console.log("НЕФИЛЬТРОВАННЫЙ arrCountMinMaxCategories "+arrCountMinMaxCategories);
	jQuery.each(arrCountMinMaxCategories, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});
	*/
		
	
	//Бу манна талылынна браузертан
	for(var i1=0;i1<selected_products.length;i1++){
	selected_products[i1].min_count=arrCountMinMax[2*i1];
	selected_products[i1].max_count=arrCountMinMax[2*i1+1];
	}

	filtered_selected_products = jQuery(selected_products).filter(function(idx) {
		//if(selected_products[idx].min_count != selected_products[idx].max_count){
		if(selected_products[idx].max_count>0){
			console.log("НАШЕЛ ПО [idx].max_count С браузера"+selected_products[idx].max_count);
			filtered_arrPreferenceIn.push(arrPreferenceIn[idx]);
		}
		//return (selected_products[idx].min_count != selected_products[idx].max_count);
		return (selected_products[idx].max_count>0);
	});
	

	console.log("ФИЛЬТРОВАННЫЙ selected_products "+filtered_selected_products);
	jQuery.each(filtered_selected_products, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});
	
	//console.log("ФИЛЬТРОВАННЫЙ filtered_arrPreferenceIn"+filtered_arrPreferenceIn);
	
	
	
	arrPriceFiltered=arrPrice(filtered_selected_products);
	//console.log("ФИЛЬТРОВАННЫЙ arrPriceFiltered .length"+arrPriceFiltered.length);

    //товардар ааттара
    arrNameNonFiltered=arrName(filtered_selected_products);
    console.log("НЕФИЛЬТРОВАННЫЙ arrNameNonFiltered "+arrNameNonFiltered);
    console.log("НЕФИЛЬТРОВАННЫЙ arrNameNonFiltered[0] "+arrNameNonFiltered[0]);

    arrIdFiltered=arrId(filtered_selected_products);
	//console.log("ФИЛЬТРОВАННЫЙ arrIdFiltered .length"+arrIdFiltered.length);

	//console.log("arrPriceFiltered :"+arrPriceFiltered);
	//jQuery.each(arrPriceFiltered, function( key1, value1 ) {
		//console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		//});
		
	//console.log("arrIdFiltered :"+arrIdFiltered);
	//jQuery.each(arrIdFiltered, function( key1, value1 ) {
	//	console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
	//	});	
	
	var arrCatB=createMatrixB(filtered_selected_products, count_of_cat_products);
	jQuery("#budget").html('<br /> Бюджет пользователя '+jQuery("#new_budget").val());
	
	var arrcartez = [];
	arrcartez=arrCountProducts_for_cart(filtered_selected_products);
	console.log("UUU arrcartez= "+arrcartez);
	jQuery.each(arrcartez, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});
		
	var cartesianPr = [];
	cartesianPr=cartesianProduct(arrcartez);
	//категорияларынан фильтрдаатым
	var filteredPr = filterByMatrixB(cartesianPr,arrCatB,arrCountMinMaxCategories);
	var filteredPrices = []; // Массив цен неупорядаченный
	var filteredUtilities = []; // Массив полезностей неупорядаченный
	
	//console.log("UUU function //filterByMatrixB(arrcartez,matrix_b,arrCountMinMaxCategories)= "+
	//filteredPr);
			
	//категорияларынан уонна бюджетынан фильтрдаатым
	filteredPr=filterByBudget(filtered_selected_products,filteredPr,budget);
	jQuery.each(filtered_selected_products[0], function(index,value) {
	});
	
	jQuery.each(filtered_selected_products,function(key,data) {
		jQuery.each(data, function(index,value) {
		});
	});
	
	str='Бюджет='+budget+'<br/>';
	for (i=0;i<filteredPr.length;i++)	{
		for (j=0;j<filteredPr[i].length;j++)	{
			arrObjectsMin[i]={id:i, totalPrice: totalMultiple(arrPrice(filtered_selected_products),filteredPr[i])}
			arrObjectsMax[i]={id:i, totalPrice: totalMultiple(filtered_arrPreferenceIn,filteredPr[i])}
		str+=filteredPr[i][j]+' ';
		}
		filteredPrices.push(totalMultiple(arrPrice(filtered_selected_products),filteredPr[i]));
		filteredUtilities.push(totalMultiple(filtered_arrPreferenceIn,filteredPr[i]));
		str+='Цена='+totalMultiple(arrPrice(filtered_selected_products),filteredPr[i])+' ';
		str+='Полезность='+totalMultiple(filtered_arrPreferenceIn,filteredPr[i])+'<br/>';
	}
	
	console.log("filteredPr 2019 =", filteredPr);//фильтеред иьигэр количестволар бааллар 
	console.log("filteredPrices 2019 =", filteredPrices);//фильтеред иьигэр ценалара бааллар 
	console.log("filteredUtilities 2019 =", filteredUtilities);//фильтеред иьигэр туьата бааллар 
	
	
	//jQuery("#product_arr").html('<br /> Допустимые сочетания товаров. '+str		);
	jQuery("#product_arr_not_sorted").html(createTableNotSorted(filteredPr, filteredPrices, filteredUtilities, 10,arrNameNonFiltered));

	arrObjectsMin.sort(function(a, b){return a.totalPrice - b.totalPrice});
	arrObjectsMax.sort(function(a, b){return b.totalPrice - a.totalPrice});
	
	var sortedFilteredPrMin=[];
	var sortedFilteredPrMax=[];
	
	for (i=0;i<arrObjectsMin.length;i++)	{
	sortedFilteredPrMin.push(filteredPr[arrObjectsMin[i].id]);
	}
	
	for (i=0;i<arrObjectsMax.length;i++)	{
	sortedFilteredPrMax.push(filteredPr[arrObjectsMax[i].id]);
	}
	
	//Сана упорядоченный массива
	jQuery("#product_opt_all").html("Пока пусто");
		
	jQuery("#product_opt_all").html(createTable(filtered_selected_products, sortedFilteredPrMin,5,"Стоимость", 0,count_of_cat_products));
	
	jQuery("#product_preference_all").html("Пока пусто");
	jQuery("#product_preference_all").html(createTable(filtered_selected_products, sortedFilteredPrMax,5, "Полезность", 1,count_of_cat_products));

//hover таблицы стоимостей		
	jQuery("#tableSelected0 tbody tr:not(:first)").on("hover", function(e) {
	  if(e.type == "mouseenter") {
		//console.log("over");
		 jQuery(this).css({'color':'blue'}).css("font-size","20px").css({'font-weight':'bold'});
		 //jQuery(this).css({'backgroundColor':'red'});

	  }
	  else if (e.type == "mouseleave") {
		//console.log("out");
		 jQuery(this).css({'color':''}).css("font-size","").css({'font-weight':''});
		// jQuery(this).css({'backgroundColor':''});
	  }
	});

//Таблица по стоимости	
	var table0val=[];
	for (var i=0; i<5;i++){
		var arrTd=[];
		var rowId="#selectedTr0"+i;
		var collectionTr=[];
		if(jQuery(rowId).text()!=''){
			//console.log("selectedTr"+jQuery(rowId).text());
			for (var j=0; j<filtered_selected_products.length;j++){
				var tdId="#td"+j;
				//манна селектор столбца. Онно товардар ааттара баар
				var prId="#myTr"+j;
				//манна продукталар ID
				//console.log("jQuery(prId).text() ", jQuery(prId).text());
				//console.log("arrId(filtered_selected_products) ",arrId(filtered_selected_products)) ;
				
				
				arrTd[j]=jQuery(rowId).children(tdId).text();
			}
			collectionTr.push(arrTd);
			collectionTr.push(arrId(filtered_selected_products));
			//console.log("collectionTr.push(arrTd) ", collectionTr);
		table0val[i]=collectionTr;
		//table0val[i]=arrTd;
		}
	}
	
//	Таблица по полезности
	var table1val=[];
	for (var i=0; i<5;i++){
		var arrTd=[];
		var rowId="#selectedTr1"+i;
		var collectionTr=[];
		if(jQuery(rowId).text()!=''){
			//console.log("selectedTr"+jQuery(rowId).text());
			for (var j=0; j<filtered_selected_products.length;j++){
				var tdId="#td"+j;
				//манна селектор столбца. Онно товардар ааттара баар
				var prId="#myTr"+j;
				//манна продукталар ID
				//console.log("jQuery(prId).text() ", jQuery(prId).text());
				//console.log("arrId(filtered_selected_products) //",arrId(filtered_selected_products)) ;
				
				
				arrTd[j]=jQuery(rowId).children(tdId).text();
			}
			collectionTr.push(arrTd);
			collectionTr.push(arrId(filtered_selected_products));
			//console.log("collectionTr.push(arrTd) ", collectionTr);
		table1val[i]=collectionTr;
		//table1val[i]=arrTd;
		}
	}

//	Таблица стоимостей для отправки на сервер
	var isSendToCart;
	
	jQuery("#tableSelected0 tbody tr:not(:first)").on("click", function(e) {
		var str=jQuery(this).attr("id");
			str=str.substring(11);
			//alert(jQuery(this).attr("id")+" Подстрока "+str); 
		var arrTable0=table0val[str];
		//alert("arrTable0 строка ="+table0val[str])
		 if(arrTable0.length > 0){
			var arrj=JSON.stringify(arrTable0); 
			//alert("JSON строка arrj="+arrj)
			isSendToCart = confirm("Заменить товары корзины?");
			if(isSendToCart){		
			jQuery.ajax({
				url: ajax_object.ajax_url,
				type: 'POST',
				dataType:'json',
				data:{
				action: 'msvCart',
				newProducts:arrj,
				},
				beforeSend: function( xhr ) {
					jQuery('#wait0').text('Загрузка, 5 сек...');	
				},
				success: function( data ) {
					jQuery('#wait0').text('');	
					jQuery('.wrap').text('Поместил в корзине '+data+ '					товаров. Посмотрите корзину.');
				}
			});
			}
		 }	
	});

//	Таблица полезностей для отправки на сервер	
	jQuery("#tableSelected1 tbody tr:not(:first)").on("click", function(e) {
		var str=jQuery(this).attr("id");
			str=str.substring(11);
			//alert(jQuery(this).attr("id")+" Подстрока "+str); 
		var arrTable1=table1val[str];
		//alert("arrTable1 строка ="+table1val[str])
		 if(arrTable1.length > 0){
			var arrj=JSON.stringify(arrTable1); 
			//alert("JSON строка arrj="+arrj)
			isSendToCart = confirm("Заменить товары корзины?");
			if(isSendToCart){		
			jQuery.ajax({
				url: ajax_object.ajax_url,
				type: 'POST',
				dataType:'json',
				data:{
				action: 'msvCart',
				newProducts:arrj,
				},
				beforeSend: function( xhr ) {
					jQuery('#wait1').text('Загрузка, 5 сек...');	
				},
				success: function( data ) {
					jQuery('#wait1').text('');	
					jQuery('.wrap').text('Поместил в корзине '+data+ '					товаров.  Посмотрите корзину.');
				}
			});
			}
		 }	
	});
//hover таблицы полезностей	 
	 jQuery("#tableSelected1 tbody tr:not(:first)").on("hover", function(e) {
	  if(e.type == "mouseenter") {
		//console.log("over");
		 jQuery(this).css({'color':'blue'}).css("font-size","20px").css({'font-weight':'bold'});
	  }
	  else if (e.type == "mouseleave") {
		//console.log("out");
		 jQuery(this).css({'color':''}).css("font-size","").css({'font-weight':''});
	  }
	});

	
	});
});