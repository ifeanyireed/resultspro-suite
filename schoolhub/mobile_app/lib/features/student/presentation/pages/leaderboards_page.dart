import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class LeaderboardsPage extends StatelessWidget {
  const LeaderboardsPage({super.key});

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
        title: const Text('Leaderboards', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: Column(
        children: [
          // Custom Tabs
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Row(
              children: [
                Expanded(child: _buildTab('Class', true)),
                const SizedBox(width: 12),
                Expanded(child: _buildTab('School', false)),
                const SizedBox(width: 12),
                Expanded(child: _buildTab('National', false)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Podium
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: ScrollReveal(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildPodiumSpot(2, 'Alex', '890 pts', 100, Colors.grey.shade400, 'assets/images/photo01.jpeg'),
                  const SizedBox(width: 16),
                  _buildPodiumSpot(1, 'Sarah', '1,240 pts', 140, Colors.amber, 'assets/images/photo10.jpeg'),
                  const SizedBox(width: 16),
                  _buildPodiumSpot(3, 'James', '750 pts', 80, Colors.brown.shade300, 'assets/images/photo11.jpeg'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
          // List
          Expanded(
            child: Container(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, -5))],
              ),
              child: ListView.builder(
                physics: const BouncingScrollPhysics(),
                itemCount: 10,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _buildListRank(index + 4, 'Student Name ${index + 4}', '${700 - (index * 20)} pts', index.isEven),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(String title, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: isSelected ? AppColors.skyBlue : Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: isSelected ? [BoxShadow(color: AppColors.skyBlue.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))] : [],
      ),
      child: Text(
        title,
        style: TextStyle(
          color: isSelected ? Colors.white : AppColors.darkBlue.withOpacity(0.6),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
          fontSize: 13,
        ),
      ),
    );
  }

  Widget _buildPodiumSpot(int rank, String name, String points, double height, Color color, String avatar) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.topRight,
          children: [
            CircleAvatar(radius: 28, backgroundImage: AssetImage(avatar)),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: color, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
              child: Text(rank.toString(), style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
        Text(points, style: TextStyle(fontSize: 11, color: AppColors.darkBlue.withOpacity(0.5))),
        const SizedBox(height: 8),
        Container(
          width: 70,
          height: height,
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          ),
        ),
      ],
    );
  }

  Widget _buildListRank(int rank, String name, String points, bool isUp) {
    return Row(
      children: [
        Text('#$rank', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkBlue)),
        const SizedBox(width: 16),
        const CircleAvatar(radius: 20, backgroundColor: Color(0xFFEBF1FA), child: Icon(Icons.person, color: AppColors.darkBlue)),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
              const SizedBox(height: 2),
              Text(points, style: TextStyle(fontSize: 12, color: AppColors.darkBlue.withOpacity(0.5))),
            ],
          ),
        ),
        Icon(isUp ? Icons.arrow_upward : Icons.arrow_downward, color: isUp ? Colors.green : Colors.red, size: 16),
      ],
    );
  }
}
