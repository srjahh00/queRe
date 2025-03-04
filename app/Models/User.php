<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'allow_login'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'allow_login' =>'boolean',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // public function getCreatedAtAttribute($value){
    //     return Carbon::parse($value)->format('M d Y'); 
    // }

    public function environments(){
        return $this->hasOne(EnvironmentAssignment::class);
    }

    public function CurrentEnvironment(){
        return $this->environment()->only(['name','key']);
    }

    public function sms(){
        return $this->hasMany(Sms::class);
    }

    public function activeSms(){
        return $this->sms()->latest('created_at');
    }
}
