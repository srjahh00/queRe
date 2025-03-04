<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Mattiverse\Userstamps\Traits\Userstamps;

class Environment extends Model
{
 /** @use HasFactory<\Database\Factories\UserFactory> */
 use HasFactory,SoftDeletes,Userstamps;

 /**
  * The attributes that are mass assignable.
  *
  * @var list<string>
  */
 protected $fillable = [
     'key',
     'name',
 ];

 /**
  * The attributes that should be hidden for serialization.
  *
  * @var list<string>
  */
 protected $hidden = [
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



 public function usersEnvironments(){
    return $this->hasMany(EnvironmentAssignment::class);
 }

//  public function getKeyAttribute($value)
//  {
//      $firstPart = substr($value, 0, 2);
//      $lastPart = substr($value, -3);
//      $maskedPart = str_repeat('*', strlen($value) - 5);
     
//      return $firstPart . $maskedPart . $lastPart;
//  }

 public function getCreatedAtAttribute($value){
     return Carbon::parse($value)->format('M d Y'); 
 }

}

