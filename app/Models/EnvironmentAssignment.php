<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Mattiverse\Userstamps\Traits\Userstamps;

class EnvironmentAssignment extends Model
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
 ];

 /**
  * The attributes that should be hidden for serialization.
  *
  * @var list<string>
  */
 protected $hidden = [
    'key'
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

 public function user(){
    return $this->belongsTo(User::class,'user_id');
 }
 
 public function environment(){
    return $this->belongsTo(Environment::class,'environment_id');
 }

 public function getCreatedAtAttribute($value){
     return Carbon::parse($value)->format('M d Y'); 
 }
}
