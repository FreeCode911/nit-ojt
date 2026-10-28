<!DOCTYPE html>
<html lang="en" class="h-full" x-data="{ dark: localStorage.getItem('theme') === 'dark' }" :class="{ 'dark': dark }">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'OJT Logbook')</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16.png') }}">
    <link rel="icon" type="image/png" sizes="48x48" href="{{ asset('favicon-48.png') }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('favicon-96.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
    <link rel="mask-icon" href="{{ asset('favicon-16.png') }}" color="#4f46e5">
    <meta name="msapplication-TileColor" content="#4f46e5">
    <meta name="msapplication-TileImage" content="{{ asset('mstile-150.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        // apply saved theme before paint
        (function () {
            if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
        })();
    </script>
</head>
<body class="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <div class="min-h-full">
        <!-- Top bar -->
        <header class="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <a href="{{ route('dashboard') }}" class="flex items-center gap-2 font-bold text-lg">
                            <img src="{{ asset('images/logo.png') }}" alt="OJT Logbook" class="h-9 w-9 rounded-xl object-contain shadow-md bg-white/80 dark:bg-white/10 p-1">
                            <span class="hidden sm:inline bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">OJT Logbook</span>
                        </a>
                    </div>
                    @auth
                    <nav class="hidden md:flex items-center gap-1">
                        @php
                            $nav = [
                                ['dashboard', 'layout-dashboard', 'Dashboard'],
                                ['internships.index', 'briefcase', 'Internships'],
                                ['logs.index', 'book-open', 'Logs'],
                                ['evaluations.index', 'star', 'Evaluations'],
                            ];
                        @endphp
                        @foreach($nav as [$route, $icon, $label])
                            <a href="{{ route($route) }}" class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition {{ request()->routeIs(str_replace('.index','',$route).'*') ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' }}">
                                <i data-lucide="{{ $icon }}" class="w-4 h-4"></i>{{ $label }}
                            </a>
                        @endforeach
                        @if(auth()->user()->isAdmin())
                            <a href="{{ route('admin.users.index') }}" class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition {{ request()->routeIs('admin.*') ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' }}">
                                <i data-lucide="users" class="w-4 h-4"></i>Users
                            </a>
                        @endif
                    </nav>
                    @endauth
                    <div class="flex items-center gap-2">
                        <!-- theme toggle -->
                        <button @click="dark = !dark; localStorage.setItem('theme', dark ? 'dark' : 'light')" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle theme">
                            <i data-lucide="sun" class="w-5 h-5 dark:hidden"></i>
                            <i data-lucide="moon" class="w-5 h-5 hidden dark:block"></i>
                        </button>
                        @auth
                            <div x-data="{ open: false }" class="relative">
                                <button @click="open=!open" class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white text-sm font-semibold">{{ strtoupper(substr(auth()->user()->name,0,1)) }}</span>
                                    <span class="hidden sm:block text-sm font-medium">{{ auth()->user()->name }}</span>
                                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i>
                                </button>
                                <div x-show="open" @click.outside="open=false" x-transition class="absolute right-0 mt-2 w-48 card p-2 shadow-lg">
                                    <div class="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{{ auth()->user()->role }}</div>
                                    <form method="POST" action="{{ route('logout') }}">
                                        @csrf
                                        <button class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <i data-lucide="log-out" class="w-4 h-4"></i>Logout
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @else
                            <a href="{{ route('login') }}" class="btn-ghost">Login</a>
                            <a href="{{ route('register') }}" class="btn-primary">Register</a>
                        @endauth
                    </div>
                </div>
            </div>
        </header>

        <!-- Mobile nav -->
        @auth
        <div class="md:hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-x-auto">
            <div class="flex gap-1 px-4 py-2">
                @foreach([['dashboard','Dashboard'],['internships.index','Internships'],['logs.index','Logs'],['evaluations.index','Evaluations']] as [$r,$l])
                    <a href="{{ route($r) }}" class="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap {{ request()->routeIs(str_replace('.index','',$r).'*') ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300' }}">{{ $l }}</a>
                @endforeach
                @if(auth()->user()->isAdmin())
                    <a href="{{ route('admin.users.index') }}" class="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">Users</a>
                @endif
            </div>
        </div>
        @endauth

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            @if (session('success'))
                <div class="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-emerald-800 dark:text-emerald-300" role="alert">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>{{ session('success') }}
                </div>
            @endif
            @if (session('error'))
                <div class="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-300" role="alert">
                    <i data-lucide="alert-circle" class="w-5 h-5"></i>{{ session('error') }}
                </div>
            @endif
            @if ($errors->any())
                <div class="mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-300" role="alert">
                    <div class="flex items-center gap-2 font-medium mb-1"><i data-lucide="alert-triangle" class="w-5 h-5"></i>Please fix the following:</div>
                    <ul class="list-disc pl-7 text-sm">
                        @foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach
                    </ul>
                </div>
            @endif
            @yield('content')
        </main>

        <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    <img src="{{ asset('images/logo.png') }}" alt="OJT Logbook" class="h-7 w-7 rounded-lg object-contain">
                    <span class="font-semibold text-sm">OJT Logbook</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">Built with Laravel &amp; Tailwind CSS</p>
            </div>
        </footer>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => { if (window.lucide) lucide.createIcons(); });
        document.addEventListener('alpine:initialized', () => { if (window.lucide) lucide.createIcons(); });
        document.addEventListener('alpine:updated', () => { if (window.lucide) lucide.createIcons(); });
    </script>
</body>
</html>