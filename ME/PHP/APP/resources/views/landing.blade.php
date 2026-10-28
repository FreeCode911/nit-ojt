<!DOCTYPE html>
<html lang="en" class="h-full" x-data="{ dark: localStorage.getItem('theme') === 'dark' }" :class="{ 'dark': dark }">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OJT Logbook</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');</script>
</head>
<body class="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
<div class="min-h-full flex flex-col">
    <header class="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <a href="{{ route('landing') }}" class="flex items-center gap-2">
                    <img src="{{ asset('images/logo.png') }}" alt="OJT Logbook" class="h-9 w-9 rounded-xl object-contain shadow-md bg-white/80 dark:bg-white/10 p-1">
                    <span class="hidden sm:inline font-bold text-lg bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">OJT Logbook</span>
                </a>
                <nav class="hidden md:flex items-center gap-1">
                    <a href="#features" class="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Features</a>
                    <a href="#roles" class="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Roles</a>
                </nav>
                <div class="flex items-center gap-2">
                    <button @click="dark = !dark; localStorage.setItem('theme', dark ? 'dark' : 'light')" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
                        <i data-lucide="sun" class="w-5 h-5 dark:hidden"></i>
                        <i data-lucide="moon" class="w-5 h-5 hidden dark:block"></i>
                    </button>
                    @auth
                        <a href="{{ route('dashboard') }}" class="btn-primary text-sm">Go to Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="btn-ghost text-sm">Login</a>
                        <a href="{{ route('register') }}" class="btn-primary text-sm">Get Started</a>
                    @endauth
                </div>
            </div>
        </div>
    </header>

    <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-violet-50 dark:from-brand-950/40 dark:via-slate-950 dark:to-violet-950/40"></div>
        <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6">
                <i data-lucide="sparkles" class="w-4 h-4"></i> Modern On-the-Job Training Management
            </div>
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                Track your <span class="bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">OJT journey</span><br>
                in one beautiful place
            </h1>
            <p class="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                A complete On-the-Job Training logbook for interns, supervisors, and admins.
                Log daily tasks, track hours, get evaluated, and earn certificates — with a modern dark UI.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-4">
                @auth
                    <a href="{{ route('dashboard') }}" class="btn-primary text-lg px-8 py-3.5"><i data-lucide="layout-dashboard" class="w-5 h-5"></i>Go to Dashboard</a>
                @else
                    <a href="{{ route('register') }}" class="btn-primary text-lg px-8 py-3.5"><i data-lucide="user-plus" class="w-5 h-5"></i>Start Free</a>
                    <a href="{{ route('login') }}" class="btn-ghost text-lg px-8 py-3.5"><i data-lucide="log-in" class="w-5 h-5"></i>Login</a>
                @endauth
            </div>
            <div class="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
                <div class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>Free forever</div>
                <div class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>No credit card</div>
                <div class="flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>Dark mode ready</div>
            </div>
        </div>
    </section>
<section id="features" class="py-20 bg-white dark:bg-slate-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-extrabold tracking-tight">Everything you need</h2>
                <p class="mt-4 text-slate-500 dark:text-slate-400 text-lg">Built for the real world of On-the-Job Training</p>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
                @php
                    $features = [
                        ['book-open', 'Daily Logs', 'Record tasks, hours, skills, mood, and evidence files with a beautiful form. Draft or submit instantly.'],
                        ['clock', 'Hour Tracking', 'Track approved hours against required totals with a live progress bar and percentage.'],
                        ['star', 'Evaluations', 'Supervisors score interns on attendance, performance, initiative, teamwork, and communication.'],
                        ['award', 'Certificates', 'Generate and issue completion certificates with unique numbers for successful interns.'],
                        ['users', 'Role Management', 'Separate dashboards and permissions for interns, supervisors, and admins.'],
                        ['file-text', 'Reports', 'Per-intern summary reports with logs, evaluations, and hours in one view.'],
                    ];
                @endphp
                @foreach($features as [$icon, $title, $desc])
                    <div class="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-md mb-4">
                            <i data-lucide="{{ $icon }}" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ $title }}</h3>
                        <p class="text-slate-500 dark:text-slate-400 text-sm">{{ $desc }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section id="roles" class="py-20 bg-slate-50 dark:bg-slate-950">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-extrabold tracking-tight">Built for every role</h2>
                <p class="mt-4 text-slate-500 dark:text-slate-400 text-lg">Tailored experiences for each person in the training ecosystem</p>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="card p-8 text-center">
                    <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg mb-4">
                        <i data-lucide="user" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Intern</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">Log daily tasks, track hours, view progress, and submit entries for review. See your completion percentage in real time.</p>
                </div>
                <div class="card p-8 text-center">
                    <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg mb-4">
                        <i data-lucide="user-check" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Supervisor</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">Review and approve logs, write evaluations, issue certificates, and monitor your interns' progress from one dashboard.</p>
                </div>
                <div class="card p-8 text-center">
                    <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg mb-4">
                        <i data-lucide="shield" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Admin</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">Manage users and roles, oversee all internships, view platform-wide stats, and generate reports.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="py-16 bg-gradient-to-r from-brand-600 to-violet-600">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-3 gap-8 text-center text-white">
                <div>
                    <div class="text-5xl font-extrabold">{{ $stats['internships'] }}</div>
                    <div class="text-brand-100 mt-1">Internships tracked</div>
                </div>
                <div>
                    <div class="text-5xl font-extrabold">{{ $stats['logs'] }}</div>
                    <div class="text-brand-100 mt-1">Log entries submitted</div>
                </div>
                <div>
                    <div class="text-5xl font-extrabold">{{ $stats['users'] }}</div>
                    <div class="text-brand-100 mt-1">Active users</div>
                </div>
            </div>
        </div>
    </section>

    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <img src="{{ asset('images/logo.png') }}" alt="OJT Logbook" class="h-7 w-7 rounded-lg object-contain">
                <span class="font-semibold">OJT Logbook</span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Built with Laravel &amp; Tailwind CSS</p>
        </div>
    </footer>
</div>
<script>document.addEventListener('DOMContentLoaded', () => { if (window.lucide) lucide.createIcons(); });</script>
</body>
</html>