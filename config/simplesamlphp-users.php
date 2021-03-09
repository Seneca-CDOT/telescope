<?php
/*
  Specify user info for https://hub.docker.com/r/kristophjunge/test-saml-idp/ in the same format
  as our Seneca IdP will give it.  This is modeled on the original config here:
  https://github.com/kristophjunge/docker-test-saml-idp/blob/master/config/simplesamlphp/authsources.php
*/
$config = array(

    'admin' => array(
        'core:AdminPassword',
    ),

    'example-userpass' => array(
        'exampleauth:UserPass',
        'user1:user1pass' => array(
            'uid' => array('1'),
            'eduPersonAffiliation' => array('group1'),
            /*
              NOTE: we need both `email` and `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
              for each user.  The `email` will be used for nameID, the `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
              will be added to the profile to match what we get back from Seneca's IdP.  Make sure these
              match for both fields on every user.
            */
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' => 'user1@example.com',
            'email' => 'user1@example.com',
            'http://schemas.microsoft.com/identity/claims/displayname' => 'Johannes Kepler'
        ),
        'user2:user2pass' => array(
            'uid' => array('2'),
            'eduPersonAffiliation' => array('group2'),
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' => 'user2@example.com',
            'email' => 'user2@example.com',
            'http://schemas.microsoft.com/identity/claims/displayname' => 'Galileo Galilei',
        ),
        'lippersheyh:telescope' => array(
          'uid' => array('2'),
          'eduPersonAffiliation' => array('group2'),
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' => 'hans-lippershey@example.com',
          'email' => 'hans-lippershey@example.com',
          'http://schemas.microsoft.com/identity/claims/displayname' => 'Hans Lippershey',
      ),
    ),

);
