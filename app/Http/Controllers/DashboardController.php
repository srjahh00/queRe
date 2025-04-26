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
        $sms = Sms::query()
        ->whereNotNull('code') 
        ->where('code', '!=', '') 
        ->selectRaw("
            DATE_FORMAT(DATE_SUB(created_at, INTERVAL 5 HOUR), '%Y-%m-%d') as day,
            environment_id,
            COUNT(*) as total
        ")
        ->with('environment')
        ->groupBy('day', 'environment_id')
        ->get()
        ->groupBy('day')
        ->map(fn($items, $day) => [
            'date' => Carbon::parse($day)->format('Y-m-d'),
            'environments' => $items->map(fn($item) => [
                'environment' => $item->environment->name ?? 'Unknown',
                'total' => $item->total,
            ]),
        ])
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
