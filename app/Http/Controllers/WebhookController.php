<?php

namespace App\Http\Controllers;

use App\Events\WebhookEntry;
use App\Models\Sms;
use Illuminate\Http\Request;
use Log;

class WebhookController extends Controller
{
    public function handleWebhook(Request $request){
    
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
        if ($sms) {
        WebhookEntry::dispatch();        
    }        
    }
}
