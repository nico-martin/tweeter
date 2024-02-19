<?php
include_once './env.php';

if (in_array($_SERVER['HTTP_ORIGIN'], $env_allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$allowedFields = [
    'os',
    'browser',
    'browserVersion',
    'webGpuAdapter',
    'inputTps',
    'outputTps',
    'deviceBrand',
    'deviceType',
    'cpu',
    'gpu',
    'ram',
    'modelName'
];

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
$dataFiltered = array_intersect_key($data, array_flip($allowedFields));
$maxStringLength = 200;

$subject = "Tweeter Benchmark Email";
$message = "";
foreach ($dataFiltered as $key => $value) {
    if (!is_string($value)) {
        $value = '';
    }
    $value = htmlspecialchars($value);
    if (is_string($value) && mb_strlen($value) > $maxStringLength) {
        $value = mb_substr($value, 0, $maxStringLength);
    }

    $message .= "$key: $value\n";
}
$mailSent = mail($env_to, $subject, $message);

$response = [
    'success' => $mailSent,
    'message' => $mailSent ? 'Email sent successfully.' : 'Failed to send email.'
];

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

echo json_encode($response);