<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Validate and sanitize user inputs
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    // Check for empty fields
    if (empty($name) || empty($email) || empty($message)) {
        die("Error: All fields are required.");
    }

    // Email details
    $to = "shammahkahangi@gmail.com"; // Replace with your email address
    $subject = "Mail From Website";
    $txt = "Name: $name\nEmail: $email\nMessage:\n$message";

    // Email headers
    $headers = "From: noreply@yoursite.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Attempt to send the email
    if (mail($to, $subject, $txt, $headers)) {
        // Redirect to thank you page on success
        header("Location: thankyou.html");
        exit;
    } else {
        // Log or display an error message
        die("Error: Failed to send email. Please try again later.");
    }
} else {
    die("Error: Invalid request.");
}
?>
