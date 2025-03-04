<?php

namespace App\Http\Controllers;

use App\Models\Environment;
use DB;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnvironmentController extends Controller
{

    public function index(){
        return Inertia::render('Environment/Environment',[
            'environments' => Environment::whereNotNull('key')->get()
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'key' => ['required', 'string'],
            'name' => ['required', 'string'],
        ]);
        DB::beginTransaction();
        try {
            $environment = Environment::create($validated);
            DB::commit();

        
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy($id)
    {
        $environment = Environment::findOrFail($id);
        DB::beginTransaction();
        try {
            $environment->usersEnvironments()->delete();

            $environment->delete();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(Request $request, $id){
        $validated = $request->validate([
            'key' => ['required', 'string'],
            'name' => ['required', 'string'],
        ]);
        $environment = Environment::findOrFail($id);
        DB::beginTransaction();
        try {
            $environment->update($validated);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

}
