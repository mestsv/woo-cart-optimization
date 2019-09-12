//цены товаров
function arrPrice(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.price);
		});
	return task_prices;
}

//ID товаров
function arrId(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.id);
		});
	return task_prices;
}

//скалярное произведение двух векторов
function totalMultiple(arrPrice, arrCount){
if(!arrPrice.length) return;
  var res = 0;
  for(var i = 0; i < arrPrice.length; i++){
    res += arrPrice[i] * arrCount[i];
  }
  return res;
};

//Проверка переменной принадлежности интервалу. Не входит -0
function checkProducts(selected_products, product_count){
  if(!product_count.length) {
	  return;
	  }pr
  var key = 1;
  for(var i=0;i<selected_products.length;i++){
	  if (product_count[i]<selected_products[i].min_count
	  || product_count[i]>selected_products[i].max_count) {
		key=0;
		} 
  }
  return key;
};

//Кэлтэй массив онорор. Все допустимые товары каждого вида. Хас табаар киирэрин. Браузертан ылар
function arrCountProducts_for_cart(selected_products){
    console.log("UUU selected_products.length="+selected_products.length);
	var arr= [];
	for(var i=0;i<selected_products.length;i++){

		var lengt_pr=selected_products[i].max_count-selected_products[i].min_count+1;
		var arr1=[];
		for(var j=0;j<lengt_pr;j++){
			arr1[j]=parseInt(selected_products[i].min_count)+j;
		}
		arr[i]=arr1;
        console.log("UUU arr[i]="+arr[i]);
	}
return arr;
}

//Декартово произведение. Массив тахсар.
function cartesianProduct(arr){
    console.log("Вход  в Декарт "+arr);
    return arr.reduce(function(a,b){
        return a.map(function(x){
            return b.map(function(y){
                return x.concat(y);
            })
        }).reduce(function(a,b){ return a.concat(b) },[])
    }, [[]])
}

//Фильтрация наборов по бюджету
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

//key = 0 будет по  стоимости key = 1 будет по полезности. Интерактивные таблицы буолаллар кэнники
function createTable(selected_products, tableData, count, newColumnName, key,count_of_cat_products,arrNameNonFiltered) {
  let n=0;
  var table = document.createElement('table');
  table.setAttribute("class", "table");
  table.setAttribute("id", "tableSelected"+key );
  var tableBody = document.createElement('tbody');
  var row0=document.createElement('tr');
  row0.setAttribute("id", "myTr");
  tableBody.appendChild(row0);
 
  for(var i=0;i<arrNameNonFiltered.length;i++){
		var y = document.createElement("th")
		y.setAttribute("id", "myTr"+i);
		var t = document.createTextNode(arrNameNonFiltered[i]);
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
		  //console.log("key 2 arrPreference=",selectedPreferenceProducts(selected_products));
		priceRow=totalMultiple(rowData, selectedPreferenceProducts(selected_products));
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

//Бары товардар таблицалара
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
		cell.appendChild(document.createTextNode(filteredUtilities[index]));//filteredUtilities[index]));
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
function createMatrixB(non_selected_products,selected_products, cat_ids) {
    //console.log("selected_products_non_sorted "+non_selected_products);
    //console.log("cat_ids "+cat_ids);
	var arrCatB=[];
	for(var j=0;j<cat_ids.length;j++){
		var arr1=[];
		for(var i=0;i<selected_products.length;i++){
		    arr1[i]=0;
		    if(cat_ids[j]==selected_products[i]['kat_id']){
		       // console.log("Нашел товар "+cat_ids[j]);
		        //console.log("Сравниваю с "+selected_products[i]['kat_id']);
                arr1[i]=1;

            }
		    else {
                for(var k=0;k<non_selected_products.length;k++){
                    if((cat_ids[j]==non_selected_products[k]['kat_id'])&&(selected_products[i]['id']==non_selected_products[k]['id'])){
                        arr1[i]=1;
                        //console.log("Нашел повтор "+selected_products[i]['name']);


                    }
                }
            }

		}
	

		arrCatB[j]=arr1;
	}
	return arrCatB;
}	

//массивтан биир name столбесы оруур
function arrName(selected_products) {
	var task_name = [];
	jQuery.each(selected_products, function( key, value ) {
		task_name.push(value.name);
		});
	return task_name;
}

//массивтан биир preference столбесы оруур
function arrPreference(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		console.log("20190827 Prefe "+value.preference)
		task_prices.push(value.preference);
		});
	return task_prices;
}

//массивтан биир min_count столбесы оруур
function arrMin_count(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.min_count);
		});
	return task_prices;
}

//массивтан биир max_count столбесы оруур
function arrMax_count(selected_products) {
	var task_prices = [];
	jQuery.each(selected_products, function( key, value ) {
		task_prices.push(value.max_count);
		});
	return task_prices;
}

//Браузерга тахсыбыт мин уонна мах продуктар киэнин булар
function selectedMinMaxProducts(selected_products){
	var arrCountMinMax=[];
	//console.log("selected_products.length="+selected_products.length);
	for(var i0=0;i0<selected_products.length;i0++){
		//console.log("selected_products[i0]="+selected_products[i0]);

			
        if(jQuery('select').is("#minabox"+i0)){
            //console.log("Нашел minabox"+i0);
            //console.log("Нашел minabox val="+jQuery("#minabox"+i0).val());
        arrCountMinMax.push(jQuery("#minabox"+i0).val());
        };
        if(jQuery('select').is("#maxabox"+i0)){
            //console.log("Нашел maxabox"+i0);
            //console.log("Нашел maxabox val="+jQuery("#maxabox"+i0).val());
        arrCountMinMax.push(jQuery("#maxabox"+i0).val());
			}

	}
	//console.log("Новый arrCountMinMax"+arrCountMinMax);
	return arrCountMinMax;
}

//Браузерга тахсыбыт preference продуктар киэнин булар
function selectedPreferenceProducts(selected_products){
	var arr=[];
	for(var i0=0;i0<selected_products.length;i0++){
		if(jQuery('select').is("#prefe"+i0)){
		arr.push(jQuery("#prefe"+i0).val());
		//console.log("Нашел Префе"+i0+": "+jQuery("#prefe"+i0).val());
		};
	}
	return arr;
}

//Браузерга тахсыбыт категориялар мин мах киэнин булар
function selectedMinMaxCategories(selected_products){
	var arrCountMinMax=[];
	for(var i0=0;i0<selected_products.length;i0++){
		if(jQuery('select').is("#minCat"+i0)){
			//console.log("Нашел minCat"+i0);
			//console.log("Нашел minCat val="+jQuery("#minCat"+i0).val());
		arrCountMinMax.push(jQuery("#minCat"+i0).val());
		};
		if(jQuery('select').is("#maxCat"+i0)){
			//console.log("Нашел maxCat"+i0);
			//console.log("Нашел maxCat val="+jQuery("#maxCat"+i0).val());
		arrCountMinMax.push(jQuery("#maxCat"+i0).val());
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

//Браузерга тахсыбыт Max_count 0 буолбатах товардары фильтодыыр уонна уларытар
function filtered_selected_products_arr(selected_products){
	// console.log("НАШЕЛ selected_products Уларыйбыты Барыта= "+selected_products);
	// console.log("НАШЕЛ selected_products Уларыйбыты Барыта= "+selected_products.length);
	var arr=[];
	jQuery(selected_products).each(function( idx, value ) {

		if(selected_products[idx].max_count>0){
			// console.log("НАШЕЛ ПО [idx].id С браузера: "+selected_products[idx].id);
			// console.log("НАШЕЛ ПО [idx].name С браузера: "+selected_products[idx].name);
			// console.log("НАШЕЛ ПО [idx].preference С браузера: "+selected_products[idx].preference);
			// console.log("НАШЕЛ ПО [idx].price С браузера: "+selected_products[idx].price);
			// console.log("НАШЕЛ ПО [idx].min_count С браузера: "+selected_products[idx].min_count);
			// console.log("НАШЕЛ ПО [idx].max_count С браузера: "+selected_products[idx].max_count);
			// console.log("НАШЕЛ ПО [idx].kat_id С браузера: "+selected_products[idx].kat_id);
			arr.push(selected_products[idx]);
 		}
 	});
    // console.log("Браузерга тахсыбыт Max_count 0 буолбатах " +
    //     "товардары фильтодыыр уонна уларытар ",+arr.length);
    return arr;
}

//Браузерга тахсыбыт Preference  max_count 0 буолбатах filtered_selected_products_arr угагын
function filteredPreference(filtered_selected_products_arr){
	arr=[];
	jQuery(filtered_selected_products_arr).filter(function(idx) {
		console.log("НАШЕЛ ПО [idx] префе"+filtered_selected_products_arr[idx].preference);
		arr.push(filtered_selected_products_arr[idx].preference);
		return arr;
	});
}
// Улахан массивтан arrBig кыра массивка arrSmall соп тубэсэр индексары сана массив онорор
function indexOfarr1(arrBig, arrSmall){
	arr=[];
	for(var i=0; i<arrBig.length; i++){
		if(arrSmall.indexOf(arrBig[i]) != -1) arr.push(i);
	}
	return arr;
}
////////////////////////////////////////////////////////////////////////////////////////

jQuery(document).ready(function() {
    jQuery(".buttonToggle").hide();
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


	filtered_selected_products = selected_products;


		//count_of_cat_products бэрэбиэкэлиэххэ. Категорияга хас устуука товар баарын кордорор
	//console.log("НЕФИЛЬТРОВАННЫЙ count_of_cat_products "+count_of_cat_products);
	/*console.log("ФИЛЬТРОВАННЫЙ без повтора PHP кэлбит filtered_selected_products ");
	jQuery.each(filtered_selected_products, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});*/
	
	//Бу манна бары товардар префеларын булар. Киирэр массивка хас категория аайы хас товар баарын укпутум
	arrPreferenceIn=selectedPreferenceProducts(selected_products);
	//console.log("arrPreferenceIn="+arrPreferenceIn);

	//Бу товардар ID корзинага киирбит
	//console.log("Бу товардар ID products_ids_array",products_ids_array);



	arrCountMinMax=selectedMinMaxProducts(selected_products);
	//console.log("НЕФИЛЬТРОВАННЫЙ arrCountMinMax "+arrCountMinMax);

	/////////////////////////////////
	
	//count_of_cat_products бэрэбиэкэлиэххэ. Категорияга хас устуука товар баарын кордорор
	//console.log("НЕФИЛЬТРОВАННЫЙ count_of_cat_products "+count_of_cat_products);


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
	// for(var i1=0;i1<selected_products.length;i1++){
	// selected_products[i1].min_count=arrCountMinMax[2*i1];
	// selected_products[i1].max_count=arrCountMinMax[2*i1+1];
	// }

    //Бу манна талылынна браузертан
        for(var i1=0;i1<filtered_selected_products.length;i1++){
            filtered_selected_products[i1].min_count=arrCountMinMax[2*i1];
            filtered_selected_products[i1].max_count=arrCountMinMax[2*i1+1];
        }
	

	/*console.log("ФИЛЬТРОВАННЫЙ selected_products "+filtered_selected_products);
	jQuery.each(filtered_selected_products, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});*/

	filtered_arrPreferenceIn=selectedPreferenceProducts(selected_products);
	//console.log("ФИЛЬТРОВАННЫЙ filtered_arrPreferenceIn"+filtered_arrPreferenceIn);
	
	
	
	arrPriceFiltered=arrPrice(filtered_selected_products);
	//console.log("ФИЛЬТРОВАННЫЙ arrPriceFiltered .length"+arrPriceFiltered.length);

    //товардар ааттара
    arrNameNonFiltered=arrName(filtered_selected_products);
    // console.log("ФИЛЬТРОВАННЫЙ arrNameNonFiltered "+arrNameNonFiltered);
    // console.log("ФИЛЬТРОВАННЫЙ arrNameNonFiltered[0] "+arrNameNonFiltered[0]);
    // console.log("ФИЛЬТРОВАННЫЙ arrNameNonFiltered[1] "+arrNameNonFiltered[1]);

    arrIdFiltered=arrId(filtered_selected_products);
	//console.log("ФИЛЬТРОВАННЫЙ arrIdFiltered "+arrIdFiltered);

	//console.log("arrPriceFiltered :"+arrPriceFiltered);
	//jQuery.each(arrPriceFiltered, function( key1, value1 ) {
		//console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		//});
		
	//console.log("arrIdFiltered :"+arrIdFiltered);
	//jQuery.each(arrIdFiltered, function( key1, value1 ) {
	//	console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
	//	});	


        //console.log("НЕФИЛЬТРОВАННЫЙ selected_products "+selected_products_non_sorted);
	/*jQuery.each(selected_products_non_sorted, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});*/
	var arrCatB=createMatrixB(selected_products_non_sorted,filtered_selected_products, cats_ids_array);









	jQuery("#budget").html('<br /> Бюджет пользователя '+jQuery("#new_budget").val());




	var arrcartez = [];
	arrcartez=arrCountProducts_for_cart(filtered_selected_products);
	/*console.log("UUU arrcartez= "+arrcartez);
	jQuery.each(arrcartez, function( key, value ) {
		jQuery.each(value, function( key1, value1 ) {
		console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
		});
	});*/
		
	var cartesianPr = [];
	cartesianPr=cartesianProduct(arrcartez);
	console.log("arrcartez 2019 =", arrcartez);//20190606
	console.log("cartesianPr 2019 =", cartesianPr);//20190606




	//категорияларынан фильтрдаатым
	var filteredProducts = filterByMatrixB(cartesianPr,arrCatB,arrCountMinMaxCategories);
	
	var filteredPrices = []; // Массив цен неупорядаченный
	var filteredUtilities = []; // Массив полезностей неупорядаченный
	
	
	//категорияларынан уонна бюджетынан фильтрдаатым
	filteredProducts=filterByBudget(filtered_selected_products,filteredProducts,budget);
	jQuery.each(filtered_selected_products[0], function(index,value) {
	});

	jQuery.each(filtered_selected_products,function(key,data) {
		jQuery.each(data, function(index,value) {
		});
	});
	
	str='Бюджет='+budget+'<br/>';
	for (i=0;i<filteredProducts.length;i++)	{
		for (j=0;j<filteredProducts[i].length;j++)	{
			arrObjectsMin[i]={id:i, totalPrice: totalMultiple(arrPrice(filtered_selected_products),filteredProducts[i])}
			arrObjectsMax[i]={id:i, totalPrice: totalMultiple(filtered_arrPreferenceIn,filteredProducts[i])}
		str+=filteredProducts[i][j]+' ';
		}
		filteredPrices.push(totalMultiple(arrPrice(filtered_selected_products),filteredProducts[i]));
		filteredUtilities.push(totalMultiple(filtered_arrPreferenceIn,filteredProducts[i]));
		str+='Цена='+totalMultiple(arrPrice(filtered_selected_products),filteredProducts[i])+' ';
		str+='Полезность='+totalMultiple(filtered_arrPreferenceIn,filteredProducts[i])+'<br/>';
	}
	
	console.log("filteredPr 2019 =", filteredProducts);//фильтеред иьигэр количестволар бааллар 
	console.log("filteredPrices 2019 =", filteredPrices);//фильтеред иьигэр ценалара бааллар
	console.log("arrNameNonFiltered 2019 =", arrNameNonFiltered);//фильтрдамматах товардар ааттара
	console.log("filteredUtilities 2019 =", filteredUtilities);//фильтеред иьигэр туьата бааллар

	filtered_selected_products_without0 =	filtered_selected_products_arr(selected_products);
	/*console.log("ФИЛЬТРОВАННЫЙ filtered_selected_products_without0 ");
		jQuery.each(filtered_selected_products_without0, function( key, value ) {
			jQuery.each(value, function( key1, value1 ) {
				console.log( 'Свойство: ' +key1 + '; Значение: ' + value1 );
			});
		});*/

	filtered_selected_products_without0_names =
		filtered_selected_products_without0.map(o => o.name);

	console.log("ФИЛЬТРОВАННЫЙ filtered_selected_products_without0_names "+filtered_selected_products_without0_names);

	filtered_selected_products_without0_indexs =indexOfarr1(arrNameNonFiltered, filtered_selected_products_without0_names);

	console.log("Индексы filtered_selected_products_without0_indexs "+filtered_selected_products_without0_indexs);

// удаляю из массива  столбцы, состоящие из 0







	// for(var i = 0 ; i < filteredProducts.length ; j++){
	// 	for (var j = filtered_selected_products_without0_indexs.length -1; i >= 0; i--){
	// 		filteredProducts[i].splice(filtered_selected_products_without0_indexs[j],1);
	// 	}
	// }


		for (var i = 0; i < filteredProducts.length; i++) {
			var temp = filteredProducts[i];
			filteredProducts[i] = [];
			for(var j = 0 ; j < temp.length ; j++){
				if(filtered_selected_products_without0_indexs.indexOf(j) != -1) // dont delete
				{
					filteredProducts[i].push(temp[j]);
				}
			}
		}


		console.log("filteredPr 2019 без 0 столбцов =", filteredProducts);//фильтеред иьигэр количестволар бааллар 0
		// столбецтара суох








	arrNameNonFiltered=filtered_selected_products_without0_names; //Туттуллубат товардар ааттарын соттум








		//jQuery("#product_arr").html('<br /> Допустимые сочетания товаров. '+str		);
	jQuery("#product_arr_not_sorted").html(createTableNotSorted(filteredProducts, filteredPrices, filteredUtilities, 15,arrNameNonFiltered));

	arrObjectsMin.sort(function(a, b){return a.totalPrice - b.totalPrice});
	arrObjectsMax.sort(function(a, b){return b.totalPrice - a.totalPrice});
	
	var sortedFilteredPrMin=[];
	var sortedFilteredPrMax=[];
	
	for (i=0;i<arrObjectsMin.length;i++)	{
	sortedFilteredPrMin.push(filteredProducts[arrObjectsMin[i].id]);
	}
	
	for (i=0;i<arrObjectsMax.length;i++)	{
	sortedFilteredPrMax.push(filteredProducts[arrObjectsMax[i].id]);
	}
	
	//Сана упорядоченный массива
	jQuery("#product_opt_all").html("Пока пусто");
		
	jQuery("#product_opt_all").html(createTable(filtered_selected_products, sortedFilteredPrMin,5,"Стоимость", 0,count_of_cat_products,filtered_selected_products_without0_names));
	
	jQuery("#product_preference_all").html("Пока пусто");
	jQuery("#product_preference_all").html(createTable(filtered_selected_products, sortedFilteredPrMax,5, "Полезность", 1,count_of_cat_products,filtered_selected_products_without0_names));

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
        jQuery(".buttonToggle").show();
        jQuery("#product_arr_not_sorted").hide();
        jQuery(".buttonToggle").click(function(){
            jQuery("#product_arr_not_sorted").toggle();
        });
	});
});