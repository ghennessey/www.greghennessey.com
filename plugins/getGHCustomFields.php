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

        // register_rest_field( 'post', 'description', array(
        //     'get_callback' => function( $post ) {
        //         return get_field('description');
        //     }
        // ) );
        //
        // register_rest_field( 'post', 'image', array(
        //     'get_callback' => function( $post ) {
        //         return get_field('image');
        //     }
        // ) );
    }

    add_action( 'rest_api_init', 'getCustomField_add_json' );
?>
