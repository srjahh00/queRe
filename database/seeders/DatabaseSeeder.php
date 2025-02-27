<?php

namespace Database\Seeders;

use App\Models\Environment;
use App\Models\EnvironmentAssignment;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(5050)->create();

        $user = User::create([
            'name' => 'Test User',
            'email' => 'admin@admin.com',
            'email_verified_at' => now(),
            'password' => 'PCGpp00##',
        ]);

        $environment = Environment::create([
            'name' => 'Emilia',
            'key'=> 'S91y0ysfJ5ygXd3v42AkWYpfFy6mEG',
        ]);

        EnvironmentAssignment::create([
            'user_id' => $user->id,
            'environment_id' => $environment->id,
        ]);
        

    }
}
