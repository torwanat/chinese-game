<?php
// session_start();

require "config.php";
require "player.php";
require "game.php";

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");


function sendStatus(string $status, string $nick = "", string $color = "", object $game = null) # maybe send whole game?
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

$games = getGames(); # games from database

if ($post_data['nick'] == "") { # first request
    if (!isset($_SESSION['uid'])) { # no previous game, request new nick
        sendStatus("NO_NICK"); # exits
    }
    # session found, check if previous game is active
    $uid = $_SESSION['uid'];
    $color = $_SESSION['color'];
    $nick = $_SESSION['nick'];

    foreach ($games as $row) {
        if ($row['game_id'] == $uid) { # found previous game
            $data = json_decode($row['data']);
            $game = new Game($data);
            if ($game->status == 2) { # previous game ended, stop searching
                // session_unset();
                break;
            }

            # previous game active, use previous nick
            sendStatus("OK1", $nick, $color, $game); # exits
        }
    }

    # previous game not active, request new nick
    // session_unset();
    sendStatus("NO_NICK"); # exits
}

if ($post_data['uid'] == "") { # second request, nick but no game
    foreach ($games as $row) { # check if a not full game exists
        $data = json_decode($row['data']);
        $game = new Game($data);
        if (count($game->players) < 4 && $game->status == 0) { # game open to joining exists, add player
            $nick = $post_data['nick'];
            $color = $colors[count($game->players)];

            $_SESSION['nick'] = $nick;
            $_SESSION['color'] = $color;
            $_SESSION['uid'] = $game->uid;

            $game->addPlayer($nick, $color);
            if (count($game->players) == 4) {
                $game->startGame();
            }
            updateGame($game->uid, $game);
            sendStatus("OK2", $nick, $color, $game); # exits
        }
    }

    # no open game available, create a new one
    $game = new Game();
    $game->uid = uniqid();
    $color = $colors[0];
    $nick = $post_data['nick'];
    $game->addPlayer($nick, $color);

    $_SESSION['nick'] = $nick;
    $_SESSION['color'] = $color;
    $_SESSION['uid'] = $game->uid;

    addNewGame($game);
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
    } else if ($type == "MOVE") { # player moved
        $game->pawns = $post_data['pawns'];
    } else if ($type == "ROLL") { # new dice roll
        $game->roll = $post_data['roll'];
    }

    updateGame($post_data['uid'], $game);
    sendStatus("OK4"); # exits
} else {
    sendStatus("OK5", $post_data['nick'], $post_data['color'], $game); # exits

    sendStatus("NO_NICK"); # error happened
}