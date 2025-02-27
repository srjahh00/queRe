<?php

namespace App\Http\Controllers;

use App\Models\Environment;
use App\Models\User;
use Http;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(){

    }

    public function index(){
        return Inertia::render('Dashboard/Dashboard',[
            'balance' => $this->getBalance(),
            'users_count' => User::count(),
            'users' => User::all(),
            'environments' => self::getEnvironments()

        ]);
    }

    private function getEnvironments()
    {
        return Environment::select('id', 'name')->get();
    }
    

    public function getBalance()
    {
        $apiKey = "S91y0ysfJ5ygXd3v42AkWYpfFy6mEG"; 
    
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
