import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class ClassroomActivityPage extends StatelessWidget {
  const ClassroomActivityPage({super.key});

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
          'Classroom Activity',
          style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Filter Chips (Mock)
            Row(
              children: [
                _buildFilterChip('All', true),
                const SizedBox(width: 8),
                _buildFilterChip('Assignments', false),
                const SizedBox(width: 8),
                _buildFilterChip('Resources', false),
              ],
            ),
            const SizedBox(height: 32),

            // Today Section
            const Text('Today', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildActivityCard(
              'Math Homework: Quadratic Equations',
              'Mathematics • Due tomorrow',
              Icons.assignment_outlined,
              Colors.blue,
              'Pending',
              Colors.orange,
            ),
            const SizedBox(height: 12),
            _buildActivityCard(
              'Biology Lab Notes: Photosynthesis',
              'Biology • Shared 2h ago',
              Icons.description_outlined,
              Colors.green,
              'Resource',
              AppColors.skyBlue,
            ),

            const SizedBox(height: 32),

            // This Week Section
            const Text('This Week', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildActivityCard(
              'English Essay: The Great Gatsby',
              'English • Due in 3 days',
              Icons.edit_note_outlined,
              Colors.purple,
              'In Progress',
              Colors.blue,
            ),
            const SizedBox(height: 12),
            _buildActivityCard(
              'History Project: Ancient Rome',
              'History • Submitted',
              Icons.auto_stories_outlined,
              Colors.orange,
              'Done',
              Colors.green,
            ),
            const SizedBox(height: 12),
            _buildActivityCard(
              'Physics Formula Sheet',
              'Physics • Resource',
              Icons.folder_open_outlined,
              Colors.blueGrey,
              'Download',
              AppColors.skyBlue,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.skyBlue : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: isSelected ? [BoxShadow(color: AppColors.skyBlue.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))] : [],
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : AppColors.darkBlue.withOpacity(0.6),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
          fontSize: 13,
        ),
      ),
    );
  }

  Widget _buildActivityCard(String title, String subtitle, IconData icon, Color iconColor, String status, Color statusColor) {
    return ScrollReveal(
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
                color: iconColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                status,
                style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
