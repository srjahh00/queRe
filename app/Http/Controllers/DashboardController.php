<?php

namespace App\Http\Controllers;

use App\Models\Environment;
use App\Models\Sms;
use App\Models\User;
use Carbon\Carbon;
use Http;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function __construct(){

    }

    public function index()
    {
        $sms = Sms::whereNotNull('code')
        ->where('code', '!=', '')
        ->with('environment')
        ->get()
        ->map(function ($sms) {
            $adjusted = Carbon::parse($sms->created_at)->subHours(5);
            return [
                'day' => $adjusted->format('Y-m-d'),
                'environment_id' => $sms->environment_id,
                'environment_name' => $sms->environment->name ?? 'Unknown',
            ];
        })
        ->groupBy(function ($item) {
            return $item['day'];
        })
        ->map(function ($groupedByDay) {
            return [
                'date' => $groupedByDay->first()['day'],
                'environments' => $groupedByDay
                    ->groupBy('environment_id')
                    ->map(function ($items) {
                        return [
                            'environment' => $items->first()['environment_name'],
                            'total' => $items->count(),
                        ];
                    })
                    ->values(),
            ];
        })
        ->sortByDesc('date')
        ->values();
    
    
        return Inertia::render('Dashboard/Dashboard', [
            'balance' => $this->getBalances(),
            'users_count' => User::count(),
            'sms' => Sms::whereNotNull('code')->count(),
            'sms_per_day_environment' => $sms,
            'users' => User::with(['roles', 'environments.environment'])->get(),
            'roles' => Role::where('name', '!=', 'super admin')->get(),
            'environments' => self::getEnvironments(),
        ]);
    }

    private function getEnvironments()
    {
        return Environment::select('id', 'name')->get();
    }
    
    public function getBalances()
    {
        return Environment::select('name', 'key')
            ->get()
            ->map(function ($env) {
                return [
                    'name' => $env->name,
                    'balance' => $this->getBalance($env->key),
                ];
            });
    }

    public function getBalance($apiKey)
    {

        $response = Http::get("https://daisysms.com/stubs/handler_api.php", [
            'api_key' => $apiKey,
            'action' => 'getBalance',
        ]);
    
        $body = $response->body();
    
        if (str_contains($body, 'ACCESS_BALANCE')) {
            return explode(':', $body)[1];
        } elseif (str_contains($body, 'BAD_KEY')) {
            return "Invalid API Key!";
        }
    
        return "[ERROR] Faulty API - Check with Administrator";
    }
}
