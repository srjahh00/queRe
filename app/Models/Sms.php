<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Mattiverse\Userstamps\Traits\Userstamps;

class Sms extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory,SoftDeletes,Userstamps;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'environment_id',
        'rental_id',
        'rental_number',
        'service',
        'code',
        'text',
        'message_id',
        'sender',
        'country',
        'received_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'environment_id'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
        ];
    }

    // public function getCreatedAtAttribute($value){
    //     return Carbon::parse($value)->format('M d Y'); 
    // }
    
    public function environment(){
        return $this->belongsTo(Environment::class,'environment_id');
    }

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
}
