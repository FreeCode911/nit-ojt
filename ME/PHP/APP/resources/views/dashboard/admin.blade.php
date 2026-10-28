<div class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
    <p class="text-slate-500 dark:text-slate-400 mt-1">Overview of the whole platform</p>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    @php
        $statsCards = [
            ['Users', $stats['users'], 'users', 'from-blue-500 to-cyan-500'],
            ['Internships', $stats['internships'], 'briefcase', 'from-indigo-500 to-violet-500'],
            ['Pending Logs', $stats['pending_logs'], 'clock', 'from-amber-500 to-orange-500'],
            ['Completed', $stats['completed'], 'check-circle', 'from-emerald-500 to-teal-500'],
        ];
    @endphp
    @foreach($statsCards as [$label, $value, $icon, $grad])
        <div class="card p-6 relative overflow-hidden">
            <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br {{ $grad }} opacity-10"></div>
            <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-gradient-to-br {{ $grad }} text-white shadow-md">
                    <i data-lucide="{{ $icon }}" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="text-2xl font-bold">{{ $value }}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">{{ $label }}</div>
                </div>
            </div>
        </div>
    @endforeach
</div>

<div class="grid lg:grid-cols-3 gap-6 mb-8">
    <div class="card p-6 lg:col-span-2">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="trending-up" class="w-4 h-4"></i>Internship Status Breakdown</h2>
        <div class="relative h-64">
            <canvas id="statusChart"></canvas>
        </div>
    </div>
    <div class="card p-6">
        <h2 class="font-semibold flex items-center gap-2 mb-4"><i data-lucide="pie-chart" class="w-4 h-4"></i>Quick Stats</h2>
        <div class="space-y-4">
            @php($colors = ['amber','blue','emerald','red'])
            @foreach(['pending','active','completed','cancelled'] as $i => $s)
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="capitalize font-medium">{{ $s }}</span>
                        <span class="text-slate-500 dark:text-slate-400">{{ $statusCounts[$s] }}</span>
                    </div>
                    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div class="bg-{{ $colors[$i] }}-500 h-2 rounded-full transition-all duration-700" style="width: {{ $stats['internships'] > 0 ? min(100, $statusCounts[$s] * 100 / $stats['internships']) : 0 }}%"></div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<div class="card overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
        <h2 class="font-semibold flex items-center gap-2"><i data-lucide="list" class="w-4 h-4"></i>Recent Internships</h2>
        <a href="{{ route('internships.index') }}" class="text-sm text-brand-600 dark:text-brand-400 hover:underline">View all</a>
    </div>
    <div class="overflow-x-auto">
        <table class="table-base">
            <thead class="bg-slate-50 dark:bg-slate-800/40">
                <tr>
                    <th class="th-base">Intern</th>
                    <th class="th-base">Company</th>
                    <th class="th-base">Status</th>
                    <th class="th-base"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            @foreach($recent as $i)
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="td-base font-medium">{{ $i->intern->name }}</td>
                    <td class="td-base text-slate-500 dark:text-slate-400">{{ $i->company }}</td>
                    <td class="td-base">
                        <span class="badge
                            @if($i->status==='active') bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300
                            @elseif($i->status==='completed') bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300
                            @elseif($i->status==='cancelled') bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300
                            @else bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 @endif">
                            {{ ucfirst($i->status) }}
                        </span>
                    </td>
                    <td class="td-base text-right"><a href="{{ route('internships.show', $i) }}" class="text-brand-600 dark:text-brand-400 hover:underline">View →</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('statusChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Active', 'Completed', 'Cancelled'],
            datasets: [{
                data: [
                    {{ \App\Models\Internship::where('status','pending')->count() }},
                    {{ \App\Models\Internship::where('status','active')->count() }},
                    {{ \App\Models\Internship::where('status','completed')->count() }},
                    {{ \App\Models\Internship::where('status','cancelled')->count() }}
                ],
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } }
            }
        }
    });
});
</script>