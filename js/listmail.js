jQuery(document).ready(function(){   
    var suneditor = jQuery('#textarea_mess').get(0);
    
    var fonts = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'];
    var Font = Quill.import('formats/font');
    Font.whitelist = fonts;

    var fullEditor = new Quill('#full-container .editor', {
        bounds: '#full-container .editor',
        modules: {
          'toolbar': [
            [{ 'font': fonts }, { 'size': [] }],
            [ 'bold', 'italic', 'underline', 'strike' ],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'super' }, { 'script': 'sub' }],
            [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
            [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
            [ 'direction', { 'align': [] }],
            [ 'link', 'image', 'video' ],
            [ 'clean' ]
          ],
        },
        theme: 'snow'
      });

    function cochage_utilisateur(uid, maill, name) {
        jQuery('#sedoo_listmail_destlist').append('<p class="sedoo_listmail_dest_elem" mail="'+maill+'" id="'+uid+'">'+name+'</p>'); 
        jQuery(".sedoo_listmail_name.uid-"+uid).addClass('active'); // si l'user est dans plusieurs site, je coche / décoche toutes ses occurrences
        if(jQuery('.sedoo_listmail_subject').val().length !=0 && jQuery('.ql-editor').text().length !=0 && jQuery('.sedoo_listmail_expediteur').val().length !=0){
            jQuery('#sedoo_listmail_submit').attr('disabled', false);
        }
    }


    function decochage_utilisateur(uid) {
        jQuery('#'+uid+'.sedoo_listmail_dest_elem').remove();
        jQuery(".sedoo_listmail_name.uid-"+uid).removeClass('active'); // si l'user est dans plusieurs site, je coche / décoche toutes ses occurrences        
        if(jQuery('.sedoo_listmail_dest_elem').length === 0) {
            jQuery('#sedoo_listmail_submit').attr('disabled', true);  
        }
    }

    jQuery('.listmail_title .listmail_header').click(function() {  // déplier replier les volets
        var id = jQuery(this).attr('id');
        jQuery('#nsite-'+id).toggleClass('unfold');
    });
    
    jQuery('.byrole').click(function() {   // ajouter tous ceux d'un role
        var role = jQuery(this).attr('role');
        
        if(jQuery(this).hasClass('active')) { // si le filtre byrole est actif alors je le désactive et je décoche les éléments
            jQuery('.role-'+role).each(function( index ) { // je parcours les elements
                var uid = jQuery(this).attr('uid');            
                decochage_utilisateur(uid);
            });
        } else { // sinon je l'active et je coche les elements
            jQuery('.role-'+role).each(function( index ) { // je parcours les elements
                if(jQuery(this).hasClass('active')) { // si un element y est deja je touche pas (pour pas ajouter 2fois)
                } else { // sinon j'ajoute
                    var uid = jQuery(this).attr('uid');
                    var maill = jQuery(this).attr('sedoo_maill');
                    var name = jQuery(this).text();    
                    cochage_utilisateur(uid, maill, name);  
                }
            });
        }
        jQuery(this).toggleClass('active');
    });

    jQuery('.listmail_section .checkall').click(function() { // ajouter les adresses de toute une liste au clic de la liste
        if(jQuery(this).hasClass('active')) {
            jQuery( this ).parent().siblings('.sedoo_listmail_name').removeClass('active');
            jQuery( this ).parent().siblings('.sedoo_listmail_name').each(function( index ) {
                var uid = jQuery(this).attr('uid');            
                decochage_utilisateur(uid);
            });
        } else {
            jQuery( this ).parent().siblings('.sedoo_listmail_name').each(function( index ) {
                if(jQuery(this).hasClass('active')) { // si un element y est deja je touche pas (pour pas ajouter 2fois)
                } else {
                    var uid = jQuery(this).attr('uid');
                    var maill = jQuery(this).attr('sedoo_maill');
                    var name = jQuery(this).text();    
                    cochage_utilisateur(uid, maill, name);   
                }     
            });
        }
        jQuery(this).toggleClass('active');
    });

    jQuery('.sedoo_listmail_name').click(function() {   // ajouter une adresse a la liste de destinataires
        var uid = jQuery(this).attr('uid');
        var maill = jQuery(this).attr('sedoo_maill');
        var name = jQuery(this).text();
        if(jQuery(this).hasClass('active')) {          // j'enlève ou j'ajoute l'élément a la liste des destinataires en fonction de l'état du bouton
            decochage_utilisateur(uid);
        } else {
            cochage_utilisateur(uid, maill, name);   
        }
    });


    jQuery('#sedoo_listmail_submit').attr('disabled', true);
    function check_et_activer_bouton() {
        if(jQuery('.sedoo_listmail_subject').val().length !=0 && jQuery('.ql-editor').text().length !=0 && jQuery('.sedoo_listmail_expediteur').val().length !=0 && jQuery('.sedoo_listmail_dest_elem').length != 0){
            jQuery('#sedoo_listmail_submit').attr('disabled', false);
        }
        else
        {
            jQuery('#sedoo_listmail_submit').attr('disabled', true);        
        }
    }

    jQuery('.sedoo_listmail_subject, .sedoo_listmail_expediteur').keyup(function(){
        check_et_activer_bouton();
    });
    jQuery('.ql-editor').mouseover(function(){
        check_et_activer_bouton();
    });

    jQuery('#sedoo_listmail_submit').click(function() {
        var destlist = '';
        var expediteur = jQuery('.sedoo_listmail_expediteur').val();
        var message = jQuery('.ql-editor').html();
        var sujet = jQuery('.sedoo_listmail_subject').val();
        jQuery( "#sedoo_listmail_destlist p" ).each(function( index ) {
            destlist = destlist+','+jQuery(this).attr('mail');
        });

        jQuery.ajax({
            url: ajaxurl,
            type: "POST",
            data: {
              'action': 'sedoo_listmail_sendmailto',
              'destlist' : destlist,
              'message' : message,
              'sujet'  : sujet,
              'expediteur'  : expediteur
            }
        }).done(function(response) {
            if(response == 'success') {
                var text = 'Message envoyé !';   
            } else {
                var text = 'Une erreur est survenue.';
            }
            jQuery('.mailstatus').remove();
            jQuery('.sedoo_listmailform').append('<p class="mailstatus '+response+'">'+text+'</p>');
        });
    });
});