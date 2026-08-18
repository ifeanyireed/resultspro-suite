import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class AchievementsPage extends StatelessWidget {
  const AchievementsPage({super.key});

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
        title: const Text('Achievements', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Badges', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildBadge('Perfect Attendance', Icons.event_available, Colors.green),
                _buildBadge('Top Scorer', Icons.star, Colors.amber),
                _buildBadge('Code Master', Icons.code, Colors.blue),
                _buildBadge('Science Whiz', Icons.science, Colors.purple),
                _buildBadge('Fast Reader', Icons.auto_stories, Colors.orange, isLocked: true),
                _buildBadge('Math Genius', Icons.calculate, Colors.redAccent, isLocked: true),
              ],
            ),
            const SizedBox(height: 32),
            const Text('Certificates', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildCertificateTile('Introduction to Python', 'ScholarsNG • Issued Aug 2023', Icons.workspace_premium),
            const SizedBox(height: 12),
            _buildCertificateTile('First Place - Science Fair', 'School Board • Issued Jun 2023', Icons.emoji_events),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String title, IconData icon, Color color, {bool isLocked = false}) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isLocked ? Colors.grey.shade300 : color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(isLocked ? Icons.lock_outline : icon, color: isLocked ? Colors.grey : color, size: 32),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isLocked ? Colors.grey : AppColors.darkBlue),
          maxLines: 2,
        ),
      ],
    );
  }

  Widget _buildCertificateTile(String title, String subtitle, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 5))]),
      child: Row(
        children: [
          Icon(icon, color: Colors.amber, size: 32),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                const SizedBox(height: 2),
                Text(subtitle, style: TextStyle(fontSize: 11, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
          Icon(Icons.download_outlined, color: AppColors.skyBlue.withOpacity(0.5), size: 20),
        ],
      ),
    );
  }
}
