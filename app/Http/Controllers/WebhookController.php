<?php

namespace App\Http\Controllers;

use App\Events\WebhookEntry;
use App\Models\Sms;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function handleWebhook(Request $request): void{
        \Log::info($request->all());

        WebhookEntry::dispatch();

        $data = $request->all();
        
        $activationId = data_get($data,'activationId');
        $sms = Sms::where('rental_id', $activationId)->firstOrFail();
        $sms->update([
            'code' => data_get($data,'code'), 
            'text' => data_get($data,'text'), 
            'message_id' => data_get($data,'messageId'), 
            'country' => data_get($data,'country'), 
            'received_at' => data_get($data,'receivedAt'), 
        ]);
        return $sms;
    }
}
