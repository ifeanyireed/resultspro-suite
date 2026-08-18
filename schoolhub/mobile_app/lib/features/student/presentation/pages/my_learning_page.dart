import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class MyLearningPage extends StatelessWidget {
  final bool isTab;
  const MyLearningPage({super.key, this.isTab = false});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEBF1FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: !isTab,
        leading: isTab ? null : IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkBlue, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('My Learning', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.search, color: AppColors.darkBlue), onPressed: () {}),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        children: [
          _buildSubjectCard('Mathematics', 'Algebra & Geometry', 0.75, Icons.calculate_outlined, Colors.blue),
          const SizedBox(height: 16),
          _buildSubjectCard('Science', 'Physics & Chemistry', 0.60, Icons.science_outlined, Colors.green),
          const SizedBox(height: 16),
          _buildSubjectCard('History', 'World War II', 0.40, Icons.history_edu, Colors.orange),
          const SizedBox(height: 16),
          _buildSubjectCard('Literature', 'Shakespeare', 0.90, Icons.menu_book_outlined, Colors.purple),
        ],
      ),
    );
  }

  Widget _buildSubjectCard(String title, String topic, double progress, IconData icon, Color color) {
    return ScrollReveal(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                      const SizedBox(height: 4),
                      Text('Current: $topic', style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                    ],
                  ),
                ),
                Icon(Icons.play_circle_fill_outlined, color: AppColors.skyBlue, size: 32),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: color.withOpacity(0.1),
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                    borderRadius: BorderRadius.circular(4),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(width: 12),
                Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
