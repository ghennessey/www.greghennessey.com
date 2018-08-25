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

    /* DEBUG STUFF */

   function console_log( $data ){
     echo '<script>';
     echo 'console.log('. json_encode( $data ) .')';
     echo '</script>';
   }

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

function getPageByID( WP_REST_Request $request ) {
  $id = $request['id'];
  $pages = get_pages(array(
    'include' => $id
  ));
  return $pages;
}

function getAllMenuItems() {
  //$pages = wp_get_pages();
  $menu = "Main";
  $menuItems = wp_get_nav_menu_items( $menu );

  if ( empty( $menuItems ) ) {
    return null;
  }

  return $menuItems;
}

add_action( 'rest_api_init', function() {
  register_rest_route( 'gh/v1', '/menu_items', array(
    'methods' => 'GET',
    'callback' => 'getAllMenuItems'
  ) );

  register_rest_route( 'gh/v1', '/page/(?P<id>[\d]+)', array(
    'methods' => WP_REST_Server::READABLE,
    'callback' => 'getPageByID'
  ) );

} );

?>
