<?php

namespace App\Http\Controllers;

use App\Models\Sms;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Log;

class SmsController extends Controller
{
    public $environment;

    public function __construct(Request $request)
    {
        $this->environment = $request->user()->environments()->first()->environment ?? null;
    }

    public function index(Request $request)
    {
        $environmentKeyMissing = is_null($this->environment);

        $now = Carbon::now();

        // Define "today" as starting at 5 AM
        $start = $now->copy()->startOfDay()->addHours(5);

        // Adjust if current time is before 5 AM
        if ($now->lt($start)) {
            $start->subDay();
        }

        // Current day range
        $end = $start->copy()->addDay();

        // Previous day range
        $prevStart = $start->copy()->subDay();
        $prevEnd = $start;

        return Inertia::render('SMS/DaisySms', [
            'sms' => Auth::user()->sms()->orderBy('created_at', 'desc')->get(),
            'daily_usage' => Auth::user()->sms()
                ->whereBetween('created_at', [$start, $end])
                ->whereNotNull('code')
                ->where('code', '!=', '')
                ->count(),
            'previous_daily_usage' => Auth::user()->sms()
                ->whereBetween('created_at', [$prevStart, $prevEnd])
                ->whereNotNull('code')
                ->where('code', '!=', '')
                ->count(),
            'environmentKeyMissing' => $environmentKeyMissing,
        ]);
    }

    public function getSmsList()
    {
        return Auth::user()->sms()->orderBy('created_at', 'desc')->get();
    }


    public function store(Request $request)
    {

        $validated = $request->validate([
            'areaCode' => ['required', 'string'],
            'carriers' => ['required', 'string', Rule::in(['vz', 'tmo', 'none'])],
        ]);

        // Normalize area codes (even if only one)
        $areaCodes = array_filter(array_map('trim', explode(',', $validated['areaCode'])));
        $validated['areaCode'] = implode(',', $areaCodes);

        // Final API params
        $params = [
            'api_key' => $this->environment->key,
            'action' => 'getNumber',
            'service' => 'oi',
            'max_price' => '0.60',
            'areas' => $validated['areaCode'],
        ];


        if ($validated['carriers'] !== 'none') {
            $params['carriers'] = $validated['carriers'];
        }

        $response = Http::get("https://daisysms.com/stubs/handler_api.php", $params);

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
                    'carrier' => data_get($validated, 'carriers', null)
                ]);
            }
        } else {
            return back()->withErrors(['errors' => $response]);
        }
    }

    public function cancelRental($id, Request $request)
    {
        // curl "https://daisysms.com/stubs/handler_api.php?api_key=$APIKEY&action=setStatus&id=308&status=8"

        $response = Http::get("https://daisysms.com/stubs/handler_api.php", [
            'api_key' => $this->environment->key,
            'action' => 'setStatus',
            'id' => data_get($request, 'rental_id'),
            'status' => '8',
        ]);
        $sms = Sms::where('rental_id', data_get($request, 'rental_id'));
        $sms->delete();

        return redirect('/sms')->with('message', $response->body());

    }
}
