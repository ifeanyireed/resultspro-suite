import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';
import '../../../parent/presentation/pages/academic_progress_page.dart';

class MyResultsPage extends StatelessWidget {
  const MyResultsPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Reusing the Parent's Academic Progress UI since it's the exact same data conceptually.
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
        title: const Text('My Results', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Performance Overview
            const Text('Term 2 Performance', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildMetricCard('Rank', '3rd', 'out of 45', Icons.leaderboard_outlined, Colors.orange)),
                const SizedBox(width: 16),
                Expanded(child: _buildMetricCard('Avg Score', '92%', '+2% from T1', Icons.trending_up, Colors.green)),
              ],
            ),
            const SizedBox(height: 32),

            // Progress Chart Placeholder
            const Text('Progress Over Time', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            ScrollReveal(
              child: Container(
                height: 200,
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.bar_chart, size: 64, color: AppColors.skyBlue.withOpacity(0.5)),
                    const SizedBox(height: 16),
                    Text('Chart Data Loading...', style: TextStyle(color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Subject Breakdown
            const Text('Subject Breakdown', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildSubjectCard('Mathematics', 'A', 95, true),
            const SizedBox(height: 12),
            _buildSubjectCard('Science', 'A-', 90, true),
            const SizedBox(height: 12),
            _buildSubjectCard('Literature', 'B+', 85, false),
            const SizedBox(height: 12),
            _buildSubjectCard('History', 'A', 92, true),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, String subtitle, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 4),
          Text(title, style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5), fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Text(subtitle, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectCard(String subject, String grade, int score, bool improved) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(subject, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
              Text(grade, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.skyBlue)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: score / 100,
                  backgroundColor: AppColors.skyBlue.withOpacity(0.1),
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.skyBlue),
                  borderRadius: BorderRadius.circular(4),
                  minHeight: 6,
                ),
              ),
              const SizedBox(width: 16),
              Text('$score%', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
              const SizedBox(width: 8),
              Icon(improved ? Icons.arrow_upward : Icons.arrow_downward, 
                   color: improved ? Colors.green : Colors.red, size: 16),
            ],
          ),
        ],
      ),
    );
  }
}
