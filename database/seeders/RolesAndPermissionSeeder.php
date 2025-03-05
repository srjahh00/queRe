<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create Permissions
        $permissions = [
            'manage environment',
            'sms service',
            'view dashboard',
            'manage user'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);

        // Assign permissions to roles
        // Super Admin gets all permissions
        $superAdminRole->syncPermissions(Permission::all());

        // Admin gets "manage environment" and "sms service"
        $adminRole->syncPermissions(['manage environment', 'sms service', 'manage user']);

        // Staff gets only "sms service"
        $staffRole->syncPermissions(['sms service']);
    }
}
