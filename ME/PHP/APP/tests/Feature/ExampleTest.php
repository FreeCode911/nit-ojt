<?php

test('the application redirects guests to login', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});

test('the login page loads', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});
