<?php
/**
 * Created by PhpStorm.
 * User: Mrikaev Kostya
 * Date: 09.09.2020
 * Time: 22:00
 */

defined( 'ABSPATH' ) || exit;
if ( ! defined( 'COCO_PLUGIN_FILE' ) ) {
	define( 'COCO_PLUGIN_FILE', __FILE__ );
}

class Composite {
	protected static $_instance = null;
	protected $fields = null;

	public function __construct() {
		register_activation_hook( __FILE__, array($this,'plugin_activate') );
		// Initialize admininstrator menu
		if(is_admin()) {
			add_action( 'admin_menu', array($this,'admin_menu'));
			add_action( 'admin_init', array($this,'admin_init'));
		}
		$this->get_fields();
	}

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	// Hook handles
	public function admin_init(){
		foreach($this->fields as $field){
			register_setting( 'coco-plugin-settings-group', $field->slug );
		}

	}
	public function admin_menu(){
		add_submenu_page( 'edit.php?post_type=product',
			"Редактор сборщика Woocommerce",
			"Редактор сборщика",
			'manage_options',
			'coco_editor',
			array($this,'settings_page'),
			'55.4' );
	}

	function plugin_activate() {
		// Trigger our function that registers the custom post type plugin.
		add_shortcode('composite_constructor',array($this,'composite_constructor'));
		// Clear the permalinks after the post type has been registered.
		flush_rewrite_rules();
	}


	private function get_fields(){
		$path =  plugin_dir_url( __DIR__ ).'fields.json';
		$request = wp_remote_get($path);
		if( is_wp_error( $request ) ) {
			throw new Error("Bad request. JSON data file cant't downloaded.");
		}
		$body = wp_remote_retrieve_body($request);
		$this->fields = json_decode($body);
	}


	// templates
	private function composite_constructor( $atts, $content = null ) {
		echo '<h1>It\'s shortcode</h1>';
		echo do_shortcode( "[products category='' limit='2']" );
	}
	public function settings_page() {
		include_once plugin_dir_path( __DIR__ ) .'\\templates\\settings-page.php';
	}
}


