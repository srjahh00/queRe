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

        // Get yesterday's usage for all users
        $users = User::withCount([
            'yesterday_sms' => function ($query) use ($start, $end) {
                $query->whereBetween('created_at', [$start, $end])
                    ->whereNotNull('code')
                    ->where('code', '!=', '');
            }
        ])->get();

        // Format the message
        $message = "📊 Yesterday's SMS Usage Report\n";
        $message .= "⏰ Time Period: " . $start->format('Y-m-d H:i') . " to " . $end->format('Y-m-d H:i') . "\n\n";

        $message .= "👥 Total Users: " . $users->count() . "\n";
        $message .= "📨 Total SMS Sent: " . $users->sum('yesterday_sms_count') . "\n\n";

        $message .= "Top Users:\n";
        $users->filter(fn($user) => $user->yesterday_sms_count > 0)
            ->sortByDesc('yesterday_sms_count')
            ->take(10)
            ->each(function ($user) use (&$message) {
                $message .= "👤 " . $user->name . ": " . $user->yesterday_sms_count . " SMS\n";
            });

        // Send to Telegram
        $this->sendToTelegram($message);

        $this->info('Yesterday\'s SMS usage report sent to Telegram!');
    }

    public function sendToTelegram($message)
    {
        $token = 'bot7750244451:AAGvd1zhTkC3KwWoxuEg6w9LdzlA8AbPTKk';
        $url = "https://api.telegram.org/{$token}/sendMessage";

        try {
            $response = Http::get($url, [
                'chat_id' => '-4718270540',
                'text' => $message
            ]);

        } catch (\Exception $e) {
            throw new \Exception("Error while sending message: " . $e->getMessage());
        }
    }
}
