<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * e.g., it puts together the home page when no home.php file exists.
 *
 * Learn more: {@link https://codex.wordpress.org/Template_Hierarchy}
 *
 * @package WordPress
 * @subpackage GH-2018
 * @since GH-2018 1.0
 */

 $homepage = file_get_contents('http://www.greghennessey.com/wp-content/themes/gh-2018/build/index.html');
 echo $homepage;
  ?>
