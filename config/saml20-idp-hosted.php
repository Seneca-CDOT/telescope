<?php
/*
  Specify that we want the user's nameID to be persistent, and use the email:
  https://stackoverflow.com/questions/50260272/how-to-replace-a-value-of-nameid-with-attribute-in-simplesamlphp-based-idp
*/

$metadata['__DYNAMIC:1__'] = array(
    /*
     * The hostname of the server (VHOST) that will use this SAML entity.
     *
     * Can be '__DEFAULT__', to use this entry by default.
     */
    'host' => '__DEFAULT__',
    // X.509 key and certificate. Relative to the cert directory.
    'privatekey' => 'server.pem',
    'certificate' => 'server.crt',
    /*
     * Authentication source to use. Must be one that is configured in
     * 'config/authsources.php'.
     */
    'auth' => 'example-userpass',

    'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',

    // refer to https://simplesamlphp.org/docs/stable/saml:nameid
    'authproc' => array(
        3 => array(
            'class' => 'saml:AttributeNameID',
            'attribute' => 'email',
            'Format' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent'
        )
    )

);
