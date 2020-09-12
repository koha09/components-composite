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
		add_shortcode('composite_constructor',array($this,'composite_constructor'));
		register_activation_hook( __FILE__, array($this,'plugin_activate') );
		// Initialize admininstrator menu
		if(is_admin()) {
			add_action( 'admin_menu', array($this,'admin_menu'));
			add_action( 'admin_init', array($this,'admin_init'));
		}
		$this->get_fields();

		// rest
		add_action('rest_api_init',array($this,'rest_api_init'));
		// assets
		wp_register_script('constructor',plugins_url('../assets/js/bundle.js',__FILE__),array(),'1.0.0','all');

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

	public function plugin_activate() {
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

	// rest
	public function rest_api_init(){
		register_rest_route( 'constructor/v1', '/get-products-by-categories/(?P<slug>[a-zA-Z\-]+)', [
			'methods'  => 'GET',
			'callback' => array($this,'rest_get_products'),
		] );
		register_rest_route('constructor/v1','/get-categories', [
			'method'=>'GET',
			'callback' => array($this,'rest_get_fields')
		]);
	}

	public function rest_get_fields(WP_REST_Request $request){
		return $this->fields;
	}
	public function rest_get_products( WP_REST_Request $request ){
		$field = array_reduce($this->fields, function ($res,$item) use ($request) {
			return $item->name == $request['slug']?$item:$res;
		},null);
		if(empty($field)){
			return new WP_Error( 'no_author_posts', 'Записей не найдено', [ 'status' => 404 ] );
		}
		$category = esc_attr( get_option( $field->name ));
		$args = array(
			'posts_per_page' => 12
		);
		$query = new WC_Product_Query($args);
		$products = $query->get_products();
		return array_map(function($item){
			return array(
				'name'=>$item->get_name(),
				'price'=>$item->get_price(),
				'id'=>$item->get_id(),
				'sku'=>$item->get_sku(),
				'categories'=>$item->get_categories()
			);
		},$products);

	}


	public function display_search_result(){

		$skus = urldecode($_POST['sku_universel']);
		$skus = explode(',',$skus);
		$product_ids = array();

		// you can use native woocommerce function to get the product ids
		foreach($skus as $sku){
			$product_id = wc_get_product_id_by_sku($sku);
			if ( is_int($product_id) ) {
				$product_ids.=$product_id;
    }
		}

		$args = array(
			'post_type'      => 'product', // product, not products
			'post_status'    => 'publish',
			'post__in'       => $product_ids,
			'posts_per_page' => 100 // change this based on your needs
		);
		$ajaxposts = new WP_Query( $args );

		$response = '';

		if ( $ajaxposts->posts ){
			while ( $ajaxposts->have_posts() ) {
				$ajaxposts->the_post();
				$response .= wc_get_template_part( 'content', 'product' ); // use WooCommerce function to get html
			}
		} else {
			// handle not found by yourself or
			// perhaps do_action( 'woocommerce_no_products_found' ); could do the trick?
		}

		echo $response;
		exit;

	}
	// templates
	public function composite_constructor( $atts, $content = null ) {
		include_once plugin_dir_path( __DIR__ ) .'\\templates\\constructor.php';
		wp_enqueue_script('constructor');
	}
	public function settings_page() {
		include_once plugin_dir_path( __DIR__ ) .'\\templates\\settings-page.php';
	}
}


