<?php

namespace App\Http\Controllers;

use App\Models\Sms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Log;

class SmsController extends Controller
{   
    public $environment;

    public function __construct(Request $request)
    {
        $this->environment = $request->user()->environments()->first()->environment;
    }

    public function index(Request $request)
    {
        return Inertia::render('SMS/DaisySms', [
            'sms' => Auth::user()->sms()->orderBy('created_at', 'desc')->get(), 
        ]);
    }

    public function getSmsList() {
        return Auth::user()->sms()->orderBy('created_at', 'desc')->get();
    }
    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'areaCode' => ['required', 'string'],
        ]);
        $response = Http::get("https://daisysms.com/stubs/handler_api.php", [
            'api_key' => $this->environment->key,
            'action' => 'getNumber',
            'service' => 'oi',
            'max_price'=> '0.60',
            'carriers' => 'vz',
            'areas' => $validated['areaCode']
        ]);
        
        $response = $response->body();
      
        if (str_contains($response, 'ACCESS_NUMBER:')) {
            $accessNumber = \Str::between($response, 'ACCESS_NUMBER:', ' ') ?? null;
        
            $rentalId = \Str::beforeLast($accessNumber, ':');  
            $rentalNumber = \Str::afterLast($accessNumber, ':');  
            
            if ($accessNumber && $rentalId && $rentalNumber) {
                Sms::create([
                    'user_id' => $request->user()->id,
                    'service' => 'Tinder',
                    'environment_id' => $this->environment->id,
                    'rental_id' => $rentalId, 
                    'rental_number' => $rentalNumber,  
                ]);
            }
        }
        
        
        Log::info("Response: " . $response);
        return Inertia::render('SMS/DaisySms', [
            'body' => $response,
            'sms' => Auth::user()->sms()->orderBy('created_at', 'desc')->get(), 
        ]);
    }

    public function cancelRental($id,Request $request){
        // curl "https://daisysms.com/stubs/handler_api.php?api_key=$APIKEY&action=setStatus&id=308&status=8"

        $response = Http::get("https://daisysms.com/stubs/handler_api.php", [
            'api_key' => $this->environment->key,
            'action' => 'setStatus',
            'id' => data_get($request,'rental_id'),
            'status' => '8',
        ]);

        return Inertia::render('SMS/DaisySms',[
           'response' => $response->body(),
           'sms'=> Auth::user()->sms()->orderBy('created_at', 'desc')->get() 
        ]);
    }  
}
