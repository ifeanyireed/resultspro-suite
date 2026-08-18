import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

import '../../../parent/presentation/pages/academic_progress_page.dart';
import '../../../parent/presentation/pages/assessments_page.dart';
import '../../../parent/presentation/pages/classroom_activity_page.dart';
import '../../../parent/presentation/pages/future_skills_page.dart';

class ChildProfilePage extends StatelessWidget {
  final String name;
  final String grade;
  final String imagePath;

  const ChildProfilePage({
    super.key,
    required this.name,
    required this.grade,
    required this.imagePath,
  });

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
          'Student Profile',
          style: TextStyle(
            color: AppColors.darkBlue,
            fontSize: 18,
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Profile Info
            ScrollReveal(
              child: Center(
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.skyBlue.withOpacity(0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: 40,
                        backgroundImage: AssetImage(imagePath),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      name,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      grade,
                      style: TextStyle(fontSize: 14, color: AppColors.darkBlue.withOpacity(0.6), fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Academic Progress
            ScrollReveal(
              delay: const Duration(milliseconds: 100),
              child: _buildSectionHeaderWithAction('Academic Progress', 'View all', () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const AcademicProgressPage()));
              }),
            ),
            ScrollReveal(
              delay: const Duration(milliseconds: 100),
              child: InkWell(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const AcademicProgressPage()));
                },
                borderRadius: BorderRadius.circular(24),
                child: _buildAcademicCard(),
              ),
            ),
            const SizedBox(height: 24),
            
            // Classroom & Assessments
            ScrollReveal(
              delay: const Duration(milliseconds: 150),
              child: Row(
                children: [
                  Expanded(child: _buildActionCard(context, 'Assessments', Icons.assignment_turned_in_outlined, Colors.blue, const AssessmentsPage())),
                  const SizedBox(width: 16),
                  Expanded(child: _buildActionCard(context, 'Classroom Activity', Icons.school_outlined, Colors.orange, const ClassroomActivityPage())),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Attendance & Behavior
            ScrollReveal(
              delay: const Duration(milliseconds: 200),
              child: Row(
                children: [
                  Expanded(child: _buildStatCard('Attendance', '95%', Icons.access_time, Colors.orange, '18/20 Days')),
                  const SizedBox(width: 16),
                  Expanded(child: _buildStatCard('Behavior', 'Excellent', Icons.psychology_outlined, Colors.purple, '15 Merits')),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Future Skills
            ScrollReveal(
              delay: const Duration(milliseconds: 300),
              child: _buildSectionHeaderWithAction('Future Skills', 'View all', () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const FutureSkillsPage()));
              }),
            ),
            ScrollReveal(
              delay: const Duration(milliseconds: 300),
              child: InkWell(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const FutureSkillsPage()));
                },
                borderRadius: BorderRadius.circular(24),
                child: _buildFutureSkillsCard(),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeaderWithAction(String title, String actionText, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
          ),
          InkWell(
            onTap: onTap,
            child: Text(
              actionText,
              style: const TextStyle(fontSize: 13, color: AppColors.skyBlue, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, String title, IconData icon, Color color, Widget page) {
    return InkWell(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => page)),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.3), width: 1.5),
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
          ],
        ),
      ),
    );
  }

  Widget _buildAcademicCard() {
    return Container(
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Overall GPA', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
              const Text('3.8', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.skyBlue)),
            ],
          ),
          const SizedBox(height: 20),
          _buildSubjectRow('Mathematics', 0.95, 'A'),
          const SizedBox(height: 16),
          _buildSubjectRow('Science', 0.88, 'B+'),
          const SizedBox(height: 16),
          _buildSubjectRow('Literature', 0.92, 'A-'),
        ],
      ),
    );
  }

  Widget _buildSubjectRow(String subject, double progress, String grade) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              subject,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.darkBlue.withOpacity(0.7)),
            ),
            Text(
              grade,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.darkBlue),
            ),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: progress,
          backgroundColor: AppColors.skyBlue.withOpacity(0.1),
          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.skyBlue),
          borderRadius: BorderRadius.circular(4),
          minHeight: 6,
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color, String desc) {
    return Container(
      padding: const EdgeInsets.all(16),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkBlue),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: TextStyle(fontSize: 11, color: color.withOpacity(0.8), fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildFutureSkillsCard() {
    return Container(
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
          _buildSkillRow('Problem Solving', 0.85, Icons.extension_outlined, Colors.orange),
          const SizedBox(height: 20),
          _buildSkillRow('Coding', 0.70, Icons.code, Colors.blue),
          const SizedBox(height: 20),
          _buildSkillRow('Communication', 0.90, Icons.record_voice_over_outlined, Colors.purple),
        ],
      ),
    );
  }

  Widget _buildSkillRow(String skill, double progress, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                skill,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.darkBlue),
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: progress,
                backgroundColor: color.withOpacity(0.1),
                valueColor: AlwaysStoppedAnimation<Color>(color),
                borderRadius: BorderRadius.circular(4),
                minHeight: 6,
              ),
            ],
          ),
        ),
        const SizedBox(width: 16),
        Text(
          '${(progress * 100).toInt()}%',
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color),
        ),
      ],
    );
  }
}
