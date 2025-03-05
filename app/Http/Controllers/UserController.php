<?php

namespace App\Http\Controllers;

use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use PhpParser\Node\Stmt\Return_;
use Redirect;

class UserController extends Controller
{
    public function index(){
        return User::with(['roles','environments.environment'])->get();
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        DB::beginTransaction();
    
        try {
            $validated = $request->validate([
                'name' => ['required', 'string'],
                'email' => [
                    'required', 
                    'email', 
                    Rule::unique('users')->ignore($user->id),  
                ],
                'allow_login' => ['nullable', 'boolean'],
                'environment_id' => ['required', 'string', Rule::exists('environments', 'id')], 
            ]);
    
            $user->update([
                'name' => data_get($validated, 'name'),
                'email' => data_get($validated, 'email'),
                'allow_login' => data_get($validated, 'allow_login'),
            ]);
    
            $user->environments()->delete();  
            $user->environments()->updateOrCreate([ 
                'user_id' => $user->id,
                'environment_id' => data_get($validated, 'environment_id')
            ]);

            
            DB::commit();
            return Redirect::back();
    } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;  
        }
    }
}
