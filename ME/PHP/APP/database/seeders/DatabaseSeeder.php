<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Evaluation;
use App\Models\Internship;
use App\Models\LogEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    private const EVAL_WEEKS_1_4 = ['Weeks 1-4', 84, 80, 78, 88, 82];

    private const EVAL_WEEKS_5_8 = ['Weeks 5-8', 90, 86, 88, 86, 84];

    private const EVAL_MIDTERM = ['Midterm', 88, 84, 86, 90, 87];

    private const EVAL_FINAL = ['Final', 94, 92, 91, 93, 95];

    private const EVAL_NEEDS_IMPROVEMENT = ['Weeks 1-4', 72, 66, 61, 70, 68];

    /**
     * Deterministic demo data: the anchored accounts keep their emails
     * (every password is "password"), internship id 1 stays John x Jane at
     * Acme Corp, and all other rows come from fixed pools so reseeding
     * always produces the same demo dataset.
     */
    public function run(): void
    {
        $this->command->info('Seeding users...');

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ojt.test',
            'password' => 'password',
            'role' => 'admin',
            'phone' => '0917 000 0001',
            'email_verified_at' => now(),
        ]);

        $jane = User::create([
            'name' => 'Jane Supervisor',
            'email' => 'supervisor@ojt.test',
            'password' => 'password',
            'role' => 'supervisor',
            'company' => 'Acme Corp',
            'department' => 'Engineering',
            'phone' => '0917 200 1001',
            'email_verified_at' => now(),
        ]);

        $john = User::create([
            'name' => 'John Intern',
            'email' => 'intern@ojt.test',
            'password' => 'password',
            'role' => 'intern',
            'company' => 'Acme Corp',
            'department' => 'Engineering',
            'phone' => '0917 300 2001',
            'email_verified_at' => now(),
        ]);

        $extraSupervisors = [];

        foreach ([
            ['marco@ojt.test', 'Marco Villanueva', 'ByteWorks Studio', 'Design', '0917 200 1002'],
            ['rhea@ojt.test', 'Rhea Santos', 'DataPoint Analytics', 'Analytics', '0917 200 1003'],
            ['carlo@ojt.test', 'Carlo Reyes', 'CloudForce Systems', 'Operations', '0917 200 1004'],
        ] as [$email, $name, $company, $department, $phone]) {
            $extraSupervisors[$email] = User::create([
                'name' => $name,
                'email' => $email,
                'password' => 'password',
                'role' => 'supervisor',
                'company' => $company,
                'department' => $department,
                'phone' => $phone,
                'email_verified_at' => now(),
            ]);
        }

        /*
         * Internship id 1 is anchored: John, supervised by Jane at
         * Acme Corp, Software Intern, 480 required hours, active.
         * The demo sits him around 55% progress.
         */
        $johnInternship = Internship::create([
            'intern_id' => $john->id,
            'supervisor_id' => $jane->id,
            'company' => 'Acme Corp',
            'department' => 'Engineering',
            'position' => 'Software Intern',
            'start_date' => now()->subWeeks(16)->toDateString(),
            'end_date' => now()->addWeeks(8)->toDateString(),
            'required_hours' => 480,
            'status' => 'active',
            'notes' => 'Seeded demo internship.',
        ]);

        $this->seedLogs($johnInternship, 'engineering', approved: 36, submitted: 2, rejected: 1, draft: 1);

        $this->seedEvaluations($johnInternship, [
            self::EVAL_WEEKS_1_4,
            self::EVAL_WEEKS_5_8,
        ]);

        /*
         * Extra interns: [email, name, company, department, position,
         * supervisor email, status, started weeks ago, runs for weeks,
         * required hours].
         */
        $internships = [
            ['maria@ojt.test', 'Maria Lopez', 'Acme Corp', 'Quality Assurance', 'QA Intern', 'supervisor@ojt.test', 'active', 8, 16, 480],
            ['angelo@ojt.test', 'Angelo Cruz', 'Acme Corp', 'IT Support', 'IT Support Intern', 'supervisor@ojt.test', 'pending', 1, 25, 480],
            ['bea@ojt.test', 'Bea Gonzales', 'ByteWorks Studio', 'Design', 'UI/UX Design Intern', 'marco@ojt.test', 'active', 12, 12, 480],
            ['paolo@ojt.test', 'Paolo Mendoza', 'ByteWorks Studio', 'Frontend Development', 'Frontend Dev Intern', 'marco@ojt.test', 'active', 14, 10, 480],
            ['kat@ojt.test', 'Kat Dela Pena', 'ByteWorks Studio', 'Marketing', 'Creative Design Intern', 'marco@ojt.test', 'active', 6, 14, 240],
            ['nico@ojt.test', 'Nico Reyes', 'DataPoint Analytics', 'Data Analysis', 'Data Analyst Intern', 'rhea@ojt.test', 'completed', 26, 2, 300],
            ['amy@ojt.test', 'Amy Tan', 'DataPoint Analytics', 'Business Intelligence', 'BI Intern', 'rhea@ojt.test', 'active', 10, 14, 480],
            ['leo@ojt.test', 'Leo Aquino', 'DataPoint Analytics', 'Data Engineering', 'Data Engineering Intern', 'rhea@ojt.test', 'completed', 24, 1, 300],
            ['ella@ojt.test', 'Ella Lim', 'CloudForce Systems', 'DevOps', 'DevOps Intern', 'carlo@ojt.test', 'active', 5, 19, 480],
            ['migs@ojt.test', 'Migs Torres', 'CloudForce Systems', 'Network Operations', 'Network Ops Intern', 'carlo@ojt.test', 'cancelled', 9, 11, 480],
            ['sam@ojt.test', 'Sam Ramos', 'Acme Corp', 'People Operations', 'HR Intern', 'supervisor@ojt.test', 'active', 4, 20, 480],
            ['fran@ojt.test', 'Fran Navarro', 'CloudForce Systems', 'Support Engineering', 'Support Engineer Intern', 'carlo@ojt.test', 'active', 11, 13, 480],
        ];

        $logSpecs = [
            'Maria Lopez' => [['qa', 18, 2, 0, 1], [self::EVAL_WEEKS_1_4]],
            'Angelo Cruz' => [null, []],
            'Bea Gonzales' => [['design', 14, 3, 0, 1], [self::EVAL_WEEKS_1_4]],
            'Paolo Mendoza' => [['frontend', 26, 2, 1, 0], [self::EVAL_WEEKS_1_4]],
            'Kat Dela Pena' => [['design', 8, 0, 0, 1], []],
            'Nico Reyes' => [['analytics', 40, 0, 0, 0], [self::EVAL_WEEKS_1_4, self::EVAL_MIDTERM, self::EVAL_FINAL]],
            'Amy Tan' => [['bi', 12, 1, 0, 0], []],
            'Leo Aquino' => [['data-engineering', 40, 0, 0, 0], [self::EVAL_MIDTERM, self::EVAL_FINAL]],
            'Ella Lim' => [['devops', 9, 1, 0, 0], []],
            'Migs Torres' => [['network', 4, 0, 1, 0], []],
            'Sam Ramos' => [['people', 6, 0, 0, 0], []],
            'Fran Navarro' => [['support', 15, 2, 0, 1], [self::EVAL_NEEDS_IMPROVEMENT]],
        ];

        $this->command->info('Seeding internships, log entries, evaluations and certificates...');

        foreach ($internships as $index => [$email, $name, $company, $department, $position, $supervisorEmail, $status, $started, $runs, $required]) {
            $intern = User::create([
                'name' => $name,
                'email' => $email,
                'password' => 'password',
                'role' => 'intern',
                'company' => $company,
                'department' => $department,
                'phone' => '0917 300 '.str_pad((string) ($index + 2), 4, '0', STR_PAD_LEFT),
                'email_verified_at' => now(),
            ]);

            $internship = Internship::create([
                'intern_id' => $intern->id,
                'supervisor_id' => $supervisorEmail === 'supervisor@ojt.test' ? $jane->id : $extraSupervisors[$supervisorEmail]->id,
                'company' => $company,
                'department' => $department,
                'position' => $position,
                'start_date' => now()->subWeeks($started)->toDateString(),
                'end_date' => now()->addWeeks($status === 'completed' ? -$runs : $runs)->toDateString(),
                'required_hours' => $required,
                'status' => $status,
                'notes' => $status === 'completed'
                    ? 'Finished required hours and passed the final evaluation.'
                    : 'OJT program 2026 - seeded demo data.',
            ]);

            [$logSpec, $evalRows] = $logSpecs[$name];

            if ($logSpec !== null) {
                $this->seedLogs($internship, ...$logSpec);
            }

            $this->seedEvaluations($internship, $evalRows);

            if ($status === 'completed') {
                Certificate::create([
                    'internship_id' => $internship->id,
                    'certificate_number' => 'CERT-'.str_pad((string) $internship->id, 5, '0', STR_PAD_LEFT).'-'.now()->format('Y'),
                    'issued_to' => $intern->name,
                    'issued_by' => $internship->supervisor->name,
                    'issued_date' => now()->subWeeks(1)->toDateString(),
                ]);
            }
        }

        $this->command->table(
            ['users', 'internships', 'log entries', 'evaluations', 'certificates'],
            [[User::count(), Internship::count(), LogEntry::count(), Evaluation::count(), Certificate::count()]]
        );
    }

    /**
     * Weekday log entries walking back over business days from yesterday
     * (today stays free for fresh demo entries), cycling hours, task pools
     * and moods from fixed arrays. The newest entries stay submitted/draft,
     * older ones are approved, and any rejections sit mid-history.
     */
    private function seedLogs(
        Internship $internship,
        string $flavor,
        int $approved = 0,
        int $submitted = 0,
        int $rejected = 0,
        int $draft = 0,
    ): void {
        $intern = $internship->intern;
        $supervisor = $internship->supervisor;

        $pool = self::TASK_POOLS[$flavor];
        $hours = [7.5, 8, 6.5, 7, 8.5, 6, 7.5, 8];
        $moods = $internship->status === 'cancelled'
            ? ['Frustrated', 'Unmotivated', 'Busy']
            : ['Productive', 'Focused', 'Energized', 'Challenged', 'Calm', 'Satisfied', 'Busy'];

        // Newest-first weekdays, leaving today untouched.
        $dates = [];
        $cursor = now()->subDay();
        $total = $approved + $submitted + $rejected + $draft;

        while (count($dates) < $total) {
            if (! $cursor->isWeekend() && $cursor->greaterThanOrEqualTo($internship->start_date)) {
                $dates[] = $cursor->toDateString();
            }

            $cursor = $cursor->subDay();
        }

        $slots = [];

        for ($n = 0; $n < $draft; $n++) {
            $slots[$n] = 'draft';
        }

        for ($n = $draft; $n < $draft + $submitted; $n++) {
            $slots[$n] = 'submitted';
        }

        for ($n = 0; $n < $rejected; $n++) {
            $slots[$this->midIndex($total) + $n] = 'rejected';
        }

        for ($n = 0; $n < $total; $n++) {
            if (! isset($slots[$n])) {
                $slots[$n] = 'approved';
            }
        }

        foreach ($slots as $logIndex => $status) {
            $date = $dates[$logIndex];
            $taskIndex = $logIndex % count($pool['tasks']);

            $isReviewed = $status === 'approved' || $status === 'rejected';

            LogEntry::create([
                'internship_id' => $internship->id,
                'user_id' => $intern->id,
                'log_date' => $date,
                'hours' => $hours[$logIndex % count($hours)],
                'task' => $pool['tasks'][$taskIndex],
                'description' => $pool['descriptions'][$taskIndex],
                'skills' => [
                    $pool['skills'][$taskIndex % count($pool['skills'])],
                    $pool['skills'][($taskIndex + 1) % count($pool['skills'])],
                ],
                'mood' => $moods[$logIndex % count($moods)],
                'status' => $status,
                'supervisor_note' => $status === 'rejected'
                    ? self::REJECTION_NOTES[$logIndex % count(self::REJECTION_NOTES)]
                    : null,
                'reviewed_at' => $isReviewed
                    ? now()->parse($date)->addDay()->setTime(9, ($logIndex * 7) % 50)
                    : null,
                'reviewed_by' => $isReviewed ? $supervisor->id : null,
                'created_at' => $date.' 17:30:00',
                'updated_at' => $date.' 17:30:00',
            ]);
        }
    }

    private function midIndex(int $total): int
    {
        static $offset = 0;

        return (int) floor($total * 0.45) + ($offset++ % max(1, min(3, $total - 3)));
    }

    private function seedEvaluations(Internship $internship, array $evals): void
    {
        if ($evals === []) {
            return;
        }

        $supervisor = $internship->supervisor;
        $pool = self::EVAL_TEXTS[$internship->company] ?? self::EVAL_TEXTS['default'];

        foreach ($evals as $index => $eval) {
            [$period, $attendance, $performance, $initiative, $teamwork, $communication] = $eval;

            $overall = ($attendance + $performance + $initiative + $teamwork + $communication) / 5;
            $recommendation = $overall >= 75 ? 'pass' : ($overall >= 65 ? 'needs_improvement' : 'fail');

            Evaluation::create([
                'internship_id' => $internship->id,
                'supervisor_id' => $supervisor->id,
                'period' => $period,
                'attendance' => $attendance,
                'performance' => $performance,
                'initiative' => $initiative,
                'teamwork' => $teamwork,
                'communication' => $communication,
                'overall' => $overall,
                'strengths' => $pool['strengths'][$index % count($pool['strengths'])],
                'improvements' => $pool['improvements'][$index % count($pool['improvements'])],
                'comments' => $pool['comments'][$index % count($pool['comments'])],
                'recommendation' => $recommendation,
            ]);
        }
    }

    private const REJECTION_NOTES = [
        'Please add the actual ticket references before resubmitting.',
        'Hours do not match the reported timesheet - please review.',
        'Resubmit with a more specific task summary.',
    ];

    private const TASK_POOLS = [
        'engineering' => [
            'tasks' => [
                'Built REST endpoint for user profiles',
                'Fixed pagination bug in dashboard list',
                'Wrote factory tests for the auth flow',
                'Refactored legacy Blade partials to components',
                'Debugged slow N+1 query on reports page',
                'Set up the staging deploy pipeline',
                'Implemented form validation for log entries',
                'Paired session on reviewing a pull request',
            ],
            'descriptions' => [
                'Added resource controller, policy and feature tests for the profile endpoints.',
                'Traced the bug to a missing chunk of the index query; fixed and added a regression test.',
                'Covered login, logout and password reset with response assertions.',
                'Extracted repeated markup into reusable components and removed unused views.',
                'Added eager loading to the reports query; the page now loads in 80ms down from 600ms.',
                'Wired the deploy script to run tests, build assets, and invalidate caches.',
                'Server-side rules with custom error messages matching the design system.',
                'Reviewed two pull requests and discussed naming and error-handling conventions.',
            ],
            'skills' => ['PHP', 'Laravel', 'Git', 'SQL', 'JavaScript', 'Testing', 'Code Review', 'Debugging'],
        ],

        'qa' => [
            'tasks' => [
                'Wrote regression cases for the checkout flow',
                'Filed 6 bugs with reproduction steps',
                'Automated smoke tests for login',
                'Ran an exploratory testing session on the admin panel',
                'Triaged incoming bug reports with the dev team',
                'Validated the hotfix on staging',
                'Documented the test plan for the mobile build',
                'Reviewed QA checklist coverage',
            ],
            'descriptions' => [
                'Covered the happy path, discount codes and failed payments; 26 test cases total.',
                'Each report includes environment, build number and a screen recording.',
                'Chained the new smoke set to the nightly pipeline; the first run passed green.',
                'Logged 4 usability issues and one severity-1 edge case in the bulk actions menu.',
                'Prioritized the weekly backlog in triage and closed out duplicates.',
                'Re-ran the failed suite after the hotfix deploy; all tests now pass.',
                'Outlined the device matrix and network conditions for the release candidate.',
                'Mapped each requirement to at least one test and flagged two uncovered spots.',
            ],
            'skills' => ['Testing', 'Playwright', 'TestRail', 'JIRA', 'SQL', 'Exploratory Testing', 'Documentation', 'Regression'],
        ],

        'design' => [
            'tasks' => [
                'Designed onboarding flow mockups',
                'Ran a usability test with internal users',
                'Prepared component specs for handoff',
                'Updated the icon set to match tokens',
                'Prototyped dark-mode variants',
                'Collected feedback from the brand review',
                'Refined empty-state illustrations',
                'Mapped the responsive breakpoints',
            ],
            'descriptions' => [
                'Three screen variations plus an accessible focus state in Figma.',
                'Tested with 4 teammates; iterated labels and reduced cognitive load.',
                'Annotated 9 sizes, padding and a spacing scale for consistent implementation.',
                'Redrew 14 icons on the 24px grid and exported optimized SVG assets.',
                'Built variants for surfaces and borders following the new color tokens.',
                'Incorporated the brand review notes into the final layout.',
                'Balanced the two-line state so the card height stays stable up to 160% zoom.',
                'Documented how the grid adapts from 375px to 1440px and above.',
            ],
            'skills' => ['Figma', 'Prototyping', 'Design Systems', 'User Testing', 'Illustrator', 'Accessibility', 'Iconography', 'Responsive Design'],
        ],

        'frontend' => [
            'tasks' => [
                'Built a responsive card grid for the landing page',
                'Fixed dark-mode contrast issues',
                'Extracted a reusable button component',
                'Improved the Lighthouse accessibility score',
                'Wired the stat cards to live data',
                'Wrote currency input masking for the form',
                'Debounced the global search field',
                'Investigated a hydration mismatch warning',
            ],
            'descriptions' => [
                'The grid now reflows from 1 to 4 columns with identical markup.',
                'Reworked the pairs failing 4.5:1 contrast against the darker surface palette.',
                'Migrated 8 call sites to the shared component with variants.',
                'Resolved 11 issues; the homepage now scores 98 on mobile.',
                'Added number formatting, accessible text and hover replay feedback per design.',
                'Made the input accessible and localized separators work as expected.',
                'Reduced search chatter from roughly 120 messages to 15 on a slow day.',
                'Traced the mismatch to a date library default form; pinned it to UTC.',
            ],
            'skills' => ['React', 'Tailwind CSS', 'TypeScript', 'Accessibility', 'Git', 'Component Design', 'Testing', 'Debugging'],
        ],

        'analytics' => [
            'tasks' => [
                'Cleaned the quarterly dataset of 50k rows',
                'Built a pivot dashboard of revenue metrics',
                'Wrote a SQL view for churn cohorts',
                'Validated report figures against finance',
                'Prototyped a Python notebook for A/B tests',
                'Automated weekly data-freshness checks',
                'Charted the NPS trend by segment',
                'Documented the reconciliation process',
            ],
            'descriptions' => [
                'Removed duplicates, typed the columns and documented each transformation.',
                'Leadership is already using the dashboard in the Monday standup.',
                'The cohort view runs in under two seconds in the staging warehouse.',
                'Tracked three mismatches to timezone buckets and fixed the aggregation.',
                'Shipped two significance test variants benchmarked against reference tests.',
                'Freshness failures now alert by email and feed the on-call rota.',
                'Score segmented by plan, tenure and signup source with quarterly deltas.',
                'Wrote a runbook so non-analysts can reproduce the reconciliation.',
            ],
            'skills' => ['SQL', 'Python', 'Pandas', 'Tableau', 'Excel', 'Dashboarding', 'Documentation', 'Statistics'],
        ],

        'bi' => [
            'tasks' => [
                'Modeled the sales star schema in staging',
                'Built a self-serve report template for marketing',
                'Reviewed metric definitions with stakeholders',
                'Instrumented funnel events in the BI layer',
                'Migrated 4 legacy reports to the BI tool',
                'Drafted a data dictionary for the warehouse',
                'Ran an anomaly check on signups',
                'Optimized slow dashboard queries',
            ],
            'descriptions' => [
                'The fact and dimension tables support daily incremental loads.',
                'Marketing now builds their own reports without filing tickets.',
                'Documented canonical metric definitions to stop double counting.',
                'Six funnel stages are recorded with consistent event contracts.',
                'Cut 2 duplicated sources and retired the old reports.',
                'Covered all tables and columns with ownership and lineage notes.',
                'Investigated 3 data spikes; two traced to campaign pushes.',
                'Cut p95 render time in half by pre-aggregating the hot paths.',
            ],
            'skills' => ['SQL', 'dbt', 'Power BI', 'Data Modeling', 'Stakeholder Communication', 'Documentation', 'Excel', 'Warehouse Design'],
        ],

        'data-engineering' => [
            'tasks' => [
                'Deployed an Airflow DAG for the daily ETL',
                'Migrated staging tables to warehouse v2',
                'Added data-quality gates to the pipeline',
                'Backfilled 90 days of history',
                'Designed the partition schema for events',
                'Profiled and fixed the slow ingestion job',
                'Set up CI tests for the ingest models',
                'Rolled out the weekly retention policy',
            ],
            'descriptions' => [
                'The DAG runs at 02:00 with retries and Slack alerts on failure.',
                'All downstream consumers migrated with no breakage reported.',
                'Row counts, null checks and schema drift checks run per job.',
                'The backfill took two nights and reconciled against the source.',
                'The partition key was chosen to support retention pruning.',
                'The job improved from 40 minutes to 6 after the copy optimization.',
                'Pull requests now require the quality checks to pass before merging.',
                'Implemented 30-day hot and 90-day warm tiers as agreed with ops.',
            ],
            'skills' => ['Python', 'Airflow', 'PostgreSQL', 'dbt', 'AWS', 'SQL', 'Monitoring', 'ETL'],
        ],

        'devops' => [
            'tasks' => [
                'Set up the staging CI pipeline',
                'Rotated TLS certificates on edge nodes',
                'Containerized the internal tooling',
                'Wrote an IaC module for database secrets',
                'Ran chaos testing on the staging cluster',
                'Patched base images with CVE fixes',
                'Updated the on-call runbook',
                'Forecasted replica scaling limits',
            ],
            'descriptions' => [
                'Tests, linting, audits and build now run on every pull request.',
                'All three nodes rotated with zero downtime during the window.',
                'The image slimmed by 60MB and locks its dependency tree.',
                'Secrets are now loaded from the vault at boot instead of env files.',
                'The failover drill behaved exactly as designed.',
                'Scheduled rolling redeploys to avoid surprise interruptions.',
                'Added scenarios for disk, API and database failures.',
                'Both manual and automated scaling paths were documented.',
            ],
            'skills' => ['Docker', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD', 'Monitoring', 'Security', 'Runbooks'],
        ],

        'network' => [
            'tasks' => [
                'Audited switch VLAN configurations',
                'Wired the patch panel for the new floor',
                'Diagnosed intermittent wifi drops',
                'Updated network diagrams after the change',
                'Responded to 9 connectivity tickets',
                'Ran rack inventory and labeling',
                'Documented firewall rule changes',
                'Assisted with the failover drill',
            ],
            'descriptions' => [
                'Two misaligned ports were documented and corrected within the week.',
                'Fourteen new drops were cabled, tested and certified.',
                'Root cause was an AP channel clash; the layout was tuned after.',
                'Both the physical and logical views now reflect floor 2.',
                'All 9 tickets were resolved inside the SLA.',
                'Labeling is standardized and matched to the inventory sheet.',
                'Change log entries were attached to their firewall tickets.',
                'The primary-to-backup transition was rehearsed with the network lead.',
            ],
            'skills' => ['Networking', 'Cisco', 'Troubleshooting', 'Ticketing', 'Documentation', 'Hardware', 'Firewalls', 'Inventory'],
        ],

        'people' => [
            'tasks' => [
                'Drafted the onboarding checklist for new hires',
                'Ran a 1:1 feedback survey',
                'Maintained HRIS records for the month',
                'Shadowed a benefits administration cycle',
                'Drafted the interview scorecard template',
                'Prepared the training calendar',
                'Audited attendance records for gaps',
                'Organized an equipment setup workshop',
            ],
            'descriptions' => [
                'The checklist covers day 1-30 with owners and due dates.',
                'Summarized anonymized feedback into three action items.',
                'All hires for the month now have complete HRIS records.',
                'Learned how claims and reimbursements move through approval.',
                'Scorecards highlight both role skills and values alignment.',
                'The calendar covers 6 topics across the quarter by role.',
                'Flagged two record gaps and followed up with their managers.',
                'Eight teammates attended; materials were shared afterwards.',
            ],
            'skills' => ['HRIS', 'Onboarding', 'Communication', 'Documentation', 'Survey Design', 'Scheduling', 'Attention to Detail', 'Training'],
        ],

        'support' => [
            'tasks' => [
                'Triaged 24 support tickets',
                'Wrote 8 knowledge base articles',
                'Shadowed escalation calls with senior staff',
                'Implemented a tagging scheme in the helpdesk',
                'Reviewed customer feedback surveys',
                'Ran the weekly review of open tickets',
                'Reproduced 5 intermittent customer bugs',
                'Updated the internal FAQ',
            ],
            'descriptions' => [
                'Tags now include region, plan tier and entry point.',
                'Each article covers one known issue with step-by-step fixes.',
                'Learned the escalation rubric for prioritizing severity.',
                'Manual and auto tags now map cleanly to the reports.',
                'Summarized 3 recurring complaints for product review.',
                'Aged tickets reviewed with the lead for follow-up actions.',
                'Repro notes and environment info attached for dev triage.',
                'Customer-visible wording now matches the public docs tone.',
            ],
            'skills' => ['Zendesk', 'Escalation Handling', 'Documentation', 'Communication', 'SLA', 'Bug Reporting', 'Patience', 'Time Management'],
        ],
    ];

    private const EVAL_TEXTS = [
        'default' => [
            'strengths' => [
                'Consistent attendance, communicates progress without prompting and responds well to feedback.',
                'Submitted work is self-sufficient: tests, documentation and tidying included.',
                'Asks informed questions, connects tasks to business context and helps teammates.',
                'Showed initiative by surfacing risks early and suggesting workflow improvements.',
            ],
            'improvements' => [
                'Should speak up sooner when blocked instead of waiting for the daily check-in.',
                'Time-box research tasks; some exploration ran longer than needed.',
                'Hand-off notes could include links and current states; keep tightening them.',
                'Estimates are still optimistic; calibrate with the supervisor when unsure.',
            ],
            'comments' => [
                'On track overall, showing productivity growth week over week.',
                'Steady performance. Keep documenting as the volume of work increases.',
                'Solid contributions across the team, ready for more challenging work.',
                'Showed strong ownership in recent weeks; encourage that continued depth.',
            ],
        ],
        'Acme Corp' => [
            'strengths' => [
                'Dependable delivery cadence; updates tickets and docs without prompting.',
                'Quality mindset; catches edge cases during review.',
                'Collaborative in stand-ups and pairing sessions.',
                'Asks focused questions that save everyone time.',
            ],
            'improvements' => [
                'Own smaller features end-to-end instead of waiting for assignments.',
                'Verify fixes before opening pull requests; a few rounds needed resets.',
                'Speak up about design alternatives; the team values that perspective.',
                'Trim scope in estimates when dependencies are unknown.',
            ],
            'comments' => [
                'Consistent contributor; trusted to carry work independently.',
                'Steady growth across the cycle with good team fit.',
                'Pleasant to work with and ships reliably.',
                'Encouraged to take deeper ownership next cycle.',
            ],
        ],
        'ByteWorks Studio' => [
            'strengths' => [
                'Pixel-consistent work; prototypes carry design intent through to hand-off.',
                'Mindful of inclusive design: contrast, labels and interaction states.',
                'Presents design rationale clearly and accepts feedback well.',
                'Balances aesthetics with usability; measurements match dev needs.',
            ],
            'improvements' => [
                'Time-box exploration in Figma; wide exploration slowed the reviews.',
                'Gather more research input; aim for five users minimum next iteration.',
                'Add edge cases to specs: empty, loading and error states per component.',
                'Practice presenting rationale with measurable evidence, not intuition.',
            ],
            'comments' => [
                'Great craft and pace, growing steadily in scope.',
                'Design-system thinking is on the rise with excellent consistency.',
                'The final deliverable was clean and dev-ready.',
                'Ready to own a feature from research through shipped next sprint.',
            ],
        ],
        'DataPoint Analytics' => [
            'strengths' => [
                'Fast SQL learner; explored the warehouse fundamentals without assistance.',
                'Dashboard output is clean, labeled and decision-ready.',
                'Validates figures against source systems before publishing.',
                'Asks sharp questions about metric definitions to avoid double counting.',
            ],
            'improvements' => [
                'Prefer vectorized operations over row-wise loops in Python.',
                'Document transformations inline so analyses survive handoffs.',
                'Practice presenting analysis to non-technical audiences with tighter narratives.',
                'Make dashboards evergreen: one actionable page beats five decorative tiles.',
            ],
            'comments' => [
                'Adaptable and productive; ready to own small end-to-end analyses.',
                'Reliable analyst instincts and a careful work ethic.',
                'Works independently and consistently delivers on schedule.',
                'Great growth trajectory; encourage a deeper statistics foundation next term.',
            ],
        ],
        'CloudForce Systems' => [
            'strengths' => [
                'Comfortable on the Linux console; picked up the monitoring tool quickly.',
                'Careful change hygiene: every change documented and reversible.',
                'Communicates clearly during incidents and keeps stakeholders informed.',
                'Reliable operations discipline; caught two misconfigurations before deploy.',
            ],
            'improvements' => [
                'Balance breadth with depth; pick one subsystem to master per quarter.',
                'Automate more of the recurring manual verification steps.',
                'Practice incident write-ups with clearer timelines.',
                'Allocate documentation time during the work, not after.',
            ],
            'comments' => [
                'Dependable pair for operations work and growing well.',
                'Level of care in operations is above the bar for the role.',
                'Handles run-and-maintain work confidently; ready for on-call shadowing.',
                'Strong finish to the cycle; keep practicing incident leadership.',
            ],
        ],
    ];
}
