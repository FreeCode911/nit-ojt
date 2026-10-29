<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the landing page loads for guests', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertSee('OJT Logbook');
});

test('the login page loads', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});
