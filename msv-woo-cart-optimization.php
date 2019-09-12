<?php
/*
Plugin Name: Msv Woo Cart Optimization
Plugin URI: http://chessmsv.ru/%D0%BF%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-msv-woo-cart-optimization
Description: оптимизация корзины интернет магазина, использующего плагин WooCommerce, по методике "Задачи потребителя"
Author: Semyon Mestnikov
Version: 1.0.0
Author: http://chessmsv.ru/
*/

/*  Copyright 2019  Semyon Mestnikov  (email: mestsv@mail.ru)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
if(is_admin() == TRUE){
	register_activation_hook(__FILE__, function(){
			global $user_ID;
					
			wp_insert_post(array(
				'post_type'			=> 'page',
				'post_title'		=> 'Оптимизация корзины',
				'comment_status'	=> 'closed',
				'post_status'		=> 'publish',
				'ping_status'		=> 'closed',
				'post_author'		=> $user_ID,
				'post_name'			=> 'cart-in-cart',
				));
	});
}

require __DIR__.'/functions.php';
add_action('wp_enqueue_scripts','msv_cartoptimization_scripts');



register_activation_hook(__FILE__,'cartoptimization_install');
register_deactivation_hook(__FILE__,'cartoptimization_uninstall');
register_uninstall_hook(__FILE__,'cartoptimization_ondelete');



//add_action('admin_menu','cartoptimization_admin_menu');


// Включаем код для отладки и определяем объект
require_once("PHPDebug.php");


//add_action('woocommerce_cart_contents', 'msv_add_button');
add_filter('the_content', 'pagesearch');
add_filter('the_content', 'msv_add_button');

add_action( 'wp_ajax_msvCart', 'newproducts_function' ); // wp_ajax_{ЗНАЧЕНИЕ ПАРАМЕТРА ACTION!!}
add_action( 'wp_ajax_nopriv_msvCart', 'newproducts_function' ); // wp_ajax_{ЗНАЧЕНИЕ ПАРАМЕТРА ACTION!!}








