<?php

namespace App\Services;

class HealthService
{
    public function check(): array
    {
        return [
            'status' => 'ok',
            'version' => '1.0.0',
        ];
    }
}
