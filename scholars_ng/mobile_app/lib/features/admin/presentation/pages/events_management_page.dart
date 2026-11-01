import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/scroll_reveal.dart';

class EventsManagementPage extends StatelessWidget {
  const EventsManagementPage({super.key});

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
        title: const Text('Events Management', style: TextStyle(color: AppColors.darkBlue, fontSize: 18, fontWeight: FontWeight.w900)),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        children: [
          _buildEventCard('Open Day 2024', 'Oct 25, 2024 • 09:00 AM', 'Prospective Parents', Icons.door_front_door_outlined, Colors.blue),
          const SizedBox(height: 16),
          _buildEventCard('Annual PTA Meeting', 'Nov 05, 2024 • 04:00 PM', 'All Parents', Icons.groups_outlined, Colors.purple),
          const SizedBox(height: 16),
          _buildEventCard('Inter-School Quiz', 'Dec 12, 2024 • 10:00 AM', 'Selected Students', Icons.emoji_events_outlined, Colors.orange),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.skyBlue,
        child: const Icon(Icons.event, color: Colors.white),
      ),
    );
  }

  Widget _buildEventCard(String title, String date, String audience, IconData icon, Color color) {
    return ScrollReveal(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5))]),
        child: Row(
          children: [
            Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: color)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkBlue)),
                  const SizedBox(height: 4),
                  Text(date, style: TextStyle(fontSize: 12, color: AppColors.skyBlue, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 2),
                  Text('Audience: $audience', style: TextStyle(fontSize: 11, color: AppColors.darkBlue.withOpacity(0.5))),
                ],
              ),
            ),
            const Icon(Icons.edit_outlined, size: 18, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}
