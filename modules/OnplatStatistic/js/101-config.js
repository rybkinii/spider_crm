SiteApp.constant(
    'SiteConfiguration', {
        debug:false,
        transform:true,
        method:'POST',
        //protocol:'http',
        //server: '78.107.58.38',
		server: '<?php echo $_SERVER["HTTP_HOST"];?>',
        //local:'192.168.1.66:80',
        entry:'/php/entry.php',
        //files:'/php/file.php',
		//info:'/php/info.php',
        //test:'/php/test.php'
    }
);
