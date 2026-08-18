import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class AssessmentsPage extends StatefulWidget {
  const AssessmentsPage({super.key});

  @override
  State<AssessmentsPage> createState() => _AssessmentsPageState();
}

class _AssessmentsPageState extends State<AssessmentsPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkBlue, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Assessments',
          style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(30),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                borderRadius: BorderRadius.circular(26),
                color: AppColors.skyBlue,
              ),
              labelColor: Colors.white,
              unselectedLabelColor: AppColors.darkBlue.withOpacity(0.5),
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              tabs: const [
                Tab(text: 'Upcoming'),
                Tab(text: 'Completed'),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildUpcomingList(),
          _buildCompletedList(),
        ],
      ),
    );
  }

  Widget _buildUpcomingList() {
    final assessments = [
      {
        'title': 'Mathematics Mid-Term',
        'subject': 'Mathematics',
        'date': 'Oct 15, 2024',
        'time': '09:00 AM',
        'type': 'Physical Exam',
        'icon': Icons.calculate_outlined,
        'color': Colors.blue,
      },
      {
        'title': 'Biology Quiz #3',
        'subject': 'Biology',
        'date': 'Oct 18, 2024',
        'time': '11:30 AM',
        'type': 'Online Test',
        'icon': Icons.science_outlined,
        'color': Colors.green,
      },
      {
        'title': 'History Essay',
        'subject': 'History',
        'date': 'Oct 22, 2024',
        'time': 'Submission',
        'type': 'Assignment',
        'icon': Icons.history_edu,
        'color': Colors.orange,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      itemCount: assessments.length,
      itemBuilder: (context, index) {
        final item = assessments[index];
        return ScrollReveal(
          delay: Duration(milliseconds: index * 100),
          child: Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: (item['color'] as Color).withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['title'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                        const SizedBox(height: 4),
                        Text('${item['subject']} • ${item['type']}', style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.calendar_today_outlined, size: 12, color: AppColors.skyBlue.withOpacity(0.7)),
                            const SizedBox(width: 4),
                            Text(item['date'] as String, style: TextStyle(fontSize: 11, color: AppColors.skyBlue.withOpacity(0.8), fontWeight: FontWeight.bold)),
                            const SizedBox(width: 12),
                            Icon(Icons.access_time, size: 12, color: AppColors.skyBlue.withOpacity(0.7)),
                            const SizedBox(width: 4),
                            Text(item['time'] as String, style: TextStyle(fontSize: 11, color: AppColors.skyBlue.withOpacity(0.8), fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.darkBlue.withOpacity(0.2)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildCompletedList() {
    final assessments = [
      {
        'title': 'English Literature Test',
        'subject': 'English',
        'score': '92/100',
        'grade': 'A',
        'date': 'Sep 28, 2024',
        'icon': Icons.menu_book_outlined,
        'color': Colors.purple,
      },
      {
        'title': 'Physics Quiz #2',
        'subject': 'Physics',
        'score': '85/100',
        'grade': 'B+',
        'date': 'Sep 20, 2024',
        'icon': Icons.biotech_outlined,
        'color': Colors.blueGrey,
      },
      {
        'title': 'General Science',
        'subject': 'Science',
        'score': '98/100',
        'grade': 'A+',
        'date': 'Sep 15, 2024',
        'icon': Icons.science_outlined,
        'color': Colors.green,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      itemCount: assessments.length,
      itemBuilder: (context, index) {
        final item = assessments[index];
        return ScrollReveal(
          delay: Duration(milliseconds: index * 100),
          child: Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: (item['color'] as Color).withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['title'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                        const SizedBox(height: 4),
                        Text('${item['subject']} • Completed on ${item['date']}', style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(item['score'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                      Text(item['grade'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.green)),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
