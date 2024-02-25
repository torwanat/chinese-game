<?php

class Player implements JsonSerializable
{
    public $nick;
    public $status = 0; # 0 - joined, 1 - ready, 2 - waiting for turn, 3 - playing turn
    public $color;

    function __construct(string $nick, string $color)
    {
        $this->nick = $nick;
        $this->color = $color;
    }

    function jsonSerialize()
    {
        return array(
            "nick" => $this->nick,
            "status" => $this->status,
            "color" => $this->color
        );
    }
}