<?php


include_once('db.conf.php');

define ('ROOT', __DIR__."/../");
define ('DEBUG_MODE', true);
define ('LOG_MODE', 5);


session_start();

$metadata = array();

class dbAdapter {
	public $dbConnection; 
	private $result;
	private $errNumber;
	private $debug;
	public  $queryes;
	
	
	private $error = array (
		'NUMBER' => 0,
		'DESCR' => NULL
	);

	public function __construct($connection_string) {
		$this->debug = TRUE;
		$this->dbConnection = pg_connect($connection_string);
		if (pg_connection_status($this->dbConnection) !== PGSQL_CONNECTION_OK)
		{
			$this->info(1, 'Connection check error', array());die();
		}
		
		$this->queryes = array(
			//'lst_proc' => array( "query" => "SELECT * FROM pg_proc where proowner in (".OWNER.");", "args" => array()),
			'lst_proc' => array( "query" => "SELECT * FROM S99_STATISTIC.vw_ProcList;", "args" => array()),                    
			'lst_type' => array( "query" => "SELECT pg_catalog.format_type(t.oid, NULL) AS Name, t.oid, pg_catalog.obj_description(t.oid, 'pg_type') as Description FROM pg_catalog.pg_type t", "args" => array()),
		);

		// запрос всех типов 		

		
		// запрос всех процедур
	
		$queryes = $this->cached_object("queryes", NULL);
		
		if($queryes)
			$this->queryes = $queryes;
		else
		{
			$res = $this->call("lst_proc", array());
			if (!$res->error)
			{
				if(count($res->data)>0)
				{
					foreach($res->data as $record)
					{
						$query = "SELECT * FROM {$record['proname']} (";
						$pattern = $query;
						
						$args = explode ( "," , str_replace(array("{","}"),null,$record['proargnames']) );
						$out  = $args;

						foreach($args as $id => $arg)
							if($arg=="" || strrpos($arg,"i_")!==0)
								unset($args[$id]);
						foreach($out as $id => $arg)
							if($arg=="" || strrpos($arg,"i_")===0)
								unset($out[$id]);
						foreach($args as $id => $arg)
							if(strrpos($arg,"i_")===0)
								$args[$id] = substr($args[$id], 2);

						for($arg=1;$arg<=count($args);$arg++)
						{
							$query.='$'.$arg;
							$pattern.="%s";
							if($arg!=count($args)){$query.=',';$pattern.=',';}
						}
						$query.=")";$pattern.=")";
						if(strrpos($record['proname'], "iud_")===0){$query.=" AS result";$pattern.=" AS result";}
						$query.=";";$pattern.=";";

						$this->queryes[$record['proname']]["proargtypes"] = explode ( " " , $record['proargtypes'] );
						$this->queryes[$record['proname']]["args"] =$args;
						$this->queryes[$record['proname']]["out"] =$out;
						$this->queryes[$record['proname']]["query"] =$query;
						$this->queryes[$record['proname']]["pattern"] =$pattern;
						$this->queryes = $this->cached_object("queryes", $this->queryes, DEBUG_MODE);
					}
				}
			}else
			{
				$this->info(1, 'Bad proc list', array());die();
			}
		}
	}
	
	public function __destruct() {
		if ($this->dbConnection) {
			pg_close ($this->dbConnection);
		}
	}

	private function getNoticeMessage($message) {
		$pos_1 = strpos($message,':');
		if ($pos_1 === false) $pos_1 = 0;
		$pos_2 = strrpos($message,'P0001');
		if ($pos_2 === false) $pos_2 = strlen($message);
		$len = strlen($message);
		return substr($message,$pos_1+3,$pos_2-$pos_1-4);
	}
	
	private function prepare($name)
	{
		//var_dump($this->queryes);
		if(!isset($this->queryes[$name]['query']))return FALSE;
		$resource = pg_query_params($this->dbConnection, 'SELECT name FROM pg_prepared_statements WHERE name = $1', array($name));
		if (pg_num_rows($resource) == 0)
		{
			$resource = @pg_prepare($this->dbConnection, $name, $this->queryes[$name]["query"]);
			if($resource === FALSE)
				return FALSE;
			//elseif($_GET['action']) var_dump($resource);
			unset($resource);
		}
		else
			unset($resource);
		return TRUE;
	}
	
	public function info($lvl, $pattern, $args)
	{
		syslog(LOG_NOTICE,call_user_func_array('sprintf', array_merge((array)$pattern, $args)));
		//if(LOG_MODE > $lvl)
			//file_put_contents(ROOT."/php/adapter.log", "{$lvl}\t".call_user_func_array('sprintf', array_merge((array)$pattern, $args))."\n", FILE_APPEND | LOCK_EX);			
	}
	
	public function cached_object($name, $object, $rewrite = false)
	{
		if(!file_exists(ROOT."/php/$name.json") || $rewrite)
		{
			if($object)
			{
				$fp = fopen(ROOT."/php/$name.json", 'w');
				if($fp)
				{
					fwrite($fp, json_encode($object));
					fclose($fp);
				}
			}
		}		
		return  json_decode( file_get_contents(ROOT."/php/$name.json") , true);
	}
	
	public function notice()
	{
		return pg_last_notice($this->dbConnection);
	}
	
	public function call($name, $args)
	{
		$ret = new stdClass();
		$ret->error = false;		
		//$this->info(1, 'error 1!', $args);
		$code = $this->prepare($name);	
		
		//var_dump($code, pg_last_error(), $args);
		if($code===FALSE)
		{
			$ret->error   = pg_last_error();return $ret;
		}
		
		$resource = @pg_execute($this->dbConnection, $name , $args );
		
		if ($resource === FALSE)
		{
			$ret->error   = pg_last_error()." ".implode ( "," , $args );return $ret;
		}
		
		if(isset($this->queryes[$name]["pattern"]))
			$this->info(2, $this->queryes[$name]["pattern"], $args);
		elseif(isset($this->queryes[$name]["query"]))
			$this->info(2, $this->queryes[$name]["query"], $args);

		$ret->data = pg_fetch_all($resource);
		return $ret;
	}
	
}

$db = new dbAdapter(CONN);


$args = $arguments;

if(isset($_SESSION['session']))
{
	$sess = json_decode($_SESSION['session'], true);
	$args['session_name'] = $sess[0]['session'];
}


$call_arguments = array();

if($args['action'])
{
	
	$params = array();
	if(isset($db->queryes[$args['action']]))
	{
		$cc = 0;
		foreach($db->queryes[$args['action']]['args'] as $arg)
		{
			
			$params[$cc] = null;
			
			
			if(isset($args[$arg]))
			{
				
				if(is_array($args[$arg]))
					$params[$cc]  = "{".implode ( ',' , $args[$arg] )."}";
				else
					$params[$cc]  = "{$args[$arg]}";
			}
			$cc++;
		}
	}
	
	$call_arguments = $params;

}




?>

