<?php
require "game_data.php";

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
}

$rawInput = fopen('php://input', 'r');
$tempStream = fopen('php://temp', 'r+');
stream_copy_to_stream($rawInput, $tempStream);
rewind($tempStream);
$post_data = json_decode(stream_get_contents($tempStream), true);

$player_color = $post_data['playerColor'];
$pawns = json_decode($post_data['pawns']);
$pawn_color = $post_data['pawnColor'];
$tile_id = $post_data['tileId'];
$roll_result = $post_data['rollResult'];

$win = false;

if ($pawn_color != $player_color) {
    exit;
}

# move pawn
if (in_array($tile_id, $game_path)) {
    $moved = array_search($tile_id, $game_path) - $offsets[$pawn_color];
    if ($moved < 0) {
        $moved += count($game_path);
    }

    foreach ($pawns as $pawn) {
        if ($pawn->moved == $moved && $pawn->color = $pawn_color) {
            if ($moved + $roll_result >= count($game_path) + count($finishes[$pawn_color])) {
                $pawn->moved = count($game_path) + $finishes[$pawn_color] - 1;
            } else {
                $pawn->moved += $roll_result;
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
            exit;
        }

        $spawn_index = array_search($tile_id, $spawns[$pawn_color]);
        foreach ($pawns as $index => $pawn) {
            if ($pawn->moved == -1 && $pawn->color == $pawn_color && $index % 4 == $spawn_index) {
                $pawn->moved = 0;
                break;
            }
        }
    } else {
        $finish_index = array_search($tile_id, $finishes[$pawn_color]);
        foreach ($pawns as $pawn) {
            if ($pawn->moved - count($game_path) == $finish_index && $pawn->color == $pawn_color) {
                if ($finish_index + $roll_result >= count($finishes[$pawn_color])) {
                    $pawn->moved = count($game_path) + count($finishes[$pawn_color]) - 1;
                } else {
                    $pawn->moved += $roll_result;
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
    if ($pawn->moved >= count($game_path)) {
        $temp_tile = $finishes[$pawn->color][$pawn->moved - count($game_path)];
    } else if ($pawn->moved < 0) {
        $temp_tile = $spawns[$pawn->color][$index % 4];
    } else {
        $temp_tile = $game_path[($pawn->moved + $offsets[$pawn->color]) % count($game_path)];
    }

    foreach ($tiles as $tile) {
        if ($tile['id'] == $tile_id && $tile['color'] != $pawn->color) {
            $collision_tile = $tile_id;
            break 2;
        } else {
            array_push(
                $tiles,
                array(
                    "id" => $temp_tile,
                    "color" => $pawn->color
                )
            );
        }
    }
}

if ($collision_tile != -1) {
    foreach ($finishes as $index => $finish_tiles) {
        if (in_array($collision_tile, $finish_tiles)) {
            exit;
        }
    }

    foreach ($pawns as $index => $pawn) {
        $temp_tile = 0;
        if ($pawn->moved >= count($game_path)) {
            $temp_tile = $finishes[$pawn->color][$pawn->moved - count($game_path)];
        } else if ($pawn->moved < 0) {
            $temp_tile = $spawns[$pawn->color][$index % 4];
        } else {
            $temp_tile = $game_path[($pawn->moved + $offsets[$pawn->color]) % count($game_path)];
        }
        if ($temp_tile == $collision_tile && $pawn->color != $pawn_color) {
            $pawn->moved = -1;
        }
    }
}

#check for win
$pawns_finished = [0, 0, 0, 0];
foreach ($pawns as $index => $pawn) {
    if ($pawn->moved > count($game_path)) {
        $pawns_finished[floor($index / 4)] += 1;
    }
}

if (in_array(4, $pawns_finished)) {
    $win = true;
}

if ($win) {
    echo json_encode(
        array(
            "status" => "WIN",
            "pawns" => $pawns
        )
    );
}