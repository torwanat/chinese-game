<?php

class Config
{
	private $databaseHost;
	private $databaseUsername;
	private $databasePassword;
	private $databaseName;
	private $connection;

	function __construct()
	{
		$this->databaseHost = getenv('DB_HOST') ?: 'db';
		$this->databaseUsername = getenv('DB_USER') ?: 'chinese_user';
		$this->databasePassword = getenv('DB_PASSWORD') ?: 'chinczyk';
		$this->databaseName = getenv('DB_DATABASE') ?: 'chinese';
		$this->connection = mysqli_connect($this->databaseHost, $this->databaseUsername, $this->databasePassword, $this->databaseName);
	}

	function getGames()
	{
		$response = $this->connection->query("SELECT * FROM games;");
		$result = array();

		if ($response->num_rows > 0) {
			while ($row = $response->fetch_assoc()) {
				array_push($result, $row);
			}
		}

		return $result;
	}

	function updateGame(string $uid, Game $game)
	{
		$data = json_encode($game);
		$query = $this->connection->prepare("UPDATE games SET data=? WHERE game_id=?;");
		$query->bind_param("ss", $data, $uid);
		$query->execute();
	}

	function addNewGame(Game $game)
	{
		$data = json_encode($game);
		$query = $this->connection->prepare("INSERT INTO games (game_id, data) VALUES (?,?);");
		$query->bind_param("ss", $game->uid, $data);
		$query->execute();
	}
}
