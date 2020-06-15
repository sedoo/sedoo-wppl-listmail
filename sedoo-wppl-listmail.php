<?php
/**
 * Plugin Name: Sedoo - Listmail
 * Description: Facilite l'envoie d'email aux admins des sites
 * Version: 0.0.1
 * Author: Nicolas Gruwe & Pierre Vert - SEDOO DATA CENTER
 * Author URI:      https://www.sedoo.fr 
 * GitHub Plugin URI: sedoo/sedoo-wppl-listmail
 * GitHub Branch:     master
 */


function enqueue_listmail_style() {
    wp_register_style( 'sedoo_listmail_css', plugins_url('css/listmail.css', __FILE__) );
    wp_enqueue_style( 'sedoo_listmail_css' );
}
add_action( 'admin_enqueue_scripts', 'enqueue_listmail_style' );

function enqueue_listmail_script() {
    // le fichier js qui contient les fonctions tirgger au change des select
    $scrpt_listmail = plugins_url().'/sedoo-wppl-listmail/js/listmail.js';
    wp_enqueue_script('sedoo_listmail', $scrpt_listmail,  array ( 'jquery' ));                    
}
add_action( 'admin_enqueue_scripts', 'enqueue_listmail_script' );

function sedoo_listmail_add_page_func() {
    add_menu_page(
        __( 'Envoi de mail', 'my-textdomain' ),
        __( 'Envoi de mail', 'my-textdomain' ),
        'manage_options',
        'envoi-mail',
        'sedoo_send_mail_listmail',
        'dashicons-email',
        3
    );
}

add_action( 'admin_menu', 'sedoo_listmail_add_page_func' );

function display_user_bloc($email, $name, $nsite, $uid, $role) { // affiche le paragraphe contenant le nom et faisant office de case à cocher
    echo '<p class="sedoo_listmail_name siten-'.$nsite.' uid-'.$uid.' role-'.$role.'" uid="'.$uid.'" sedoo_maill="'.$email.'">'.$name.'</p>';
}

function sedoo_send_mail_listmail() {
    ?>
        <h1>
            <?php esc_html_e( 'Choix des destinataires', 'my-plugin-textdomain' ); ?>
        </h1>
    <?php
    $sites_list = get_sites();
    $i =0;
    foreach ( $sites_list as $site ) {
        switch_to_blog( $site->blog_id );
        echo '<section class="listmail_title" id="nsite-'.$i.'"> <div class="listmail_header" id="'.$i.'"><span class="dashicons dashicons-arrow-down" ></span> <h2>'.get_bloginfo( 'name' ).'</h2></div>';
        echo '<div class="listmail_content">';
            echo '<div class="listmail_section">';
                echo '<h4> Administrateurs <span class="dashicons dashicons-yes checkall" title="Cocher / Decocher tous"></span> </h4> ';
                $blogusers_admin = get_users( [ 'role__in' => ['administrator'] ] );
                foreach($blogusers_admin as $user_admin){
                    display_user_bloc($user_admin->user_email,$user_admin->user_login, $i, $user_admin->ID, 'administrator');
                }
            echo '</div>';
            echo '<div class="listmail_section">';    
                echo '<h4> Editeurs <span class="dashicons dashicons-yes checkall" title="Cocher / Decocher tous"></span></h4>';
                $blogusers_editor = get_users( [ 'role__in' => ['editor'] ] );
                foreach($blogusers_editor as $user_editor){
                    display_user_bloc($user_editor->user_email,$user_editor->user_login, $i, $user_editor->ID, 'editor');
                }
            echo '</div>';
        echo '</div>';
        echo '</section>';
        $i++;
        restore_current_blog();
    }
    ?>
    <h2> Par rôle </h2>
   <h4> Administrateurs <span class="dashicons dashicons-yes byrole" role="administrator" title="Cocher / Decocher tous"></span> </h4>
   <h4> Editeurs <span class="dashicons dashicons-yes byrole" role="editor" title="Cocher / Decocher tous"></span> </h4>



    <script>
       var ajaxurl = "<?php  echo admin_url('admin-ajax.php'); ?>";
    </script>
    <hr />
    <h1> <?php esc_html_e( 'Formulaire', 'my-plugin-textdomain' ); ?> </h1>
    <h2> Destinataires : </h2>
    <p id="sedoo_listmail_destlist"> </p>
    <section class="sedoo_listmailform">
        <input type="text" name="sedoo_listmail_subject" class="regular-text sedoo_listmail_subject" placeholder="Sujet du mail">
        <textarea name="sedoo_listmail_text" rows="5" cols="30" class="sedoo_listmail_text"></textarea>
        <input type="submit" name="submit" id="sedoo_listmail_submit" class="button button-primary" value="Envoyer">    
    </section>
    <?php 
}

add_action('wp_ajax_nopriv_sedoo_listmail_sendmailto', 'sedoo_listmail_sendmailto');
add_action('wp_ajax_sedoo_listmail_sendmailto', 'sedoo_listmail_sendmailto');
function sedoo_listmail_sendmailto() {
    $destlist = $_POST['destlist'];
    
}
