<?php
require "game_data.php";
require "headers.php";

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit;
}

$rawInput = fopen('php://input', 'r');
$tempStream = fopen('php://temp', 'r+');
stream_copy_to_stream($rawInput, $tempStream);
rewind($tempStream);
$post_data = json_decode(stream_get_contents($tempStream), true);

$player_color = $post_data['playerColor'];
$pawns = $post_data['pawns']; //?
$pawn_color = $post_data['pawnColor'];
$tile_id = $post_data['tileId'];
$roll_result = $post_data['rollResult'];

$win = false;

function sendResult(string $result, array $pawns)
{
    echo json_encode(
        array(
            "status" => $result,
            "pawns" => $pawns
        )
    );
    exit;
}

if ($pawn_color != $player_color) {
    sendResult("NO", $pawns);
}

# move pawn
if (in_array($tile_id, $game_path)) {
    $moved = array_search($tile_id, $game_path) - $offsets[$pawn_color];
    if ($moved < 0) {
        $moved += count($game_path);
    }

    foreach ($pawns as $index => $pawn) {
        if ($pawn['moved'] == $moved && $pawn['color'] == $pawn_color) {
            if ($moved + $roll_result >= count($game_path) + count($finishes[$pawn_color])) {
                sendResult("NO", $pawns);
            } else {
                $pawns[$index]['moved'] += $roll_result;
            }
            break;
        }
    }
} else {
    $spawn = false;
    foreach ($spawns as $color => $spawn_tiles) {
        if (in_array($tile_id, $spawn_tiles)) {
            $spawn = true;
            break;
        }
    }

    if ($spawn) {
        if ($roll_result != 6 && $roll_result != 1) {
            sendResult("NO", $pawns);
        }

        $spawn_index = array_search($tile_id, $spawns[$pawn_color]);
        foreach ($pawns as $index => $pawn) {
            if ($pawn['moved'] == -1 && $pawn['color'] == $pawn_color && $index % 4 == $spawn_index) {
                $pawns[$index]['moved'] = 0;
                break;
            }
        }
    } else {
        $finish_index = array_search($tile_id, $finishes[$pawn_color]);
        foreach ($pawns as $index => $pawn) {
            if ($pawn['moved'] - count($game_path) == $finish_index && $pawn['color'] == $pawn_color) {
                if ($finish_index + $roll_result >= count($finishes[$pawn_color])) {
                    sendResult("NO", $pawns);
                } else {
                    $pawns[$index]['moved'] += $roll_result;
                }
                break;
            }
        }
    }
}

# check for collision
$tiles = array();
$collision_tile = -1;

foreach ($pawns as $index => $pawn) {
    $temp_tile = 0;
    if ($pawn['moved'] >= count($game_path)) {
        $temp_tile = $finishes[$pawn['color']][$pawn['moved'] - count($game_path)];
    } else if ($pawn['moved'] < 0) {
        $temp_tile = $spawns[$pawn['color']][$index % 4];
    } else {
        $temp_tile = $game_path[($pawn['moved'] + $offsets[$pawn['color']]) % count($game_path)];
    }

    foreach ($tiles as $tile) {
        if ($tile['id'] == $temp_tile && $tile['color'] != $pawn['color']) {
            $collision_tile = $temp_tile;
            break 2;
        }
    }
    array_push(
        $tiles,
        array(
            "id" => $temp_tile,
            "color" => $pawn['color']
        )
    );
}

error_log(json_encode($tiles));

if ($collision_tile != -1) {
    foreach ($finishes as $index => $finish_tiles) {
        if (in_array($collision_tile, $finish_tiles)) {
            sendResult("NO", $pawns);
        }
    }

    foreach ($pawns as $index => $pawn) {
        $temp_tile = 0;
        if ($pawn['moved'] >= count($game_path)) {
            $temp_tile = $finishes[$pawn['color']][$pawn['moved'] - count($game_path)];
        } else if ($pawn['moved'] < 0) {
            $temp_tile = $spawns[$pawn['color']][$index % 4];
        } else {
            $temp_tile = $game_path[($pawn['moved'] + $offsets[$pawn['color']]) % count($game_path)];
        }
        if ($temp_tile == $collision_tile && $pawn['color'] != $pawn_color) {
            $pawns[$index]['moved'] = -1;
        }
    }
}

#check for win
$pawns_finished = [0, 0, 0, 0];
foreach ($pawns as $index => $pawn) {
    if ($pawn['moved'] > count($game_path)) {
        $pawns_finished[floor($index / 4)] += 1;
    }
}

if (in_array(4, $pawns_finished)) {
    $win = true;
}

if ($win) {
    sendResult("WIN", $pawns);
} else {
    sendResult("MOVE", $pawns);
}