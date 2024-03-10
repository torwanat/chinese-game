<?php
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

$language = $post_data['language'];

putenv("LANG=" . $language);
setlocale(LC_ALL, $language);

$domain = "messages";
bindtextdomain($domain, "Locale/nocache");
bindtextdomain($domain, "Locale");
bind_textdomain_codeset($domain, "UTF-8");

textdomain($domain);

echo json_encode(_($post_data['message']));