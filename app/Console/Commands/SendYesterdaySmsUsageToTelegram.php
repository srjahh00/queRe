<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class SendYesterdaySmsUsageToTelegram extends Command
{
    protected $signature = 'sms:send-yesterday-usage';
    protected $description = 'Send yesterday\'s SMS usage statistics to Telegram';

    public function handle()
    {
        $now = Carbon::now();

        // Calculate yesterday's range (5 AM to 5 AM)
        $end = $now->copy()->startOfDay()->addHours(5);
        if ($now->lt($end)) {
        $end->subDay();
        }
        $start = $end->copy()->subDay();

        // Get all users with their SMS counts and environments
        $users = User::with(['environments.environment'])
            ->withCount([
                'yesterday_sms' => function ($query) use ($start, $end) {
                    $query->whereBetween('created_at', [$start, $end])
                        ->whereNotNull('code')
                        ->where('code', '!=', '');
                }
            ])
            ->orderBy('name')
            ->get();

        // Group users by environment
        $usersByEnvironment = $users->groupBy(function ($user) {
            return $user->environments->environment->name ?? 'unknown';
        });

        // Telegram configuration for different environments
        $telegramConfig = [
            'bella' => [
                'chat_id' => env('TELEGRAM_BELLA_CHAT_ID', '-1002425542459'),
                'thread_id' => env('TELEGRAM_BELLA_THREAD_ID', '2763'),
            ],
            'brooklyn' => [
                'chat_id' => env('TELEGRAM_BROOKLYN_CHAT_ID', '-1002174516181'),
                'thread_id' => env('TELEGRAM_BROOKLYN_THREAD_ID', '3'),
            ],
          
        ];

        // Send report for each environment
        foreach ($usersByEnvironment as $envName => $envUsers) {
            $message = "📊 Yesterday's SMS Usage Report for {$envName}\n";
            $message .= "⏰ Time Period: " . $start->format('Y-m-d H:i') . " to " . $end->format('Y-m-d H:i') . "\n\n";

            $totalSms = $envUsers->sum('yesterday_sms_count');
            $activeUsers = $envUsers->where('yesterday_sms_count', '>', 0)->count();

            $message .= "👥 Total Users: " . $envUsers->count() . "\n";
            $message .= "👤 Active Users: " . $activeUsers . "\n";
            $message .= "📨 Total SMS Sent: " . $totalSms . "\n\n";

            // All users section
            $message .= "All Users:\n";
            $envUsers->each(function ($user) use (&$message) {
                $status = $user->yesterday_sms_count > 0 ? '✅' : '❌';
                $message .= "{$status} " . $user->name . ": " . $user->yesterday_sms_count . " SMS\n";
            });

            // Top users section
            $message .= "\n🏆 Top Users:\n";
            $envUsers->where('yesterday_sms_count', '>', 0)
                ->sortByDesc('yesterday_sms_count')
                ->take(10)
                ->each(function ($user) use (&$message) {
                    $message .= "👤 " . $user->name . ": " . $user->yesterday_sms_count . " SMS\n";
                });

            // Send to appropriate Telegram thread
            $config = $telegramConfig[strtolower($envName)] ;
            $this->sendToTelegram($message, $config['chat_id'], $config['thread_id']);
        }

        $this->info('Yesterday\'s SMS usage reports sent to Telegram!');
    }

    public function sendToTelegram($message, $chatId, $threadId)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN', '7878382027:AAH2nE6Y__LjgGyt96XWEQCnl78C4RN8rtY');

        $url = "https://api.telegram.org/bot{$botToken}/sendMessage";

        try {
            $response = Http::post($url, [
                'chat_id' => $chatId,
                'message_thread_id' => (int) $threadId,
                'text' => $message,
                'parse_mode' => 'HTML',
            ]);

            if ($response->failed()) {
                \Log::error('Telegram API Error:', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new \Exception("Telegram API Error: " . $response->body());
            }

            return $response->json();

        } catch (\Exception $e) {
            \Log::error("Telegram Send Error: " . $e->getMessage());
            throw new \Exception("Failed to send Telegram message: " . $e->getMessage());
        }
    }
}
