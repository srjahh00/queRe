<?php

use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\SendYesterdaySmsUsageToTelegram;

Schedule::command(SendYesterdaySmsUsageToTelegram::class)
    ->dailyAt('5:05')
    ->timezone(config('app.timezone', 'Asia/Singapore'));