<?php
require "config.php";
require "player.php";
require "game.php";
require "headers.php";

function sendStatus(string $status, string $nick = "", string $color = "", object $game = null)
{
	echo json_encode(
		array(
			"status" => $status,
			"nick" => $nick,
			"color" => $color,
			"game" => $game
		)
	);
	exit;
}

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
	sendStatus("OPTIONS_OK");
}

# data from post body
$rawInput = fopen('php://input', 'r');
$tempStream = fopen('php://temp', 'r+');
stream_copy_to_stream($rawInput, $tempStream);
rewind($tempStream);
$post_data = json_decode(stream_get_contents($tempStream), true);

$colors = array("red", "blue", "green", "yellow"); # all colors

$DB_connection = new Config();
$games = $DB_connection->getGames(); # games from database

if ($post_data['nick'] == "") { # no data from session
	sendStatus("NO_NICK"); # exits
}

if ($post_data['session']) { # request with data from session
	foreach ($games as $row) { # find game with uid from session
		$data = json_decode($row['data']);
		$game = new Game($data);
		if ($game->uid == $post_data['uid']) { ## if game found and ongoing, return it
			if ($game->status != 2) {
				sendStatus("OK1", $post_data['nick'], $post_data['color'], $game); # exits
			} else {
				break;
			}
		}
	}

	# if no game found, or game ended
	sendStatus("NO_NICK"); #exits
}

if (empty($post_data['uid'])) {
	foreach ($games as $row) { # check if a not full game exists
		$data = json_decode($row['data']);
		$game = new Game($data);
		if (count($game->players) < 4 && $game->status == 0) { # game open to joining exists, add player
			$nick = $post_data['nick'];
			$color = $colors[count($game->players)];

			$game->addPlayer($nick, $color);
			if (count($game->players) == 4) {
				$game->startGame();
			}
			$DB_connection->updateGame($game->uid, $game);
			sendStatus("OK2", $nick, $color, $game); # exits
		}
	}

	# no open game available, create a new one
	$game = new Game();
	$game->uid = uniqid();
	$color = $colors[0];
	$nick = $post_data['nick'];
	$game->addPlayer($nick, $color);

	$DB_connection->addNewGame($game);
	sendStatus("OK3", $nick, $color, $game); # exits
}

$game;

foreach ($games as $row) { # find game with uid from request
	$data = json_decode($row['data']);
	$game = new Game($data);
	if ($game->uid == $post_data['uid']) {
		break;
	}
}

if (isset($post_data['type'])) { # ongoing game updated
	$type = $post_data['type'];
	if ($type == "STATUS") { # lobby changed (ready / unready)
		$ready_counter = 0;

		foreach ($game->players as $player) {
			if ($player->color == $post_data['color']) {
				if ($player->status == 0) {
					$player->status = 1;
				} else {
					$player->status = 0;
				}
			}
			if ($player->status == 1) {
				$ready_counter++;
			}
		}

		# if everyone ready, start game
		if ($ready_counter >= 2 || count($game->players) == 4) {
			$game->startGame();
		}
	} else {
		if (isset($post_data['pawns'])) {
			$game->pawns = $post_data['pawns'];
		}
		if (isset($post_data['roll'])) {
			$game->roll = $post_data['roll'];
		}
		switch ($type) {
			case "MOVE":
				$game->nextPlayerTurn();
				break;
			case "ROLL":
				$game->diceThrowMade($post_data['color']);
				break;
			case "WIN":
				$game->gameWon($post_data['color']);
				break;
			default:
				break;
		}
	}

	$DB_connection->updateGame($post_data['uid'], $game);
	sendStatus("OK4"); # exits
} else {
	if (isset($game) && $game->timestamp > 0 && time() - $game->timestamp >= 60 && $game->status != 2) {
		$game->nextPlayerTurn();
		$DB_connection->updateGame($post_data['uid'], $game);
		sendStatus("OK6", $post_data['nick'], $post_data['color'], $game); # exits
	}
	sendStatus("OK7", $post_data['nick'], $post_data['color'], $game); # exits

	sendStatus("NO_NICK"); # error happened
}
