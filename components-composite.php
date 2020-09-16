<?php
/**
 * Plugin Name:       Composite Components
 * Plugin URI:        https://vk.com/unnamed_wanderer
 * Description:       Selects components in the PC assembly.
 * Version:           1.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Mrikaev Konstantin
 * Author URI:        https://vk.com/unnamed_wanderer
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;
if ( ! defined( 'COCO_PLUGIN' ) ) {
	include_once (__DIR__ . '/includes/class-composite.php');


	function CompositePlugin() {
		return Composite::instance();
	}

	// Global for backwards compatibility.
	$GLOBALS['components-composition'] = CompositePlugin();
}
