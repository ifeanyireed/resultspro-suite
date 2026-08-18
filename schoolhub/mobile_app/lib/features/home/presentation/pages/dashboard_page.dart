import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

import '../../../notifications/presentation/pages/notifications_page.dart';

import '../../../community/presentation/pages/community_page.dart';

import '../../../profile/presentation/pages/profile_page.dart';

import '../../../profile/presentation/pages/child_profile_page.dart';
import '../../../parent/presentation/pages/fee_management_page.dart';
import '../../../parent/presentation/pages/transport_tracking_page.dart';
import '../../../parent/presentation/pages/parent_messaging_page.dart';

import '../../../student/presentation/pages/my_learning_page.dart';
import '../../../student/presentation/pages/assignments_page.dart';
import '../../../student/presentation/pages/exam_center_page.dart';
import '../../../student/presentation/pages/my_results_page.dart';
import '../../../student/presentation/pages/coding_academy_page.dart';
import '../../../student/presentation/pages/ai_lab_page.dart';
import '../../../student/presentation/pages/projects_portfolio_page.dart';
import '../../../student/presentation/pages/competitions_page.dart';
import '../../../student/presentation/pages/leaderboards_page.dart';
import '../../../student/presentation/pages/achievements_page.dart';

import '../../../teacher/presentation/pages/class_management_page.dart';
import '../../../teacher/presentation/pages/attendance_register_page.dart';
import '../../../teacher/presentation/pages/assignment_manager_page.dart';
import '../../../teacher/presentation/pages/assessment_manager_page.dart';
import '../../../teacher/presentation/pages/results_manager_page.dart';
import '../../../teacher/presentation/pages/resource_library_page.dart';

import '../../../admin/presentation/pages/student_management_page.dart';
import '../../../admin/presentation/pages/staff_management_page.dart';
import '../../../admin/presentation/pages/communication_center_page.dart';
import '../../../admin/presentation/pages/events_management_page.dart';
import '../../../admin/presentation/pages/reports_analytics_page.dart';
import '../../../admin/presentation/pages/subscription_billing_page.dart';
import '../../../admin/presentation/pages/school_settings_page.dart';

class DashboardPage extends StatefulWidget {
  final String role;
  const DashboardPage({super.key, this.role = 'Student'});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _buildDashboardTab(),
          _getTab2(),
          _getTab3(),
          _getTab4(),
          const CommunityPage(),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: AppColors.skyBlue,
          unselectedItemColor: AppColors.darkBlue.withOpacity(0.3),
          showSelectedLabels: false,
          showUnselectedLabels: false,
          items: _getBottomNavItems(),
        ),
      ),
    );
  }

  Widget _getTab2() {
    if (widget.role == 'Parent') return const FeeManagementPage(isTab: true);
    if (widget.role == 'Teacher') return const ClassManagementPage();
    if (widget.role == 'School Admin') return const StudentManagementPage();
    return const MyLearningPage(isTab: true);
  }

  Widget _getTab3() {
    if (widget.role == 'Parent') return const TransportTrackingPage(isTab: true);
    if (widget.role == 'Teacher') return const AttendanceRegisterPage();
    if (widget.role == 'School Admin') return const StaffManagementPage();
    return const Center(child: Text('Timetable', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)));
  }

  Widget _getTab4() {
    if (widget.role == 'Parent') return const ParentMessagingPage(isTab: true);
    if (widget.role == 'Teacher') return const ParentMessagingPage(isTab: true);
    if (widget.role == 'School Admin') return const CommunicationCenterPage();
    return const AssignmentsPage(isTab: true);
  }

  List<BottomNavigationBarItem> _getBottomNavItems() {
    if (widget.role == 'Parent') {
      return const [
        BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.payments_outlined), label: 'Fees'),
        BottomNavigationBarItem(icon: Icon(Icons.directions_bus_outlined), label: 'Transport'),
        BottomNavigationBarItem(icon: Icon(Icons.message_outlined), label: 'Messages'),
        BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Community'),
      ];
    }
    if (widget.role == 'Teacher') {
      return const [
        BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.class_outlined), label: 'Classes'),
        BottomNavigationBarItem(icon: Icon(Icons.how_to_reg_outlined), label: 'Attendance'),
        BottomNavigationBarItem(icon: Icon(Icons.message_outlined), label: 'Messages'),
        BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Community'),
      ];
    }
    if (widget.role == 'School Admin') {
      return const [
        BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Pulse'),
        BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Students'),
        BottomNavigationBarItem(icon: Icon(Icons.badge_outlined), label: 'Staff'),
        BottomNavigationBarItem(icon: Icon(Icons.campaign_outlined), label: 'Comm'),
        BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Community'),
      ];
    }
    return const [
      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      BottomNavigationBarItem(icon: Icon(Icons.menu_book_outlined), label: 'Lessons'),
      BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), label: 'Timetable'),
      BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: 'Homework'),
      BottomNavigationBarItem(icon: Icon(Icons.people_outline), label: 'Community'),
    ];
  }

  Widget _buildDashboardTab() {
    String welcomeName = 'James';
    if (widget.role == 'Parent') welcomeName = 'Mr. Smith';
    if (widget.role == 'Teacher') welcomeName = 'Mrs. Grace';
    if (widget.role == 'School Admin') welcomeName = 'Administrator';

    return SafeArea(
      child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // ... (header remains the same)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 20),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 15,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Search...',
                            hintStyle: TextStyle(color: AppColors.darkBlue.withOpacity(0.3), fontSize: 14),
                            prefixIcon: Icon(Icons.search, color: AppColors.darkBlue.withOpacity(0.3), size: 20),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const NotificationsPage()),
                        );
                      },
                      borderRadius: BorderRadius.circular(24),
                      child: _buildHeaderIconButton(Icons.notifications_outlined),
                    ),
                    const SizedBox(width: 12),
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => ProfilePage(role: widget.role)),
                        );
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: CircleAvatar(
                        radius: 20,
                        backgroundImage: AssetImage(
                          widget.role == 'Parent' 
                            ? 'assets/images/photo12.jpeg' 
                            : widget.role == 'Teacher' 
                              ? 'assets/images/photo09.jpeg'
                              : 'assets/images/photo11.jpeg'
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Welcome Banner
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: ScrollReveal(
                  child: Container(
                    height: 160,
                    decoration: BoxDecoration(
                      color: AppColors.skyBlue,
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.skyBlue.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Positioned(
                          right: 10,
                          bottom: -20,
                          child: Image.asset(
                            _getBannerMonsterImage(),
                            height: 140,
                            fit: BoxFit.contain,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Welcome back, $welcomeName',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                _getBannerText(),
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.9),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // Stats Row
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                child: Row(
                  children: _getStats(),
                ),
              ),
            ),

            // Content Sections
            if (widget.role == 'Parent') ...[
              _buildSectionHeader('Children Overview', 'Manage'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      _buildChildOverviewCard('Sarah Smith', 'Grade 8', 'assets/images/photo10.jpeg', '95%', 'A'),
                      const SizedBox(height: 12),
                      _buildChildOverviewCard('Tom Smith', 'Grade 5', 'assets/images/photo11.jpeg', '98%', 'B+'),
                    ],
                  ),
                ),
              ),

              _buildSectionHeader('Recent Results', 'View all'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      _buildResultItem('Mathematics', 'Sarah Smith', 'A (95%)', Colors.green),
                      const SizedBox(height: 12),
                      _buildResultItem('History', 'Tom Smith', 'B+ (88%)', Colors.blue),
                    ],
                  ),
                ),
              ),

              _buildSectionHeader('Assignments', 'View all'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      _buildTaskItem('Math Assignment #5', 'Sarah Smith • Due tomorrow', true),
                      const SizedBox(height: 12),
                      _buildTaskItem('Biology Lab Report', 'Tom Smith • Due in 3 days', false),
                    ],
                  ),
                ),
              ),
            ] else if (widget.role == 'School Admin') ...[
              // Admin Pulse Dashboard
              _buildSectionHeader('School Pulse', 'Live'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.5,
                    children: [
                      _buildPulseCard('Enrollment', '85%', '+12 this month', Icons.trending_up, Colors.blue),
                      _buildPulseCard('Academics', 'B+', 'Avg Performance', Icons.school_outlined, Colors.purple),
                      _buildPulseCard('Revenue', '\$42.5k', '92% Collected', Icons.payments_outlined, Colors.green),
                      _buildPulseCard('Attendance', '94%', 'Students & Staff', Icons.how_to_reg_outlined, Colors.orange),
                    ],
                  ),
                ),
              ),

              // Admin Quick Actions
              _buildSectionHeader('Management', ''),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: SizedBox(
                    height: 100,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      children: [
                        _buildQuickActionButton(context, 'Events', Icons.event_note_outlined, Colors.indigo, const EventsManagementPage()),
                        const SizedBox(width: 12),
                        _buildQuickActionButton(context, 'Analytics', Icons.analytics_outlined, Colors.teal, const ReportsAnalyticsPage()),
                        const SizedBox(width: 12),
                        _buildQuickActionButton(context, 'Billing', Icons.receipt_long_outlined, Colors.blueGrey, const SubscriptionBillingPage()),
                        const SizedBox(width: 12),
                        _buildQuickActionButton(context, 'Settings', Icons.settings_outlined, Colors.grey, const SchoolSettingsPage()),
                      ],
                    ),
                  ),
                ),
              ),

              // Enrollment Funnel
              _buildSectionHeader('Enrollment Funnel', 'Analytics'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
                    child: Column(
                      children: [
                        _buildFunnelRow('Leads', 150, Colors.blue.withOpacity(0.1)),
                        const SizedBox(height: 8),
                        _buildFunnelRow('Applications', 85, Colors.blue.withOpacity(0.3)),
                        const SizedBox(height: 8),
                        _buildFunnelRow('Admissions', 42, Colors.blue),
                      ],
                    ),
                  ),
                ),
              ),
            ] else if (widget.role == 'Teacher') ...[
              // Teacher Quick Actions
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Quick Access', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 100,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          children: [
                            _buildQuickActionButton(context, 'Assign', Icons.assignment_add, Colors.blue, const AssignmentManagerPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Assess', Icons.task_alt, Colors.green, const AssessmentManagerPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Results', Icons.grade_outlined, Colors.orange, const ResultsManagerPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Library', Icons.library_books_outlined, Colors.purple, const ResourceLibraryPage()),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              _buildSectionHeader('Today\'s Classes', 'View all'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      _buildTimetableItem('Mathematics', '08:00 - 09:00', 'Grade 8A', Colors.blue),
                      const SizedBox(height: 12),
                      _buildTimetableItem('General Science', '10:00 - 11:00', 'Grade 7C', Colors.green),
                    ],
                  ),
                ),
              ),

              _buildSectionHeader('Pending Grading', 'View all'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      _buildTaskItem('Math Assignment #5', 'Grade 8A • 12 pending', false),
                      const SizedBox(height: 12),
                      _buildTaskItem('Physics Lab Report', 'Grade 11B • 5 pending', false),
                    ],
                  ),
                ),
              ),
            ] else ...[
              // Student Quick Actions
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Quick Access', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 100,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          children: [
                            _buildQuickActionButton(context, 'Exams', Icons.quiz_outlined, Colors.purple, const ExamCenterPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Results', Icons.auto_graph, Colors.green, const MyResultsPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Coding', Icons.code, Colors.blue, const CodingAcademyPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'AI Lab', Icons.psychology, Colors.deepPurple, const AiLabPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Projects', Icons.folder_special, Colors.orange, const ProjectsPortfolioPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Contests', Icons.emoji_events, Colors.amber, const CompetitionsPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Ranks', Icons.leaderboard, Colors.redAccent, const LeaderboardsPage()),
                            const SizedBox(width: 12),
                            _buildQuickActionButton(context, 'Badges', Icons.stars, Colors.teal, const AchievementsPage()),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              _buildSectionHeader('Timetable', 'Mar 28, 2024'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: ScrollReveal(
                    delay: const Duration(milliseconds: 200),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          _buildTimetableItem('Algorithms', '08:00 - 09:00', 'Mathematics', Colors.blue),
                          const Divider(height: 32),
                          _buildTimetableItem('Levels of organization', '09:00 - 10:00', 'Biology', Colors.green),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              _buildSectionHeader('Tasks', 'View all'),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      _buildTaskItem('Math Assignment #5', 'Due tomorrow', true),
                      const SizedBox(height: 12),
                      _buildTaskItem('Biology Lab Report', 'Due in 3 days', false),
                    ],
                  ),
                ),
              ),
            ],

            // Upcoming Events (Shared)
            _buildSectionHeader('Upcoming events', ''),

            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final events = [
                      {'title': 'English accents', 'date': '18 Apr, 2024, 12:00', 'image': 'assets/images/photo07.jpeg'},
                      {'title': 'RoboFest', 'date': '20 May, 2024, 15:00', 'image': 'assets/images/photo08.jpeg'},
                    ];
                    if (index >= events.length) return null;
                    final event = events[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: _buildEventCard(event['title']!, event['date']!, event['image']!),
                    );
                  },
                  childCount: 2,
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      );
  }

  String _getBannerMonsterImage() {
    switch (widget.role) {
      case 'Parent':
        return 'assets/images/monster_love.png';
      case 'Teacher':
        return 'assets/images/monster_winner.png';
      case 'School Admin':
        return 'assets/images/monster_meditating.png';
      default:
        return 'assets/images/monster_studying.png';
    }
  }

  String _getBannerText() {
    switch (widget.role) {
      case 'Parent':
        return 'Your children are doing great this week!\nCheck their latest results and attendance.';
      case 'Teacher':
        return 'You have 4 classes today.\nDon\'t forget to upload the biology results.';
      case 'School Admin':
        return 'School operations are running smoothly.\nThere are 2 new teacher applications to review.';
      default:
        return 'You\'ve learned 70% of your goal this week!\nKeep it up and improve your progress.';
    }
  }

  List<Widget> _getStats() {
    List<Map<String, dynamic>> stats = [];
    switch (widget.role) {
      case 'Parent':
        stats = [
          {'title': 'Children', 'value': '2', 'icon': Icons.family_restroom_outlined, 'desc': 'Enrolled'},
          {'title': 'Avg. Grade', 'value': 'A', 'icon': Icons.grade_outlined, 'desc': 'Excellent'},
          {'title': 'Fees', 'value': 'Paid', 'icon': Icons.payments_outlined, 'desc': 'Up to date'},
        ];
        break;
      case 'Teacher':
        stats = [
          {'title': 'Classes', 'value': '4/6', 'icon': Icons.class_outlined, 'desc': 'Today'},
          {'title': 'Students', 'value': '124', 'icon': Icons.people_outline, 'desc': 'Total'},
          {'title': 'Pending', 'value': '12', 'icon': Icons.assignment_late_outlined, 'desc': 'Tasks'},
        ];
        break;
      case 'School Admin':
        stats = [
          {'title': 'Students', 'value': '1,240', 'icon': Icons.people_outline, 'desc': 'Active'},
          {'title': 'Teachers', 'value': '48', 'icon': Icons.person_search_outlined, 'desc': 'Employed'},
          {'title': 'Revenue', 'value': '92%', 'icon': Icons.trending_up, 'desc': 'Target met'},
        ];
        break;
      default:
        stats = [
          {'title': 'Attendance', 'value': '19/20', 'icon': Icons.access_time, 'desc': 'Days present'},
          {'title': 'Homework', 'value': '53', 'icon': Icons.home_work_outlined, 'desc': 'Completed'},
          {'title': 'Rating', 'value': '89', 'icon': Icons.star_border, 'desc': 'Top 10%'},
        ];
    }

    return stats.map((stat) => Expanded(
      child: Padding(
        padding: EdgeInsets.only(right: stat == stats.last ? 0 : 16),
        child: _buildStatCard(stat['title'], stat['value'], stat['icon'], stat['desc']),
      ),
    )).toList();
  }

  Widget _buildHeaderIconButton(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Icon(icon, color: AppColors.darkBlue.withOpacity(0.6), size: 22),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, String description) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(icon, color: AppColors.skyBlue, size: 28),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  value,
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: TextStyle(fontSize: 11, color: AppColors.skyBlue.withOpacity(0.8), fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionButton(BuildContext context, String title, IconData icon, Color color, Widget page) {
    return InkWell(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => page)),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 85,
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3), width: 1.5),
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.darkBlue.withOpacity(0.8)), maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, String actionText) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
            ),
            if (actionText.isNotEmpty)
              Text(
                actionText,
                style: TextStyle(
                  fontSize: 14, 
                  color: actionText == 'Mar 28, 2024' ? AppColors.darkBlue.withOpacity(0.5) : AppColors.skyBlue, 
                  fontWeight: actionText == 'Mar 28, 2024' ? FontWeight.w600 : FontWeight.bold
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildChildOverviewCard(String name, String grade, String imagePath, String attendance, String avgGrade) {
    return Builder(
      builder: (context) {
        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ChildProfilePage(
                  name: name,
                  grade: grade,
                  imagePath: imagePath,
                ),
              ),
            );
          },
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundImage: AssetImage(imagePath),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        grade,
                        style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5)),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'Att: $attendance',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Grade: $avgGrade',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      }
    );
  }

  Widget _buildResultItem(String subject, String studentName, String grade, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.grade_outlined, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  subject,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue),
                ),
                const SizedBox(height: 2),
                Text(
                  studentName,
                  style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5)),
                ),
              ],
            ),
          ),
          Text(
            grade,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color),
          ),
        ],
      ),
    );
  }

  Widget _buildTimetableItem(String title, String time, String subject, Color color) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 40,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue, fontSize: 16),
              ),
              const SizedBox(height: 4),
              Text(
                time,
                style: TextStyle(color: AppColors.darkBlue.withOpacity(0.5), fontSize: 13),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            subject,
            style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget _buildTaskItem(String title, String deadline, bool isCompleted) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(
            isCompleted ? Icons.check_circle_outline : Icons.radio_button_unchecked,
            color: isCompleted ? AppColors.skyBlue : AppColors.darkBlue.withOpacity(0.2),
            size: 24,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.darkBlue,
                    decoration: isCompleted ? TextDecoration.lineThrough : null,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  deadline,
                  style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPulseCard(String title, String value, String subtitle, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: 8),
              Text(title, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 4),
          Text(subtitle, style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildFunnelRow(String label, int count, Color color) {
    return Row(
      children: [
        SizedBox(width: 80, child: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.darkBlue))),
        Expanded(
          child: Container(
            height: 24,
            decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.only(right: 12),
            child: Text(count.toString(), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: color == Colors.blue ? Colors.white : AppColors.darkBlue)),
          ),
        ),
      ],
    );
  }

  Widget _buildEventCard(String title, String date, String imagePath) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        image: DecorationImage(
          image: AssetImage(imagePath),
          fit: BoxFit.cover,
          colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.3), BlendMode.darken),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(
              title,
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  date,
                  style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.3)),
                  ),
                  child: const Text(
                    'More details',
                    style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
