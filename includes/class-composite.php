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
	protected static $namespace = 'constructor/v1';

	public function __construct() {
		register_activation_hook( __FILE__, array( $this, 'plugin_activate' ) );
		$this->get_fields();

		if ( Composite::is_request_api() ) {
			// REST API was included starting WordPress 4.4.
			if ( ! class_exists( 'WP_REST_Server' ) ) {
				return;
			}
			add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		} else {
			wp_register_script( 'constructor', plugins_url( '../assets/js/bundle.js', __FILE__ ), array(), '1.0.0', 'all' );
			add_shortcode( 'composite_constructor', array( $this, 'composite_constructor' ) );
			if ( is_admin() ) {
				add_action( 'admin_menu', array( $this, 'admin_menu' ) );
				add_action( 'admin_init', array( $this, 'admin_init' ) );
			}
		}

	}

	private static function get_wc_version() {
		return defined( 'WC_VERSION' ) && WC_VERSION ? WC_VERSION : null;
	} // END get_wc_version()

	private static function is_request_api() {
		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}

		$rest_prefix         = trailingslashit( rest_get_url_prefix() );
		$is_rest_api_request = ( false !== strpos( $_SERVER['REQUEST_URI'], $rest_prefix . Composite::$namespace ) );

		return $is_rest_api_request;
	}

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	// Hook handles
	public function admin_init() {
		foreach ( $this->fields as $field ) {
			register_setting( 'coco-plugin-settings-group', $field->slug );
		}

	}

	public function admin_menu() {
		add_submenu_page( 'edit.php?post_type=product',
			"Редактор сборщика Woocommerce",
			"Редактор сборщика",
			'manage_options',
			'coco_editor',
			array( $this, 'settings_page' ),
			'55.4' );
	}

	public function plugin_activate() {
		// Clear the permalinks after the post type has been registered.
		flush_rewrite_rules();
	}


	private function get_fields() {
		$path    = plugin_dir_url( __DIR__ ) . 'fields.json';
		$request = wp_remote_get( $path );
		if ( is_wp_error( $request ) ) {
			throw new Error( "Bad request. JSON data file cant't downloaded." );
		}
		$body         = wp_remote_retrieve_body( $request );
		$this->fields = json_decode( $body );
	}

	// rest
	public function rest_api_init() {
		$this->initialize_woocommerce();
		register_rest_route( Composite::$namespace, '/get-products-by-categories/(?P<slug>[a-zA-Z\-]+)', [
			'methods'  => WP_REST_Server::CREATABLE,
			'callback' => array( $this, 'rest_get_products' ),
		], [

		] );
		register_rest_route( Composite::$namespace, '/get-categories', [
			'methods'  => WP_REST_Server::READABLE,
			'callback' => array( $this, 'rest_get_fields' )
		] );
		register_rest_route( Composite::$namespace, '/create-order', [
			'methods'  => WP_REST_Server::CREATABLE,
			'callback' => array( $this, 'rest_order_products' )
		] );
	}

	public function rest_get_fields( WP_REST_Request $request ) {
		return $this->fields;
	}

	public function rest_get_products( $data = array() ) {
		$page = ! isset( $data['page'] ) ? 1 : wc_clean( wp_unslash( $data['page'] ) );
		$slug = ! isset( $data['slug'] ) ? 0 : wc_clean( wp_unslash( $data['slug'] ) );
		$terms = ! isset( $data['terms'] ) ? [] : wc_clean( wp_unslash( $data['terms'] ) );


		$field = array_reduce( $this->fields, function ( $res, $item ) use ( $slug ) {
			return $item->slug == $slug ? $item : $res;
		}, null );

		if ( empty( $field ) ) {
			return new WP_Error( 'no_find_field', 'Не удалось найти field', [ 'status' => 404 ] );
		}
		$args  = array(
			'posts_per_page' => 2,
			'page'           => $page,
			'category'       => $slug,
			'paginate'       => true
		);
		$query = new WC_Product_Query( $args );
		$tax_query_array = array();
		if($terms) {
			foreach ( $terms as $term ) {
				array_push( $tax_query_array, array(
					'taxonomy' => $term['name'],
					'field'    => 'options',
					'operator' => 'in',
					'terms'    => $term['value']
				) );
			}
			$query->set('tax_query',$tax_query_array);
		}

		$products           = $query->get_products();
		$products->products = array_map( function ( $item ) use ( $slug ) {
			$attributes = array_map( function ( $attr ) {
				return array(
					'id'      => $attr->get_id(),
					'name'    => $attr->get_name(),
					'options' => $attr->get_options()
				);
			}, $item->get_attributes() );

			return array(
				'name'       => $item->get_name(),
				'price'      => $item->get_price(),
				'id'         => $item->get_id(),
				'sku'        => $item->get_sku(),
				'category'   => $slug,
				'attributes' => $attributes
			);
		}, $products->products );

		return $products;
	}

	/**
	 * @param array $request
	 *
	 * @return Exception|string|Throwable
	 */
	public function rest_order_products( $request = array() ) {
		$values = json_decode( $request->get_body() )->ids;
		foreach ( $values as $id ) {
			try {
				WC()->cart->add_to_cart( $id, 1 );
			} catch ( Throwable $t ) {
				return $t;
			}
		}

		return wc_get_cart_url();
	}

	public function display_search_result() {

		$skus        = urldecode( $_POST['sku_universel'] );
		$skus        = explode( ',', $skus );
		$product_ids = array();

		// you can use native woocommerce function to get the product ids
		foreach ( $skus as $sku ) {
			$product_id = wc_get_product_id_by_sku( $sku );
			if ( is_int( $product_id ) ) {
				$product_ids .= $product_id;
			}
		}

		$args      = array(
			'post_type'      => 'product', // product, not products
			'post_status'    => 'publish',
			'post__in'       => $product_ids,
			'posts_per_page' => 100 // change this based on your needs
		);
		$ajaxposts = new WP_Query( $args );

		$response = '';

		if ( $ajaxposts->posts ) {
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

	private function initialize_woocommerce() {
		if ( defined( 'WC_ABSPATH' ) ) {
			// WC 3.6+ - Cart and other frontend functions are not included for REST requests.
			include_once WC_ABSPATH . 'includes/wc-cart-functions.php';
			include_once WC_ABSPATH . 'includes/wc-notice-functions.php';
			include_once WC_ABSPATH . 'includes/wc-template-hooks.php';
		}

		if ( null === WC()->session ) {
			$session_class = apply_filters( 'woocommerce_session_handler', 'WC_Session_Handler' );

			WC()->session = new $session_class();
			WC()->session->init();
		}

		if ( null === WC()->customer ) {
			WC()->customer = new WC_Customer( get_current_user_id(), true );
		}

		if ( null === WC()->cart ) {
			WC()->cart = new WC_Cart();

			// We need to force a refresh of the cart contents from session here (cart contents are normally refreshed on wp_loaded, which has already happened by this point).
			WC()->cart->get_cart();
		}
	}

	// templates
	public function composite_constructor( $atts, $content = null ) {
		include_once plugin_dir_path( __DIR__ ) . '\\templates\\constructor.php';
		wp_enqueue_script( 'constructor' );
	}

	public function settings_page() {
		//include_once plugin_dir_path( __DIR__ ) . '\\templates\\settings-page.php';
	}
}


