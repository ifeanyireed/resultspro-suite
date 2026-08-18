import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class ClassManagementPage extends StatelessWidget {
  const ClassManagementPage({super.key});

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
        title: const Text('Class Management', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        children: [
          _buildClassCard('Grade 8A', 'Mathematics • 32 Students', Icons.group_outlined, Colors.blue),
          const SizedBox(height: 16),
          _buildClassCard('Grade 9B', 'Further Math • 28 Students', Icons.group_outlined, Colors.purple),
          const SizedBox(height: 16),
          _buildClassCard('Grade 7C', 'General Science • 35 Students', Icons.group_outlined, Colors.green),
          const SizedBox(height: 32),
          const Text('Subject Overview', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 16),
          _buildSubjectTile('Mathematics', 'Grade 8, 9, 10', Icons.calculate_outlined),
          const SizedBox(height: 12),
          _buildSubjectTile('Further Mathematics', 'Grade 11, 12', Icons.functions),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.skyBlue,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('New Class', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildClassCard(String className, String subtitle, IconData icon, Color color) {
    return ScrollReveal(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Row(
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
                  Text(className, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(fontSize: 13, color: AppColors.darkBlue.withOpacity(0.5))),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.darkBlue, size: 14),
          ],
        ),
      ),
    );
  }

  Widget _buildSubjectTile(String title, String grades, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]),
      child: Row(
        children: [
          Icon(icon, color: AppColors.skyBlue, size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                Text(grades, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
