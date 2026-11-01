import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class AssessmentManagerPage extends StatelessWidget {
  const AssessmentManagerPage({super.key});

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
        title: const Text('Assessment Manager', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        children: [
          _buildAssessmentCard('Mid-Term Mathematics', 'Grade 8A • Scheduled: Oct 15', 'CBT • 40 Questions', Colors.redAccent),
          const SizedBox(height: 16),
          _buildAssessmentCard('Biology Quiz #3', 'Grade 9B • Scheduled: Oct 18', 'Online • 20 Questions', Colors.green),
          const SizedBox(height: 16),
          _buildAssessmentCard('English Essay', 'Grade 10C • Scheduled: Oct 20', 'Offline • 1 Prompt', Colors.blue),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.skyBlue,
        icon: const Icon(Icons.add_task, color: Colors.white),
        label: const Text('Create Assessment', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildAssessmentCard(String title, String subtitle, String details, Color color) {
    return ScrollReveal(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                const Icon(Icons.more_vert, color: Colors.grey, size: 20),
              ],
            ),
            const SizedBox(height: 4),
            Text(subtitle, style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5))),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(details, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                  child: Text('Edit', style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
