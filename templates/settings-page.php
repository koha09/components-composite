<?php
/**
 * Created by PhpStorm.
 * User: Guardian
 * Date: 09.09.2020
 * Time: 15:51
 */

$categories = get_terms( array(
	'taxonomy' => 'product_cat'
));

?>
<div class="wrap">
    <form method="post" action="options.php">
	    <?php settings_fields( 'coco-plugin-settings-group' ); ?>
	    <?php do_settings_sections( 'coco-plugin-settings-group' ); ?>
        <div class="nav-tab-wrapper">
            <div class="nav-tab nav-tab-active">Основное</div>
        </div>
        <h1 class="screen-reader-text">Основное</h1>
        <h2>Категории</h2>
        <p>
            Прикрепите к разделам соответствующие категории товаров
        </p>
        <table>
            <?php
                foreach($this->fields as $field) {
	                ?>
                    <tr valign="top">
                        <th scope="row">
                            <label><?php echo $field->title ?></label>
                        </th>
                        <td>
                            <select name="<?echo $field->slug ?>">
				                <?
				                foreach ( $categories as $c ) {
					                $selected = $c->slug == esc_attr( get_option( $field->slug ) );
					                if ( $selected ) {
						                echo "<option value='$c->slug' selected>$c->name</option>";
					                } else {
						                echo "<option value='$c->slug'>$c->name</option>";
					                }
				                }
				                ?>
                            </select>
                        </td>
                    </tr>
	                <?php
                }
            ?>
        </table>
        <?php submit_button(); ?>
    </form>
</div>

