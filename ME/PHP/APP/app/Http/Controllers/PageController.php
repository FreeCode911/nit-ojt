<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Inertia\Inertia;

class PageController extends Controller
{
    public function landing()
    {
        $stats = [
            'internships' => Internship::count(),
            'logs' => LogEntry::count(),
            'users' => User::count(),
        ];

        $features = [
            [
                'icon' => 'book-open',
                'title' => 'Daily Logs',
                'desc' => 'Record tasks, hours, skills, mood, and evidence files with a beautiful form. Draft or submit instantly.',
                'color' => 'brand',
                'gradient' => 'from-brand-500 to-violet-500',
                'bg_light' => 'bg-brand-100',
                'bg_dark' => 'dark:bg-brand-900/30',
                'text_light' => 'text-brand-600',
                'text_dark' => 'dark:text-brand-400',
            ],
            [
                'icon' => 'clock',
                'title' => 'Hour Tracking',
                'desc' => 'Track approved hours against required totals with a live progress bar and percentage.',
                'color' => 'emerald',
                'gradient' => 'from-emerald-500 to-teal-500',
                'bg_light' => 'bg-emerald-100',
                'bg_dark' => 'dark:bg-emerald-900/30',
                'text_light' => 'text-emerald-600',
                'text_dark' => 'dark:text-emerald-400',
            ],
            [
                'icon' => 'star',
                'title' => 'Evaluations',
                'desc' => 'Supervisors score interns on attendance, performance, initiative, teamwork, and communication.',
                'color' => 'amber',
                'gradient' => 'from-amber-500 to-orange-500',
                'bg_light' => 'bg-amber-100',
                'bg_dark' => 'dark:bg-amber-900/30',
                'text_light' => 'text-amber-600',
                'text_dark' => 'dark:text-amber-400',
            ],
            [
                'icon' => 'award',
                'title' => 'Certificates',
                'desc' => 'Generate and issue completion certificates with unique numbers for successful interns.',
                'color' => 'violet',
                'gradient' => 'from-violet-500 to-purple-500',
                'bg_light' => 'bg-violet-100',
                'bg_dark' => 'dark:bg-violet-900/30',
                'text_light' => 'text-violet-600',
                'text_dark' => 'dark:text-violet-400',
            ],
            [
                'icon' => 'users',
                'title' => 'Role Management',
                'desc' => 'Separate dashboards and permissions for interns, supervisors, and admins.',
                'color' => 'blue',
                'gradient' => 'from-blue-500 to-indigo-500',
                'bg_light' => 'bg-blue-100',
                'bg_dark' => 'dark:bg-blue-900/30',
                'text_light' => 'text-blue-600',
                'text_dark' => 'dark:text-blue-400',
            ],
            [
                'icon' => 'file-text',
                'title' => 'Reports',
                'desc' => 'Per-intern summary reports with logs, evaluations, and hours in one view.',
                'color' => 'fuchsia',
                'gradient' => 'from-fuchsia-500 to-pink-500',
                'bg_light' => 'bg-fuchsia-100',
                'bg_dark' => 'dark:bg-fuchsia-900/30',
                'text_light' => 'text-fuchsia-600',
                'text_dark' => 'dark:text-fuchsia-400',
            ],
        ];

        $roles = [
            [
                'icon' => 'user',
                'title' => 'Intern',
                'desc' => 'Log daily tasks, track hours, view progress, and submit entries for review. See your completion percentage in real time.',
                'gradient' => 'from-emerald-500 to-teal-500',
                'color_base' => 'emerald',
                'features' => [
                    'Daily log entries with rich text',
                    'Real-time progress tracking',
                    'Skills & mood logging',
                    'File attachments',
                    'Mobile-friendly',
                ],
                'cta' => 'Start Logging',
            ],
            [
                'icon' => 'user-check',
                'title' => 'Supervisor',
                'desc' => 'Review and approve logs, write evaluations, issue certificates, and monitor your interns\' progress from one dashboard.',
                'gradient' => 'from-blue-500 to-indigo-500',
                'color_base' => 'blue',
                'features' => [
                    'One-click log approval/rejection',
                    'Structured evaluations',
                    'Certificate issuance',
                    'Team analytics',
                    'Automated reminders',
                ],
                'cta' => 'Manage Team',
            ],
            [
                'icon' => 'shield',
                'title' => 'Admin',
                'desc' => 'Manage users and roles, oversee all internships, view platform-wide stats, and generate reports.',
                'gradient' => 'from-violet-500 to-fuchsia-500',
                'color_base' => 'violet',
                'features' => [
                    'User & role management',
                    'Platform analytics',
                    'Bulk operations',
                    'Audit logs',
                    'Custom branding',
                ],
                'cta' => 'View Admin Panel',
            ],
        ];

        $testimonials = [
            [
                'content' => '"OJT Logbook transformed how we manage internships. The real-time progress tracking saves us hours every week, and the dark mode is a lifesaver for late-night grading."',
                'author' => 'Dr. Sarah Chen',
                'role' => 'Computer Science Professor',
                'org' => 'Tech University',
                'avatar' => 'SC',
            ],
            [
                'content' => '"Finally, a logbook that doesn\'t feel like paperwork. My interns actually enjoy logging their days, and I can approve entries with one click from my phone."',
                'author' => 'Marcus Johnson',
                'role' => 'Senior Engineering Manager',
                'org' => 'InnovateCorp',
                'avatar' => 'MJ',
            ],
            [
                'content' => '"The evaluation templates and certificate generation are game-changers. We went from 2 weeks of admin work to 30 minutes per cohort."',
                'author' => 'Prof. Elena Rodriguez',
                'role' => 'Internship Coordinator',
                'org' => 'Business Institute',
                'avatar' => 'ER',
            ],
        ];

        $pricing = [
            'free' => [
                'name' => 'Free',
                'desc' => 'Perfect for individuals & small teams',
                'badge' => 'Current Plan',
                'badge_color' => 'emerald',
                'features' => [
                    'Unlimited internships & logs',
                    'All 3 roles (Intern, Supervisor, Admin)',
                    'Real-time progress tracking',
                    'Evaluations & certificates',
                    'Dark/light mode',
                    'Data export (CSV/PDF)',
                    'Email notifications',
                ],
                'cta' => 'Current Plan',
                'disabled' => true,
                'primary' => true,
                'outline' => false,
                'border_color' => 'emerald-500',
                'text_color' => 'emerald-600',
                'text_color_dark' => 'emerald-400',
                'hover_bg' => '',
            ],
            'pro' => [
                'name' => 'Pro',
                'desc' => 'For universities & large organizations',
                'badge' => 'Coming Soon',
                'badge_color' => 'brand',
                'features' => [
                    'Everything in Free',
                    'Custom branding & domain',
                    'Advanced analytics & reports',
                    'SSO (SAML/OIDC)',
                    'API access & webhooks',
                    'Dedicated support',
                    'SLA guarantee',
                ],
                'cta' => 'Notify Me',
                'disabled' => true,
                'primary' => false,
                'outline' => true,
                'border_color' => 'brand-500',
                'text_color' => 'brand-600',
                'text_color_dark' => 'brand-400',
                'hover_bg' => 'hover:bg-brand-50 dark:hover:bg-brand-900/20',
            ],
            'enterprise' => [
                'name' => 'Enterprise',
                'desc' => 'Custom solutions for large institutions',
                'badge' => null,
                'features' => [
                    'Everything in Pro',
                    'On-premise deployment',
                    'Custom integrations',
                    'Dedicated infrastructure',
                    '24/7 phone support',
                    'Custom contract terms',
                    'Migration assistance',
                ],
                'cta' => 'Contact Sales',
                'disabled' => true,
                'primary' => false,
                'outline' => true,
                'border_color' => 'slate-400',
                'text_color' => 'slate-500',
                'text_color_dark' => 'slate-400',
                'hover_bg' => 'hover:bg-slate-100 dark:hover:bg-slate-800',
            ],
        ];

        $animatedStats = [
            ['label' => 'Internships Tracked', 'value' => (string) $stats['internships'], 'change' => '+12%', 'changeType' => 'increase'],
            ['label' => 'Log Entries', 'value' => (string) $stats['logs'], 'change' => '+8%', 'changeType' => 'increase'],
            ['label' => 'Active Users', 'value' => (string) $stats['users'], 'change' => '+23%', 'changeType' => 'increase'],
            ['label' => 'Certificates Issued', 'value' => (string) Certificate::count(), 'change' => '+15%', 'changeType' => 'increase'],
        ];

        $dashboardChartData = [
            'data' => [
                ['name' => 'Week 1', 'logs' => 12, 'hours' => 38],
                ['name' => 'Week 2', 'logs' => 19, 'hours' => 52],
                ['name' => 'Week 3', 'logs' => 15, 'hours' => 45],
                ['name' => 'Week 4', 'logs' => 22, 'hours' => 61],
            ],
            'lines' => [
                ['key' => 'logs', 'color' => '#6366f1', 'name' => 'Log Entries'],
                ['key' => 'hours', 'color' => '#8b5cf6', 'name' => 'Hours'],
            ],
            'height' => 350,
        ];

        return Inertia::render('Landing', compact(
            'stats',
            'features',
            'roles',
            'testimonials',
            'pricing',
            'animatedStats',
            'dashboardChartData'
        ));
    }
}
