<?php
/**
 * Created by PhpStorm.
 * User: Guardian
 * Date: 09.09.2020
 * Time: 15:51
 */
$default = '[
          {
            "title": "Процессоры",
            "slug": "processori",
            "terms": ["pa_soket"]
          },
          {
            "title": "Материнские карты",
            "slug": "materinskie-plati",
            "terms": ["pa_soket"]
          }
        ]';
$value = get_option('shema')?get_option('shema'):$default;

?>
<div class="wrap">
    <form method="post" action="options.php">
	    <?php settings_fields( 'configurator-plugin-settings-group' ); ?>
	    <?php do_settings_sections( 'configurator-plugin-settings-group' ); ?>
        <div class="nav-tab-wrapper">
            <div class="nav-tab nav-tab-active">Основное</div>
        </div>
        <h1 class="screen-reader-text">Основное</h1>
        <h2>Конфигурация сборщика ПК</h2>
        <p>
            Задайте настройки конфигуратора
        </p>
        <textarea name="shema" style="width: 600px" rows="16"><?php echo $value?></textarea>
        <?php submit_button(); ?>
    </form>
</div>

