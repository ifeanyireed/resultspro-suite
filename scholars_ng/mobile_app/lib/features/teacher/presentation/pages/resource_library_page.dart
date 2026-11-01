import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class ResourceLibraryPage extends StatelessWidget {
  const ResourceLibraryPage({super.key});

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
        title: const Text('Resource Library', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        children: [
          const Text('Shared with Classes', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 16),
          _buildResourceCard('Calculus Basics.pdf', 'Grade 11B • Mathematics', Icons.picture_as_pdf, Colors.red),
          const SizedBox(height: 12),
          _buildResourceCard('Cell Structure.mp4', 'Grade 9A • Biology', Icons.video_library, Colors.blue),
          const SizedBox(height: 12),
          _buildResourceCard('Romeo & Juliet.doc', 'Grade 10C • English', Icons.description, Colors.blueGrey),
          const SizedBox(height: 32),
          const Text('Personal Library', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
          const SizedBox(height: 16),
          _buildResourceCard('Exam Template.xlsx', 'Mathematics', Icons.table_chart, Colors.green),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.skyBlue,
        child: const Icon(Icons.upload_file, color: Colors.white),
      ),
    );
  }

  Widget _buildResourceCard(String title, String subtitle, IconData icon, Color iconColor) {
    return ScrollReveal(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))]),
        child: Row(
          children: [
            Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: iconColor.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: iconColor, size: 24)),
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
            const Icon(Icons.more_vert, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }
}
