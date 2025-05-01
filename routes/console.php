<?php

use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\SendYesterdaySmsUsageToTelegram;

Schedule::command(SendYesterdaySmsUsageToTelegram::class)
    ->everyFifteenMinutes()
    ->timezone(config('app.timezone', 'Asia/Singapore'));