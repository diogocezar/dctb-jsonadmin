<?php
	/**
	* 	JsonAdmin
	* 	Class to save an JSON from Jquery
	* 	Author: Diogo Cezar Teixeira Batista
	*	Year: 2016
	*/

	class JsonAdmin{

		/**
		* Attribute to store an instance of PageBuilder
		*/
		private static $instance = null;

		/**
		* Method that returns an instance
		*/
		public static function getInstance(){
			if (!isset(self::$instance) && is_null(self::$instance)) {
				$c = __CLASS__;
				self::$instance = new $c;
			}
			return self::$instance;
		}

		/**
		* Private constructor to prevent direct criation
		*/
		private function __construct(){}

		/**
		*	Save JSON
		*/

		public function save(){
			$error = false;
			$file  = "../data/data.json";
			if(!file_exists($file)){
				$error = true;
			}
			if(!empty($_POST['data'])){
				$json = $_POST['data'];
				if(file_put_contents($file, $json)){
					$error = false;
				}
				else{
					$error = true;
				}
			}
			else{
				$error = true;
			}
			if($error)
				echo "{\"success\" : \"false\"}";
			else
				echo "{\"success\" : \"true\"}";
		}
	}//JsonAdmin

	if(isset($_GET['method'])){
		$method = $_GET['method'];
		if(!empty($method)){
			$instance = JsonAdmin::getInstance();
			$instance->{$method}();
		}
	}
?>