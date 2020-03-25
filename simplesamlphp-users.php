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
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' => 'user1@example.com',
            'http://schemas.microsoft.com/identity/claims/displayname' => 'Johannes Kepler'
        ),
        'user2:user2pass' => array(
            'uid' => array('2'),
            'eduPersonAffiliation' => array('group2'),
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' => 'user2@example.com',
            'http://schemas.microsoft.com/identity/claims/displayname' => 'Galileo Galilei',
        ),
        'LippersheyH:telescope' => array(
          'uid' => array('2'),
          'eduPersonAffiliation' => array('group2'),
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' => 'HansLippershey@example.com',
          'http://schemas.microsoft.com/identity/claims/displayname' => 'Hans Lippershey',
      ),
    ),

);
