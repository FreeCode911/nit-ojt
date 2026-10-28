<div class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight">Supervisor Dashboard</h1>
    <p class="text-slate-500 dark:text-slate-400 mt-1">Your interns and pending reviews</p>
</div>

<div class="grid md:grid-cols-3 gap-4 mb-6">
    <div class="card p-5 flex items-center gap-4">
        <div class="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
            <i data-lucide="users" class="w-6 h-6"></i>
        </div>
        <div>
            <div class="text-2xl font-bold">{{ $internships->count() }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">Assigned Interns</div>
        </div>
    </div>
    <div class="card p-5 flex items-center gap-4">
        <div class="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
            <i data-lucide="inbox" class="w-6 h-6"></i>
        </div>
        <div>
            <div class="text-2xl font-bold">{{ $pendingLogs->count() }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">Pending Reviews</div>
        </div>
    </div>
    <div class="card p-5 flex items-center gap-4">
        <div class="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
            <i data-lucide="trending-up" class="w-6 h-6"></i>
        </div>
        <div>
            <div class="text-2xl font-bold">{{ $internships->sum('approvedHours') }}h</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">Total Approved Hours</div>
        </div>
    </div>
</div>

<div class="grid md:grid-cols-2 gap-6">
    <div class="card p-6">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="users" class="w-4 h-4"></i>My Interns</h2>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
            @forelse($internships as $i)
                <li class="py-4">
                    <div class="flex justify-between items-start gap-3">
                        <div class="flex-1">
                            <div class="font-medium">{{ $i->intern->name }}</div>
                            <div class="text-sm text-slate-500 dark:text-slate-400">{{ $i->company }} · {{ $i->position }}</div>
                            <div class="mt-2">
                                <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    <span>{{ $i->approvedHours() }} / {{ $i->required_hours }} h</span>
                                    <span>{{ $i->progressPercent() }}%</span>
                                </div>
                                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-brand-500 to-violet-500 h-2 rounded-full transition-all duration-700" style="width: {{ $i->progressPercent() }}%"></div>
                                </div>
                            </div>
                        </div>
                        <a href="{{ route('internships.show', $i) }}" class="text-brand-600 dark:text-brand-400 text-sm hover:underline whitespace-nowrap">View →</a>
                    </div>
                </li>
            @empty
                <li class="py-8 text-center">
                    <i data-lucide="users" class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2"></i>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">No interns assigned yet.</p>
                </li>
            @endforelse
        </ul>
    </div>
    <div class="card p-6">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="inbox" class="w-4 h-4"></i>Pending Log Reviews</h2>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
            @forelse($pendingLogs as $log)
                <li class="py-4 flex justify-between items-start gap-3">
                    <div>
                        <div class="font-medium">{{ $log->user->name }}</div>
                        <div class="text-sm text-slate-500 dark:text-slate-400">{{ $log->log_date->format('M d, Y') }} · {{ $log->task }} · {{ $log->hours }}h</div>
                    </div>
                    <a href="{{ route('logs.show', $log) }}" class="btn-primary text-sm py-1.5 px-3">Review</a>
                </li>
            @empty
                <li class="py-8 text-center">
                    <i data-lucide="check-circle" class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2"></i>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">No pending logs. 🎉</p>
                </li>
            @endforelse
        </ul>
    </div>
</div>