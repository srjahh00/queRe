<?php

use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\SendYesterdaySmsUsageToTelegram;

// For COMMANDS (your SMS usage reporter)
Schedule::command(SendYesterdaySmsUsageToTelegram::class)
    ->everyMinute()
    ->timezone(config('app.timezone', 'Asia/Singapore'));