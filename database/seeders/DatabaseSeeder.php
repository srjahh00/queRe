<?php

namespace Database\Seeders;

use App\Models\Environment;
use App\Models\EnvironmentAssignment;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        self::call([
            RolesAndPermissionSeeder::class 
         ]);
         
        $user = User::create([
            'name' => 'Admin',
            'email' => 'jhay@admin.com',
            'email_verified_at' => now(),
            'password' => 'PCGpp00##',
            'allow_login' => true,
        ]);

        $environment = Environment::create([
            'name' => 'Emilia',
            'key'=> 'S91y0ysfJ5ygXd3v42AkWYpfFy6mEG',
        ]);

        EnvironmentAssignment::create([
            'user_id' => $user->id,
            'environment_id' => $environment->id,
        ]);
        
        $superAdminRole = Role::where('name', 'super admin')->first();

        // If the 'super admin' role exists, assign it to the user
        if ($superAdminRole) {
            $user->assignRole(data_get($superAdminRole,'name'));
        }
      
    }
}
