<?php
global $sessionVar;
global $count_of_categories;
global $count_of_cat_products;
global $selected_products_results;
global $selected_products_non_sorted;
global $products_ids_array;
global $cats_ids_array;

$sessionVar = 'hello';
$count_of_cat_products = array();

function cartoptimization_install(){
	global $wpdb;
	$table_name=$wpdb->prefix. 'cartoptimization';
	if($wpdb->get_var("SHOW TABLES LIKE $table_name") != $table_name){
		$sql="CREATE TABLE IF NOT EXISTS `$table_name` (
		`id_cartoptimation` int (11) NOT NULL AUTO_INCREMENT,
		`name` varchar(40) NOT NULL,
		`text` text NOT NULL,
		PRIMARY KEY (`id_cartoptimation`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
		$wpdb->query($sql);
	}
	add_option('cartoptimization_alternative',6);
}

function cartoptimization_uninstall(){
	global $wpdb;
	$table_name=$wpdb->prefix. 'cartoptimization';
	$sql="DROP TABLE IF EXISTS $table_name";
	$wpdb->query($sql);
	$sql1="DELETE FROM `wp_posts` WHERE `wp_posts`.`post_title`='Оптимизация корзины'";
	$wpdb->query($sql1);
	delete_option('cartoptimization_alternative');
}

function cartoptimization_ondelete(){
	global $wpdb;
	$table_name=$wpdb->prefix. 'cartoptimization';
	$sql="DROP TABLE IF EXISTS $table_name";
	$wpdb->query($sql);
	$sql1="DELETE FROM `wp_posts` WHERE `wp_posts`.`post_title`='Оптимизация корзины'";
	$wpdb->query($sql1);
	delete_option('cartoptimization_alternative');
}





//global $newCart;
function newproducts_function(){
if (isset($_POST['newProducts'])){
	global $woocommerce;
	$newProducts=$_POST['newProducts'];
	$woocommerce->cart->empty_cart();
	$newCart=json_decode(stripslashes($newProducts),false);
	$countj=0;
	$countNewCartPr=0;
	
	for($i=0;$i<count($newCart[1]);$i++){
		$newCart0=$newCart[1][$i];
		$countj=$newCart[0][$i];
		$countNewCartPr+=$countj;
		for($j=0;$j<$countj;$j++){
		$woocommerce->cart->add_to_cart($newCart0);
		}
	}
	$json_text=json_encode($newCart);
	$json_text0=json_encode($newCart0);
	$json_countj=json_encode($countNewCartPr);
	echo $json_countj;
	die(); 
}
else {
	echo "Нет данных";
	die(); 
}
}

function msv_cartoptimization_scripts(){
global $post;
	$my_page_title = 'Оптимизация корзины';
	if (!($my_page_title==$post->post_title)) return;	
	wp_enqueue_script('msv_cartoptimization_scripts', plugins_url('/js/msv-cartoptimization-scripts.js',__FILE__),array('jquery'),null);
	wp_enqueue_style('msv_cartoptimization_style', plugins_url('/css/msv-cartoptimization-style.css',__FILE__));
	
	
	wp_localize_script( 'msv_cartoptimization_scripts', 'ajax_object',
        array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'we_value' => 1234 ) );
	
}

function pagesearch($content){
	global $sessionVar;
	global $selected_products_results;
	global $selected_products_non_sorted;
	global $post;
	global $count_of_cat_products;
	global $count_of_categories;
	global $wpdb;
	global $woocommerce;
	global $products_ids_array;
	global $cats_ids_array;

	
	echo get_template_directory();

	$debug = new PHPDebug();
	//$debug->debug("PHP: Очень простое сообщение на консоль с файла function.php");
	
	
	$my_page_title = 'Оптимизация корзины';
	if (!($my_page_title==$post->post_title)) return $content;

	
	$emptycart="Корзина пуста. Плагин работает с не пустой корзиной";
	if (sizeof(WC()->cart->get_cart()) == 0){
		echo $emptycart;
	}
	echo $content;
	echo '<h3>Товары в корзине</h3>';

	//массивы id и количества товаров в корзине 
	$products_ids_array = array();
	$products_quantities_array = array();
	$products_names_array = array();

	foreach( WC()->cart->get_cart() as $cart_item ){
		$products_ids_array[] = $cart_item['product_id'];
	}
	foreach( WC()->cart->get_cart() as $cart_item ){
		$products_quantities_array[] = $cart_item['quantity'];
	}
	foreach( WC()->cart->get_cart() as $cart_item ){
		$products_names_array[] = $cart_item['data']->name;
	}

	echo '<table class="widefat">
		<thead>
				<tr>
					<th> ID </th>
					<th> Название </th>
					<th> Цена </th>
					<th> Категория </th>
					<th> Количество </th>
				</tr>
		</thead>';
	
	$cat_array = array();
	$sumcart=0;
	//Цикл Выводит в таблице Товары из корзине
	foreach( WC()->cart->get_cart() as $cart_item_key => $values ) {
        echo '<tr>';
        $_product = $values['data'];

        $debug->debug("PHP: Cart data ", $_product->id);

        //echo "<pre>";
        //print_r($_product);
        //echo "</pre>";


        echo '<td>'.$_product->id.'</td>';
        echo '<td>'.$_product->name.'</td>';
        echo '<td>'.$_product->price.'</td>';
        $sumcart+= $_product->price*$values['quantity'];
        echo '<td>';
        for ($i = 0; $i < count($_product->category_ids); $i++) {
            $terms_catnames = $wpdb->get_results("SELECT name, term_id FROM wp_terms WHERE term_id=".$_product->category_ids[$i]."");
            for ($j = 0; $j < count($terms_catnames); $j++) {
                echo ' '.$terms_catnames[$j]->name.' ';
                echo '</br>';
                $cat_array[] = $terms_catnames[$j]->term_id;
            }
        }
        echo '</td>';
        echo '<td>';
        echo $values['quantity'];
        echo '</td>';
        echo '</tr>';
        }
	echo '<tr><td>Итого</td><td></td><td>'.$sumcart.'</td><td></td></tr>';
	echo '</table>';

	
	
	$result = array_unique($cat_array);
    $cats_ids_array=$result;
	$debug->debug("PHP: Массив ID категорий в корзине $result:",$result );
	
	$count_of_categories = count($result);
	
	echo '</br>';
	echo '<h3>Категории, связанные с товарами в корзине. Настройка.</h3> 
	Выберите Min и Max количество товаров данной категории для внесения изменений  
	в корзине. Если Min=0 и Max=0, то все товары этой категории не попадут в корзину. 
	В таблице ниже укажите свои предпочтения по товарам.  
	При этом, если на товаре Min=Max, то такое количество товара включается в корзину. 
	Если Min=0 и Max=0 для конкретного товара, то этот товар не попадет в корзину. 
	Один товар может попасть в две и более категории. В этом случае количество категорий
	может отличаться от корзины.';
	echo '<table id = "table_cat"><tr><th>N</th><th>Name</th><th>Min</th><th>Max</th></tr>';


    $table_counter_cat = 0;
	foreach($result as $i => $id_cat){
		$terms_aidyn = $wpdb->get_results("SELECT name FROM wp_terms WHERE term_id=".$result[$i]."");
		$numKat=$i+1;
		echo '<tr><td id='.$result[$i].'>'.$numKat.'</td><td>'.$terms_aidyn[0]->name .'</td>';
			echo '<td>';
			echo '<select id="minCat'.$table_counter_cat.'"> 
				<option selected="selected" value="0">0</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				</select>';


			echo '</td>';
			echo '<td>';
			echo '<select id="maxCat'.$table_counter_cat.'">
				<option value="0">0</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option selected="selected" value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				</select>';
			echo '</td>';
		echo '</tr>';

        $table_counter_cat++;//категорияляр индекстарын улаатыннарабын.

	}
	echo '</table>';
	
	echo "КОЛИЧЕСТВО СВЯЗАННЫХ С КОРЗИНОЙ КАТЕГОРИЙ  ";
	echo $count_of_categories.". Все товары этих категорий." ;
	
	////echo '<table id = "table_products">';
	
	//$table_counter счетчик таблиц категорий
	//$table_counter = 0;
	$product_counter=0;
	
	foreach($result as $i => $id_cat){
		$catlist = $wpdb->get_results("SELECT object_id FROM wp_term_relationships WHERE term_taxonomy_id=".$result[$i]."");




		$terms_name = $wpdb->get_results("SELECT name FROM wp_terms WHERE term_id=".$result[$i]."");
        ////echo '<tr id = "cat_'.$i.'"><th>'.$terms_name[0]->name."</th><th>Цена</th><th>Предпочтение</th><th>Min</th><th>Max</th></tr>";
        ////echo "<br/> ";
		$ii=0;
		$count_of_cat_products[] = count($catlist);


		for($j = 0;$j<count($catlist);$j++){
			//базаттан товардар ааттарын талар
			$name_product_woo = $wpdb->get_row("SELECT post_title FROM wp_posts WHERE ID=".$catlist[$j]->object_id."");
			//базаттан товардар ID талар
			$id_product_woo = $wpdb->get_row("SELECT ID FROM wp_posts WHERE ID=".$catlist[$j]->object_id."");
			
			
			
			$product_regular_price = $wpdb->get_results("SELECT meta_value FROM wp_postmeta WHERE post_id=".$catlist[$j]->object_id." AND meta_key='_price'");
			$selected_products[]= array("id" => $id_product_woo->ID,"name" =>
                $name_product_woo->post_title,"price" => $product_regular_price[0]->
            meta_value,"preference" =>"Высокое" ,"min_count" => 0,
                "max_count" => 7, "kat_id" => $result[$i]);
			//Категорияга уларыттым kat_id. Товардар категориялара
			$ii++;
			$itotal=$ii-1;

            ////echo '<tr id = "product_'.$table_counter.$j.'"><td id = "product_name_'.$table_counter.$j.'">';
			$keydublicat=1;
			
			//проверка на дубликат

			///for ($k = 0;$k<count($selected_products)-1;$k++)
				////if(($i>0)&&($name_product_woo->post_title==$selected_products[$k]['name'])){
				////$keydublicat=0;
                ////unset($selected_products[$k]);//Удаляю все дубликаты для отправки в JS
			////}

            ////echo $name_product_woo->post_title;
            ////echo '</td><td>';
            ////echo $product_regular_price[0]->meta_value;
            ////echo '</td>';

            ////echo '<td>';
			if($keydublicat){
			////echo '<select id="prefe'.$table_counter.$j.'" style="width : 100px">
				////<option selected="selected" value="10">Высокое</option>
				////<option value="5">Среднее</option>
				////<option value="1">Низкое</option>
                ////</select>';
			}
            ////echo '</td>';
					
			/*$countInCart=0;
			//талыллыбыт продуктар ааттарын булабын
			$keyName=true;
			foreach($products_names_array as $num => $name){
				if($name_product_woo->post_title==$name){
					$countInCart=$products_quantities_array[$num];
					//$countInCart='В корзине ('.$countInCart.')';
					$keyName=false;
				}
			}*/

            ////echo '<td>';
			if($keydublicat){
			////echo '<select id="minabox'.$table_counter.$j.'" style="width : 30px">
				////<option selected value="0">0</option>
				////<option value="1">1</option>
				////<option value="2">2</option>
				////<option value="3">3</option>
				////<option value="4">4</option>
				////<option value="5">5</option>
                ////</select>';
                ////echo '</td>';
			}
            ////echo '<td>';
			$maxval = 'value ="';
			$selected_text = '';
			//браузерга анаан кодтарв дополнительно киллэрди
/*
			if($keydublicat){
				if(!$keyName){

				echo '<select id="maxabox'.$table_counter.$j.'" style="width : 30px">';
                    for($l = 0; $l<6; $l++){
                        if($l==$countInCart)$selected_text = 'selected ';
                        else $selected_text = '';
                        echo '<option '.$selected_text.'value="'.$l.'">'.$l.'</option>';
                    }
                        echo '</select>';
                    ///////
                    //$selected_products[$product_counter][kat_id]=99;
				}
				else {

				echo '<select id="maxabox'.$table_counter.$j.'" style="width : 30px">
					<option selected="selected" value="0">0</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					</select>';
				}
			}
  */          ////echo '</td>';

            ////		echo '</tr>';

            $product_counter++;
		}
		//$table_counter++;
	}


// Удаляю дибликаты товаров, которые попали в разные категории
    // получаем уникальные ключи
    $uniqueKeys = array_keys(
        array_unique(
            array_map(function($item) {
                return $item['id'];
            }, $selected_products)
        )
    );

// извлекаем в новый массив те ключи, которые были уникальными
   $uniqueArray = array_filter($selected_products, function($itemKey) use ($uniqueKeys){
           return in_array($itemKey, $uniqueKeys);
    });


    $selected_products_results =[];
// извлекаем в новый массив те ключи, которые были уникальными
    foreach($selected_products as $item => $val){
        if (in_array($item, $uniqueKeys)) {
            array_push($selected_products_results, $val);
        }


    }





	global $cart_page_url;
	$cart_page_url = get_permalink(woocommerce_get_page_id( 'cart' ));

//    echo '<pre>';
//    print_r($selected_products);
//    echo '</pre>';

    $selected_products_non_sorted=$selected_products;//Старое оставил. Там несколько категорий у одного
    // товара может быть
    $selected_products=$selected_products_results;//Переопределил. Уже без повтора



//    echo '<pre>';
//    print_r($selected_products_results);
//    echo '</pre>';


    echo '<table id = "table_products">';
    echo '<th>N</th><th>Название</th><th>Цена</th><th>Предпочтение</th><th>Min</th><th>Max</th>';
        ////echo "<br/> ";;
    foreach($selected_products as $i => $vals){
        $numb=$i+1;
        echo '<tr><td>'.$numb.'</td><td id=product_name_'.$i.'>'.$vals['name'].'</td><td>'.$vals['price'].'</td><td>';
        echo '<select id="prefe'.$i.'" style="width : 100px">
        <option selected="selected" value="10">Высокое</option>
        <option value="5">Среднее</option>
        <option value="1">Низкое</option>
        </select>'.'</td><td>';
        echo '<select id="minabox'.$i.'" style="width : 30px">
        <option selected value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        </select></td><td>';
        echo '<select id="maxabox'.$i.'" style="width : 30px">';
        for($l = 0; $l<6; $l++){
            $countInCart=0;
            //талыллыбыт продуктар ааттарын булабын
            foreach($products_names_array as $num => $name){
                if($vals['name']==$name){
                    $countInCart=$products_quantities_array[$num];
                    //$countInCart='В корзине ('.$countInCart.')';
                    $keyName=false;
                }
            }
           if($l==$countInCart) $selected_text = 'selected ';
            else $selected_text = '';
            echo '<option '.$selected_text.'value="'.$l.'">'.$l.'</option>';
        }
        echo '</select>';
     /*   echo '<select id="maxabox'.$i.'" style="width : 30px">
        <option selected="selected" value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        </select>';*/
    echo  '</td></tr>';
   }
    echo '</table>';
}

function msv_add_button($content) { 
global $selected_products_results;
global $selected_products_non_sorted;
global $count_of_categories;
global $count_of_cat_products;
global $post;
global $products_ids_array;
global $cart_page_url;
global $cats_ids_array;

	$my_page_title = 'Оптимизация корзины';
	if (!($my_page_title==$post->post_title)) return $content;

$button = 'Кнопка для jQuery';

for($i = 0; $i < count($selected_products_results); $i++){
$selected_products[$i]= array(
"id" => $selected_products_results[$i][id],
"name" => $selected_products_results[$i][name],
"price" => $selected_products_results[$i][price],
"preference" =>$selected_products_results[$i][preference],
"min_count" => $selected_products_results[$i][min_count],
"max_count" => $selected_products_results[$i][max_count],
"kat_id" => $selected_products_results[$i][kat_id]);
}

    $debug = new PHPDebug();
    $debug->debug("PHP: Глобальный Массив selected_products_results:",$selected_products_results );
    $debug->debug("PHP: Глобальный Массив selected_products_non_sorted:",$selected_products_non_sorted );


?>
<script type="text/javascript">
	var count_of_categories = "<?php echo $count_of_categories;?>";
 	var button = "<?php echo $button; ?>";
	var sumTotal=0;
    var selected_products = <?php echo json_encode($selected_products); ?>;
    var selected_products_non_sorted = <?php echo json_encode($selected_products_non_sorted); ?>;
	var count_of_cat_products = <?php echo json_encode($count_of_cat_products);?>;
	var products_ids_array = <?php echo json_encode($products_ids_array);?>;          
	var cats_ids_array = <?php echo json_encode($cats_ids_array);?>;
</script>




<div class="wrap">
	<h4> Вывод альтернативных вариантов корзины</h4>
	Для просмотра альтернативных, других вариантов корзины настройте выше свои предпочтения. Встроенный оптимизационный калькулятор решает задачу максимизации полезности при заданных предпочтениях. Сначала показывает полезность вашей корзины
	и дополнительно еще 5 альтернативных вариантов корзины. Количество альтернатив настраивается. Если хотите поменять корзину, то ставите галочку и нажимаете кнопку "Поменять товары корзины". 
	<h2>Для оптимизации корзины введите бюджет и нажмите кнопку</h2>
	Бюджет: <input type="text" id="new_budget" />
	<a  class="button25" >Оптимизировать</a>
	
	<div id="budget">
	</div>

    <a  class="buttonToggle" >Показать/скрыть все варианты</a>

    <div id="all_table_show"></div>

	<div id="min_count">
	</div>

	<div id="max_count">
	</div>

	<div id="product_arr">
	</div>
	<div style="overflow-x: auto;" id="product_arr_not_sorted">
	</div>
	<h2>5 лучших вариантов по стоимости</h2>
	<div id="wait0">
	</div>
	<div style="overflow-x: auto;" id="product_opt_all">	
	</div>
	
	
	
	<h2>5 лучших вариантов по полезности</h2>
	<div id="wait1">	
	</div>
	<div style="overflow-x: auto;" id="product_preference_all">	
	</div>
	
	
</div>

<form action="<?php echo $cart_page_url;?>">
	<button class="buttonHidden" >Открыть корзину</button>
	</form>

<?php
}