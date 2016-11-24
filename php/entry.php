<?php
	$arguments = $_POST;
	///http_response_code(404);
	//var_dump($arguments);die();
	
	
	include_once('adapter.php');
	header("Content-Type: application/json; charset=UTF-8");
	
	$metadata = json_encode($metadata, JSON_UNESCAPED_UNICODE);
	
	if($arguments['action']=="get_f_client_login")
	{
		if(isset($_SESSION))
			if(isset($_SESSION['session'])){echo "{\"data\":".$_SESSION['session'].",\"meta\":$metadata,\"notice\":[]}";die();}
	}
	if($arguments['action']=="get_f_client_logout")
	{
		unset($_SESSION['session']);
	}
	
	
	$res = new stdClass();
	$analiz = array('2'=>time());
	$res->error = false;
	$res->data = array();
	

	//$db->call('set_config', array(0=>'application_name', 1=>'Onplat statistic v1.0b', 2=>false));
	
	pg_query($db->dbConnection, "SELECT set_config('application_name', 'Onplat statistic v1.0b', false);");
	
	if(!in_array($arguments['action'], array('ask_f_dictionaryes','ask_f_terminal','ask_f_client','iud_f_terminal','iud_f_terminalservice', 'iud_f_access','iud_f_client')))
	{
		$res = $db->call($arguments['action'], $call_arguments);
	}
	elseif($arguments['action']=='iud_f_terminalservice')
	{
		//'iud_l_terminalserviceblock';; query.iud; query.l_terminalserviceblock; query.f_terminal; query.f_service;
		//'iud_l_terminaltemplate';; query.iud; query.l_terminaltemplate; query.f_terminal; query.f_template; query.f_service;

		if(($_POST['block']=='0' || $_POST['block']==null)&&($_POST['l_terminalserviceblock']!=null && $_POST['l_terminalserviceblock']!='0'))
			$res1 = $db->call('iud_l_terminalserviceblock', array(0=>$sess[0]['session'],1=>'3',2=>$_POST['l_terminalserviceblock'],3=>$_POST['f_terminal'],4=>$_POST['f_service']));
		
		if(($_POST['block']!='0' && $_POST['block']!=null)&&($_POST['l_terminalserviceblock']==null || $_POST['l_terminalserviceblock']=='0'))
			$res2 = $db->call('iud_l_terminalserviceblock', array(0=>$sess[0]['session'],1=>'1',2=>null,3=>$_POST['f_terminal'],4=>$_POST['f_service']));
		
		if($_POST['l_terminaltemplate']!=null && $_POST['l_terminaltemplate']!='0')
			$res3 = $db->call('iud_l_terminaltemplate', array(0=>$sess[0]['session'],1=>'3',2=>$_POST['l_terminaltemplate'],3=>$_POST['f_terminal'],4=>$_POST['f_template_old'],5=>$_POST['f_service']));
		
		if($_POST['f_template']!=null && $_POST['f_template']!='0')
			$res4 = $db->call('iud_l_terminaltemplate', array(0=>$sess[0]['session'],1=>'1',2=>null,3=>$_POST['f_terminal'],4=>$_POST['f_template'],5=>$_POST['f_service']));

		
		$res->iud = array($res1,$res2,$res3,$res4);
		//var_dump($res->iud);die();
	}
	elseif($arguments['action']=='iud_f_access')
	{
		$res = $db->call($arguments['action'], $call_arguments);
		//var_dump($res);die();
	}
	elseif($arguments['action']=='ask_f_client')
	{
		$res = $db->call($arguments['action'], $call_arguments);
		foreach($res->data as $terminal => $data)
		{
			$res->data[$terminal]['ask_f_access'] =  $db->call('ask_f_access', array(0=>$sess[0]['session'],1=>$data['f_client']));
                        $res->data[$terminal]['ask_f_clientextra'] =  $db->call('ask_system_f_clientextra', array(0=>$sess[0]['session'],1=>$data['f_client']));
                        /*if(!$res->data[$terminal]['ask_f_access']['data'])
                            $res->data[$terminal]['ask_f_access']['data'] = array();*/ 
                        if(!$res->data[$terminal]['ask_f_clientextra']->data)
                            $res->data[$terminal]['ask_f_clientextra']->data = array();
		}		
	}
        elseif($arguments['action']=='iud_f_client'){
            
            $res = $db->call($arguments['action'], $call_arguments);
                if(!isset($_POST['ask_f_clientextra']))
				$_POST['ask_f_clientextra'] = array();
            if(!$res->error)
            {
                $querys = array();
                foreach($_POST['ask_f_clientextra']["data"] as $data)
                {
                    $arr = array();
                    $quargs = array($sess[0]['session'], $data["iud"], $data["f_clientextra"], $data["f_client"], $data["c_extratype"], $data["value_dec"], $data["value_char"], $data["value_time"]);
                    $querys[] = $db->call('iud_system_f_clientextra', $quargs );
                }
                //$res->meta = $querys;
                //var_dump($querys);die();
            }
            
        }
        elseif($arguments['action']=='iud_f_terminal')
        {
            $res = $db->call($arguments['action'], $call_arguments);
			if(!isset($_POST['get_f_address']))
				$_POST['get_f_address'] = array();
            if(!$res->error)
            {
				$addr_query1 = null;
                $quargs = array($sess[0]['session'],'3',$_POST['f_address'],$_POST['f_terminal'],$_POST['postindex'],$_POST['region'],$_POST['district'],$_POST['town'],$_POST['place'],$_POST['street'],$_POST['home'],$_POST['corpus'],$_POST['building'],$_POST['flat'],$_POST['descr'],$_POST['latitude'],$_POST['longitude']);
				if($_POST['get_f_address']['f_address'] != null)
				{
					$quargs[2] = $_POST['get_f_address']['f_address'];
					$addr_query1 = $db->call('iud_f_address', $quargs );
				}
				$quargs[1] = '1';$quargs[2] = null;
				$addr_query2 = $db->call('iud_f_address', $quargs );
				
                $res->iud_f_address3 = array(0=>$quargs,1=>$addr_query1);
				$res->iud_f_address1 = array(0=>$quargs,1=>$addr_query2);
            }
			$res->post = $_POST;

        }
	elseif($arguments['action']=='ask_f_terminal')
	{
		$res = $db->call($arguments['action'], $call_arguments);
		foreach($res->data as $terminal => $data)
		{
                        $res->data[$terminal]['get_f_address'] = array();
						$address =  $db->call('get_f_address', array(0=>$sess[0]['session'],1=>$data['f_address']));
                        if($address)
                        if($address->data)
                            if($address->data[0])
							{
                                $res->data[$terminal]['get_f_address'] = $address->data[0];
								$res->data[$terminal]['get_f_address']['f_address'] = $data['f_address'];
								//if($data['f_terminal']=='5')
                                                                //{$quargs = array($sess[0]['session'],'3',$data['f_address'],$data['f_terminal'],$_POST['postindex'],$_POST['region'],$_POST['district'],$_POST['town'],$_POST['place'],$_POST['street'],$_POST['home'],$_POST['corpus'],$_POST['building'],$_POST['flat'],$_POST['descr'],$_POST['latitude'],$_POST['longitude']);$addr_query = $db->call('iud_f_address', $quargs );}
							}
		}
	}
	elseif($arguments['action']=='ask_f_dictionaryes')
	{
		if(isset($_SESSION['session']))
		{
			$sess = json_decode($_SESSION['session'], true);
			foreach(array(
			''
			, 'lst_system_c_clientgroup'
			, 'lst_system_c_clientjur'
			, 'lst_system_c_acctype'
			, 'lst_system_c_currency'
			, 'lst_system_c_paydir'
			, 'lst_system_c_paytype'
			, 'lst_terminals_c_filetype'
			, 'lst_terminals_c_module'
			, 'lst_terminals_c_taxtype'
			, 'lst_gate_c_provider'
                        , 'lst_gate_c_taxtype'
                        , 'lst_system_c_datatype' 
                        , 'lst_system_c_extratype'			
                        , 'lst_system_c_contacttype'			
                        , 'lst_system_c_addresstype'                            
                            ) as $dictionary )
			{
				if($dictionary=='')continue;
				$ret = $db->call($dictionary, array(0=>$sess[0]['session']));
				if($ret->error)
				{
					$res->error = $ret->error;break;
				}
				foreach($ret->data as $record)
				{
						$newrec = $record;
						$newrec['dictionary'] = $dictionary;
						$res->data[] = $newrec;
				}

			}
			//var_dump($res);die();
			//var_dump($sess[0]['session']);
		}
		
		
	}
	
	$analiz['3'] = time();
	$res->analiz = $analiz;
	
	if($res->error)
	{
		$db->info(1, $res->error, array());
		echo '{"error":"'.str_replace("\n"," ",str_replace("\"","'",$res->error)).'","data":[{}],"meta":'.$metadata.',"notice":[]}';
	}
	elseif(!$res->data)
	{
		echo '{"data":[{}],"meta":'.$metadata.',"notice":[]}';
		
	}
	else
	{
		if(isset($res->data[0]['error']))
		if($res->data[0]['error'])
		{
			$db->info(4, $db->notice(), array());
			echo '{"error":"'.str_replace("\n"," ",str_replace("\"","'",$db->notice())).'","data":[{}],"meta":'.$metadata.',"notice":[]}'; 
			die();
		}
		
		unset($res->error);
		if($arguments['action']=="get_f_client_login")
		{
			$_SESSION['session'] = json_encode($res->data, JSON_UNESCAPED_UNICODE);
		}
		echo json_encode($res, JSON_UNESCAPED_UNICODE);

	}

?>