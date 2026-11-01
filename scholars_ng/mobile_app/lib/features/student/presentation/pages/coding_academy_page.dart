import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class CodingAcademyPage extends StatelessWidget {
  const CodingAcademyPage({super.key});

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
        title: const Text('Coding Academy', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Continue Learning Banner
            ScrollReveal(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.skyBlue,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [BoxShadow(color: AppColors.skyBlue.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10))],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                            child: const Text('CONTINUE', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                          ),
                          const SizedBox(height: 12),
                          const Text('Python for Beginners', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                          const SizedBox(height: 8),
                          Text('Variables and Data Types', style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      child: const Icon(Icons.play_arrow_rounded, color: AppColors.skyBlue, size: 32),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Paths
            const Text('Learning Paths', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildPathCard('Web Development', 'HTML, CSS, JS', 0.45, Icons.web),
            const SizedBox(height: 12),
            _buildPathCard('Data Science', 'Python, Pandas', 0.10, Icons.data_exploration),
          ],
        ),
      ),
    );
  }

  Widget _buildPathCard(String title, String tech, double progress, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: AppColors.skyBlue.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: AppColors.skyBlue)),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                    const SizedBox(height: 4),
                    Text(tech, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                  ],
                ),
              ),
              Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.skyBlue)),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: AppColors.skyBlue.withOpacity(0.1),
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.skyBlue),
            borderRadius: BorderRadius.circular(4),
            minHeight: 6,
          ),
        ],
      ),
    );
  }
}
