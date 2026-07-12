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

$locale = $post_data['language'] . ".UTF-8";
$language = $post_data['language'] == "pl_PL" ? "pl_PL:pl" : "en_US:en";

putenv("LANG=$locale");
putenv("LC_ALL=$locale");
putenv("LANGUAGE=$language");
setlocale(LC_ALL, $locale);

bindtextdomain('messages', '/var/www/html/Locale');
bind_textdomain_codeset('messages', 'UTF-8');
textdomain('messages');

echo json_encode(_($post_data['message']));
