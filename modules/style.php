<?php
	header("Content-Type: text/css");
    session_start();
    $session = array();
    $clientgroup = "";
    if(isset($_SESSION['session']))
    {
            $session = json_decode($_SESSION['session'], true);
            $clientgroup = $session[0]['clientgroup'];
    }
    
    $functions = scandir("{$_GET['module']}/css");
    foreach($functions as $function)
        if(!in_array($function, array('.','..')) )
		{
                include_once("{$_GET['module']}/css/{$function}");
				echo "\n";
		}
			

?>