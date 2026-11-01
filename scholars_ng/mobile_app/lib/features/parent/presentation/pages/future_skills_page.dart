import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class FutureSkillsPage extends StatelessWidget {
  const FutureSkillsPage({super.key});

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
          'Future Skills',
          style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Stats
            ScrollReveal(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.darkBlue,
                  borderRadius: BorderRadius.circular(32),
                  image: DecorationImage(
                    image: const AssetImage('assets/images/monster_winner.png'),
                    alignment: Alignment.centerRight,
                    scale: 3,
                    opacity: 0.2,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Learning Journey', style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Level 12', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _buildBadge('4 Certificates'),
                        const SizedBox(width: 8),
                        _buildBadge('12 Projects'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Skills Progress
            const Text('Core Skills', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildSkillProgressCard('Coding & Logic', 0.85, 'Advanced Python', Icons.code, Colors.blue),
            const SizedBox(height: 12),
            _buildSkillProgressCard('Artificial Intelligence', 0.65, 'Neural Networks', Icons.psychology_outlined, Colors.purple),
            const SizedBox(height: 12),
            _buildSkillProgressCard('Robotics', 0.45, 'Sensors & Motors', Icons.precision_manufacturing_outlined, Colors.orange),

            const SizedBox(height: 32),

            // Recent Projects
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Recent Projects', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
                Text('View Portfolio', style: TextStyle(fontSize: 13, color: AppColors.skyBlue, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 180,
              child: ListView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                children: [
                  _buildProjectCard('AI Chatbot', 'Python • NLP', 'assets/images/photo05.jpeg'),
                  _buildProjectCard('Smart Home', 'IOT • Arduino', 'assets/images/photo06.jpeg'),
                  _buildProjectCard('Maze Solver', 'Robotics', 'assets/images/photo04.jpeg'),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Certificates
            const Text('Certificates', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
            const SizedBox(height: 16),
            _buildCertificateTile('Introduction to Python', 'ScholarsNG • Issued Aug 2023', Icons.verified_user_outlined),
            const SizedBox(height: 12),
            _buildCertificateTile('AI Ethics & Safety', 'Google Learning • Issued Jun 2023', Icons.verified_user_outlined),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildSkillProgressCard(String title, double progress, String currentModule, IconData icon, Color color) {
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                      Text('Current: $currentModule', style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
                    ],
                  ),
                ),
                Text('${(progress * 100).toInt()}%', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color)),
              ],
            ),
            const SizedBox(height: 16),
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
    );
  }

  Widget _buildProjectCard(String title, String tech, String imagePath) {
    return Container(
      width: 140,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            child: Image.asset(imagePath, height: 100, width: double.infinity, fit: BoxFit.cover),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.darkBlue), maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 2),
                Text(tech, style: TextStyle(fontSize: 10, color: AppColors.skyBlue, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCertificateTile(String title, String subtitle, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 5))],
      ),
      child: Row(
        children: [
          const Icon(Icons.workspace_premium_outlined, color: Colors.amber, size: 32),
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
