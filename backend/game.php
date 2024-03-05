<?php

class Game implements JsonSerializable
{
    public $uid;
    public $status = 0; # 0 - waiting, 1 - ongoing, 2 - ended
    public $players = array();
    public $pawns = array();
    public $roll = 6;
    public $winner = "";
    public $timestamp = -1;

    function __construct(object $template = null)
    {
        if ($template) {
            $this->uid = $template->uid;
            $this->status = $template->status;
            $this->players = $template->players;
            $this->pawns = $template->pawns;
            $this->roll = $template->roll;
            $this->winner = $template->winner;
            $this->timestamp = $template->timestamp;
        } else {
            $colors = array("red", "blue", "green", "yellow");
            $id_counter = 1;
            for ($i = 0; $i < 4; $i++) {
                for ($j = 0; $j < 4; $j++) {
                    array_push(
                        $this->pawns,
                        array(
                            "color" => $colors[$i],
                            "moved" => -1,
                            "id" => $id_counter
                        )
                    );
                    $id_counter++;
                }
            }
        }
    }

    function addPlayer(string $nick, string $color)
    {
        array_push($this->players, new Player($nick, $color));
    }

    function startGame()
    {
        $this->status = 1;
        for ($i = 0; $i < count($this->players); $i++) {
            $player = $this->players[$i];
            if ($player->color == "red") {
                $player->status = 3;
            } else {
                $player->status = 2;
            }
        }
        $this->timestamp = time();
    }

    function diceThrowMade(string $color)
    {
        for ($i = 0; $i < count($this->players); $i++) {
            $player = $this->players[$i];
            if ($player->color == $color) {
                $player->status = 4;
                break;
            }
        }
    }

    function nextPlayerTurn()
    {
        for ($i = 0; $i < count($this->players); $i++) {
            $player = $this->players[$i];
            if ($player->status == 3 || $player->status == 4) {
                $player->status = 2;
                $index = 0;
                if ($i != count($this->players) - 1) {
                    $index = $i + 1;
                }
                $this->players[$index]->status = 3;
                $this->timestamp = time();
                return;
            }
        }
    }

    function gameWon(string $color)
    {
        $this->winner = $color;
        $this->status = 2;
    }

    function jsonSerialize()
    {
        return array(
            "uid" => $this->uid,
            "status" => $this->status,
            "players" => $this->players,
            "pawns" => $this->pawns,
            "roll" => $this->roll,
            "winner" => $this->winner,
            "timestamp" => $this->timestamp
        );
    }
}