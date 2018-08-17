<?php
  //A snip of code I found on this site to help me build my app
  //https://snipcart.com/blog/reactjs-wordpress-rest-api-example

   /*
   Plugin Name: GetGHCustomFields
   Description: Get the custom fiends I created for my site
   Version: 1.0
   Author: Greg Hennessey
   Author URI: http://www.greghennessey.com
   License: MIT
   */

function getCustomField_add_json() {

    register_rest_field( 'page', 'background_image', array(
        'get_callback' => function( $post ) {
            return get_field('background_image');
        }
    ) );

    register_rest_field( 'page', 'logo_image', array(
        'get_callback' => function( $post ) {
            return get_field('logo_image');
        }
    ) );

}
add_action( 'rest_api_init', 'getCustomField_add_json' );

function getAllMenuItems() {
  //Important page data that we want is...
  // ID
  // guid
  // post_title
  // menu_order
  $pages = wp_get_nav_menu_items();
  if ( empty( $pages ) ) {
    return null;
  }

  return $pages;
}

add_action( 'rest_api_init', function() {
  register_rest_route( 'gh/v1', '/menu_items', array(
    'methods' => 'GET',
    'callback' => 'getAllMenuItems'
  ) );
} );

// allow CORS
header("Access-Control-Allow-Origin: *");

?>
